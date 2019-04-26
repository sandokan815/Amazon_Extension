var popupWindow = window.open(
    chrome.extension.getURL("popup.html"),
    "Sweet Spot Finder",
    "width=500,height=750"
);
window.close(); 