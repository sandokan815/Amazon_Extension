var maxpage = 9;
var check_url = "https://ssfinder.com/check/?license=";
var showhide = 0;
var csv_data = "\"Keyword\",\"Count\",\"Relevance\",\"SFR\",\"Choice\",\"Top ASIN\",\"VDB\",\"Rank\",\"Sponsored\"\r\n";   
var asin = "";
var relevance_scores = {};
var bubble_data = {};
var volumes = {};
var all_keywords = [];
var total_ajax = 0;
var processed_ajax = 0;
var choice = {};
var counts = {};
var rank = {};
var sponsored = {};
var n1 = {};
var pagerank = {};
var sortable_keywords = [];
var xraygenerated = false;
var setonce = false;
var highlight_words = [];
var maxconnections = 100;
var ajaxdelay = 250;

function onlyUnique(value, index, self)
	{ 
    return self.indexOf(value) === index &&value;
	}

function exportToCsv(filename, data) 
	{
	var blob = new Blob([data], { type: 'text/csv;charset=utf-8;' });
	if (navigator.msSaveBlob)
		{ // IE 10+
		navigator.msSaveBlob(blob, filename);
        } 
	else 
		{
		var link = document.createElement("a");
		if (link.download !== undefined)
			{
			var url = URL.createObjectURL(blob);
			link.setAttribute("href", url);
			link.setAttribute("download", filename);
			link.style.visibility = 'hidden';
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);
			}
        }
    }

function get_score()
	{
	chrome.runtime.sendMessage({command: "get_score", asin: asin}, (response) => 
		{
		if(response.data)
			process(response.data);	
		else
			alert("This extension only works if you are logged in your Seller Central account");
		});		
	}
	
function create_sortable_keywords()
	{
	sortable_keywords = [];
	all_keywords.forEach(function(keyword)
		{
		if(keyword.length)
			{
			var relevance = 0,sfr=999999,badge="NO BADGE FOUND",exact=0,ranking=999,countx=0,topasinx="NA",sponsoredx="NA",pagex="NA";	
			if(relevance_scores[keyword])
				relevance = relevance_scores[keyword];
			if(bubble_data[keyword])
				sfr = bubble_data[keyword];
			if(volumes[keyword]>0)
				exact = volumes[keyword];
			if(choice[keyword]==asin)
				badge = "(this asin) "+choice[keyword];
			else if(choice[keyword])
				badge = choice[keyword];
			if(rank[keyword])
				ranking = rank[keyword];
			if(sponsored[keyword])
				sponsoredx=sponsored[keyword];
			if(n1[keyword])
				topasinx=n1[keyword];
			if(counts[keyword])
				countx = counts[keyword];
			if(pagerank[keyword])
				pagex = pagerank[keyword];
			sortable_keywords.push([keyword,relevance,sfr,badge,exact,ranking,countx,topasinx,sponsoredx+"",pagex+""]);
			}	
		});
	}
	
