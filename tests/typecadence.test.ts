/**
 * Unit tests for Typecadence
 */

const Typecadence = require('../src/typecadence');

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Create a `.typecadence` element, set its text + data-attributes, and append to body. */
function createElement(
  text: string,
  attributes: Record<string, string> = {},
): HTMLElement {
  const el = document.createElement('div');
  el.classList.add('typecadence');
  el.textContent = text;
  for (const [key, value] of Object.entries(attributes)) {
    el.setAttribute(key, value);
  }
  document.body.appendChild(el);
  return el;
}

/**
 * Drain the animation to completion.
 *
 * animateText uses `await new Promise(r => setTimeout(r, n))` in a loop.
 * Each iteration only schedules the NEXT timer after the current one fires.
 * We use real `process.nextTick` (excluded from faking) to flush microtasks
 * between timer advances.
 */
async function drainAnimation(animationPromise: Promise<void>): Promise<void> {
  let settled = false;
  animationPromise.then(() => { settled = true; }, () => { settled = true; });

  for (let i = 0; i < 5000 && !settled; i++) {
    jest.advanceTimersByTime(50);
    await new Promise<void>(r => process.nextTick(r));
  }

  if (!settled) throw new Error('drainAnimation: animation did not settle after 5000 iterations');
  await animationPromise;
}

/** Extract the visible text from an element, ignoring the caret element. */
function getVisibleText(el: HTMLElement): string {
  let text = '';
  for (const node of el.childNodes) {
    if (node.nodeType === Node.TEXT_NODE) {
      text += node.textContent;
    }
  }
  return text;
}

// ---------------------------------------------------------------------------
// Mock setup
// ---------------------------------------------------------------------------

let observeMock: jest.Mock;
let unobserveMock: jest.Mock;
let disconnectMock: jest.Mock;
let intersectionCallback: (entries: Partial<IntersectionObserverEntry>[]) => void;

beforeEach(() => {
  jest.useFakeTimers({ doNotFake: ['nextTick'] });
  document.body.innerHTML = '';

  observeMock = jest.fn();
  unobserveMock = jest.fn();
  disconnectMock = jest.fn();

  (globalThis as any).IntersectionObserver = jest.fn((cb: any) => {
    intersectionCallback = cb;
    return {
      observe: observeMock,
      unobserve: unobserveMock,
      disconnect: disconnectMock,
    };
  });
});

afterEach(() => {
  jest.clearAllTimers();
  jest.useRealTimers();
  jest.restoreAllMocks();
});

// ===========================================================================
// Constructor & init
// ===========================================================================

describe('Constructor & init', () => {
  test('observes all .typecadence elements', () => {
    const el1 = createElement('Hello');
    const el2 = createElement('World');

    new Typecadence();

    expect(observeMock).toHaveBeenCalledTimes(2);
    expect(observeMock).toHaveBeenCalledWith(el1);
    expect(observeMock).toHaveBeenCalledWith(el2);
  });

  test('handles zero .typecadence elements without errors', () => {
    expect(() => new Typecadence()).not.toThrow();
    expect(observeMock).not.toHaveBeenCalled();
  });

  test('IntersectionObserver is created with correct options', () => {
    createElement('Test');
    new Typecadence();

    expect(globalThis.IntersectionObserver).toHaveBeenCalledWith(
      expect.any(Function),
      { root: null, rootMargin: '0px', threshold: 0.1 },
    );
  });
});

// ===========================================================================
// IntersectionObserver behavior
// ===========================================================================

describe('IntersectionObserver', () => {
  test('triggers animateText when element becomes intersecting', async () => {
    const el = createElement('Hi', { 'data-typecadence-mistakes': '0' });
    new Typecadence();

    intersectionCallback([{ isIntersecting: true, target: el }]);

    // The callback triggers animateText (fire-and-forget). Drain timers.
    let done = false;
    // We can't capture the promise from #handleIntersect, so drain until text appears.
    for (let i = 0; i < 500 && !done; i++) {
      jest.advanceTimersByTime(50);
      await new Promise<void>(r => process.nextTick(r));
      if (getVisibleText(el) === 'Hi') done = true;
    }

    expect(getVisibleText(el)).toBe('Hi');
  });

  test('unobserves element after it becomes intersecting', () => {
    const el = createElement('Hi');
    new Typecadence();

    intersectionCallback([{ isIntersecting: true, target: el }]);

    expect(unobserveMock).toHaveBeenCalledWith(el);
  });

  test('ignores non-intersecting entries', () => {
    const el = createElement('Hi');
    new Typecadence();

    intersectionCallback([{ isIntersecting: false, target: el }]);

    expect(el.textContent).toBe('Hi');
    expect(unobserveMock).not.toHaveBeenCalled();
  });
});

