class Typecadence {
  readonly #elements: NodeListOf<HTMLElement>;
  #observer: IntersectionObserver;

  constructor() {
    this.#elements = document.querySelectorAll(".typecadence");
    this.#observer = new IntersectionObserver(this.#handleIntersect.bind(this), {
      root: null,
      rootMargin: "0px",
      threshold: 0.1
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

  #parseDelay(delayAttribute: string | null): number {
    const delay = parseInt(delayAttribute || '');
    return isNaN(delay) ? 0 : delay;
  }

  #parseSpeedAttribute(speedAttribute: string | null): [number, number] {
    const regex = /^\d+(?:,\d+)?$/;
    if (!speedAttribute || !regex.test(speedAttribute)) return [100, 100];

    const speedValues = speedAttribute.split(",").map(Number);
    if (speedValues.length === 1) return [speedValues[0], speedValues[0]];
    return [speedValues[0], speedValues[1]];
  }

  #getTypingSpeed(minSpeed: number, maxSpeed: number): number {
    return Math.floor(Math.random() * (maxSpeed - minSpeed + 1)) + minSpeed;
  }

  #createCaret(element: HTMLElement): HTMLElement {
    const caret = document.createElement("span");
    caret.classList.add("typecadence-caret");
    caret.textContent = element.getAttribute("data-typecadence-caret-char") || '|';

    const caretColor = element.getAttribute("data-typecadence-caret-color");
    if (caretColor) {
      caret.style.color = caretColor;
    }

    const caretBold = element.getAttribute("data-typecadence-caret-bold");
    caret.style.fontWeight = caretBold === "false" ? "normal" : "bold";

    caret.style.visibility = "visible";
    return caret;
  }

  #shouldDisplayCaret(element: HTMLElement): boolean {
    const caretAttribute = element.getAttribute("data-typecadence-caret");
    return caretAttribute === "true";
  }

  #parseMistakes(mistakesAttribute: string | null): number {
    const mistakes = parseInt(mistakesAttribute || '');
    return isNaN(mistakes) || mistakes < 0 || mistakes > 100 ? 0 : mistakes;
  }

  #isMistake(chance: number): boolean {
    return Math.random() * 100 < chance;
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
    const delay = this.#parseDelay(element.getAttribute("data-typecadence-delay"));
    const [minSpeed, maxSpeed] = this.#parseSpeedAttribute(element.getAttribute("data-typecadence-speed"));
    const displayCaret = this.#shouldDisplayCaret(element);
    const mistakeChance = this.#parseMistakes(element.getAttribute("data-typecadence-mistakes"));
    const caretBlinkSpeed = parseInt(element.getAttribute("data-typecadence-caret-blink-speed") || '') || 500;
    const caretBlink = element.getAttribute("data-typecadence-caret-blink") !== "false";
    const caretRemain = element.getAttribute("data-typecadence-caret-remain") === "true";
    const caretRemainTimeout = parseInt(element.getAttribute("data-typecadence-caret-remain-timeout") || '');
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
        const incorrectChar = String.fromCharCode(Math.floor(Math.random() * 94) + 33);
        const charNode = document.createTextNode(incorrectChar);
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
