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
var _Typecadence_instances, _Typecadence_elements, _Typecadence_defaultSettings, _Typecadence_adjacentMapping, _Typecadence_observer, _Typecadence_handleIntersect, _Typecadence_parseSpeedAttribute, _Typecadence_getTypingSpeed, _Typecadence_createCaret, _Typecadence_parsePercent, _Typecadence_isMistake, _Typecadence_incorrectChar, _Typecadence_backspace;
class Typecadence {
    constructor() {
        _Typecadence_instances.add(this);
        _Typecadence_elements.set(this, void 0);
        _Typecadence_defaultSettings.set(this, {
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
            mistakesAttentiveness: 100,
        });
        _Typecadence_adjacentMapping.set(this, {
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
        });
        _Typecadence_observer.set(this, void 0);
        __classPrivateFieldSet(this, _Typecadence_elements, document.querySelectorAll(".typecadence"), "f");
        __classPrivateFieldSet(this, _Typecadence_observer, new IntersectionObserver(__classPrivateFieldGet(this, _Typecadence_instances, "m", _Typecadence_handleIntersect).bind(this), {
            root: null,
            rootMargin: "0px",
            threshold: 0.1,
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
            // Establish animation settings
            const delayAttribute = parseInt(element.getAttribute("data-typecadence-delay"));
            const delay = isNaN(delayAttribute) ? __classPrivateFieldGet(this, _Typecadence_defaultSettings, "f").delay : delayAttribute;
            const [minSpeed, maxSpeed] = __classPrivateFieldGet(this, _Typecadence_instances, "m", _Typecadence_parseSpeedAttribute).call(this, element.getAttribute("data-typecadence-speed"));
            const displayCaretAttribute = element.getAttribute("data-typecadence-caret");
            const displayCaret = displayCaretAttribute !== null ? displayCaretAttribute === "true" : __classPrivateFieldGet(this, _Typecadence_defaultSettings, "f").caretBlink;
            const mistakeChance = __classPrivateFieldGet(this, _Typecadence_instances, "m", _Typecadence_parsePercent).call(this, element.getAttribute("data-typecadence-mistakes")) || __classPrivateFieldGet(this, _Typecadence_defaultSettings, "f").mistakes;
            const mistakesAttentiveness = __classPrivateFieldGet(this, _Typecadence_instances, "m", _Typecadence_parsePercent).call(this, element.getAttribute("data-typecadence-mistakes-attentiveness")) || __classPrivateFieldGet(this, _Typecadence_defaultSettings, "f").mistakesAttentiveness;
            const caretBlinkSpeedAttribute = parseInt(element.getAttribute("data-typecadence-caret-blink-speed"));
            const caretBlinkSpeed = isNaN(caretBlinkSpeedAttribute) ? __classPrivateFieldGet(this, _Typecadence_defaultSettings, "f").caretBlinkSpeed : caretBlinkSpeedAttribute;
            const caretBlinkAttribute = element.getAttribute("data-typecadence-caret-blink");
            const caretBlink = caretBlinkAttribute !== null ? caretBlinkAttribute === "true" : __classPrivateFieldGet(this, _Typecadence_defaultSettings, "f").caretBlink;
            const caretRemain = (element.getAttribute("data-typecadence-caret-remain") === "true") || __classPrivateFieldGet(this, _Typecadence_defaultSettings, "f").caretRemain;
            const caretRemainTimeoutAttribute = parseInt(element.getAttribute("data-typecadence-caret-remain-timeout"));
            const caretRemainTimeout = isNaN(caretRemainTimeoutAttribute) ? __classPrivateFieldGet(this, _Typecadence_defaultSettings, "f").caretRemainTimeout : caretRemainTimeoutAttribute;
            // Define text content
            const text = ((_a = element.textContent) === null || _a === void 0 ? void 0 : _a.trim()) || '';
            element.textContent = "";
            let caret = null;
            let caretAnimationInterval = null;
            // Create caret
            if (displayCaret) {
                caret = __classPrivateFieldGet(this, _Typecadence_instances, "m", _Typecadence_createCaret).call(this, element);
                element.appendChild(caret);
                if (caretBlink) {
                    caretAnimationInterval = setInterval(() => {
                        if (caret.style.visibility === "visible") {
                            caret.style.visibility = "hidden";
                        }
                        else {
                            caret.style.visibility = "visible";
                        }
                    }, caretBlinkSpeed);
                }
            }
            // Animation: loop through each character in the text
            yield new Promise(resolve => setTimeout(resolve, delay)); // Delay before typing
            let currentIndex = 0;
            for (const char of text) {
                if (__classPrivateFieldGet(this, _Typecadence_instances, "m", _Typecadence_isMistake).call(this, mistakeChance)) {
                    const charNode = document.createTextNode(__classPrivateFieldGet(this, _Typecadence_instances, "m", _Typecadence_incorrectChar).call(this, char));
                    if (caret) {
                        element.insertBefore(charNode, caret);
                    }
                    else {
                        element.appendChild(charNode);
                    }
                    yield new Promise(resolve => setTimeout(resolve, __classPrivateFieldGet(this, _Typecadence_instances, "m", _Typecadence_getTypingSpeed).call(this, minSpeed, maxSpeed)));
                    yield __classPrivateFieldGet(this, _Typecadence_instances, "m", _Typecadence_backspace).call(this, element, caret, minSpeed, maxSpeed);
                }
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
            // Animate caret
            if (displayCaret) {
                if (caretAnimationInterval && caretRemain) {
                    if (!isNaN(caretRemainTimeout)) {
                        setTimeout(() => {
                            clearInterval(caretAnimationInterval);
                            if (caret) {
                                caret.style.visibility = "hidden";
                            }
                        }, caretRemainTimeout);
                    }
                }
                else {
                    clearInterval(caretAnimationInterval);
                    if (caret) {
                        caret.style.visibility = "hidden";
                    }
                }
            }
        });
    }
}
_Typecadence_elements = new WeakMap(), _Typecadence_defaultSettings = new WeakMap(), _Typecadence_adjacentMapping = new WeakMap(), _Typecadence_observer = new WeakMap(), _Typecadence_instances = new WeakSet(), _Typecadence_handleIntersect = function _Typecadence_handleIntersect(entries) {
    for (const entry of entries) {
        if (entry.isIntersecting) {
            this.animateText(entry.target);
            __classPrivateFieldGet(this, _Typecadence_observer, "f").unobserve(entry.target);
        }
    }
}, _Typecadence_parseSpeedAttribute = function _Typecadence_parseSpeedAttribute(speedAttribute) {
    const regex = /^\d+(?:[,-]\d+)?$/;
    if (!speedAttribute || !regex.test(speedAttribute))
        return [__classPrivateFieldGet(this, _Typecadence_defaultSettings, "f").minSpeed, __classPrivateFieldGet(this, _Typecadence_defaultSettings, "f").maxSpeed];
    const speedValues = speedAttribute.split(/,|-/).map(Number);
    if (speedValues.length === 1)
        return [speedValues[0], speedValues[0]];
    return [speedValues[0], speedValues[1]];
}, _Typecadence_getTypingSpeed = function _Typecadence_getTypingSpeed(minSpeed, maxSpeed) {
    return Math.floor(Math.random() * (maxSpeed - minSpeed + 1)) + minSpeed;
}, _Typecadence_createCaret = function _Typecadence_createCaret(element) {
    const caret = document.createElement("span");
    caret.classList.add("typecadence-caret");
    caret.textContent = element.getAttribute("data-typecadence-caret-char") || __classPrivateFieldGet(this, _Typecadence_defaultSettings, "f").caretChar;
    const caretColor = element.getAttribute("data-typecadence-caret-color") || __classPrivateFieldGet(this, _Typecadence_defaultSettings, "f").caretColor;
    if (caretColor) {
        caret.style.color = caretColor;
    }
    caret.style.fontWeight = element.getAttribute("data-typecadence-caret-bold") === "false" ? "normal" : (__classPrivateFieldGet(this, _Typecadence_defaultSettings, "f").caretBold ? "bold" : "normal");
    caret.style.visibility = "visible";
    return caret;
}, _Typecadence_parsePercent = function _Typecadence_parsePercent(percentAttribute) {
    const percent = parseInt(percentAttribute || '');
    return isNaN(percent) || percent < 0 ? 0 : (percent > 100 ? 100 : percent);
}, _Typecadence_isMistake = function _Typecadence_isMistake(chance) {
    return Math.random() * 100 < chance;
}, _Typecadence_incorrectChar = function _Typecadence_incorrectChar(desiredChar) {
    const desiredCharLower = desiredChar.toLowerCase();
    const adjacentChars = __classPrivateFieldGet(this, _Typecadence_adjacentMapping, "f").qwerty[desiredCharLower];
    if (!adjacentChars) {
        return desiredChar;
    }
    const randomIndex = Math.floor(Math.random() * adjacentChars.length);
    const incorrectChar = adjacentChars[randomIndex];
    return desiredChar === desiredChar.toUpperCase() ? incorrectChar.toUpperCase() : incorrectChar;
}, _Typecadence_backspace = function _Typecadence_backspace(element, caret, minSpeed, maxSpeed) {
    return __awaiter(this, void 0, void 0, function* () {
        if (caret) {
            element.removeChild(element.lastChild.previousSibling);
        }
        else {
            element.textContent = element.textContent.slice(0, -1);
        }
        yield new Promise(resolve => setTimeout(resolve, __classPrivateFieldGet(this, _Typecadence_instances, "m", _Typecadence_getTypingSpeed).call(this, minSpeed, maxSpeed)));
    });
};
document.addEventListener("DOMContentLoaded", () => {
    new Typecadence();
});
//# sourceMappingURL=typecadence.js.map