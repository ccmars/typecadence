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
var _Typecadence_instances, _Typecadence_elements, _Typecadence_defaultSettings, _Typecadence_adjacentMapping, _Typecadence_observer, _Typecadence_handleIntersect, _Typecadence_parseAnimationSettings, _Typecadence_parseSpeedAttribute, _Typecadence_parsePercent, _Typecadence_getTypingSpeed, _Typecadence_createCaret, _Typecadence_isMistake, _Typecadence_incorrectChar, _Typecadence_backspace;
import { KeyboardLayout, ADJACENT_KEY_MAPPING } from './typecadence_keyboardLayouts.js';
class Typecadence {
    constructor() {
        _Typecadence_instances.add(this);
        _Typecadence_elements.set(this, void 0);
        _Typecadence_defaultSettings.set(this, {
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
        });
        _Typecadence_adjacentMapping.set(this, ADJACENT_KEY_MAPPING);
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
        __classPrivateFieldGet(this, _Typecadence_elements, "f").forEach((element) => {
            __classPrivateFieldGet(this, _Typecadence_observer, "f").observe(element);
        });
    }
    animateText(element) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d, _e;
            const animationSettings = __classPrivateFieldGet(this, _Typecadence_instances, "m", _Typecadence_parseAnimationSettings).call(this, element);
            // Define text content
            const text = ((_a = element.textContent) === null || _a === void 0 ? void 0 : _a.trim()) || '';
            element.textContent = "";
            let caret = null;
            let caretAnimationInterval = null;
            // Show caret
            if (animationSettings.caret) {
                caret = __classPrivateFieldGet(this, _Typecadence_instances, "m", _Typecadence_createCaret).call(this, animationSettings);
                element.appendChild(caret);
                if (animationSettings.caretBlink) {
                    caretAnimationInterval = window.setInterval(() => {
                        if (caret) {
                            if (caret.style.visibility === "visible") {
                                caret.style.visibility = "hidden";
                            }
                            else {
                                caret.style.visibility = "visible";
                            }
                        }
                    }, animationSettings.caretBlinkSpeed);
                }
            }
            // Delay before typing
            yield new Promise((resolve) => setTimeout(resolve, animationSettings.delay));
            let mistakeBuffer = [];
            let currentIndex = 0;
            // Type animation
            while (currentIndex < text.length || mistakeBuffer.length > 0) {
                // Correct mistakes
                if (mistakeBuffer.length >= animationSettings.mistakesPresent
                    || (mistakeBuffer.length > 0
                        && currentIndex >= text.length)) {
                    const mistakeIndex = mistakeBuffer[0];
                    const stepsToGoBack = currentIndex - mistakeIndex;
                    for (let i = 0; i < stepsToGoBack; i++) {
                        const bsMin = (_b = animationSettings.backspaceMinSpeed) !== null && _b !== void 0 ? _b : animationSettings.minSpeed;
                        const bsMax = (_c = animationSettings.backspaceMaxSpeed) !== null && _c !== void 0 ? _c : animationSettings.maxSpeed;
                        yield __classPrivateFieldGet(this, _Typecadence_instances, "m", _Typecadence_backspace).call(this, element, caret, bsMin, bsMax);
                        currentIndex--;
                    }
                    mistakeBuffer = [];
                }
                // Type next character
                if (currentIndex < text.length) {
                    const char = text[currentIndex];
                    const isMistake = __classPrivateFieldGet(this, _Typecadence_instances, "m", _Typecadence_isMistake).call(this, animationSettings.mistakes);
                    if (isMistake) {
                        const incorrectChar = __classPrivateFieldGet(this, _Typecadence_instances, "m", _Typecadence_incorrectChar).call(this, char, animationSettings.keyboard);
                        const charNode = document.createTextNode(incorrectChar);
                        if (caret) {
                            element.insertBefore(charNode, caret);
                        }
                        else {
                            element.appendChild(charNode);
                        }
                        if (char !== incorrectChar) {
                            mistakeBuffer.push(currentIndex);
                        }
                    }
                    else {
                        const charNode = document.createTextNode(char);
                        if (caret) {
                            element.insertBefore(charNode, caret);
                        }
                        else {
                            element.appendChild(charNode);
                        }
                    }
                    const isSpace = char === ' ';
                    const speedMin = isSpace
                        ? ((_d = animationSettings.spaceMinSpeed) !== null && _d !== void 0 ? _d : animationSettings.minSpeed)
                        : animationSettings.minSpeed;
                    const speedMax = isSpace
                        ? ((_e = animationSettings.spaceMaxSpeed) !== null && _e !== void 0 ? _e : animationSettings.maxSpeed)
                        : animationSettings.maxSpeed;
                    const typingSpeed = __classPrivateFieldGet(this, _Typecadence_instances, "m", _Typecadence_getTypingSpeed).call(this, speedMin, speedMax);
                    yield new Promise((resolve) => setTimeout(resolve, typingSpeed));
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
                }
                else {
                    if (caretAnimationInterval) {
                        clearInterval(caretAnimationInterval);
                    }
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
}, _Typecadence_parseAnimationSettings = function _Typecadence_parseAnimationSettings(element) {
    var _a, _b, _c, _d, _e, _f;
    const debugAttribute = (_a = element.getAttribute("data-typecadence-debug")) === null || _a === void 0 ? void 0 : _a.toLowerCase();
    const debug = debugAttribute === "true" ? true : debugAttribute === "false" ? false : __classPrivateFieldGet(this, _Typecadence_defaultSettings, "f").debug;
    const delayAttribute = element.getAttribute("data-typecadence-delay");
    const delayParsed = delayAttribute ? parseInt(delayAttribute) : NaN;
    const delay = isNaN(delayParsed) ? __classPrivateFieldGet(this, _Typecadence_defaultSettings, "f").delay : delayParsed;
    const [minSpeed, maxSpeed] = __classPrivateFieldGet(this, _Typecadence_instances, "m", _Typecadence_parseSpeedAttribute).call(this, element.getAttribute("data-typecadence-speed"));
    const spaceSpeedAttr = element.getAttribute("data-typecadence-space-speed");
    const [spaceMinSpeedParsed, spaceMaxSpeedParsed] = spaceSpeedAttr
        ? __classPrivateFieldGet(this, _Typecadence_instances, "m", _Typecadence_parseSpeedAttribute).call(this, spaceSpeedAttr)
        : [NaN, NaN];
    const spaceMinSpeed = isNaN(spaceMinSpeedParsed) ? __classPrivateFieldGet(this, _Typecadence_defaultSettings, "f").spaceMinSpeed : spaceMinSpeedParsed;
    const spaceMaxSpeed = isNaN(spaceMaxSpeedParsed) ? __classPrivateFieldGet(this, _Typecadence_defaultSettings, "f").spaceMaxSpeed : spaceMaxSpeedParsed;
    const backspaceSpeedAttr = element.getAttribute("data-typecadence-backspace-speed");
    const [backspaceMinSpeedParsed, backspaceMaxSpeedParsed] = backspaceSpeedAttr
        ? __classPrivateFieldGet(this, _Typecadence_instances, "m", _Typecadence_parseSpeedAttribute).call(this, backspaceSpeedAttr)
        : [NaN, NaN];
    const backspaceMinSpeed = isNaN(backspaceMinSpeedParsed) ? __classPrivateFieldGet(this, _Typecadence_defaultSettings, "f").backspaceMinSpeed : backspaceMinSpeedParsed;
    const backspaceMaxSpeed = isNaN(backspaceMaxSpeedParsed) ? __classPrivateFieldGet(this, _Typecadence_defaultSettings, "f").backspaceMaxSpeed : backspaceMaxSpeedParsed;
    const displayCaretAttribute = (_b = element.getAttribute("data-typecadence-caret")) === null || _b === void 0 ? void 0 : _b.toLowerCase();
    const caret = displayCaretAttribute === "true" ? true :
        displayCaretAttribute === "false" ? false :
            __classPrivateFieldGet(this, _Typecadence_defaultSettings, "f").caret;
    const caretChar = element.getAttribute("data-typecadence-caret-char") || __classPrivateFieldGet(this, _Typecadence_defaultSettings, "f").caretChar;
    const caretColor = element.getAttribute("data-typecadence-caret-color") || __classPrivateFieldGet(this, _Typecadence_defaultSettings, "f").caretColor;
    const caretBoldAttribute = (_c = element.getAttribute("data-typecadence-caret-bold")) === null || _c === void 0 ? void 0 : _c.toLowerCase();
    const caretBold = caretBoldAttribute === "true" ? true :
        caretBoldAttribute === "false" ? false :
            __classPrivateFieldGet(this, _Typecadence_defaultSettings, "f").caretBold;
    const caretBlinkSpeedAttribute = element.getAttribute("data-typecadence-caret-blink-speed");
    const caretBlinkSpeedParsed = caretBlinkSpeedAttribute ? parseInt(caretBlinkSpeedAttribute) : NaN;
    const caretBlinkSpeed = isNaN(caretBlinkSpeedParsed) ? __classPrivateFieldGet(this, _Typecadence_defaultSettings, "f").caretBlinkSpeed : caretBlinkSpeedParsed;
    const caretBlinkAttribute = (_d = element.getAttribute("data-typecadence-caret-blink")) === null || _d === void 0 ? void 0 : _d.toLowerCase();
    const caretBlink = caretBlinkAttribute === "true" ? true :
        caretBlinkAttribute === "false" ? false :
            __classPrivateFieldGet(this, _Typecadence_defaultSettings, "f").caretBlink;
    const caretRemainAttribute = (_e = element.getAttribute("data-typecadence-caret-remain")) === null || _e === void 0 ? void 0 : _e.toLowerCase();
    const caretRemain = caretRemainAttribute === "true" ? true :
        caretRemainAttribute === "false" ? false :
            __classPrivateFieldGet(this, _Typecadence_defaultSettings, "f").caretRemain;
    const caretRemainTimeoutAttribute = element.getAttribute("data-typecadence-caret-remain-timeout");
    const caretRemainTimeoutParsed = caretRemainTimeoutAttribute ? parseInt(caretRemainTimeoutAttribute) : NaN;
    const caretRemainTimeout = isNaN(caretRemainTimeoutParsed) ? __classPrivateFieldGet(this, _Typecadence_defaultSettings, "f").caretRemainTimeout : caretRemainTimeoutParsed;
    const mistakesPercent = __classPrivateFieldGet(this, _Typecadence_instances, "m", _Typecadence_parsePercent).call(this, element.getAttribute("data-typecadence-mistakes"));
    const mistakes = (mistakesPercent !== null) ? mistakesPercent : __classPrivateFieldGet(this, _Typecadence_defaultSettings, "f").mistakes;
    const mistakesPresentAttribute = element.getAttribute("data-typecadence-mistakes-present");
    const mistakesPresentParsed = mistakesPresentAttribute ? parseInt(mistakesPresentAttribute) : NaN;
    const mistakesPresent = mistakesPresentParsed < 0 || isNaN(mistakesPresentParsed) ?
        __classPrivateFieldGet(this, _Typecadence_defaultSettings, "f").mistakesPresent : Math.max(1, mistakesPresentParsed);
    const keyboardAttribute = (_f = element.getAttribute("data-typecadence-keyboard")) === null || _f === void 0 ? void 0 : _f.toLowerCase();
    const keyboard = keyboardAttribute === KeyboardLayout.QWERTZ ? KeyboardLayout.QWERTZ :
        keyboardAttribute === KeyboardLayout.AZERTY ? KeyboardLayout.AZERTY :
            __classPrivateFieldGet(this, _Typecadence_defaultSettings, "f").keyboard;
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
    if (debug)
        console.debug("Typecadence settings:", animationSettings);
    return animationSettings;
}, _Typecadence_parseSpeedAttribute = function _Typecadence_parseSpeedAttribute(speedAttribute) {
    const regex = /^\d+(?:[,-]\d+)?$/;
    if (!speedAttribute || !regex.test(speedAttribute))
        return [__classPrivateFieldGet(this, _Typecadence_defaultSettings, "f").minSpeed, __classPrivateFieldGet(this, _Typecadence_defaultSettings, "f").maxSpeed];
    const speedValues = speedAttribute.split(/[,-]/).map(Number);
    if (speedValues.length === 1)
        return [speedValues[0], speedValues[0]];
    return [speedValues[0], speedValues[1]];
}, _Typecadence_parsePercent = function _Typecadence_parsePercent(percentAttribute) {
    const percent = parseInt(percentAttribute || '', 10);
    if (isNaN(percent)) {
        return null;
    }
    return percent < 0 ? 0 : (percent > 100 ? 100 : percent);
}, _Typecadence_getTypingSpeed = function _Typecadence_getTypingSpeed(minSpeed, maxSpeed) {
    return Math.floor(Math.random() * (maxSpeed - minSpeed + 1)) + minSpeed;
}, _Typecadence_createCaret = function _Typecadence_createCaret(animationSettings) {
    const caret = document.createElement("span");
    caret.classList.add("typecadence-caret");
    caret.textContent = animationSettings.caretChar;
    caret.style.color = animationSettings.caretColor;
    caret.style.fontWeight = animationSettings.caretBold ? "bold" : "normal";
    caret.style.visibility = "visible";
    return caret;
}, _Typecadence_isMistake = function _Typecadence_isMistake(chance) {
    if (chance <= 0)
        return false;
    return Math.random() * 100 < chance;
}, _Typecadence_incorrectChar = function _Typecadence_incorrectChar(desiredChar, keyboard = 'qwerty') {
    const desiredCharLower = desiredChar.toLowerCase();
    const keyboardLayout = keyboard;
    const keyboardMapping = __classPrivateFieldGet(this, _Typecadence_adjacentMapping, "f")[keyboardLayout];
    if (!keyboardMapping || !(desiredCharLower in keyboardMapping)) {
        return desiredChar;
    }
    const adjacentChars = keyboardMapping[desiredCharLower];
    const randomIndex = Math.floor(Math.random() * adjacentChars.length);
    const incorrectChar = adjacentChars[randomIndex];
    return desiredChar === desiredChar.toUpperCase() ? incorrectChar.toUpperCase() : incorrectChar;
}, _Typecadence_backspace = function _Typecadence_backspace(element, caret, minSpeed, maxSpeed) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        if (caret) {
            const previousSibling = (_a = element.lastChild) === null || _a === void 0 ? void 0 : _a.previousSibling;
            if (previousSibling) {
                element.removeChild(previousSibling);
            }
        }
        else {
            const currentText = element.textContent;
            if (currentText) {
                element.textContent = currentText.slice(0, -1);
            }
        }
        yield new Promise(resolve => setTimeout(resolve, __classPrivateFieldGet(this, _Typecadence_instances, "m", _Typecadence_getTypingSpeed).call(this, minSpeed, maxSpeed)));
    });
};
// Auto-initialize when DOM is ready (for UMD version)
if (typeof window !== 'undefined') {
    document.addEventListener("DOMContentLoaded", () => {
        new Typecadence();
    });
}
export default Typecadence;
//# sourceMappingURL=typecadence.js.map