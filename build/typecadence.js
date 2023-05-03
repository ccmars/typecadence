var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _Typecadence_instances, _Typecadence_elements, _Typecadence_observer, _Typecadence_handleIntersect, _Typecadence_parseDelay, _Typecadence_parseSpeedAttribute, _Typecadence_getTypingSpeed, _Typecadence_createCaret, _Typecadence_shouldDisplayCaret;
class Typecadence {
    constructor() {
        _Typecadence_instances.add(this);
        _Typecadence_elements.set(this, void 0);
        _Typecadence_observer.set(this, void 0);
        __classPrivateFieldSet(this, _Typecadence_elements, document.querySelectorAll(".typecadence"), "f");
        __classPrivateFieldSet(this, _Typecadence_observer, new IntersectionObserver(__classPrivateFieldGet(this, _Typecadence_instances, "m", _Typecadence_handleIntersect).bind(this), {
            root: null,
            rootMargin: "0px",
            threshold: 0.1
        }), "f");
        this.init();
    }
    init() {
        for (const element of __classPrivateFieldGet(this, _Typecadence_elements, "f")) {
            __classPrivateFieldGet(this, _Typecadence_observer, "f").observe(element);
        }
    }
    animateText(element) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const text = ((_a = element.textContent) === null || _a === void 0 ? void 0 : _a.trim()) || '';
            const delay = __classPrivateFieldGet(this, _Typecadence_instances, "m", _Typecadence_parseDelay).call(this, element.getAttribute("data-typecadence-delay"));
            const [minSpeed, maxSpeed] = __classPrivateFieldGet(this, _Typecadence_instances, "m", _Typecadence_parseSpeedAttribute).call(this, element.getAttribute("data-typecadence-speed"));
            const displayCaret = __classPrivateFieldGet(this, _Typecadence_instances, "m", _Typecadence_shouldDisplayCaret).call(this, element);
            element.textContent = "";
            let caret = null;
            let caretAnimationInterval = null;
            if (displayCaret) {
                caret = __classPrivateFieldGet(this, _Typecadence_instances, "m", _Typecadence_createCaret).call(this, element);
                element.appendChild(caret);
                caretAnimationInterval = setInterval(() => {
                    if (caret.style.visibility === "visible") {
                        caret.style.visibility = "hidden";
                    }
                    else {
                        caret.style.visibility = "visible";
                    }
                }, 500);
            }
            let currentIndex = 0;
            yield new Promise(resolve => setTimeout(resolve, delay));
            for (const char of text) {
                const charNode = document.createTextNode(char);
                if (caret) {
                    element.insertBefore(charNode, caret);
                }
                else {
                    element.appendChild(charNode);
                }
                currentIndex++;
                const typingSpeed = __classPrivateFieldGet(this, _Typecadence_instances, "m", _Typecadence_getTypingSpeed).call(this, minSpeed, maxSpeed);
                yield new Promise(resolve => setTimeout(resolve, typingSpeed));
            }
            if (caretAnimationInterval) {
                clearInterval(caretAnimationInterval);
            }
            caret === null || caret === void 0 ? void 0 : caret.remove();
        });
    }
}
_Typecadence_elements = new WeakMap(), _Typecadence_observer = new WeakMap(), _Typecadence_instances = new WeakSet(), _Typecadence_handleIntersect = function _Typecadence_handleIntersect(entries) {
    for (const entry of entries) {
        if (entry.isIntersecting) {
            this.animateText(entry.target);
            __classPrivateFieldGet(this, _Typecadence_observer, "f").unobserve(entry.target);
        }
    }
}, _Typecadence_parseDelay = function _Typecadence_parseDelay(delayAttribute) {
    const delay = parseInt(delayAttribute || '');
    return isNaN(delay) ? 0 : delay;
}, _Typecadence_parseSpeedAttribute = function _Typecadence_parseSpeedAttribute(speedAttribute) {
    const regex = /^\d+(?:,\d+)?$/;
    if (!speedAttribute || !regex.test(speedAttribute))
        return [100, 100];
    const speedValues = speedAttribute.split(",").map(Number);
    if (speedValues.length === 1)
        return [speedValues[0], speedValues[0]];
    return [speedValues[0], speedValues[1]];
}, _Typecadence_getTypingSpeed = function _Typecadence_getTypingSpeed(minSpeed, maxSpeed) {
    return Math.floor(Math.random() * (maxSpeed - minSpeed + 1)) + minSpeed;
}, _Typecadence_createCaret = function _Typecadence_createCaret(element) {
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
}, _Typecadence_shouldDisplayCaret = function _Typecadence_shouldDisplayCaret(element) {
    const caretAttribute = element.getAttribute("data-typecadence-caret");
    return caretAttribute === "true";
};
document.addEventListener("DOMContentLoaded", () => {
    new Typecadence();
});
//# sourceMappingURL=typecadence.js.map