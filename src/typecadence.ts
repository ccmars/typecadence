declare var exports: any;
declare var define: any;

(function (global: any, factory: () => any) {
  if (typeof exports === 'object' && typeof module !== 'undefined') {
    module.exports = factory();
  } else if (typeof define === 'function' && define.amd) {
    define(factory);
  } else {
    global.Typecadence = factory();
  }
}(this, function () {
  'use strict';

  class Typecadence {
    static #instance: Typecadence | null = null;
    readonly #elements: NodeListOf<HTMLElement>;
    readonly #playbackState: Map<HTMLElement, { paused: boolean; resumeResolve?: () => void; originalText?: string; cancelled?: boolean; caretInterval?: number }> = new Map();
    readonly #storedText: Map<HTMLElement, string> = new Map();
    readonly #defaultSettings: AnimationSettings = {
      debug: false,
      delay: 0,
      minSpeed: 50,
      maxSpeed: 100,
      caret: true,
      caretChar: '|',
      caretColor: '',
      caretBold: true,
      caretBlink: true,
      caretBlinkSpeed: 500,
      caretTag: 'span',
      caretClass: '',
      caretId: '',
      caretRemain: false,
      caretRemainTimeout: null,
      spaceMinSpeed: null,
      spaceMaxSpeed: null,
      backspaceMinSpeed: null,
      backspaceMaxSpeed: null,
      mistakes: 5,
      mistakesPresent: 1,
      callback: '',
      keyboard: KeyboardLayout.QWERTY,
    };
    readonly #adjacentMapping = {
      qwerty: {
        '`': ['1', '2', 'q', 'w'],
        '1': ['2', 'q', '`'],
        '2': ['1', 'q', 'w', '3'],
        '3': ['2', 'w', 'e', '4'],
        '4': ['3', 'e', 'r', '5'],
        '5': ['4', 'r', 't', '6'],
        '6': ['5', 't', 'y', '7'],
        '7': ['6', 'y', 'u', '8'],
        '8': ['7', 'u', 'i', '9'],
        '9': ['8', 'i', 'o', '0'],
        '0': ['9', 'o', 'p', '-'],
        '-': ['0', 'p', '[', '='],
        '=': ['-', '[', ']'],
        'q': ['1', '2', 'w', 'a', '`'],
        'w': ['q', 'a', 's', 'e', '3', '2'],
        'e': ['w', 's', 'd', 'r', '4', '3'],
        'r': ['e', 'd', 'f', 't', '5', '4'],
        't': ['r', 'f', 'g', 'y', '6', '5'],
        'y': ['t', 'g', 'h', 'u', '7', '6'],
        'u': ['y', 'h', 'j', 'i', '8', '7'],
        'i': ['u', 'j', 'k', 'o', '9', '8'],
        'o': ['i', 'k', 'l', 'p', '0', '9'],
        'p': ['o', 'l', ';', '[', '-', '0'],
        '[': ['p', ';', '\'', ']', '=', '-'],
        ']': ['[', '\'', '\\', '='],
        'a': ['q', 'w', 's', 'z'],
        's': ['a', 'z', 'x', 'd', 'e', 'w'],
        'd': ['s', 'x', 'c', 'f', 'r', 'e'],
        'f': ['d', 'c', 'v', 'g', 't', 'r'],
        'g': ['f', 'v', 'b', 'h', 'y', 't'],
        'h': ['g', 'b', 'n', 'j', 'u', 'y'],
        'j': ['h', 'n', 'm', 'k', 'i', 'u'],
        'k': ['j', 'm', ',', 'l', 'o', 'i'],
        'l': ['k', ',', '.', ';', 'p', 'o'],
        ';': ['l', '.', '/', '\'', '[', 'p'],
        '\'': [';', '/', ']', '['],
        'z': ['a', 's', 'x'],
        'x': ['z', 's', 'c', 'd'],
        'c': ['x', 'd', 'f', 'v'],
        'v': ['c', 'f', 'g', 'b'],
        'b': ['v', 'g', 'h', 'n'],
        'n': ['b', 'h', 'j', 'm'],
        'm': ['n', 'j', 'k', ','],
        ',': ['m', 'k', 'l', '.'],
        '.': [',', 'l', ';', '/'],
        '/': ['.', ';', '\''],
        '\\': [']', '[', '\''],
      },
      qwertz: {
        '1': ['2', 'q', 'a', 'y', '0'],
        '2': ['1', 'q', 'w', 's', 'e', '3'],
        '3': ['2', 'w', 'e', 'd', 'r', '4'],
        '4': ['3', 'e', 'r', 'f', 't', '5'],
        '5': ['4', 't', 'z', 'g', 'h', '6'],
        '6': ['5', 'z', 'u', 'h', 'j', '7'],
        '7': ['6', 'u', 'i', 'j', 'k', '8'],
        '8': ['7', 'i', 'o', 'k', 'l', '9'],
        '9': ['8', 'o', 'p', 'l', 'm', 'ß'],
        '0': ['9', 'p', 'ü', 'ß', '´'],
        'ß': ['0', 'ü', '+', '´'],
        'q': ['1', '2', 'w', 'a', 'y'],
        'w': ['q', 'a', 's', 'e', 'd', '2', '3'],
        'e': ['w', 's', 'd', 'f', 'r', '3', '4'],
        'r': ['e', 'd', 'f', 'g', 't', '4', '5'],
        't': ['r', 'f', 'g', 'h', 'z', '5', '6'],
        'z': ['t', 'g', 'h', 'u', 'i', '6', '7'],
        'u': ['z', 'h', 'j', 'k', 'o', '7', '8'],
        'i': ['u', 'j', 'k', 'l', 'p', 'ö', 'ü', '8', '9'],
        'o': ['i', 'k', 'l', 'ö', 'ä', 'p', '9', '0'],
        'p': ['o', 'l', 'ö', 'ä', 'ü', '+', '0', 'ß'],
        'a': ['q', 'w', 's', 'y'],
        's': ['a', 'w', 'e', 'd', 'x', 'y'],
        'd': ['s', 'e', 'r', 'f', 'c', 'x'],
        'f': ['d', 'r', 't', 'g', 'v', 'c'],
        'g': ['f', 't', 'z', 'h', 'b', 'v'],
        'h': ['g', 'z', 'u', 'j', 'n', 'b'],
        'j': ['h', 'u', 'i', 'k', 'm', 'n'],
        'k': ['j', 'i', 'o', 'l', ',', 'm'],
        'l': ['k', 'o', 'p', 'ö', 'ä', 'ü', 'm'],
        'ö': ['l', 'p', 'ü', 'ä'],
        'ä': ['ö', 'p', 'ü'],
        'y': ['q', 'a', 's', 'x'],
        'x': ['y', 's', 'd', 'c'],
        'c': ['x', 'd', 'f', 'v'],
        'v': ['c', 'f', 'g', 'b'],
        'b': ['v', 'g', 'h', 'n'],
        'n': ['b', 'h', 'j', 'm'],
        'm': ['n', 'j', 'k', 'l', ','],
        ',': ['m', 'k', 'l', ';', '.', '-'],
        '.': [',', 'l', ';', ':', '/', '-'],
        '-': ['.', ';', ':', '_', '+'],
        '+': ['-', ':', 'ß', '´'],
        '´': ['+', 'ß'],
      },
      azerty: {
        '1': ['2', '&', 'a', 'z'],
        '2': ['1', 'a', 'z', 'e', '3'],
        '3': ['2', 'e', 'r', 'z', 'u', '4'],
        '4': ['3', 'r', 't', 'u', 'i', 'f', '5'],
        '5': ['4', 't', 'y', 'i', 'o', 'g', '6'],
        '6': ['5', 'y', 'u', 'o', 'p', 'h', '7'],
        '7': ['6', 'u', 'i', 'p', '¨', 'j', '8'],
        '8': ['7', 'i', 'o', '¨', 'k', 'l', 'm', '9'],
        '9': ['8', 'o', 'p', 'l', 'm', 'ù', '0'],
        '0': ['9', 'p', 'm', 'ù', '²'],
        'q': ['a', 'z', 'w', 's', '2'],
        'w': ['q', 'z', 'e', 's', 'd', '3'],
        'e': ['w', 's', 'd', 'f', 'r', '4'],
        'r': ['e', 'd', 'f', 'g', 't', '5'],
        't': ['r', 'f', 'g', 'h', 'y', '6'],
        'y': ['t', 'g', 'h', 'j', 'u', '7'],
        'u': ['y', 'h', 'j', 'k', 'i', 'z', '8'],
        'i': ['u', 'j', 'k', 'l', 'o', 'è', '9'],
        'o': ['i', 'k', 'l', 'm', 'p', 'à', '0'],
        'p': ['o', 'l', 'm', 'ù', '0', '^', '$'],
        'a': ['q', 'w', 'z', 'x'],
        's': ['a', 'z', 'e', 'd', 'x', 'c'],
        'd': ['s', 'e', 'r', 'f', 'c', 'v'],
        'f': ['d', 'r', 't', 'g', 'v', 'b'],
        'g': ['f', 't', 'y', 'h', 'b', 'n'],
        'h': ['g', 'y', 'u', 'j', 'n', 'm'],
        'j': ['h', 'u', 'i', 'k', 'm', ',', ';'],
        'k': ['j', 'i', 'o', 'l', ',', 'm', '!'],
        'l': ['k', 'o', 'p', 'm', 'ù', '²', ':'],
        'm': ['l', 'p', 'ù', '²', '$', '*'],
        'ù': ['m', 'p', '0', '²', '*', '%'],
        'z': ['a', 'q', 's', 'e'],
        'x': ['z', 's', 'd', 'c'],
        'c': ['x', 'd', 'f', 'v'],
        'v': ['c', 'f', 'g', 'b'],
        'b': ['v', 'g', 'h', 'n'],
        'n': ['b', 'h', 'j', 'm'],
        ',': ['m', 'j', 'k', ';', ':', '!'],
        ';': [',', 'k', 'l', 'm', ':', '*'],
        ':': [';', 'l', 'ù', '$', '*', '%'],
        '!': [':', 'k', 'm', 'ù', '$', '*'],
        '$': ['ù', 'm', ',', ';', ':', '!'],
        '^': ['p', 'ù', '*', '$'],
        '*': ['^', 'ù', 'm', ',', ';', ':', '!'],
        '%': ['^', 'ù', ':', '$', '*'],
        '²': ['&', 'é', '"', '(', '-', 'è', '_', 'ç', 'à', ')', '=', '0'],
        '&': ['1', 'a', 'z', 'é', '2', 'é', '²'],
        'é': ['&', 'a', 'z', 'e', '"', '2', '²', '(', 'è', '3'],
        '"': ['é', 'z', 'e', 'r', "'", '(', '²', '-', 'è', '4'],
        '\'': ['"', 'e', 'r', 't', '(', 'è', '5', 'è'],
        '(': ['"', 'é', 'r', 't', 'y', 'u', 'è', '_', 'ç', '6'],
        '-': ['²', '(', 'è', 'y', 'u', 'i', 'è', 'ç', '8', '0', '=', ')'],
        'è': ['-', 'y', 'u', 'i', 'o', 'p', '^', '$', '*', '(', '_', 'ç', 'à', ')', '=', '²'],
        '_': ['-', '(', 'è', 'u', 'i', 'o', 'p', '^', '$', '*', 'ç', 'à', ')', '=', '0'],
        'ç': ['²', 'è', '_', 'a', 'q', 'w', 'x', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'm', 'ù', '²', '!', ':', '*', ')', '=', 'à'],
        'à': ['ç', '²', '(', '-', '0', ')', '=', '_'],
        '=': ['-', '0', '²', ')', '_', 'ç', 'à'],
      }
    };
    #observer: IntersectionObserver;

    constructor() {
      if (Typecadence.#instance) {
        return Typecadence.#instance;
      }
      this.#elements = document.querySelectorAll(".typecadence");
      this.#observer = new IntersectionObserver(this.#handleIntersect.bind(this), {
        root: null,
        rootMargin: "0px",
        threshold: 0.1,
      });
      Typecadence.#instance = this;
      this.init();
    }

    /** @internal Reset singleton for testing. */
    static _resetInstance(): void {
      Typecadence.#instance = null;
    }

    init(): void {
      for (const element of this.#elements) {
        // For manual trigger elements, hide text immediately and store it
        const triggerAttr = element.getAttribute("data-typecadence-trigger")?.toLowerCase();
        if (triggerAttr === TriggerMode.MANUAL) {
          this.#storedText.set(element, element.textContent?.trim() || '');
          element.textContent = '';
        }
        this.#observer.observe(element);
      }
    }

    static play(element: HTMLElement | string): Promise<void> | null {
      const instance = Typecadence.#instance;
      if (!instance) {
        console.warn('Typecadence: No instance available. Ensure Typecadence is initialized.');
        return null;
      }

      const targetElement = typeof element === 'string'
        ? document.querySelector(element) as HTMLElement | null
        : element;

      if (!targetElement) {
        console.warn('Typecadence: Element not found.');
        return null;
      }

      // If animation is active, either resume (if paused) or ignore
      const state = instance.#playbackState.get(targetElement);
      if (state) {
        if (state.paused && state.resumeResolve) {
          state.paused = false;
          state.resumeResolve();
          state.resumeResolve = undefined;
        }
        return null;
      }

      // Otherwise start a new animation
      return instance.#animateText(targetElement);
    }

    static pause(element: HTMLElement | string): boolean {
      const instance = Typecadence.#instance;
      if (!instance) {
        console.warn('Typecadence: No instance available. Ensure Typecadence is initialized.');
        return false;
      }

      const targetElement = typeof element === 'string'
        ? document.querySelector(element) as HTMLElement | null
        : element;

      if (!targetElement) {
        console.warn('Typecadence: Element not found.');
        return false;
      }

      const state = instance.#playbackState.get(targetElement);
      if (!state) {
        console.warn('Typecadence: No active animation for this element.');
        return false;
      }

      state.paused = true;
      return true;
    }

    static restart(element: HTMLElement | string): Promise<void> | null {
      const instance = Typecadence.#instance;
      if (!instance) {
        console.warn('Typecadence: No instance available. Ensure Typecadence is initialized.');
        return null;
      }

      const targetElement = typeof element === 'string'
        ? document.querySelector(element) as HTMLElement | null
        : element;

      if (!targetElement) {
        console.warn('Typecadence: Element not found.');
        return null;
      }

      const state = instance.#playbackState.get(targetElement);
      if (state) {
        // Cancel current animation
        state.cancelled = true;
        if (state.caretInterval) {
          clearInterval(state.caretInterval);
        }
        if (state.paused && state.resumeResolve) {
          state.resumeResolve();
        }
        // Store original text for the next animation to pick up
        if (state.originalText !== undefined) {
          instance.#storedText.set(targetElement, state.originalText);
          targetElement.textContent = '';
        }
        instance.#playbackState.delete(targetElement);
      }

      return instance.#animateText(targetElement);
    }

    #handleIntersect(entries: IntersectionObserverEntry[]): void {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          const element = entry.target as HTMLElement;
          const triggerAttr = element.getAttribute("data-typecadence-trigger")?.toLowerCase();
          if (triggerAttr !== TriggerMode.MANUAL) {
            this.#animateText(element);
          }
          this.#observer.unobserve(entry.target);
        }
      }
    }

    #parseAnimationSettings(element: HTMLElement): AnimationSettings {
      const debugAttribute = element.getAttribute("data-typecadence-debug")?.toLowerCase();
      const debug = debugAttribute === "true" ? true : debugAttribute === "false" ? false : this.#defaultSettings.debug;
      const delayAttribute = parseInt(element.getAttribute("data-typecadence-delay"));
      const delay = isNaN(delayAttribute) ? this.#defaultSettings.delay : delayAttribute;
      const [minSpeed, maxSpeed] = this.#parseSpeedAttribute(element.getAttribute("data-typecadence-speed"));

      const spaceSpeedAttr = element.getAttribute("data-typecadence-space-speed");
      const [spaceMinSpeedParsed, spaceMaxSpeedParsed] = spaceSpeedAttr
        ? this.#parseSpeedAttribute(spaceSpeedAttr)
        : [NaN, NaN];
      const spaceMinSpeed = isNaN(spaceMinSpeedParsed) ? this.#defaultSettings.spaceMinSpeed : spaceMinSpeedParsed;
      const spaceMaxSpeed = isNaN(spaceMaxSpeedParsed) ? this.#defaultSettings.spaceMaxSpeed : spaceMaxSpeedParsed;

      const backspaceSpeedAttr = element.getAttribute("data-typecadence-backspace-speed");
      const [backspaceMinSpeedParsed, backspaceMaxSpeedParsed] = backspaceSpeedAttr
        ? this.#parseSpeedAttribute(backspaceSpeedAttr)
        : [NaN, NaN];
      const backspaceMinSpeed = isNaN(backspaceMinSpeedParsed) ? this.#defaultSettings.backspaceMinSpeed : backspaceMinSpeedParsed;
      const backspaceMaxSpeed = isNaN(backspaceMaxSpeedParsed) ? this.#defaultSettings.backspaceMaxSpeed : backspaceMaxSpeedParsed;

      const displayCaretAttribute = element.getAttribute("data-typecadence-caret")?.toLowerCase();
      const caret = displayCaretAttribute === "true" ? true :
        displayCaretAttribute === "false" ? false :
          this.#defaultSettings.caret;
      const caretChar = element.getAttribute("data-typecadence-caret-char") || this.#defaultSettings.caretChar;
      const caretColor = element.getAttribute("data-typecadence-caret-color") || this.#defaultSettings.caretColor;
      const caretTag = element.getAttribute("data-typecadence-caret-tag") || this.#defaultSettings.caretTag;
      const caretClass = element.getAttribute("data-typecadence-caret-class") || this.#defaultSettings.caretClass;
      const caretId = element.getAttribute("data-typecadence-caret-id") || this.#defaultSettings.caretId;
      const caretBoldAttribute = element.getAttribute("data-typecadence-caret-bold")?.toLowerCase();
      const caretBold = caretBoldAttribute === "true" ? true :
        caretBoldAttribute === "false" ? false :
          this.#defaultSettings.caretBold;
      const caretBlinkSpeedAttribute = parseInt(element.getAttribute("data-typecadence-caret-blink-speed"));
      const caretBlinkSpeed = isNaN(caretBlinkSpeedAttribute) ? this.#defaultSettings.caretBlinkSpeed : caretBlinkSpeedAttribute;
      const caretBlinkAttribute = element.getAttribute("data-typecadence-caret-blink")?.toLowerCase();
      const caretBlink = caretBlinkAttribute === "true" ? true :
        caretBlinkAttribute === "false" ? false :
          this.#defaultSettings.caretBlink;
      const caretRemainAttribute = element.getAttribute("data-typecadence-caret-remain")?.toLowerCase();
      const caretRemain = caretRemainAttribute === "true" ? true :
        caretRemainAttribute === "false" ? false :
          this.#defaultSettings.caretRemain;
      const caretRemainTimeoutAttribute = parseInt(element.getAttribute("data-typecadence-caret-remain-timeout"));
      const caretRemainTimeout = isNaN(caretRemainTimeoutAttribute) ? this.#defaultSettings.caretRemainTimeout : caretRemainTimeoutAttribute;
      const mistakesPercent = this.#parsePercent(element.getAttribute("data-typecadence-mistakes"));
      const mistakes = (mistakesPercent !== null) ? mistakesPercent : this.#defaultSettings.mistakes;
      const mistakesPresentAttribute = parseInt(element.getAttribute("data-typecadence-mistakes-present"));
      const mistakesPresent = mistakesPresentAttribute < 0 || isNaN(mistakesPresentAttribute) ? this.#defaultSettings.mistakesPresent : Math.max(1, mistakesPresentAttribute);
      const callback = element.getAttribute("data-typecadence-callback") || this.#defaultSettings.callback;
      const keyboardAttribute = element.getAttribute("data-typecadence-keyboard")?.toLowerCase();
      const keyboard = keyboardAttribute === KeyboardLayout.QWERTZ ? KeyboardLayout.QWERTZ :
        keyboardAttribute === KeyboardLayout.AZERTY ? KeyboardLayout.AZERTY :
          this.#defaultSettings.keyboard;
      const animationSettings = {
        debug,
        delay,
        minSpeed,
        maxSpeed,
        spaceMinSpeed,
        spaceMaxSpeed,
        backspaceMinSpeed,
        backspaceMaxSpeed,
        caret,
        caretTag,
        caretClass,
        caretId,
        caretChar,
        caretColor,
        caretBold,
        caretBlinkSpeed,
        caretBlink,
        caretRemain,
        caretRemainTimeout,
        callback,
        mistakes,
        mistakesPresent,
        keyboard,
      };

      if (debug) console.debug("Typecadence settings:", animationSettings);
      return animationSettings;
    }

    #parseSpeedAttribute(speedAttribute: string | null): [number, number] {
      const regex = /^\d+(?:[,-]\d+)?$/;
      if (!speedAttribute || !regex.test(speedAttribute)) return [this.#defaultSettings.minSpeed, this.#defaultSettings.maxSpeed];

      const speedValues = speedAttribute.split(/[,-]/).map(Number);
      if (speedValues.length === 1) return [speedValues[0], speedValues[0]];
      return [speedValues[0], speedValues[1]];
    }

    #parsePercent(percentAttribute: string | null): number {
      const percent = parseInt(percentAttribute || '', 10);
      if (isNaN(percent)) {
        return null;
      }
      return percent < 0 ? 0 : (percent > 100 ? 100 : percent);
    }

    #getTypingSpeed(minSpeed: number, maxSpeed: number): number {
      return Math.floor(Math.random() * (maxSpeed - minSpeed + 1)) + minSpeed;
    }

    #createCaret(animationSettings: AnimationSettings): HTMLElement {
      const caret = document.createElement(animationSettings.caretTag);
      caret.classList.add("typecadence-caret");
      if (animationSettings.caretClass) {
        for (const cls of animationSettings.caretClass.split(/\s+/)) {
          if (cls) caret.classList.add(cls);
        }
      }
      if (animationSettings.caretId) {
        caret.id = animationSettings.caretId;
      }
      caret.textContent = animationSettings.caretChar;
      caret.style.color = animationSettings.caretColor;
      caret.style.fontWeight = animationSettings.caretBold ? "bold" : "normal";
      caret.style.visibility = "visible";
      return caret;
    }

    #isMistake(chance: number): boolean {
      if (chance <= 0) return false;
      return Math.random() * 100 < chance;
    }

    #incorrectChar(desiredChar: string, keyboard: string = 'qwerty'): string {
      const desiredCharLower = desiredChar.toLowerCase();
      const adjacentChars = this.#adjacentMapping[keyboard][desiredCharLower];

      if (!adjacentChars) {
        return desiredChar;
      }

      const randomIndex = Math.floor(Math.random() * adjacentChars.length);
      const incorrectChar = adjacentChars[randomIndex];

      return desiredChar === desiredChar.toUpperCase() ? incorrectChar.toUpperCase() : incorrectChar;
    }

    async #backspace(element: HTMLElement, caret: HTMLElement | null, minSpeed: number, maxSpeed: number): Promise<void> {
      if (caret) {
        element.removeChild(element.lastChild!.previousSibling!);
      } else {
        element.textContent = element.textContent!.slice(0, -1);
      }
      await new Promise(resolve => setTimeout(resolve, this.#getTypingSpeed(minSpeed, maxSpeed)));
    }

    async #waitIfPaused(element: HTMLElement): Promise<void> {
      const state = this.#playbackState.get(element);
      if (state?.paused) {
        await new Promise<void>(resolve => {
          state.resumeResolve = resolve;
        });
      }
    }

    async #animateText(element: HTMLElement): Promise<void> {
      const animationSettings = this.#parseAnimationSettings(element);

      // Define text content (use pre-stored text for manual trigger elements)
      const text = this.#storedText.get(element) || element.textContent?.trim() || '';
      this.#storedText.delete(element);

      // Initialize playback state with original text
      this.#playbackState.set(element, { paused: false, originalText: text });

      element.textContent = "";

      let caret: HTMLElement | null = null;
      let caretAnimationInterval: number | null = null;

      // Show caret
      if (animationSettings.caret) {
        caret = this.#createCaret(animationSettings);
        element.appendChild(caret);

        if (animationSettings.caretBlink) {
          // @ts-ignore - browser setInterval returns number
          caretAnimationInterval = setInterval(() => {
            if (caret.style.visibility === "visible") {
              caret.style.visibility = "hidden";
            } else {
              caret.style.visibility = "visible";
            }
          }, animationSettings.caretBlinkSpeed);
          const currentState = this.#playbackState.get(element);
          if (currentState) {
            currentState.caretInterval = caretAnimationInterval;
          }
        }
      }

      // Delay before typing
      await new Promise((resolve) => setTimeout(resolve, animationSettings.delay));

      let mistakeBuffer: number[] = [];
      let currentIndex = 0;
      let justCorrected = false;

      // Type animation
      const animationState = this.#playbackState.get(element);
      while (currentIndex < text.length || mistakeBuffer.length > 0) {
        // Check if cancelled (e.g., by restart)
        if (animationState?.cancelled) {
          if (caretAnimationInterval) clearInterval(caretAnimationInterval);
          return;
        }

        // Wait if paused
        await this.#waitIfPaused(element);

        // Check again after pause in case we were cancelled while paused
        if (animationState?.cancelled) {
          if (caretAnimationInterval) clearInterval(caretAnimationInterval);
          return;
        }

        // Correct mistakes
        if (
          mistakeBuffer.length >= animationSettings.mistakesPresent
          || (
            mistakeBuffer.length > 0
            && currentIndex >= text.length
          )
        ) {
          const mistakeIndex = mistakeBuffer[0];
          const stepsToGoBack = currentIndex - mistakeIndex;

          for (let i = 0; i < stepsToGoBack; i++) {
            await this.#backspace(element, caret, animationSettings.backspaceMinSpeed ?? animationSettings.minSpeed, animationSettings.backspaceMaxSpeed ?? animationSettings.maxSpeed);
            currentIndex--;
          }

          mistakeBuffer = [];
          justCorrected = true;
        }

        // Type next character
        const char = text[currentIndex];
        const isMistake = !justCorrected && this.#isMistake(animationSettings.mistakes);
        justCorrected = false;
        if (isMistake) {
          const incorrectChar = this.#incorrectChar(char, animationSettings.keyboard);
          const charNode = document.createTextNode(incorrectChar);
          if (caret) {
            element.insertBefore(charNode, caret);
          } else {
            element.appendChild(charNode);
          }
          if (char !== incorrectChar) {
            mistakeBuffer.push(currentIndex);
          }
        } else {
          const charNode = document.createTextNode(char);
          if (caret) {
            element.insertBefore(charNode, caret);
          } else {
            element.appendChild(charNode);
          }
        }

        const isSpace = char === ' ';
        const typingMinSpeed = isSpace ? (animationSettings.spaceMinSpeed ?? animationSettings.minSpeed) : animationSettings.minSpeed;
        const typingMaxSpeed = isSpace ? (animationSettings.spaceMaxSpeed ?? animationSettings.maxSpeed) : animationSettings.maxSpeed;
        const typingSpeed = this.#getTypingSpeed(typingMinSpeed, typingMaxSpeed);

        await new Promise((resolve) => setTimeout(resolve, typingSpeed));
        currentIndex++;
      }

      // Hide caret
      if (animationSettings.caret) {
        if (caretAnimationInterval && (animationSettings.caretRemain || animationSettings.caretRemainTimeout)) {
          if (animationSettings.caretRemainTimeout) {
            setTimeout(() => {
              clearInterval(caretAnimationInterval);
              if (caret) {
                caret.style.visibility = "hidden";
              }
            }, animationSettings.caretRemainTimeout);
          }
        } else {
          clearInterval(caretAnimationInterval);
          if (caret) {
            caret.style.visibility = "hidden";
          }
        }
      }

      // Preserve original text for potential restart, then clean up playback state
      const originalText = this.#playbackState.get(element)?.originalText;
      if (originalText !== undefined) {
        this.#storedText.set(element, originalText);
      }
      this.#playbackState.delete(element);

      // Dispatch completion event
      element.dispatchEvent(new CustomEvent('typecadence:complete', {
        bubbles: true,
        detail: { element }
      }));

      // Call named global callback if specified
      if (animationSettings.callback) {
        const fn = (window as any)[animationSettings.callback];
        if (typeof fn === 'function') {
          fn(element);
        }
      }
    }
  }

  interface AnimationSettings {
    debug: boolean;
    delay: number;
    minSpeed: number;
    maxSpeed: number;
    spaceMinSpeed: number | null;
    spaceMaxSpeed: number | null;
    backspaceMinSpeed: number | null;
    backspaceMaxSpeed: number | null;
    caret: boolean;
    caretTag: string;
    caretClass: string;
    caretId: string;
    caretChar: string;
    caretColor: string;
    caretBold: boolean;
    caretBlinkSpeed: number;
    caretBlink: boolean;
    caretRemain: boolean;
    caretRemainTimeout: number;
    callback: string;
    mistakes: number;
    mistakesPresent: number;
    keyboard: KeyboardLayout;
  }

  enum TriggerMode {
    VISIBLE = 'visible',
    MANUAL = 'manual'
  }

  enum KeyboardLayout {
    QWERTY = 'qwerty',
    QWERTZ = 'qwertz',
    AZERTY = 'azerty'
  }

  if (typeof window !== 'undefined') {
      document.addEventListener("DOMContentLoaded", () => {
          new Typecadence();
      });
  }

  return Typecadence;
}));