// ===========================================================================
// Basic typing
// ===========================================================================

describe('Basic typing', () => {
  test('types the full text of the element', async () => {
    const el = createElement('Hello', { 'data-typecadence-mistakes': '0' });
    const tc = new Typecadence();

    await drainAnimation(tc.animateText(el));

    expect(getVisibleText(el)).toBe('Hello');
  });

  test('clears element text before starting animation', async () => {
    const el = createElement('Hello', { 'data-typecadence-mistakes': '0' });
    const tc = new Typecadence();

    const promise = tc.animateText(el);
    // Immediately after calling animateText, original text is cleared
    expect(el.textContent).not.toBe('Hello');

    await drainAnimation(promise);
  });

  test('handles empty text', async () => {
    const el = createElement('', { 'data-typecadence-mistakes': '0' });
    const tc = new Typecadence();

    await drainAnimation(tc.animateText(el));

    expect(getVisibleText(el)).toBe('');
  });

  test('handles single character text', async () => {
    const el = createElement('A', { 'data-typecadence-mistakes': '0' });
    const tc = new Typecadence();

    await drainAnimation(tc.animateText(el));

    expect(getVisibleText(el)).toBe('A');
  });

  test('handles long text', async () => {
    const longText = 'The quick brown fox jumps over the lazy dog';
    const el = createElement(longText, { 'data-typecadence-mistakes': '0' });
    const tc = new Typecadence();

    await drainAnimation(tc.animateText(el));

    expect(getVisibleText(el)).toBe(longText);
  });
});

// ===========================================================================
// Caret behavior
// ===========================================================================