function sort_keywords(sortoption)	
	{
	/*
	0 = keyword
	1 = relevance
	2 = sfr
	3 = badge
	4 = vdb
	*/
	if(sortoption==1) //relevance descending
		sortable_keywords.sort(function(a, b) 
			{
			return b[1] - a[1];
			});
			
	if(sortoption==2) //relevance ascending
		sortable_keywords.sort(function(a, b) 
			{
			return a[1] - b[1];
			});
			
	if(sortoption==3) //sfr descending
		sortable_keywords.sort(function(a, b) 
			{
			return b[2] - a[2];
			});

	if(sortoption==4) //sfr ascending
		sortable_keywords.sort(function(a, b) 
			{
			return a[2] - b[2];
			});
			
	if(sortoption==5) //choice descending
		sortable_keywords.sort(function(a, b) 
			{
			return ((b[3] == a[3]) ? 0 : ((b[3] > a[3]) ? 1 : -1));
			});
			
	if(sortoption==6) //choice ascending
		sortable_keywords.sort(function(a, b) 
			{
			return ((a[3] == b[3]) ? 0 : ((a[3] > b[3]) ? 1 : -1));
			});	
			
	if(sortoption==7) //vdb descending
		sortable_keywords.sort(function(a, b) 
			{
			return b[4] - a[4];
			});
			
	if(sortoption==8) //vdb ascending
		sortable_keywords.sort(function(a, b) 
			{
			return a[4] - b[4];
			});	
	
	if(sortoption==9) //rank descending
		sortable_keywords.sort(function(a, b) 
			{
			return b[5] - a[5];
			});
			
	if(sortoption==10) //rank ascending
		sortable_keywords.sort(function(a, b) 
			{
			return a[5] - b[5];
			});
			
	if(sortoption==11) //count descending
		sortable_keywords.sort(function(a, b) 
			{
			return b[6] - a[6];
			});
			
	if(sortoption==12) //count ascending
		sortable_keywords.sort(function(a, b) 
			{
			return a[6] - b[6];
			});
			
	if(sortoption==13) //topasin descending
		sortable_keywords.sort(function(a, b) 
			{
			return ((b[7] == a[7]) ? 0 : ((b[7] > a[7]) ? 1 : -1));
			});
			
	if(sortoption==14) //topasin ascending
		sortable_keywords.sort(function(a, b) 
			{
			return ((a[7] == b[7]) ? 0 : ((a[7] > b[7]) ? 1 : -1));
			});
			
	if(sortoption==15) //sponsored descending
		sortable_keywords.sort(function(a, b) 
			{
			return ((b[8] == a[8]) ? 0 : ((b[8] > a[8]) ? 1 : -1));
			});
			
	if(sortoption==16) //sponsored ascending
		sortable_keywords.sort(function(a, b) 
			{
			return ((a[8] == b[8]) ? 0 : ((a[8] > b[8]) ? 1 : -1));
			});
			
	if(sortoption==17) //page descending
		sortable_keywords.sort(function(a, b) 
			{
			return ((b[9] == a[9]) ? 0 : ((b[9] > a[9]) ? 1 : -1));
			});
			
	if(sortoption==18) //page ascending
		sortable_keywords.sort(function(a, b) 
			{
			return ((a[9] == b[9]) ? 0 : ((a[9] > b[9]) ? 1 : -1));
			});
			
	}
	
function numberWithCommas(x) 
	{
    var parts = x.toString().split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return parts.join(".");
	}	
	
function highlight_rows()
	{
	$(".keyword_cell").each(function()
		{
		var keyword = $(this).attr("keyword");
		var cell_words = keyword.match(/\b(\w+)\b/g).map(v => v.toLowerCase()).filter(x => x);;		
		if(cell_words.every(val => highlight_words.includes(val)))
			$(this).css("background-color","rgba(224, 224, 0, 0.25)");
		else
			$(this).css("background-color","rgba(224, 224, 0, 0)");
		});
	}
	
function toggle_rows(words)
	{
	$(".keyword_cell").each(function()
		{
		var keyword = $(this).attr("keyword");
		var cell_words = keyword.match(/\b(\w+)\b/g).map(v => v.toLowerCase()).filter(x => x);;	
		if(cell_words.some(val => words.includes(val)))
			$(this).parent().show();
		else
			$(this).parent().hide();
		});
	}
	
function show_all_rows()
	{
	$(".keyword_cell").each(function()
		{
		$(this).parent().show();
		});
	}	

function populate_highlight()
	{
	var title = $("#productTitle").html().trim();
	var bullets = [];
	$("#feature-bullets").find(".a-list-item").each(function()
		{
		if($(this).html()&&$(this).html().length)
		bullets.push($(this).html().trim());
		});
	$("#highlight_title").val(title);
	if(bullets[0])
		$("#highlight_bullet1").val(bullets[0]);
	if(bullets[1])
		$("#highlight_bullet2").val(bullets[1]);
	if(bullets[2])
		$("#highlight_bullet3").val(bullets[2]);
	if(bullets[3])
		$("#highlight_bullet4").val(bullets[3]);
	if(bullets[4])
		$("#highlight_bullet5").val(bullets[4]);
	}		
	
