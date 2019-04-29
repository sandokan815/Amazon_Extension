// chrome.runtime.onMessageExternal.addListener(
//   function(request, sender, sendResponse) 
// 	{
// 	console.log("incoming transmission from extension "+sender.id+" w/ license "+request.openExtension);
//     if (sender.id == "njgmogioadoeckccgjjpddacbapjbcmm")
// 		{
// 		if(request.openExtension)
// 			{
// 			var license = request.openExtension;
			
// 			chrome.tabs.getSelected(null, function(tab) {
		
// 				var popupWindow = window.open(
// 					chrome.extension.getURL("popup.html"),
// 					"Copy DNA",
// 					"width=500,height=750"
// 				);	
		
// 			});
			
			
// 			sendResponse({available: "true"});			
// 			}
// 		}
//   });