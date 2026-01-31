import { KeyboardLayout, ADJACENT_KEY_MAPPING } from './typecadence_keyboardLayouts.js';

class Typecadence {
  readonly #elements: NodeListOf<HTMLElement>;
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
    caretRemain: false,
    caretRemainTimeout: null,
    spaceMinSpeed: null,
    spaceMaxSpeed: null,
    backspaceMinSpeed: null,
    backspaceMaxSpeed: null,
    mistakes: 5,
    mistakesPresent: 1,
    keyboard: KeyboardLayout.QWERTY,
  };
  readonly #adjacentMapping = ADJACENT_KEY_MAPPING;
  #observer: IntersectionObserver;

  constructor() {
    this.#elements = document.querySelectorAll(".typecadence");
    this.#observer = new IntersectionObserver(this.#handleIntersect.bind(this), {
      root: null,
      rootMargin: "0px",
      threshold: 0.1,
    });
    this.init();
  }

  init(): void {
    this.#elements.forEach((element) => {
      this.#observer.observe(element);
    });
  }

  #handleIntersect(entries: IntersectionObserverEntry[]): void {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        this.animateText(entry.target as HTMLElement);
        this.#observer.unobserve(entry.target);
      }
    }
  }

  #parseAnimationSettings(element: HTMLElement): AnimationSettings {
    const debugAttribute = element.getAttribute("data-typecadence-debug")?.toLowerCase();
    const debug = debugAttribute === "true" ? true : debugAttribute === "false" ? false : this.#defaultSettings.debug;

    const delayAttribute = element.getAttribute("data-typecadence-delay");
    const delayParsed = delayAttribute ? parseInt(delayAttribute) : NaN;
    const delay = isNaN(delayParsed) ? this.#defaultSettings.delay : delayParsed;

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

    const caretBoldAttribute = element.getAttribute("data-typecadence-caret-bold")?.toLowerCase();
    const caretBold = caretBoldAttribute === "true" ? true :
      caretBoldAttribute === "false" ? false :
        this.#defaultSettings.caretBold;

    const caretBlinkSpeedAttribute = element.getAttribute("data-typecadence-caret-blink-speed");
    const caretBlinkSpeedParsed = caretBlinkSpeedAttribute ? parseInt(caretBlinkSpeedAttribute) : NaN;
    const caretBlinkSpeed = isNaN(caretBlinkSpeedParsed) ? this.#defaultSettings.caretBlinkSpeed : caretBlinkSpeedParsed;

    const caretBlinkAttribute = element.getAttribute("data-typecadence-caret-blink")?.toLowerCase();
    const caretBlink = caretBlinkAttribute === "true" ? true :
      caretBlinkAttribute === "false" ? false :
        this.#defaultSettings.caretBlink;

    const caretRemainAttribute = element.getAttribute("data-typecadence-caret-remain")?.toLowerCase();
    const caretRemain = caretRemainAttribute === "true" ? true :
      caretRemainAttribute === "false" ? false :
        this.#defaultSettings.caretRemain;

    const caretRemainTimeoutAttribute = element.getAttribute("data-typecadence-caret-remain-timeout");
    const caretRemainTimeoutParsed = caretRemainTimeoutAttribute ? parseInt(caretRemainTimeoutAttribute) : NaN;
    const caretRemainTimeout = isNaN(caretRemainTimeoutParsed) ? this.#defaultSettings.caretRemainTimeout : caretRemainTimeoutParsed;

    const mistakesPercent = this.#parsePercent(element.getAttribute("data-typecadence-mistakes"));
    const mistakes = (mistakesPercent !== null) ? mistakesPercent : this.#defaultSettings.mistakes;

    const mistakesPresentAttribute = element.getAttribute("data-typecadence-mistakes-present");
    const mistakesPresentParsed = mistakesPresentAttribute ? parseInt(mistakesPresentAttribute) : NaN;
    const mistakesPresent = mistakesPresentParsed < 0 || isNaN(mistakesPresentParsed) ?
      this.#defaultSettings.mistakesPresent : Math.max(1, mistakesPresentParsed);

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
      caretChar,
      caretColor,
      caretBold,
      caretBlinkSpeed,
      caretBlink,
      caretRemain,
      caretRemainTimeout,
      mistakes,
      mistakesPresent,
      keyboard
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

  #parsePercent(percentAttribute: string | null): number | null {
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
    const caret = document.createElement("span");
    caret.classList.add("typecadence-caret");
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
    const keyboardLayout = keyboard as keyof typeof ADJACENT_KEY_MAPPING;
    const keyboardMapping = this.#adjacentMapping[keyboardLayout];

    if (!keyboardMapping || !(desiredCharLower in keyboardMapping)) {
      return desiredChar;
    }

    const adjacentChars = keyboardMapping[desiredCharLower as keyof typeof keyboardMapping];
    const randomIndex = Math.floor(Math.random() * adjacentChars.length);
    const incorrectChar = adjacentChars[randomIndex];

    return desiredChar === desiredChar.toUpperCase() ? incorrectChar.toUpperCase() : incorrectChar;
  }

  async #backspace(element: HTMLElement, caret: HTMLElement | null, minSpeed: number, maxSpeed: number): Promise<void> {
    if (caret) {
      const previousSibling = element.lastChild?.previousSibling;
      if (previousSibling) {
        element.removeChild(previousSibling);
      }
    } else {
      const currentText = element.textContent;
      if (currentText) {
        element.textContent = currentText.slice(0, -1);
      }
    }
    await new Promise(resolve => setTimeout(resolve, this.#getTypingSpeed(minSpeed, maxSpeed)));
  }

  async animateText(element: HTMLElement): Promise<void> {
    const animationSettings = this.#parseAnimationSettings(element);

    // Define text content
    const text = element.textContent?.trim() || '';
    element.textContent = "";

    let caret: HTMLElement | null = null;
    let caretAnimationInterval: number | null = null;

    // Show caret
    if (animationSettings.caret) {
      caret = this.#createCaret(animationSettings);
      element.appendChild(caret);

      if (animationSettings.caretBlink) {
        caretAnimationInterval = window.setInterval(() => {
          if (caret) {
            if (caret.style.visibility === "visible") {
              caret.style.visibility = "hidden";
            } else {
              caret.style.visibility = "visible";
            }
          }
        }, animationSettings.caretBlinkSpeed);
      }
    }

    // Delay before typing
    await new Promise((resolve) => setTimeout(resolve, animationSettings.delay));

    let mistakeBuffer: number[] = [];
    let currentIndex = 0;

    // Type animation
    while (currentIndex < text.length || mistakeBuffer.length > 0) {
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
          const bsMin = animationSettings.backspaceMinSpeed ?? animationSettings.minSpeed;
          const bsMax = animationSettings.backspaceMaxSpeed ?? animationSettings.maxSpeed;
          await this.#backspace(element, caret, bsMin, bsMax);
          currentIndex--;
        }

        mistakeBuffer = [];
      }

      // Type next character
      if (currentIndex < text.length) {
        const char = text[currentIndex];
        const isMistake = this.#isMistake(animationSettings.mistakes);
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
        const speedMin = isSpace
          ? (animationSettings.spaceMinSpeed ?? animationSettings.minSpeed)
          : animationSettings.minSpeed;
        const speedMax = isSpace
          ? (animationSettings.spaceMaxSpeed ?? animationSettings.maxSpeed)
          : animationSettings.maxSpeed;
        const typingSpeed = this.#getTypingSpeed(speedMin, speedMax);

        await new Promise((resolve) => setTimeout(resolve, typingSpeed));
        currentIndex++;
      }
    }

    // Hide caret
    if (animationSettings.caret && caret) {
      if (caretAnimationInterval && (animationSettings.caretRemain || animationSettings.caretRemainTimeout)) {
        if (animationSettings.caretRemainTimeout) {
          setTimeout(() => {
            if (caretAnimationInterval) {
              clearInterval(caretAnimationInterval);
            }
            if (caret) {
              caret.style.visibility = "hidden";
            }
          }, animationSettings.caretRemainTimeout);
        }
      } else {
        if (caretAnimationInterval) {
          clearInterval(caretAnimationInterval);
        }
        if (caret) {
          caret.style.visibility = "hidden";
        }
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
  caretChar: string;
  caretColor: string;
  caretBold: boolean;
  caretBlinkSpeed: number;
  caretBlink: boolean;
  caretRemain: boolean;
  caretRemainTimeout: number | null;
  mistakes: number;
  mistakesPresent: number;
  keyboard: KeyboardLayout;
}

// Auto-initialize when DOM is ready (for UMD version)
if (typeof window !== 'undefined') {
  document.addEventListener("DOMContentLoaded", () => {
    new Typecadence();
  });
}

export default Typecadence;