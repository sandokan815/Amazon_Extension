chrome.runtime.onMessageExternal.addListener(
  function(request, sender, sendResponse) 
	{
	console.log("incoming transmission from extension "+sender.id+" w/ license "+request.openExtension);
    if (sender.id == "njgmogioadoeckccgjjpddacbapjbcmm")
		{
		if(request.openExtension)
			{
			var license = request.openExtension;
			var popupWindow = window.open(
				chrome.extension.getURL("popup.html?check_license="+license),
				"Sweet Spot Finder",
				"width=500,height=750"
			);
			sendResponse({available: "true"});			
			}
		}
  });