function showdata()
	{
	var upimg = chrome.extension.getURL('/images/up.png');
	var downimg = chrome.extension.getURL('/images/down.png');
	$("#relevancescoresxray").html("<style>.highlight{margin:10px;width:300px;}</style>");
	$("#relevancescoresxray").append("<div style=\"float:left;margin-bottom:10px;\"><a id=\"indexhighlighter\" class=\"ui-button\">Index Highlighter</a>&nbsp;<input type=\"text\" id=\"rowfilter\" class=\"form-control\" placeholder=\"filter words\"></div><div style=\"margin:10px;float:right;\"><a id=\"csvxray\" class=\"ui-button\">Download CSV</a>&nbsp;<button id=\"closexray\" class=\"ui-button\">Close</button></div><br style=\"clear:both;\">");
	$("#relevancescoresxray").append('<div id="highlighter" style="display:none;margin-bottom:10px;"><input type="text" class="form-control highlight" placeholder="Title" id="highlight_title"><br><input type="text" class="form-control highlight" placeholder="Bullet Point #1" id="highlight_bullet1"><br><input type="text" class="form-control highlight" placeholder="Bullet Point #2" id="highlight_bullet2"><br><input type="text" class="form-control highlight" placeholder="Bullet Point #3" id="highlight_bullet3"><br><input type="text" class="form-control highlight" placeholder="Bullet Point #4" id="highlight_bullet4"><br><input type="text" class="form-control highlight" placeholder="Bullet Point #5" id="highlight_bullet5"></div>');
	
	if(!setonce)
		{
		setonce = true;
		$(document).on("click","#closexray",function(){$("#fog").hide();$("#relevancescoresxray").hide();});
		$(document).on("click","#csvxray",function(){exportToCsv(asin+".csv", csv_data); });
		
		$(document).on("keyup","#rowfilter",function()
			{
			var input = $(this).val();
			var words = input.match(/\b(\w+)\b/g);
			if(!input||!words)
				show_all_rows();
			else				
				toggle_rows(words);
			});
		
		$(document).on("keyup",".highlight",function()
			{
			highlight_words = [];
			$('.highlight').each(function()
				{
				var input = $(this).val();
				var words = input.match(/\b(\w+)\b/g);
				highlight_words = highlight_words.concat(words);
				});
			highlight_words = highlight_words.filter(onlyUnique);
			highlight_words = highlight_words.map(v => v.toLowerCase());	
			highlight_rows();
			});
		}
	
	var table = "<style> .imgbtn {cursor:pointer;} #relevancescoresxray{ }</style><table><tr><th>Keyword</th><th>Count <img class=\"imgbtn\" src=\""+upimg+"\" id=\"upcount\" height=\"20\"><img class=\"imgbtn\" src=\""+downimg+"\" id=\"downcount\" height=\"20\"></th><th>Relevance <img class=\"imgbtn\" src=\""+upimg+"\" id=\"uprelevance\" height=\"20\"><img class=\"imgbtn\" src=\""+downimg+"\" id=\"downrelevance\" height=\"20\"></th><th>SFR <img class=\"imgbtn\" src=\""+upimg+"\" id=\"upsfr\" height=\"20\"><img class=\"imgbtn\" src=\""+downimg+"\" id=\"downsfr\" height=\"20\"></th><th>Choice Badge <img class=\"imgbtn\" src=\""+upimg+"\" id=\"upchoice\" height=\"20\"><img class=\"imgbtn\" src=\""+downimg+"\" id=\"downchoice\" height=\"20\"></th><th>Top ASIN <img class=\"imgbtn\" src=\""+upimg+"\" id=\"uptopasin\" height=\"20\"><img class=\"imgbtn\" src=\""+downimg+"\" id=\"downtopasin\" height=\"20\"></th><th>VDB <img class=\"imgbtn\" src=\""+upimg+"\" id=\"upvdb\" height=\"20\"><img class=\"imgbtn\" src=\""+downimg+"\" id=\"downvdb\" height=\"20\"></th><th>Rank <img class=\"imgbtn\" src=\""+upimg+"\" id=\"uprank\" height=\"20\"><img class=\"imgbtn\" src=\""+downimg+"\" id=\"downrank\" height=\"20\"></th><th>Page <img class=\"imgbtn\" src=\""+upimg+"\" id=\"uppage\" height=\"20\"><img class=\"imgbtn\" src=\""+downimg+"\" id=\"downpage\" height=\"20\"></th><th>Sponsored <img class=\"imgbtn\" src=\""+upimg+"\" id=\"upsponsored\" height=\"20\"><img class=\"imgbtn\" src=\""+downimg+"\" id=\"downsponsored\" height=\"20\"></th></tr><tbody>";
	csv_data = "\"Keyword\",\"Count\",\"Relevance\",\"SFR\",\"Choice\",\"Top ASIN\",\"VDB\",\"Rank\",\"Page\",\"Sponsored\"\r\n";  
	var i=0;
	sortable_keywords.forEach(function(data)
		{
		var keyword = numberWithCommas(data[0]);
		var relevance = numberWithCommas(data[1]);
		var xsfr = numberWithCommas(data[2]);
		var xbadge = data[3];
		var exact = numberWithCommas(data[4]);
		var rankx = numberWithCommas(data[5]);
		var countx =  numberWithCommas(data[6]);
		var topasinx = data[7];
		var sponsoredx = data[8];
		var pagex = data[9];
		var kwp = encodeURI(keyword);
		var csvbadge = xbadge;
		var csvtopasin = topasinx;
		
		
		if(xbadge=="NO BADGE FOUND"||xbadge=="NA")
			{}
		else if(xbadge=="(this asin) "+asin)
			xbadge = "<b>"+xbadge+"</b>";
		else
			xbadge = "<a  style=\"color:#ff9b36\" target=\"_blank\" href=\"https://www.amazon.com/dp/"+xbadge+"/\">"+xbadge+"</a>";
		
		if(topasinx=="NA")
			{}
		else if(topasinx=="(this asin) "+asin)
			topasinx = "<b>"+topasinx+"</b>";
		else
			topasinx = "<a style=\"color:#ff9b36\" target=\"_blank\" href=\"https://www.amazon.com/dp/"+topasinx+"/\">"+topasinx+"</a>";

		i++;		
		if(i%2)
			altcolor="background:rgba(1, 1, 1, 0.5)";
		else
			altcolor="";
		
		table+="<tr style=\""+altcolor+"\" class=\"altcolor\"><td class=\"keyword_cell\" keyword=\""+keyword+"\"><a  style=\"color:#ff9b36\" target=\"_blank\" href=\"https://www.amazon.com/s/?k="+kwp+"\">"+keyword+"</a></td><td>"+countx+"</td><td>"+relevance+"</td><td>"+xsfr+"</td><td>"+xbadge+"</td><td>"+topasinx+"</td><td>"+exact+"</td><td>"+rankx+"</td><td>"+pagex+"</td><td>"+sponsoredx+"</td></tr>";
		csv_data+="\""+keyword+"\",\""+countx+"\",\""+relevance+"\",\""+xsfr+"\",\""+csvbadge+"\",\""+csvtopasin+"\",\""+exact+"\",\""+rankx+"\",\""+pagex+"\",\""+sponsoredx+"\"\r\n";
		
		$("#downloadscores").show();	
		xraygenerated=true;
		});
	$("#relevancescoresxray").append(table+"</tbody></table>");
	$(document).on("click","#downrelevance",function(){
		sort_keywords(1);
		showdata();
		});	
	
	$(document).on("click","#uprelevance",function(){
		sort_keywords(2);
		showdata();
		});

	$(document).on("click","#downsfr",function(){
		sort_keywords(3);
		showdata();
		});	
		
	$(document).on("click","#upsfr",function(){
		sort_keywords(4);
		showdata();
		});	

	$(document).on("click","#downchoice",function(){
		sort_keywords(5);
		showdata();
		});	

	$(document).on("click","#upchoice",function(){
		sort_keywords(6);
		showdata();
		});	
		
	$(document).on("click","#downvdb",function(){
		sort_keywords(7);
		showdata();
		});	

	$(document).on("click","#upvdb",function(){
		sort_keywords(8);
		showdata();
		});	

	$(document).on("click","#downrank",function(){
		sort_keywords(9);
		showdata();
		});	

	$(document).on("click","#uprank",function(){
		sort_keywords(10);
		showdata();
		});	
		
	$(document).on("click","#downcount",function(){
		sort_keywords(11);
		showdata();
		});	

	$(document).on("click","#upcount",function(){
		sort_keywords(12);
		showdata();
		});	
		
	$(document).on("click","#downtopasin",function(){
		sort_keywords(13);
		showdata();
		});	

	$(document).on("click","#uptopasin",function(){
		sort_keywords(14);
		showdata();
		});

	$(document).on("click","#downsponsored",function(){
		sort_keywords(15);
		showdata();
		});	

	$(document).on("click","#upsponsored",function(){
		sort_keywords(16);
		showdata();
		});	

	$(document).on("click","#downpage",function(){
		sort_keywords(17);
		showdata();
		});	

	$(document).on("click","#uppage",function(){
		sort_keywords(18);
		showdata();
		});			
		
	}	
	

	
