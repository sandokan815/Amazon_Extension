chrome.runtime.onMessage.addListener((request, sender, sendResponse) => 
	{
	if(request.command == "get_score" && request.asin)
		{
		fetch("https://advertising.amazon.com/campaigns/sponsored-products/suggested-keywords/?asins="+request.asin)
		.then(res=>res.text())
		.then(res=>
			{
			sendResponse({data: res});	
			});
		}		
	return true;
	});