class Typecadence {
  readonly #elements: NodeListOf<HTMLElement>;
  readonly #defaultSettings = {
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

    const speedValues = speedAttribute.split(/,|-/).map(Number);
    if (speedValues.length === 1) return [speedValues[0], speedValues[0]];
    return [speedValues[0], speedValues[1]];
  }

  #getTypingSpeed(minSpeed: number, maxSpeed: number): number {
    return Math.floor(Math.random() * (maxSpeed - minSpeed + 1)) + minSpeed;
  }

  #createCaret(element: HTMLElement): HTMLElement {
    const caret = document.createElement("span");
    caret.classList.add("typecadence-caret");
    caret.textContent = element.getAttribute("data-typecadence-caret-char") || this.#defaultSettings.caretChar;

    const caretColor = element.getAttribute("data-typecadence-caret-color") || this.#defaultSettings.caretColor;
    if (caretColor) {
      caret.style.color = caretColor;
    }

    caret.style.fontWeight = element.getAttribute("data-typecadence-caret-bold") === "false" ? "normal" : (this.#defaultSettings.caretBold ? "bold" : "normal");

    caret.style.visibility = "visible";
    return caret;
  }

  #parseMistakes(mistakesAttribute: string | null): number {
    const mistakes = parseInt(mistakesAttribute || '');
    return isNaN(mistakes) || mistakes < 0 || mistakes > 100 ? 0 : mistakes;
  }

  #isMistake(chance: number): boolean {
    return Math.random() * 100 < chance;
  }

  #incorrectChar(desiredChar: string): string {
    let randomChar = String.fromCharCode(Math.floor(Math.random() * 94) + 33);
    while (randomChar === desiredChar) {
      randomChar = String.fromCharCode(Math.floor(Math.random() * 94) + 33);
    }
    return randomChar;
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
    const text = element.textContent?.trim() || '';
    const delay = parseInt(element.getAttribute("data-typecadence-delay")) || this.#defaultSettings.delay;
    const [minSpeed, maxSpeed] = this.#parseSpeedAttribute(element.getAttribute("data-typecadence-speed"));
    const displayCaret = element.getAttribute("data-typecadence-caret") === "true" || this.#defaultSettings.caret;
    const mistakeChance = this.#parseMistakes(element.getAttribute("data-typecadence-mistakes")) || this.#defaultSettings.mistakes;
    const caretBlinkSpeed = parseInt(element.getAttribute("data-typecadence-caret-blink-speed")) || this.#defaultSettings.caretBlinkSpeed;
    const caretBlink = element.getAttribute("data-typecadence-caret-blink") !== "false" || this.#defaultSettings.caretBlink;
    const caretRemain = element.getAttribute("data-typecadence-caret-remain") === "true" || this.#defaultSettings.caretRemain;
    const caretRemainTimeout = parseInt(element.getAttribute("data-typecadence-caret-remain-timeout")) || this.#defaultSettings.caretRemainTimeout;
    element.textContent = "";

    let caret: HTMLElement | null = null;
    let caretAnimationInterval: number | null = null;

    if (displayCaret) {
      caret = this.#createCaret(element);
      element.appendChild(caret);

      if (caretBlink) {
        caretAnimationInterval = setInterval(() => {
          if (caret.style.visibility === "visible") {
            caret.style.visibility = "hidden";
          } else {
            caret.style.visibility = "visible";
          }
        }, caretBlinkSpeed);
      }
    }

    let currentIndex = 0;
    await new Promise(resolve => setTimeout(resolve, delay));

    for (const char of text) {
      if (this.#isMistake(mistakeChance)) {
        const charNode = document.createTextNode(this.#incorrectChar(char));
        if (caret) {
          element.insertBefore(charNode, caret);
        } else {
          element.appendChild(charNode);
        }
        await new Promise(resolve => setTimeout(resolve, this.#getTypingSpeed(minSpeed, maxSpeed)));
        await this.#backspace(element, caret, minSpeed, maxSpeed);
      }

      const charNode = document.createTextNode(char);
      if (caret) {
        element.insertBefore(charNode, caret);
      } else {
        element.appendChild(charNode);
      }
      currentIndex++;
      const typingSpeed = this.#getTypingSpeed(minSpeed, maxSpeed);
      await new Promise(resolve => setTimeout(resolve, typingSpeed));
    }

    if (caretAnimationInterval && caretRemain) {
      if (!isNaN(caretRemainTimeout)) {
        setTimeout(() => {
          clearInterval(caretAnimationInterval);
          if (caret) {
            caret.style.visibility = "hidden";
          }
        }, caretRemainTimeout);
      }
    } else if (caretAnimationInterval) {
      clearInterval(caretAnimationInterval);
      if (caret) {
        caret.style.visibility = "hidden";
      }
    }
  }
}

document.addEventListener("DOMContentLoaded", () => {
  new Typecadence();
});
