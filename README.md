# HueView

HueView is an open-source Firefox extension that dynamically changes the colors of the browser interface based on the currently active tab. With HueView, you can enjoy an enhanced visual experience that adapts to the theme of the website you are visiting.

## Features

- **Dynamic Color Change**: HueView automatically adjusts the background and interface colors to match the dominant shades of the active tab.
- **Easy Installation**: Quickly install the extension from Firefox Add-ons or clone the repository and install it locally.

## Installation

### Firefox Add-ons

1. Open Firefox and navigate to the [HueView page on Firefox Add-ons](https://addons.mozilla.org/firefox/addon/hueview/).
2. Click on the “Add to Firefox” button.
3. The extension should now be active! Switch between tabs to see the effects.

### Local Installation (until the browser is restarted)

1. Download or clone this repository to your computer.
2. Open Firefox and navigate to `about:debugging`.
3. Click on “Load Temporary Add-on” and select the `manifest.json` file located in the HueView folder.
4. The extension should now be active! Switch between tabs to see the effects.

### Local Installation (permanently, not recommended)

Yoy need to have Mozilla Firefox Developer Edition or ESR installed to install unsigned extensions.
1. Download or clone this repository to your computer.
2. Open Firefox and navigate to `about:config`.
3. Click on “Accept the Risk and Continue”.
4. Search for `xpinstall.signatures.required` and set it to `false`.
5. Open Firefox and navigate to `about:debugging`.
6. Click on “Load Temporary Add-on” and select the `manifest.json` file located in the HueView folder.
7. The extension should now be active! Switch between tabs to see the effects.


## Usage

HueView automatically analyzes the color scheme of the currently active tab. No additional configuration is required.

## Contributions

I welcome any suggestions, bug reports, or ideas for new features. If you have thoughts, feel free to open an issue or submit a pull request.

## License

HueView is licensed under CC BY-NC-SA 4.0. For details, please refer to the [LICENSE](https://github.com/MStankiewiczOfficial/HueView/blob/main/LICENSE.md) file.

## Acknowledgements

HueView is a fork of the "Chameleon Dynamic Theme (forked)" extension by Huy Tran, which is licensed under BSD-2-Clause.


Enjoy a new browsing experience with HueView!
