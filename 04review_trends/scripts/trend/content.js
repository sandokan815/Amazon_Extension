var cur_domain = window["location"]["hostname"];
$(document).ready(function()
	{
		
	function process(data)
		{
		if(data!="ok")
			{
			window.open(chrome.extension.getURL("options.html"));
			$("#trenddiv").hide();
			}
		}
		
	chrome.storage.sync.get("license", function (obj) {
		var license  = obj["license"];
		var url = "https://sushibytes.io/check.php?license="+license;
		$.ajax({
			type: 'GET',
			url: url,
			beforeSend: function(data){},
			success: function(data){process(data);},
			error: function(data){process(data);}
			});
		});
	
	$("<div id=\"trenddiv\">Reviews Trend: <a href=\"javascript:;\" id=\"trendlink\">Annual</a> | <a href=\"javascript:;\" id=\"trendlinkalltime\">All-Time</a> <span id=\"avgrpm\"></span></div>")["insertBefore"]("#unifiedPrice_feature_div");
    $(document)["on"]("click", "#trendlink", showhidetrend);
    $(document)["on"]("click", "#trendlinkalltime", showhidetrendalltime);
    $(".main-svg").attr("z-index","2470001");
    $(".modebar").attr("z-index","2470001");
    $("<div id=\"trendplot\" style=\"width:100%;max-width:500px;height:329px;display:none;background-color:#FFF;z-index:2147483647;\"></div><hr class=\"burjActionPanelDivider\">")["insertBefore"]("#main-image-container");
    	
		
		
	var months = [];
	var yearlystats = [];
	var yearlystatskeys = [];
	var yearlystatsvalues = [];
	var alltimestats = [];
	var alltimestatskeys = [];
	var alltimestatsvalues = [];
	var allmonths = ['January', 'February', 'March','April','May','June','July','August','September','October','November','December'];
	var url = "";
	var totalreviews = 0;
	var requeststomake = 0;
	var requestsmade = 0;
	var ASIN = "";
	var extracted = false;
	var range = "yearly";
	var monthmap = {January:"Jan",February:"Feb",March:"Mar",April:"Apr",May:"May",June:"Jun",July:"Jul",August:"Aug",September:"Sep",October:"Oct",November:"Nov",December:"Dec"};
	var allmonthsregex = /January|February|March|April|May|June|July|August|September|October|November|December/gi;
	var avgrpm = 0;
	
	function shortenkeys(keys)
		{
		for (var i = 0; i < keys.length; i++)
			{
			keys[i] = keys[i].replace(/January|February|March|April|May|June|July|August|September|October|November|December/gi,function(matched){return monthmap[matched];});
			}
		return keys;
		}
	
	function sortyearly(a,b)
		{	
		if(allmonths.indexOf(a)>allmonths.indexOf(b)) return 1;
		else if(allmonths.indexOf(a)<allmonths.indexOf(b)) return -1;
		return 0;
		}
		
	function sortalltime(a,b)
		{
		var res = a.split(" ");
		var yeara=res[1];
		var montha=res[0];
		var res = b.split(" ");
		var yearb=res[1];		
		var monthb=res[0];
		if(yeara>yearb) return 1;
		else if(yeara<yearb) return -1;
		else
			{
			if(allmonths.indexOf(montha)>allmonths.indexOf(monthb)) return 1;
			else if(allmonths.indexOf(montha)<allmonths.indexOf(monthb)) return -1;			
			}
		return 0;
		}
		
	function getavg(arr)
		{
		var sum = arr.reduce(function(a, b) { return a + b; });
		var avg = sum / arr.length;
		return avg;
		}
	
	function plotyearly()
		{
		$("#loadinggif").hide();
		var data = [
		  {
			x: shortenkeys(yearlystatskeys),
			y: yearlystatsvalues,
			type: 'bar'
		  }
		];
		var layout = {showlegend:false};

		Plotly.newPlot('trendplot', data,layout,{scrollZoom:true});		
		extracted = true;
		}
		
	function showrpm()
		{
		avgrpm = Math.floor(getavg(alltimestatsvalues));
		$("#avgrpm").html("| Review Rate: "+avgrpm+"/month");
		}
		
	function plotalltime()
		{
		$("#loadinggif").hide();
		var data = [
		  {
			x: shortenkeys(alltimestatskeys),
			y: alltimestatsvalues,
			type: 'bar'
		  }
		];
		var layout = {showlegend:false};

		Plotly.newPlot('trendplot', data,layout,{scrollZoom:true});
		extracted = true;
		}
	
	function extractpagedetails()
		{
		totalreviews = parseInt($("#acrCustomerReviewText").html().replace(/,/g,""));
		requeststomake = Math.ceil(totalreviews/50);
		var regex = RegExp(".com/([\\w-]+/)?(dp|gp/product)/(\\w+/)?(\\w{10})");
		var address = window.location.href;
		var m = address.match(regex);
		ASIN = m[4];
		for(i=1;i<=requeststomake;i++)
			{
			extractdata(i);
			}
		}
	
	function extractmonths(data,step)
		{
		var regexp = /review-date\\">(.*?)<\/span/g;
		var match, matches = [];

		while ((match = regexp.exec(data)) != null) 
			{
			var raw = match[1];
			const regex = /([a-zA-Z]*)\s([0-9]*),\s([0-9]*)/g;
			m = regex.exec(raw);
			var month = m[1];
			var day = m[2]
			var year = m[3];
			var monthyear = month+" "+year;
			if(yearlystats[month])
				yearlystats[month]++;
			else
				yearlystats[month]=1;
			if(alltimestats[monthyear])
				alltimestats[monthyear]++;
			else
				alltimestats[monthyear]=1;		
			
			months.push(raw);
			}

		requestsmade++;
		if(requestsmade==requeststomake)
			{
			yearlystatskeys = Object.keys(yearlystats);
			yearlystatskeys.sort(sortyearly);
			for(i=0;i<yearlystatskeys.length;i++)
				{
				yearlystatsvalues.push(yearlystats[yearlystatskeys[i]]);
				}
				
			alltimestatskeys = Object.keys(alltimestats);
			alltimestatskeys.sort(sortalltime);
			for(i=0;i<alltimestatskeys.length;i++)
				{
				alltimestatsvalues.push(alltimestats[alltimestatskeys[i]]);
				}
			if(range=="yearly")
				plotyearly();
			else
				plotalltime();
			showrpm();
			}
		}
		
	function extractdata(step)
		{
		url  = "https://"+ cur_domain +"/hz/reviews-render/ajax/reviews/get/ref=cm_cr_getr_d_paging_btm_" + step;
		var data = {
			sortBy:"helpful",
			reviewerType:"all_reviews",
			formatType:"",
			filterByStar:"",
			pageNumber:step,
			filterByKeyword:"",
			shouldAppend:"undefined",
			deviceType:"desktop",
			reftag:"cm_cr_getr_d_paging_btm_"+step,
			pageSize:"50",
			asin:ASIN,
			scope:"reviewsAjax3"	
			};	
		$.ajax({
			type: 'POST',
			url: url,
			data: data,
			beforeSend: function(data){},
			success: function(data){extractmonths(data.responseText,step);},
			error: function(data){extractmonths(data.responseText,step);}
			});
		}
		
		

				
	function showhidetrend()
		{
		if($("#trendlink").html()=="Annual")
			{
			$("#main-image-container").hide();
			$("#trendplot").show();
			$("#trendlink").html("hide trend");
			$("#trendlinkalltime").html("All-Time");	
			}
		else
			{			
			$("#trendplot").hide();
			$("#main-image-container").show();
			$("#trendlink").html("Annual");	
			$("#trendlinkalltime").html("All-Time");	
			}
		if(!extracted)
			{
			var url = chrome.extension.getURL('images/loading.gif');
			$("#trendplot").html("<center><img style=\"height:300px;\" id=\"loadinggif\"  src=\""+url+"\"></center>");
			range = "yearly";
			extractpagedetails();
			}
		else
			{
			plotyearly();
			}
		}
		
	function showhidetrendalltime()
		{
		if($("#trendlinkalltime").html()=="All-Time")
			{
			$("#main-image-container").hide();
			$("#trendplot").show();
			$("#trendlinkalltime").html("hide trend");
			$("#trendlink").html("Annual");	
			}
		else
			{			
			$("#trendplot").hide();
			$("#main-image-container").show();
			$("#trendlinkalltime").html("All-Time");	
			$("#trendlink").html("Annual");	
			}
		if(!extracted)
			{
			var url = chrome.extension.getURL('images/loading.gif');
			$("#trendplot").html("<center><img style=\"height:300px;\" img id=\"loadinggif\" src=\""+url+"\"></center>");
			range = "alltime";
			extractpagedetails();
			}
		else
			{
			plotalltime();
			}
		}
		
	
		

	
	

	});
   