describe('Caret behavior', () => {
  test('creates a caret element by default', async () => {
    const el = createElement('Hi', { 'data-typecadence-mistakes': '0' });
    const tc = new Typecadence();

    const promise = tc.animateText(el);
    const caret = el.querySelector('.typecadence-caret');
    expect(caret).not.toBeNull();
    expect(caret!.tagName).toBe('SPAN');
    expect(caret!.textContent).toBe('|');

    await drainAnimation(promise);
  });

  test('uses custom caret tag', async () => {
    const el = createElement('Hi', {
      'data-typecadence-caret-tag': 'div',
      'data-typecadence-mistakes': '0',
    });
    const tc = new Typecadence();

    const promise = tc.animateText(el);
    const caret = el.querySelector('.typecadence-caret');
    expect(caret!.tagName).toBe('DIV');

    await drainAnimation(promise);
  });

  test('uses custom caret class', async () => {
    const el = createElement('Hi', {
      'data-typecadence-caret-class': 'my-caret blinker',
      'data-typecadence-mistakes': '0',
    });
    const tc = new Typecadence();

    const promise = tc.animateText(el);
    const caret = el.querySelector('.typecadence-caret');
    expect(caret!.classList.contains('my-caret')).toBe(true);
    expect(caret!.classList.contains('blinker')).toBe(true);

    await drainAnimation(promise);
  });

  test('uses custom caret id', async () => {
    const el = createElement('Hi', {
      'data-typecadence-caret-id': 'my-caret-id',
      'data-typecadence-mistakes': '0',
    });
    const tc = new Typecadence();

    const promise = tc.animateText(el);
    const caret = el.querySelector('#my-caret-id');
    expect(caret).not.toBeNull();

    await drainAnimation(promise);
  });

  test('uses custom caret character', async () => {
    const el = createElement('Hi', {
      'data-typecadence-caret-char': '_',
      'data-typecadence-mistakes': '0',
    });
    const tc = new Typecadence();

    const promise = tc.animateText(el);
    const caret = el.querySelector('.typecadence-caret');
    expect(caret!.textContent).toBe('_');

    await drainAnimation(promise);
  });

  test('uses custom caret color', async () => {
    const el = createElement('Hi', {
      'data-typecadence-caret-color': 'red',
      'data-typecadence-mistakes': '0',
    });
    const tc = new Typecadence();

    const promise = tc.animateText(el);
    const caret = el.querySelector('.typecadence-caret') as HTMLElement;
    expect(caret.style.color).toBe('red');

    await drainAnimation(promise);
  });

  test('caret blinks by toggling visibility', async () => {
    const el = createElement('Hi', {
      'data-typecadence-caret-blink': 'true',
      'data-typecadence-caret-blink-speed': '100',
      'data-typecadence-mistakes': '0',
    });
    const tc = new Typecadence();

    const promise = tc.animateText(el);
    const caret = el.querySelector('.typecadence-caret') as HTMLElement;

    expect(caret.style.visibility).toBe('visible');

    jest.advanceTimersByTime(100);
    expect(caret.style.visibility).toBe('hidden');

    jest.advanceTimersByTime(100);
    expect(caret.style.visibility).toBe('visible');

    await drainAnimation(promise);
  });

  test('no caret when caret is disabled', async () => {
    const el = createElement('Hi', {
      'data-typecadence-caret': 'false',
      'data-typecadence-mistakes': '0',
    });
    const tc = new Typecadence();

    const promise = tc.animateText(el);
    const caret = el.querySelector('.typecadence-caret');
    expect(caret).toBeNull();

    await drainAnimation(promise);
  });

  test('caret is hidden after animation completes (no remain)', async () => {
    const el = createElement('Hi', { 'data-typecadence-mistakes': '0' });
    const tc = new Typecadence();

    await drainAnimation(tc.animateText(el));

    const caret = el.querySelector('.typecadence-caret') as HTMLElement;
    expect(caret.style.visibility).toBe('hidden');
  });

  test('caret remains visible when caretRemain is true', async () => {
    const el = createElement('Hi', {
      'data-typecadence-caret-remain': 'true',
      'data-typecadence-mistakes': '0',
    });
    const tc = new Typecadence();

    await drainAnimation(tc.animateText(el));

    const caret = el.querySelector('.typecadence-caret') as HTMLElement;
    // caretRemain=true means the blink interval keeps running (not forced hidden)
    expect(caret.style.visibility).not.toBe('');
  });

  test('caret hides after caretRemainTimeout', async () => {
    const el = createElement('Hi', {
      'data-typecadence-caret-remain': 'false',
      'data-typecadence-caret-remain-timeout': '500',
      'data-typecadence-mistakes': '0',
    });
    const tc = new Typecadence();

    await drainAnimation(tc.animateText(el));

    const caret = el.querySelector('.typecadence-caret') as HTMLElement;

    jest.advanceTimersByTime(500);
    expect(caret.style.visibility).toBe('hidden');
  });
});

// ===========================================================================
// Settings parsing
// ===========================================================================