function process(scores_string)	
	{
	var regex = /{"keyword(.)*?}/g, match;
	while(match = regex.exec(scores_string))
		{
		var kx = match[0];
		var regex2 = /"keyword":"(.+?)"(.*)"score":(.+?)}/g, match2;
		match2 = regex2.exec(match[0]);
		var keyword = match2[1];
		all_keywords.push(keyword);
		var score = match2[3];
		relevance_scores[keyword]=score;
		}
	bubble();
	}
	
function bubble()
	{
	fetch("https://topasins.com/asinbubble.php?a="+asin)
	.then(function(resp){return resp.json();})
	.then(function(json)
		{
		if(json)
			{
			for (var sfr in json) 
				{
				if(json.hasOwnProperty(sfr))
					{
					var data = json[sfr];
					var keywordx = data["keyword"];
					bubble_data[keywordx]=sfr;
					all_keywords.push(keywordx);
					}
				}
			}
		get_sfr();
		});	
	}
	
function get_sfr()
	{
	fetch("https://topasins.com/xray.php",{
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(all_keywords)
	})
	.then(res=>res.json())
	.then(json=>
		{
		for (var k in json) 
			{
			if (json.hasOwnProperty(k)) 
				{
				bubble_data[k]=json[k];	
				all_keywords.push(k);
				}
			}
		all_keywords = all_keywords.filter(onlyUnique);
		getvdb();	
		});
	}

