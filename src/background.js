let indexedColorMap = {};
let indexedStateMap = {};
let currentActiveTab = null;
let pendingApplyColor = null;

const configData = {
    enableBorder: false,
    enableGradient: false,
    enableAccent: true,
    enableTabLine: true,
    enableToolbarOverride: true,
};

async function checkStoredSettings() {
    try {
        const item = await browser.storage.local.get();
        if (!item.configData) {
            await browser.storage.local.set({ configData });
        } else {
            Object.assign(configData, item.configData);
        }
    } catch (error) {}
}

checkStoredSettings();

function handleCaptured(imageUri) {
    const canvas = document.createElement("canvas");
    canvas.width = 100;
    canvas.height = 100;
    const canvasContext = canvas.getContext("2d");
    const image = new Image();

    image.onload = () => {
        canvasContext.drawImage(image, 0, 0);
        const canvasData = canvasContext.getImageData(0, 0, 100, 10).data;
        const color = {
            r: canvasData[2040],
            g: canvasData[2041],
            b: canvasData[2042],
            alpha: canvasData[2043],
        };

        const themeProposal = createThemeProposal(color);
        if (currentActiveTab) {
            indexedColorMap[currentActiveTab] = themeProposal.colors;
        }
        updateTheme(themeProposal);
    };
    image.src = imageUri;
}

async function updateActiveTabDetails(tab) {
    if (tab) {
        const tabURLkey = tab.url;

        if (pendingApplyColor) {
            indexedStateMap[tabURLkey] = 3;
            pendingApplyColor = null;
        }

        if (indexedStateMap[tabURLkey] !== 3 && tab.status === "complete") {
            currentActiveTab = tabURLkey;
            const imageUri = await browser.tabs.captureVisibleTab();
            handleCaptured(imageUri);
        }
    }
}

async function updateActiveTab() {
    try {
        const [activeTab] = await browser.tabs.query({
            active: true,
            currentWindow: true,
        });
        if (activeTab) {
            await updateActiveTabDetails(activeTab);
        }
    } catch (error) {
        console.log(`Error: ${error}`);
    }
}

async function handleTabUpdated(tabId, changeInfo, tab) {
    if (changeInfo.status === "complete") {
        await updateActiveTab();
    }
}

async function notify(message, sender) {
    if ("kind" in message) {
        if (message.kind === "refresh") {
            const item = await browser.storage.local.get();
            configData = item.configData;
            await updateActiveTab();
        }

        if (message.kind === "theme-color" && message.value) {
            const themeProposal = createThemeProposal(hexToRgb(message.value));
            pendingApplyColor = themeProposal.colors;
            indexedColorMap[sender.tab.url] = pendingApplyColor;

            const [activeTab] = await browser.tabs.query({
                active: true,
                currentWindow: true,
            });
            if (activeTab && activeTab.id === sender.tab.id) {
                updateTheme(themeProposal);
            }
        }
    }
}

browser.runtime.onMessage.addListener(notify);
browser.tabs.onUpdated.addListener(handleTabUpdated);
browser.tabs.onActivated.addListener(updateActiveTab);
browser.windows.onFocusChanged.addListener(updateActiveTab);
updateActiveTab();

function updateTheme(themeProposal) {
    const themeProposalCopy = { ...themeProposal };

    if (!configData.enableBorder)
        delete themeProposalCopy.colors.toolbar_bottom_separator;
    if (!configData.enableGradient) {
        delete themeProposalCopy.images;
        delete themeProposalCopy.properties;
    }
    if (!configData.enableAccent) delete themeProposalCopy.colors.accentcolor;
    if (!configData.enableToolbarOverride)
        delete themeProposalCopy.colors.toolbar;
    if (!configData.enableTabLine) delete themeProposalCopy.colors.tab_line;

    browser.theme.update(themeProposalCopy);
}

function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
        ? {
              r: parseInt(result[1], 16),
              g: parseInt(result[2], 16),
              b: parseInt(result[3], 16),
          }
        : null;
}

function createThemeProposal(color) {
    const textC =
        color.r * 0.299 + color.g * 0.587 + color.b * 0.114 > 186 ? 0 : 255;
    const toolbarC =
        color.r * 0.299 + color.g * 0.587 + color.b * 0.114 > 186 ? 255 : 0;

    const backgroundColor = `rgba(${color.r}, ${color.g}, ${color.b}, 1)`;
    const textColor = `rgb(${textC}, ${textC}, ${textC})`;
    const toolbarColor = `rgba(${toolbarC}, ${toolbarC}, ${toolbarC}, 0.3)`;
    const colorObject = {
        sidebar: backgroundColor,
        sidebar_text: textColor,
        sidebar_highlight: backgroundColor,
        sidebar_highlight_text: textColor,
        frame: backgroundColor,
        tab_background_text: textColor,
        toolbar: backgroundColor,
        tab_line: textColor,
        toolbar_bottom_separator: backgroundColor,
        toolbar_field: toolbarColor,
        toolbar_field_text: textColor,
        toolbar_field_border: backgroundColor,
        toolbar_field_border_focus: backgroundColor,
        toolbar_field_text_focus: textColor,
    };

    return {
        colors: colorObject,
    };
}

browser.runtime.onInstalled.addListener(() => {
    browser.tabs.create({url: "discontinued.html"});
});