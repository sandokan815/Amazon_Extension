$(function(){var e="";chrome.tabs.query({active:!0,currentWindow:!0},function(r){chrome.tabs.sendMessage(r[0].id,{greeting:"user_email_please"},function(r){var a=r.user_email;e=a.replace(/[()]/g,""),$("#user").html(e)})})});