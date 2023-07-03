declare var exports: any;
declare var module: any;
declare var define: any;

(function (global, factory) {
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
    readonly #elements: NodeListOf<HTMLElement>;
    readonly #defaultSettings: AnimationSettings = {
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
      mistakes: 5,
      mistakesPresent: 1,
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
      this.#elements = document.querySelectorAll(".typecadence");
      this.#observer = new IntersectionObserver(this.#handleIntersect.bind(this), {
        root: null,
        rootMargin: "0px",
        threshold: 0.1,
      });
      this.init();
    }

    init(): void {
      for (const element of this.#elements) {
        this.#observer.observe(element);
      }
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
      const delayAttribute = parseInt(element.getAttribute("data-typecadence-delay"));
      const delay = isNaN(delayAttribute) ? this.#defaultSettings.delay : delayAttribute;
      const [minSpeed, maxSpeed] = this.#parseSpeedAttribute(element.getAttribute("data-typecadence-speed"));
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
      const mistakes = this.#parsePercent(element.getAttribute("data-typecadence-mistakes")) || this.#defaultSettings.mistakes;
      const mistakesPresentAttribute = parseInt(element.getAttribute("data-typecadence-mistakes-present"));
      const mistakesPresent = mistakesPresentAttribute < 0 || isNaN(mistakesPresentAttribute) ? this.#defaultSettings.mistakesPresent : Math.max(1, mistakesPresentAttribute);
      const keyboardAttribute = element.getAttribute("data-typecadence-keyboard")?.toLowerCase();
      const keyboard = keyboardAttribute === KeyboardLayout.QWERTZ ? KeyboardLayout.QWERTZ :
        keyboardAttribute === KeyboardLayout.AZERTY ? KeyboardLayout.AZERTY :
          this.#defaultSettings.keyboard;

      return {
        delay,
        minSpeed,
        maxSpeed,
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
    }

    #parseSpeedAttribute(speedAttribute: string | null): [number, number] {
      const regex = /^\d+(?:[,-]\d+)?$/;
      if (!speedAttribute || !regex.test(speedAttribute)) return [this.#defaultSettings.minSpeed, this.#defaultSettings.maxSpeed];

      const speedValues = speedAttribute.split(/[,-]/).map(Number);
      if (speedValues.length === 1) return [speedValues[0], speedValues[0]];
      return [speedValues[0], speedValues[1]];
    }

    #parsePercent(percentAttribute: string | null): number {
      const percent = parseInt(percentAttribute || '');
      return isNaN(percent) || percent < 0 ? 0 : (percent > 100 ? 100 : percent);
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
          caretAnimationInterval = setInterval(() => {
            if (caret.style.visibility === "visible") {
              caret.style.visibility = "hidden";
            } else {
              caret.style.visibility = "visible";
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
            await this.#backspace(element, caret, animationSettings.minSpeed, animationSettings.maxSpeed);
            currentIndex--;
          }

          mistakeBuffer = [];
        }

        // Type next character
        const char = text[currentIndex];
        const isMistake = this.#isMistake(animationSettings.mistakes);
        if (isMistake) {
          const charNode = document.createTextNode(this.#incorrectChar(char, animationSettings.keyboard));
          if (caret) {
            element.insertBefore(charNode, caret);
          } else {
            element.appendChild(charNode);
          }
          mistakeBuffer.push(currentIndex);
        } else {
          const charNode = document.createTextNode(char);
          if (caret) {
            element.insertBefore(charNode, caret);
          } else {
            element.appendChild(charNode);
          }
        }

        const typingSpeed = this.#getTypingSpeed(animationSettings.minSpeed, animationSettings.maxSpeed);

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
    }
  }

  interface AnimationSettings {
    delay: number;
    minSpeed: number;
    maxSpeed: number;
    caret: boolean;
    caretChar: string;
    caretColor: string;
    caretBold: boolean;
    caretBlinkSpeed: number;
    caretBlink: boolean;
    caretRemain: boolean;
    caretRemainTimeout: number;
    mistakes: number;
    mistakesPresent: number;
    keyboard: KeyboardLayout
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