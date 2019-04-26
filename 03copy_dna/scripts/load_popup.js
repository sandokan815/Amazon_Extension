var popupWindow = window.open(
    chrome.extension.getURL("popup.html"),
    "Copy DNA",
    "width=600,height=725"
);
window.close(); 