// Background service worker
chrome.sidePanel
    .setPanelBehavior({ openPanelOnActionClick: true })
    .catch((error) => console.error(error));

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'openSidePanel') {
        // Open side panel for the current tab
        if (sender.tab?.id) {
            chrome.sidePanel.open({ tabId: sender.tab.id });
            chrome.runtime.sendMessage({
                action: 'setText',
                text: message.text
            });
        }
    }
});
