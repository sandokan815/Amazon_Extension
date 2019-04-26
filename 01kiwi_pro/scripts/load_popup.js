var popupWindow = window.open(
    chrome.extension.getURL("popup.html"),
    "KIWI",
    "width=500,height=950"
);
window.close(); 