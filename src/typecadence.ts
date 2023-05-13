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
}

class Typecadence {
  readonly #elements: NodeListOf<HTMLElement>;
  readonly #defaultSettings: AnimationSettings = {
    delay: 0,
    minSpeed: 100,
    maxSpeed: 100,
    caret: true,
    caretChar: '|',
    caretColor: '',
    caretBold: true,
    caretBlink: true,
    caretBlinkSpeed: 500,
    caretRemain: false,
    caretRemainTimeout: null,
    mistakes: 0,
    mistakesPresent: 1,
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

  #parseSpeedAttribute(speedAttribute: string | null): [number, number] {
    const regex = /^\d+(?:[,-]\d+)?$/;
    if (!speedAttribute || !regex.test(speedAttribute)) return [this.#defaultSettings.minSpeed, this.#defaultSettings.maxSpeed];

    const speedValues = speedAttribute.split(/[,-]/).map(Number);
    if (speedValues.length === 1) return [speedValues[0], speedValues[0]];
    return [speedValues[0], speedValues[1]];
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

  #parsePercent(percentAttribute: string | null): number {
    const percent = parseInt(percentAttribute || '');
    return isNaN(percent) || percent < 0 ? 0 : (percent > 100 ? 100 : percent);
  }

  #parseAnimationSettings(element: HTMLElement): AnimationSettings {
    const delayAttribute = parseInt(element.getAttribute("data-typecadence-delay"));
    const delay = isNaN(delayAttribute) ? this.#defaultSettings.delay : delayAttribute;
    const [minSpeed, maxSpeed] = this.#parseSpeedAttribute(element.getAttribute("data-typecadence-speed"));
    const displayCaretAttribute = element.getAttribute("data-typecadence-caret");
    const caret = displayCaretAttribute !== null ? displayCaretAttribute === "true" : this.#defaultSettings.caretBlink;
    const caretChar = element.getAttribute("data-typecadence-caret-char") || this.#defaultSettings.caretChar;
    const caretColor = element.getAttribute("data-typecadence-caret-color") || this.#defaultSettings.caretColor;
    const caretBoldAttribute = element.getAttribute("data-typecadence-caret-bold");
    const caretBold = caretBoldAttribute !== null ? caretBoldAttribute === "true" : this.#defaultSettings.caretBlink;
    const caretBlinkSpeedAttribute = parseInt(element.getAttribute("data-typecadence-caret-blink-speed"));
    const caretBlinkSpeed = isNaN(caretBlinkSpeedAttribute) ? this.#defaultSettings.caretBlinkSpeed : caretBlinkSpeedAttribute;
    const caretBlinkAttribute = element.getAttribute("data-typecadence-caret-blink");
    const caretBlink = caretBlinkAttribute !== null ? caretBlinkAttribute === "true" : this.#defaultSettings.caretBlink;
    const caretRemain = (element.getAttribute("data-typecadence-caret-remain") === "true") || this.#defaultSettings.caretRemain;
    const caretRemainTimeoutAttribute = parseInt(element.getAttribute("data-typecadence-caret-remain-timeout"));
    const caretRemainTimeout = isNaN(caretRemainTimeoutAttribute) ? this.#defaultSettings.caretRemainTimeout : caretRemainTimeoutAttribute;
    const mistakes = this.#parsePercent(element.getAttribute("data-typecadence-mistakes")) || this.#defaultSettings.mistakes;
    const mistakesPresentAttribute = parseInt(element.getAttribute("data-typecadence-mistakes-present"));
    const mistakesPresent = mistakesPresentAttribute < 1 && isNaN(mistakesPresentAttribute) ? this.#defaultSettings.mistakesPresent : Math.max(1, mistakesPresentAttribute);

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
    };
  }

  #isMistake(chance: number): boolean {
    if (chance <= 0) return false;
    return Math.random() * 100 < chance;
  }

  #incorrectChar(desiredChar: string): string {
    const desiredCharLower = desiredChar.toLowerCase();
    const adjacentChars = this.#adjacentMapping.qwerty[desiredCharLower];

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
    
    // Type animation
    let mistakeBuffer: number[] = [];
    let currentIndex = 0;

    while (currentIndex < text.length || mistakeBuffer.length > 0) {
      const char = text[currentIndex];
      const isMistake = this.#isMistake(animationSettings.mistakes);

      if (isMistake) {
        const charNode = document.createTextNode(this.#incorrectChar(char));
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

      currentIndex++;

      // Correct mistakes
      if (
        mistakeBuffer.length > animationSettings.mistakesPresent
        || (
          mistakeBuffer.length > 0
          && currentIndex >= text.length
        )
      ) {
        const mistakeIndex = mistakeBuffer[0];
        const stepsToGoBack = currentIndex - mistakeIndex;
        console.log(
          "currentIndex",
          currentIndex,
          "mistakeBuffer.length",
          mistakeBuffer.length,
          "animationSettings.mistakesPresent",
          animationSettings.mistakesPresent,
          "stepsToGoBack",
          stepsToGoBack
        );

        for (let i = 0; i < stepsToGoBack; i++) {
          await this.#backspace(element, caret, animationSettings.minSpeed, animationSettings.maxSpeed);
          currentIndex--;
        }

        mistakeBuffer = [];
      }

      const typingSpeed = this.#getTypingSpeed(animationSettings.minSpeed, animationSettings.maxSpeed);
      console.log(
        "char",
        char,
        "isMistake",
        isMistake,
        "mistakeBuffer",
        mistakeBuffer,
        "currentIndex",
        currentIndex
      );

      await new Promise((resolve) => setTimeout(resolve, typingSpeed));
    }

    // Hide caret
    if (animationSettings.caret) {
      if (caretAnimationInterval && animationSettings.caretRemain) {
        if (!isNaN(animationSettings.caretRemainTimeout)) {
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

document.addEventListener("DOMContentLoaded", () => {
  new Typecadence();
});
