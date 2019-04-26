/* pixel */
!function(f,b,e,v,n,t,s)
  {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
  n.callMethod.apply(n,arguments):n.queue.push(arguments)};
  if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
  n.queue=[];t=b.createElement(e);t.async=!0;
  t.src=v;s=b.getElementsByTagName(e)[0];
  s.parentNode.insertBefore(t,s)}(window, document,'script',
  'https://connect.facebook.net/en_US/fbevents.js');
  fbq('init', '1300999583322509');
  fbq('track', 'PageView');

var check_url = "https://ssfinder.com/check/?license=";
var minvol = 3000;
var cat = 0;
var opportunities = [];

/* start n threads looking for opportunities */	
function get_opportunities()
	{
	var payload = JSON.stringify({volume: minvol,category:cat});
	fetch("https://searchfrequencyrank.com/vdb-ssf/",
		{
		method: 'POST',
		body: payload,
		headers:
			{
			'Content-Type': 'application/json'
			}
		})
	.then(function(response)
		{
		if(response.status!==200)
			{
			throw new Error('something went wrong');
			}
		else
			return response.json();
		})
	.then(json => 
		{
		json.forEach(function(j)
			{
			opportunities.push([j.keyword,j.volume]);	
			});
		show_results();
		})
	}
	
function check_license(license)
	{
	$.get(check_url+license, function(data) 
		{
		if(data.indexOf("ok")!==-1)
			{
			console.log("valid license");
			chrome.storage.local.set({'licenseok':data});
			$("#licensediv").hide();
			$("#screen1").show();
			}
		else
			{
			$("#invalidlicense").show();
			}
		});
	}
		

/* display the results */	
function show_results()
	{
	var html = "";
	for(var i=0;i<10;i++)
		{
		var x = i+1;
		html += "<p>"+x+". <a target=\"_blank\" href=\"https://www.amazon.com/s/?keywords="+opportunities[i][0]+"\">"+opportunities[i][0]+"</a> - "+opportunities[i][1]+" exact monthly searches</p>";
		}
	$("#opp").html(html);		
	$("#loading").hide();
	$("#screen1").show();
	$("#logo").show();
	}
	
/* main thread */
$(document).ready(function()
	{	
	//check license
	chrome.storage.local.get('licenseok', function (result) {
        licenseok = result.licenseok;		
        if(licenseok)
			{
			$("#screen1").show();
			}
		else
			{
			$("#licensediv").show();
			}
		});
	
	//verify license
	$("#checklicense").click(function(){
		var license = $("#license").val();
		check_license(license);
		});
	
	//get new opportunities
	$(document).on("click","#showme10",function(){	
		total_found = 0;
		opportunities = [];
		minvol = $("#minvol").val();
		cat = $("#cat").val();
		$("#opp").html("");
		$("#loading").show();
		$("#screen1").hide();
		$("#logo").hide();
		get_opportunities();		
		});
	
		
	});
	
	


