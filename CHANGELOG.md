# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.2.0] - 2026-02-09

### Added

- Manual trigger mode via `data-typecadence-trigger="manual"` attribute — elements with this attribute do not auto-animate on scroll
- `Typecadence.play()` static method to start or resume an animation programmatically
- `Typecadence.pause()` static method to pause an in-progress animation
- `Typecadence.restart()` static method to restart an animation from the beginning

## [1.1.1] - 2026-02-01

### Added

- Unit test suite covering constructor, IntersectionObserver, typing, caret, settings parsing, mistakes, events, callbacks, and edge cases

### Fixed

- Infinite loop when `mistakes` is set to 100% — after correcting a mistake, the retry now always types the correct character

## [1.1.0] - 2026-01-31

### Added

- Callback support on animation complete via `data-typecadence-callback` attribute
- `typecadence:complete` custom event dispatched when animation finishes
- Space speed option via `data-typecadence-space-speed` attribute
- Backspace speed option via `data-typecadence-backspace-speed` attribute
- Caret tag option via `data-typecadence-caret-tag` attribute
- Caret class option via `data-typecadence-caret-class` attribute
- Caret ID option via `data-typecadence-caret-id` attribute

## [1.0.8] - 2023-07-28

### Fixed

- Only designate a character as a mistake if it is different than the intended character
- Spaces are never treated as mistakes

## [1.0.7] - 2023-07-19

### Added

- GitHub sponsors funding info

### Fixed

- Prevent horizontal scroll in documentation on mobile

## [1.0.6] - 2023-07-12

### Fixed

- Allow for mistakes to be set at zero

## [1.0.5] - 2023-07-10

### Changed

- Update documentation with more appropriate URLs

## [1.0.4] - 2023-07-09

### Changed

- Improve documentation

## [1.0.3] - 2023-07-07

### Changed

- Update README with a quick start and reference the jsDelivr package

## [1.0.2] - 2023-07-07

### Changed

- Ignore additional directories for NPM

## [1.0.1] - 2023-07-07

### Changed

- Update homepage in package.json
- Additional updates for NPM publishing

## [1.0.0] - 2023-07-02

### Added

- Universal module definition (UMD) wrapper
- Documentation page with live demos for all attributes
- Typing speed and delay options
- Caret display, character, color, blink, blink speed, remain, and remain timeout options
- Mistake chance, multiple mistakes present, and keyboard layout options
- QWERTY, QWERTZ, and AZERTY keyboard layout support for adjacent character mistakes
- IntersectionObserver-based animation trigger on element visibility

[1.2.0]: https://github.com/ccmars/typecadence/compare/v1.1.1...HEAD
[1.1.1]: https://github.com/ccmars/typecadence/compare/v1.1.0...v1.1.1
[1.1.0]: https://github.com/ccmars/typecadence/compare/v1.0.8...v1.1.0
[1.0.8]: https://github.com/ccmars/typecadence/compare/v1.0.7...v1.0.8
[1.0.7]: https://github.com/ccmars/typecadence/compare/v1.0.6...v1.0.7
[1.0.6]: https://github.com/ccmars/typecadence/compare/v1.0.5...v1.0.6
[1.0.5]: https://github.com/ccmars/typecadence/compare/v1.0.4...v1.0.5
[1.0.4]: https://github.com/ccmars/typecadence/compare/v1.0.3...v1.0.4
[1.0.3]: https://github.com/ccmars/typecadence/compare/v1.0.2...v1.0.3
[1.0.2]: https://github.com/ccmars/typecadence/compare/v1.0.1...v1.0.2
[1.0.1]: https://github.com/ccmars/typecadence/compare/v1.0.0...v1.0.1
[1.0.0]: https://github.com/ccmars/typecadence/releases/tag/v1.0.0
