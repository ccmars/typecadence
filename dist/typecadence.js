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
(function (global, factory) {
    if (typeof exports === 'object' && typeof module !== 'undefined') {
        module.exports = factory();
    }
    else if (typeof define === 'function' && define.amd) {
        define(factory);
    }
    else {
        global.Typecadence = factory();
    }
}(this, function () {
    'use strict';
    var _Typecadence_instances, _Typecadence_elements, _Typecadence_defaultSettings, _Typecadence_adjacentMapping, _Typecadence_observer, _Typecadence_handleIntersect, _Typecadence_parseAnimationSettings, _Typecadence_parseSpeedAttribute, _Typecadence_parsePercent, _Typecadence_getTypingSpeed, _Typecadence_createCaret, _Typecadence_isMistake, _Typecadence_incorrectChar, _Typecadence_backspace;
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
                mistakes: 5,
                mistakesPresent: 1,
                keyboard: KeyboardLayout.QWERTY,
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
                        caretAnimationInterval = setInterval(() => {
                            if (caret.style.visibility === "visible") {
                                caret.style.visibility = "hidden";
                            }
                            else {
                                caret.style.visibility = "visible";
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
                            yield __classPrivateFieldGet(this, _Typecadence_instances, "m", _Typecadence_backspace).call(this, element, caret, animationSettings.minSpeed, animationSettings.maxSpeed);
                            currentIndex--;
                        }
                        mistakeBuffer = [];
                    }
                    // Type next character
                    const char = text[currentIndex];
                    const isMistake = __classPrivateFieldGet(this, _Typecadence_instances, "m", _Typecadence_isMistake).call(this, char, animationSettings.mistakes);
                    if (isMistake) {
                        const charNode = document.createTextNode(__classPrivateFieldGet(this, _Typecadence_instances, "m", _Typecadence_incorrectChar).call(this, char, animationSettings.keyboard));
                        if (caret) {
                            element.insertBefore(charNode, caret);
                        }
                        else {
                            element.appendChild(charNode);
                        }
                        mistakeBuffer.push(currentIndex);
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
                    const typingSpeed = __classPrivateFieldGet(this, _Typecadence_instances, "m", _Typecadence_getTypingSpeed).call(this, animationSettings.minSpeed, animationSettings.maxSpeed);
                    yield new Promise((resolve) => setTimeout(resolve, typingSpeed));
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
    }, _Typecadence_parseAnimationSettings = function _Typecadence_parseAnimationSettings(element) {
        var _a, _b, _c, _d, _e, _f;
        const debugAttribute = (_a = element.getAttribute("data-typecadence-debug")) === null || _a === void 0 ? void 0 : _a.toLowerCase();
        const debug = debugAttribute === "true" ? true : debugAttribute === "false" ? false : __classPrivateFieldGet(this, _Typecadence_defaultSettings, "f").debug;
        const delayAttribute = parseInt(element.getAttribute("data-typecadence-delay"));
        const delay = isNaN(delayAttribute) ? __classPrivateFieldGet(this, _Typecadence_defaultSettings, "f").delay : delayAttribute;
        const [minSpeed, maxSpeed] = __classPrivateFieldGet(this, _Typecadence_instances, "m", _Typecadence_parseSpeedAttribute).call(this, element.getAttribute("data-typecadence-speed"));
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
        const caretBlinkSpeedAttribute = parseInt(element.getAttribute("data-typecadence-caret-blink-speed"));
        const caretBlinkSpeed = isNaN(caretBlinkSpeedAttribute) ? __classPrivateFieldGet(this, _Typecadence_defaultSettings, "f").caretBlinkSpeed : caretBlinkSpeedAttribute;
        const caretBlinkAttribute = (_d = element.getAttribute("data-typecadence-caret-blink")) === null || _d === void 0 ? void 0 : _d.toLowerCase();
        const caretBlink = caretBlinkAttribute === "true" ? true :
            caretBlinkAttribute === "false" ? false :
                __classPrivateFieldGet(this, _Typecadence_defaultSettings, "f").caretBlink;
        const caretRemainAttribute = (_e = element.getAttribute("data-typecadence-caret-remain")) === null || _e === void 0 ? void 0 : _e.toLowerCase();
        const caretRemain = caretRemainAttribute === "true" ? true :
            caretRemainAttribute === "false" ? false :
                __classPrivateFieldGet(this, _Typecadence_defaultSettings, "f").caretRemain;
        const caretRemainTimeoutAttribute = parseInt(element.getAttribute("data-typecadence-caret-remain-timeout"));
        const caretRemainTimeout = isNaN(caretRemainTimeoutAttribute) ? __classPrivateFieldGet(this, _Typecadence_defaultSettings, "f").caretRemainTimeout : caretRemainTimeoutAttribute;
        const mistakesPercent = __classPrivateFieldGet(this, _Typecadence_instances, "m", _Typecadence_parsePercent).call(this, element.getAttribute("data-typecadence-mistakes"));
        const mistakes = (mistakesPercent !== null) ? mistakesPercent : __classPrivateFieldGet(this, _Typecadence_defaultSettings, "f").mistakes;
        const mistakesPresentAttribute = parseInt(element.getAttribute("data-typecadence-mistakes-present"));
        const mistakesPresent = mistakesPresentAttribute < 0 || isNaN(mistakesPresentAttribute) ? __classPrivateFieldGet(this, _Typecadence_defaultSettings, "f").mistakesPresent : Math.max(1, mistakesPresentAttribute);
        const keyboardAttribute = (_f = element.getAttribute("data-typecadence-keyboard")) === null || _f === void 0 ? void 0 : _f.toLowerCase();
        const keyboard = keyboardAttribute === KeyboardLayout.QWERTZ ? KeyboardLayout.QWERTZ :
            keyboardAttribute === KeyboardLayout.AZERTY ? KeyboardLayout.AZERTY :
                __classPrivateFieldGet(this, _Typecadence_defaultSettings, "f").keyboard;
        const animationSettings = {
            debug,
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
    }, _Typecadence_isMistake = function _Typecadence_isMistake(char, chance) {
        if (chance <= 0)
            return false;
        if (char.match(/\s/))
            return false;
        return Math.random() * 100 < chance;
    }, _Typecadence_incorrectChar = function _Typecadence_incorrectChar(desiredChar, keyboard = 'qwerty') {
        const desiredCharLower = desiredChar.toLowerCase();
        const adjacentChars = __classPrivateFieldGet(this, _Typecadence_adjacentMapping, "f")[keyboard][desiredCharLower];
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
    let KeyboardLayout;
    (function (KeyboardLayout) {
        KeyboardLayout["QWERTY"] = "qwerty";
        KeyboardLayout["QWERTZ"] = "qwertz";
        KeyboardLayout["AZERTY"] = "azerty";
    })(KeyboardLayout || (KeyboardLayout = {}));
    if (typeof window !== 'undefined') {
        document.addEventListener("DOMContentLoaded", () => {
            new Typecadence();
        });
    }
    return Typecadence;
}));
//# sourceMappingURL=typecadence.js.map