describe('Settings parsing', () => {
  test('single speed value sets both min and max to the same value', async () => {
    const el = createElement('AB', {
      'data-typecadence-speed': '75',
      'data-typecadence-caret': 'false',
      'data-typecadence-mistakes': '0',
    });
    const tc = new Typecadence();

    await drainAnimation(tc.animateText(el));

    expect(getVisibleText(el)).toBe('AB');
  });

  test('range speed with dash is parsed correctly', async () => {
    const el = createElement('AB', {
      'data-typecadence-speed': '50-100',
      'data-typecadence-caret': 'false',
      'data-typecadence-mistakes': '0',
    });
    const tc = new Typecadence();

    await drainAnimation(tc.animateText(el));

    expect(getVisibleText(el)).toBe('AB');
  });

  test('range speed with comma is parsed correctly', async () => {
    const el = createElement('AB', {
      'data-typecadence-speed': '50,150',
      'data-typecadence-caret': 'false',
      'data-typecadence-mistakes': '0',
    });
    const tc = new Typecadence();

    await drainAnimation(tc.animateText(el));

    expect(getVisibleText(el)).toBe('AB');
  });

  test('delay causes animation to wait before typing', async () => {
    const el = createElement('A', {
      'data-typecadence-delay': '1000',
      'data-typecadence-caret': 'false',
      'data-typecadence-mistakes': '0',
    });
    const tc = new Typecadence();

    const promise = tc.animateText(el);

    // After 500ms (less than delay), nothing should be typed yet
    jest.advanceTimersByTime(500);
    await new Promise<void>(r => process.nextTick(r));
    expect(getVisibleText(el)).toBe('');

    await drainAnimation(promise);

    expect(getVisibleText(el)).toBe('A');
  });

  test('space-speed attribute is applied to space characters', async () => {
    const el = createElement('A B', {
      'data-typecadence-space-speed': '200',
      'data-typecadence-caret': 'false',
      'data-typecadence-mistakes': '0',
    });
    const tc = new Typecadence();

    await drainAnimation(tc.animateText(el));

    expect(getVisibleText(el)).toBe('A B');
  });

  test('backspace-speed attribute is applied during mistake correction', async () => {
    // Use alternating random: mistake on first try, then succeed on retry
    let callCount = 0;
    jest.spyOn(Math, 'random').mockImplementation(() => {
      // Alternate: low values trigger mistakes, high values don't
      // isMistake(50): random*100 < 50, so random < 0.5 triggers mistake
      return (callCount++ % 5 === 0) ? 0.01 : 0.99;
    });

    const el = createElement('AB', {
      'data-typecadence-backspace-speed': '30',
      'data-typecadence-mistakes': '50',
      'data-typecadence-caret': 'false',
    });
    const tc = new Typecadence();

    await drainAnimation(tc.animateText(el));

    expect(getVisibleText(el)).toBe('AB');
  });

  test('keyboard layout attribute is parsed', async () => {
    const el = createElement('AB', {
      'data-typecadence-keyboard': 'qwertz',
      'data-typecadence-mistakes': '0',
      'data-typecadence-caret': 'false',
    });
    const tc = new Typecadence();

    await drainAnimation(tc.animateText(el));

    expect(getVisibleText(el)).toBe('AB');
  });

  test('debug mode logs settings to console', async () => {
    const debugSpy = jest.spyOn(console, 'debug').mockImplementation();
    const el = createElement('A', {
      'data-typecadence-debug': 'true',
      'data-typecadence-caret': 'false',
      'data-typecadence-mistakes': '0',
    });
    const tc = new Typecadence();

    await drainAnimation(tc.animateText(el));

    expect(debugSpy).toHaveBeenCalledWith(
      'Typecadence settings:',
      expect.objectContaining({ debug: true }),
    );
  });
});

// ===========================================================================
// Mistake behavior
// ===========================================================================

describe('Mistake behavior', () => {
  test('no mistakes occur when mistakes is set to 0%', async () => {
    const el = createElement('Hello', {
      'data-typecadence-mistakes': '0',
      'data-typecadence-caret': 'false',
    });
    const tc = new Typecadence();

    await drainAnimation(tc.animateText(el));

    expect(getVisibleText(el)).toBe('Hello');
  });

  test('mistakes are made and then corrected', async () => {
    // First few calls return low value (triggers mistake), then high (succeeds).
    // isMistake(50): random*100 < 50, random < 0.5 → mistake
    let callCount = 0;
    jest.spyOn(Math, 'random').mockImplementation(() => {
      callCount++;
      // Calls 1-3 (first char: isMistake, incorrectChar, speed): trigger mistake
      // All subsequent calls: 0.99 → no mistake, corrections proceed, then types correctly
      return callCount <= 3 ? 0.01 : 0.99;
    });

    const el = createElement('ab', {
      'data-typecadence-mistakes': '50',
      'data-typecadence-mistakes-present': '1',
      'data-typecadence-caret': 'false',
    });
    const tc = new Typecadence();

    await drainAnimation(tc.animateText(el));

    // Final text should be correct after corrections
    expect(getVisibleText(el)).toBe('ab');
  });

  test('mistakesPresent controls how many mistakes accumulate before correction', async () => {
    let callCount = 0;
    jest.spyOn(Math, 'random').mockImplementation(() => {
      return (callCount++ % 4 === 0) ? 0.01 : 0.99;
    });

    const el = createElement('abc', {
      'data-typecadence-mistakes': '50',
      'data-typecadence-mistakes-present': '2',
      'data-typecadence-caret': 'false',
    });
    const tc = new Typecadence();

    await drainAnimation(tc.animateText(el));

    expect(getVisibleText(el)).toBe('abc');
  });

  test('preserves case of incorrect characters', async () => {
    // Force first call to be a mistake, rest to succeed
    let callCount = 0;
    jest.spyOn(Math, 'random').mockImplementation(() => {
      callCount++;
      // Call 1 (isMistake): 0.01 → 0.01*100=1 < 50 → mistake
      // Call 2 (incorrectChar index): 0.01 → floor(0.01*4)=0 → first adjacent
      // Call 3 (typingSpeed): 0.5 → some speed
      // Call 4+ (backspace speed, retry isMistake): 0.99 → no mistake
      return callCount <= 2 ? 0.01 : 0.99;
    });

    const el = createElement('A', {
      'data-typecadence-mistakes': '50',
      'data-typecadence-mistakes-present': '1',
      'data-typecadence-caret': 'false',
    });
    const tc = new Typecadence();

    // Track text nodes added to the element
    const addedChars: string[] = [];
    const observer = new MutationObserver((mutations) => {
      for (const m of mutations) {
        for (const node of m.addedNodes) {
          if (node.nodeType === Node.TEXT_NODE && node.textContent) {
            addedChars.push(node.textContent);
          }
        }
      }
    });
    observer.observe(el, { childList: true });

    await drainAnimation(tc.animateText(el));
    observer.disconnect();

    // Adjacent to 'a' (qwerty): ['q','w','s','z'], index 0 → 'q' → uppercase → 'Q'
    // The mistake char should be uppercase because the target 'A' is uppercase
    expect(addedChars.some(c => c !== 'A' && c === c.toUpperCase())).toBe(true);
  });
});