function getvdb()
	{
	fetch("https://topasins.com/vdb.php",{
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(all_keywords)
	})
	.then(res=>res.json())
	.then(json=>
		{
		for (var k in json) 
			{
			if (json.hasOwnProperty(k)) 
				{
				volumes[k]=json[k];	
				}
			}
		getrank();	
		});
	}	

function getrank()
	{
	all_keywords = all_keywords.filter(onlyUnique);
	total_ajax = all_keywords.length*maxpage;
	processed_ajax = 0;
	for(var page=1;page<=maxpage;page++)
		all_keywords.forEach(function(k)
			{
			checkrank(k,page);
			});
	}
	
function delayed_ajax_get(url,process)
	{
	if($.active<maxconnections)
		{	
		$.ajax(
			{
			type: "GET",
			url: url
			})
		.always(function(response) 
			{
			process(response.responseText);
			});			
		}
	else
		{
		setTimeout(function(){delayed_ajax_get(url,process);},ajaxdelay);
		}	
	}	

function checkrank(kw,page)
	{
	var kwp = encodeURI(kw);
	delayed_ajax_get("https://www.amazon.com/mn/search/ajax/?keywords="+kwp+"&page="+page,function(text)
		{		
		var m = [];
		var count = 0;
		var regex = /\s([0-9\,]+?)\sresults\sfor/g;
		m = regex.exec(text);
		if(m&&m[1])
			count = m[1].replace(/\,/g,'');
		counts[kw]=count;
		
		var n = [];
		var regex2 = /AMAZONS_CHOICE_([A-Z0-9]{10})-label/gm;
		n = regex2.exec(text);
		if(n&&n[1])
			choice[kw] = n[1];
		
		var position = 0;
		var matches = [];
		var regex_results = /id=\\\"result_([0-9]+?)\\\"\sdata-asin=\\\"([A-Za-z0-9]{10})\\\"\sclass=\\\"(.+?)\\\"/gm;
		var i = 0;
		while ((matches = regex_results.exec(text)) !== null)
			{
			if (matches.index === regex_results.lastIndex)
				{
				regex_results.lastIndex++;
				}			
			if(matches&&matches[2]&&matches[3])
				{				
				var current_asin = matches[2];
				var asin_class = matches[3];
				
				if(asin_class.indexOf("AdHolder")==-1)
					i++;
				
				if(i==1&&current_asin==asin&&page==1)
					n1[kw]="(this asin) "+current_asin;
				else if(i==1&&page==1)
					n1[kw]=current_asin;
				
				if(current_asin==asin&&asin_class.indexOf("AdHolder")!=-1)
					sponsored[kw] = page;
				else if(current_asin==asin)
					{
					pagerank[kw] = page;
					position = i;  			
					}
				}                                    
			}
		
		if(position)
			rank[kw]= (page-1)*i+position;
		
		processed_ajax++;
		$("#scrapestatus").html(processed_ajax+" / "+total_ajax);
		if(processed_ajax==total_ajax)
			{
			create_sortable_keywords();
			sort_keywords(1);
			showdata();
			}
		});
	}

