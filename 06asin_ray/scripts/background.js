chrome.runtime.onMessage.addListener((request, sender, sendResponse) => 
	{
	if (request.command === "check_sc")
		{
		fetch("https://sellercentral.amazon.com/cb")
		.then(res=>res.text())
		.then(res=>
			{
			var regex = /advertiserId:[\s\:]+\'([A-Za-z0-9]+?)\'/gms;
			var x1 = regex.exec(res);
			if(x1&&x1[1]&&x1[1].length>10&&x1[1].length<20)
				sendResponse({result: "on"});
			else
				sendResponse({result: "off"});		
			});		
		}
	else if(request.command == "get_score" && request.asin)
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