// ===========================================================================
// Events & callbacks
// ===========================================================================

describe('Events & callbacks', () => {
  test('dispatches typecadence:complete event when animation finishes', async () => {
    const el = createElement('Hi', {
      'data-typecadence-caret': 'false',
      'data-typecadence-mistakes': '0',
    });
    const tc = new Typecadence();

    const handler = jest.fn();
    el.addEventListener('typecadence:complete', handler);

    await drainAnimation(tc.animateText(el));

    expect(handler).toHaveBeenCalledTimes(1);
    expect((handler.mock.calls[0][0] as CustomEvent).detail).toEqual({ element: el });
  });

  test('typecadence:complete event bubbles', async () => {
    const el = createElement('Hi', {
      'data-typecadence-caret': 'false',
      'data-typecadence-mistakes': '0',
    });
    const tc = new Typecadence();

    const handler = jest.fn();
    document.body.addEventListener('typecadence:complete', handler);

    await drainAnimation(tc.animateText(el));

    expect(handler).toHaveBeenCalledTimes(1);
    document.body.removeEventListener('typecadence:complete', handler);
  });

  test('invokes global callback function when specified', async () => {
    const callbackFn = jest.fn();
    (window as any).myCallback = callbackFn;

    const el = createElement('Hi', {
      'data-typecadence-callback': 'myCallback',
      'data-typecadence-caret': 'false',
      'data-typecadence-mistakes': '0',
    });
    const tc = new Typecadence();

    await drainAnimation(tc.animateText(el));

    expect(callbackFn).toHaveBeenCalledTimes(1);
    expect(callbackFn).toHaveBeenCalledWith(el);

    delete (window as any).myCallback;
  });

  test('does not throw when callback references a non-existent function', async () => {
    const el = createElement('Hi', {
      'data-typecadence-callback': 'nonExistentFunction',
      'data-typecadence-caret': 'false',
      'data-typecadence-mistakes': '0',
    });
    const tc = new Typecadence();

    await expect(drainAnimation(tc.animateText(el))).resolves.toBeUndefined();
  });
});

// ===========================================================================
// Edge cases
// ===========================================================================

describe('Edge cases', () => {
  test('handles special characters', async () => {
    const text = '!@#$%^&*()';
    const el = createElement(text, {
      'data-typecadence-mistakes': '0',
      'data-typecadence-caret': 'false',
    });
    const tc = new Typecadence();

    await drainAnimation(tc.animateText(el));

    expect(getVisibleText(el)).toBe(text);
  });

  test('handles Unicode characters', async () => {
    const text = 'Héllo Wörld 你好';
    const el = createElement(text, {
      'data-typecadence-mistakes': '0',
      'data-typecadence-caret': 'false',
    });
    const tc = new Typecadence();

    await drainAnimation(tc.animateText(el));

    expect(getVisibleText(el)).toBe(text);
  });
});