function check_license(license)
	{
	$.get(check_url+license, function(data) 
		{
		if(data.indexOf("ok")!==-1)
			{
			chrome.storage.local.set({'licenseok':data});
			location.reload();
			}
		else
			{
			alert("The license is not valid.");
			}
		});
	}	

function check_sc()
	{
	chrome.runtime.sendMessage({command: "check_sc"}, (response) => 
		{
		if(response.result=="on")
			return;
		else
			{
			$('<div id="xrayerror"><a target="_blank" href="https://sellercentral.amazon.com/">X-Ray only works if you are logged in Seller Central.</a></div>').insertBefore("#unifiedPrice_feature_div");
			$("#xraysdiv").hide();
			}
		});	
	}
	
function getRandomInt(min, max) 
	{
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
	}	
	
$(document).ready(function()
	{
		
	
		
	$("body").on("click","#indexhighlighter",function()
		{
		$("#highlighter").toggle();
		populate_highlight();
		$('#highlight_title').keyup();
		});
		
	$("body").append("<div id=\"fog\" style=\"display:none;position:fixed;top:0px;left:0px;background-color:rgba(1,1,1,0.85);width:100%;height:100%;z-index:2147483646\"><div style=\"margin-left:auto;margin-right:auto;margin-top:100px;width:70%;background-color: #092546;color:white;padding:30px;height:70%;overflow-y:scroll;\" id=\"relevancescoresxray\" class=\"draggable resizable\"></div></div>");
		
	check_sc();	
		
	chrome.storage.local.get('licenseok', function (result) {
        licenseok = result.licenseok;		
        if(licenseok)
			{
			$('<div id="xraysdiv"><a href="#" id="showxray">Show X-Ray</a> <a href="#" id="downloadscores" style="display:none;"> | Download Data</a></div>').insertBefore("#unifiedPrice_feature_div");
			$(".draggable").draggable();			
			}
		else
			{
			$('<div id="xraylicensediv">Universal License: <input type="text" id="license"> <a href="#" id="checklicense">Verify License</a></div>').insertBefore("#unifiedPrice_feature_div");
			}
		});	
			
		
	$(document).on("click","#checklicense",function(){
		var license = $("#license").val();
		check_license(license);
		console.log(license);
		});	
	
	$(document).on("click","#downloadscores",function(){
		exportToCsv(asin+".csv", csv_data); 
		});
	
	$(document).on("click","#showxray",function(){		
		if(xraygenerated)
			{
			$("#fog").show();
			$("#relevancescoresxray").show();
			return;
			}
		else
			{
			sortable_keywords = [];
			var randload = getRandomInt(1,5);
			$("#fog").show();
			$("#relevancescoresxray").html("<center><img height=\"300\" src=\""+chrome.extension.getURL("images/loading"+randload+".gif")+"\"><div style=\"margin:25px;\" id=\"scrapestatus\">starting soon... please wait</div></center>");
			$("#relevancescoresxray").show();
			var regex = RegExp("\/(B0[A-Za-z0-9]{8})($|[^A-Za-z0-9])");
			var address = window.location.href;
			var m = address.match(regex);
			console.log("m1",m[1]);
			if(m&&m[1])
				asin = m[1];
			bubble_data = {};
			volumes = {};
			all_keywords = [];
			choice = {};
			relevance_scores = {};
			counts = {};
			rank = {};
			sponsored = {};
			n1 = {};
			pagerank = {};
			total_ajax = 0;
			processed_ajax = 0;
			if(m&&m[1])
				get_score();
			else
				alert("ASIN not identified!");
			}
	});
	
});
