var check_url = "https://ssfinder.com/check/?license=";
var showhide = 0;
var csv_data = "\"Keyword\",\"Relevance Score\"\r\n";   
var asin = "";
var relevance_scores = {};

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

function get_score(asin)
	{
	chrome.runtime.sendMessage({command: "get_score", asin: asin}, (response) => 
		{
		if(response.data)
			process(response.data);	
		else
			alert("This extension only works if you are logged in your Seller Central account");
		});	
	}
	
function showdata()
	{
	var final_data = [];
	for(var keyword in relevance_scores) 
		{
		if(relevance_scores.hasOwnProperty(keyword))
			{
			final_data.push([keyword,parseInt(relevance_scores[keyword])]);
			}	
		}
	final_data.sort(function(a, b) 
		{
		a = a[1];
		b = b[1];
		return a > b ? -1 : (a < b ? 1 : 0);
		});
	var table = "<table><tr><th>Keyword</th><th>Relevance Score</th></tr><tbody>";
	for(var i=0;i<final_data.length;i++)
		{
		var keyword = final_data[i][0];
		var relevance = final_data[i][1];
		table+="<tr><td>"+keyword+"</td><td>"+relevance+"</td></tr>";
		csv_data+="\""+keyword+"\",\""+relevance+"\"\r\n";
		$("#downloadscores").show();	
		}
	$("#relevancescores").html(table+"</tbody></table>");
	}	
	

	
function process(scores_string)	
	{
	var kws = [];
	var regex = /{"keyword(.)*?}/g, match;
	while(match = regex.exec(scores_string))
		{
		var kx = match[0];
		var regex2 = /"keyword":"(.+?)"(.*)"score":(.+?)}/g, match2;
		match2 = regex2.exec(match[0]);
		var keyword = match2[1];
		var score = match2[3];
		relevance_scores[keyword]=score;
		kws.push(keyword);
		}
	showdata();
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

	
$(document).ready(function()
	{
		
	chrome.storage.local.get('licenseok', function (result) {
        licenseok = result.licenseok;		
        if(licenseok)
			{
			$('<div id="relevancesdiv"><a href="#" id="showrelevance">Show Relevance Scores</a> <a href="#" id="downloadscores" style="display:none;"> | Download Data</a><span id="trafficscorediv" style="display:none;"></div><div style=\"display:none;\" id=\"relevancescores\"></div>').insertBefore("#unifiedPrice_feature_div");
			}
		else
			{
			$('<div id="licensediv">Universal License: <input type="text" id="license"> <a href="#" id="checklicense">Verify License</a></div>').insertBefore("#unifiedPrice_feature_div");
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
	
	$(document).on("click","#showrelevance",function(){
		if(!showhide)
			{
			showhide=1;
			$("#showrelevance").html("Hide Relevance Scores");
			$("#relevancescores").show();
			var regex = RegExp(".com/([\\w-]+/)?(dp|gp/product)/(\\w+/)?(\\w{10})");
			var address = window.location.href;
			var m = address.match(regex);
			asin = m[4];
			get_score(asin);
			}
		else
			{
			showhide=0;
			$("#showrelevance").html("Show Relevance Scores");
			$("#relevancescores").html("");
			$("#relevancescores").hide();
			$("#downloadscores").hide();
			$("#trafficscorediv").hide();
			}
	});
	
});
