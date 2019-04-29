!function (f, b, e, v, n, t, s) {
  if (f.fbq) return; n = f.fbq = function () {
    n.callMethod ?
      n.callMethod.apply(n, arguments) : n.queue.push(arguments)
  };
  if (!f._fbq) f._fbq = n; n.push = n; n.loaded = !0; n.version = '2.0';
  n.queue = []; t = b.createElement(e); t.async = !0;
  t.src = v; s = b.getElementsByTagName(e)[0];
  s.parentNode.insertBefore(t, s)
}(window, document, 'script',
  'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '1300999583322509');
fbq('track', 'PageView');

var app_status = "loaded";
var suggested_keywords = [];
var suggested_keywords_two = [];
var asins = [];
var asin_details = {};
var all_seeds = [];
var all_keywords = [];

var total_ajax = 0;
var processed_ajax = 0;

var results = [];
var volumes = [];
var entityid = "";

var rankings = {};
var rankings2 = {};
var score_2 = {};
var allkws = [];
var exact_volumes = {};
var broad_volumes = {};
var sfr = {};
var parents = {};
var mid = "";
var entityid = "NOT FOUND";
var counts = [];
var asins_found = [];
var choice = {};
var decryption_key = "";
var kev1 = {};
var kev2 = {};
var complete_results = [];
var ajaxdelay = 1;
var maxconnections = 50;
var ajaxtimeout = 60;
var ajaxReqs = 0;
var ajaxQueue = [];
var ajaxActive = 0;

var complete_url = "https://completion.amazon.com/search/complete?method=completion&mkt=1&p=Search&l=en_US&b2b=0&fresh=0&sv=desktop&client=amazon-search-ui&x=String&search-alias=aps&q={{q}}&qs={{qs}}&cf=1&fb=1&sc=1&";
var count_url = "https://www.amazon.com/s/?field-keywords={{kw}}";
var sponsored_url = "https://www.amazon.com/s/?field-keywords={{keyword}}";
var check_url = "https://ssfinder.com/check/?license=";


$.xhrPool = [];

function onlyUnique(value, index, self) {
  return self.indexOf(value) === index;
}

function download(content, fileName, contentType, filetype) {
  $("#screen1").hide();
  $("#loading").hide();
  $("#download-section").show();
  var a = document.getElementById("a-" + filetype);
  var file = new Blob([content], { type: contentType });
  a.href = URL.createObjectURL(file);
  a.download = fileName;
}

function check_rank_2(ranks, asin) {
  var position = "NA";
  var parentasin = parents[asin];
  if (ranks)
    position = ranks.indexOf(parentasin);
  else
    position = "NA";
  if ((position == "NA" || position == -1) && ranks && ranks.indexOf(asin) >= 0)
    position = ranks.indexOf(asin);
  if (position < 0)
    return "NA";
  else if (position == "NA")
    return "NA";
  else
    return position + 1;
}

function check_rank(kw, asin) {
  var parentasin = parents[asin];
  if (rankings[kw])
    var position = rankings[kw].indexOf(parentasin);
  else
    var position = "NA";
  if ((position == "NA" || position == -1) && rankings2[kw] && rankings2[kw].indexOf(asin) >= 0)
    position = rankings2[kw].indexOf(asin);
  if ((position == "NA" || position == -1) && rankings[kw] && rankings[kw].indexOf(asin) >= 0)
    position = rankings[kw].indexOf(asin);
  if (position < 0)
    return "NA";
  else if (position == "NA")
    return "NA";
  else
    return position + 1;
}

function escape_kw(kw) {
  if (kw)
    return kw.replace(/[^a-zA-Z0-9\s\.]/g, "");
  else
    return "";
}

function isNA(position) {
  return position == "NA";
}

function build_spreadsheet() {
  var asins_string = asins.join(";");
  var timestamp = Date.now();

  var countso = [];
  var countso2 = [];

  asins.forEach(function (asin) {
    countso[asin] = 0;
    countso2[asin] = 0;
    for (var j = 0; j < asins_found.length; j++) {
      if (asins_found[j] == asin) {
        if (j % 2)
          countso[asin]++;
        else
          countso2[asin]++;
      }
    }
  });


  varcol = String.fromCharCode("J".charCodeAt() + asins.length - 1);
  contcol = String.fromCharCode("H".charCodeAt() + asins.length - 1);

  var datarow1 = 19;
  var datarow2 = datarow1 + results.length - 1;

  var organic = "";

  organic += "\"\",\"\",\"\",\"\",\"\",\"ASIN\"," + asins.join(",") + "\n";

  organic += "\"\",\"\",\"\",\"\",\"\",\"Link\",";
  asins.forEach(function (asin) {
    organic += "\"https://amazon.com/dp/" + asin + "\",";
  });
  organic += "\n";

  organic += "\"\",\"\",\"\",\"\",\"\",\"Main Image\",";
  asins.forEach(function (asin) {
    var img = asin_details[asin].imageUrl;
    organic += "\"=IMAGE(\"\"" + img + "\"\")\",";
  });
  organic += "\n";

  organic += "\"\",\"\",\"\",\"\",\"\",\"Brand\",";
  asins.forEach(function (asin) {
    organic += "\"" + asin_details[asin].brand + "\",";
  });
  organic += ",\"Total Relevant Keywords\",\"=SUBTOTAL(3,A" + datarow1 + ":A" + datarow2 + ")\"";
  organic += "\n";

  organic += "\"\",\"\",\"\",\"\",\"\",\"Title\",";
  asins.forEach(function (asin) {
    organic += escape_kw(asin_details[asin].title) + ",";
  });
  organic += ",\"Total Broad Volume\",\"=SUBTOTAL(109,D" + datarow1 + ":D" + datarow2 + ")\"";
  organic += "\n";

  organic += "\"\",\"\",\"\",\"\",\"\",\"Reviews\",";
  asins.forEach(function (asin) {
    organic += asin_details[asin].reviewCount + ",";
  });
  organic += ",\"Total Exact Volume\",\"=SUBTOTAL(109,E" + datarow1 + ":E" + datarow2 + ")\"";
  organic += "\n";

  organic += "\"\",\"\",\"\",\"\",\"\",\"Rating\",";
  asins.forEach(function (asin) {
    organic += asin_details[asin].rating + ",";
  });
  organic += "\n";

  organic += "\"\",\"\",\"\",\"\",\"\",\"Price\",";
  asins.forEach(function (asin) {
    organic += "\"" + asin_details[asin].price + "\",";
  });
  organic += ",\"Relevant Positions:\",\"10\"";
  organic += "\n";

  organic += "\"\",\"\",\"\",\"\",\"\",\"BSR\",";
  asins.forEach(function (asin) {
    organic += asin_details[asin].bsr + ",";
  });
  organic += ",\"Minimum Monthly Searches:\",\"30\"";
  organic += "\n";

  organic += "\"\",\"\",\"\",\"\",\"\",\"Estimated Monthly Sales\",";
  asins.forEach(function (asin) {
    organic += asin_details[asin].sales + ",";
  });
  organic += ",\"Target Monthly Sales:\",\"=$G$10\"";
  organic += "\n";

  organic += "\"\",\"\",\"\",\"\",\"\",\"Estimated Monthly Revenue\",";
  letter = "G";
  asins.forEach(function (asin) {
    var revenue = parseFloat(asin_details[asin].price) * parseFloat(asin_details[asin].sales);
    organic += "\"=" + letter + "10*" + letter + "8\",";
    letter = String.fromCharCode(letter.charCodeAt() + 1);
  });
  organic += "\n";

  organic += "\"\",\"\",\"\",\"\",\"\",\"Total Exact Volume\",";
  letter = "G";
  asins.forEach(function (asin) {
    organic += "\"=SUMIF(" + letter + datarow1 + ":" + letter + datarow2 + ",\"\"<=\"\"&$" + varcol + "$8,$E$" + datarow1 + ":$E" + datarow2 + ")\",";
    letter = String.fromCharCode(letter.charCodeAt() + 1);
  });
  organic += "\n";

  organic += "\"\",\"\",\"\",\"\",\"\",\"Revenue/Volume Ratio\",";
  letter = "G";
  asins.forEach(function (asin) {
    organic += "\"=" + letter + "11/" + letter + "12\",";
    letter = String.fromCharCode(letter.charCodeAt() + 1);
  });
  organic += "\n";

  organic += "\"\",\"\",\"\",\"\",\"\",\"Sponsored Occurrences Run #1\",";
  letter = "G";
  asins.forEach(function (asin) {
    organic += "\"" + countso[asin] + "\",";
    letter = String.fromCharCode(letter.charCodeAt() + 1);
  });
  organic += "\n";

  organic += "\"\",\"\",\"\",\"\",\"\",\"Sponsored Occurrences Run #2\",";
  letter = "G";
  asins.forEach(function (asin) {
    organic += "\"" + countso2[asin] + "\",";
    letter = String.fromCharCode(letter.charCodeAt() + 1);
  });
  organic += "\n";

  organic += "\"\",\"\",\"\",\"\",\"\",\"Top 10 Positions\",";
  letter = "G";
  asins.forEach(function (asin) {
    organic += "\"=COUNTIF(" + letter + datarow1 + ":" + letter + datarow2 + ",\"\"<=\"\"&$" + varcol + "$8)\",";
    letter = String.fromCharCode(letter.charCodeAt() + 1);
  });
  organic += "\n";

  organic += "\"\",\"\",\"\",\"\",\"\",\"Age (in months)\",";
  asins.forEach(function (asin) {
    organic += asin_details[asin].age + ",";
  });
  organic += "\n";

  organic += "\"Keyword\",\"Choice\",\"Results\",\"Broad Volume\",\"Exact Volume\",\"SFR\",\"Rankings\"";
  for (var i = 0; i < asins.length - 1; i++)
    organic += ",";
  organic += ",\"Individual Contribution\",\"Cumulative Contribution\",\"Count\",\"KWS\"\n";

  var currow = 0;

  results.forEach(function (kw, index) {

    var positions = [];
    asins.forEach(function (asin) {
      positions.push(check_rank(kw, asin));
    });
    if (positions.every(isNA)) {
      console.log("skipped because all NA", kw);
      return;
    }
    else
      currow++;

    var row = 18 + currow;
    var xsfr = 10000000;
    var xbr = 0;
    var xex = 0;
    if (sfr[kw])
      xsfr = sfr[kw];
    else
      console.log("SFR for " + kw + " not valid", sfr[kw]);
    if (broad_volumes[kw] && broad_volumes[kw] != "---")
      xbr = broad_volumes[kw];
    if (exact_volumes[kw] && exact_volumes[kw] != "---")
      xex = exact_volumes[kw];
    organic += "\"" + escape_kw(kw) + "\",\"" + choice[kw] + "\",\"" + counts[kw] + "\"," + xbr + "," + xex + "," + xsfr + ",";

    organic += positions.join();
    organic += ",\"=ROUND(E" + row + "/$" + varcol + "$6*100,2)&\"\"%\"\"\",";
    organic += "\"=ROUND(SUBTOTAL(109,$E$19:E" + row + ")/$" + varcol + "$6*100,2)&\"\"%\"\"\",";
    organic += "\"=SUBTOTAL(3,$A$19:A" + row + ")\",";
    organic += "\"=ROUND($" + varcol + "$10*" + contcol + row + ")\",";
    organic += "\n";
  });


  download(organic, 'ORGANIC-' + asins_string + '-' + timestamp + '.csv', 'text/plain', 'organic');

  $("#screen1").show();
  $("#loading").hide();
}

function step9() {
  $("#step").html("Currently <b>generating spreadsheet</b>.");
  build_spreadsheet();
}

function stepsfr() {
  $("#step").html("Currently extracting <b>SFR</b>");
  var payload = JSON.stringify({ keywords: results });
  fetch("https://searchfrequencyrank.com/bulk/",
    {
      method: 'POST',
      body: payload,
      headers:
      {
        'Content-Type': 'application/json'
      }
    })
    .then(function (response) {
      if (response.status !== 200) {
        throw new Error('something went wrong');
      }
      else
        return response.json();
    })
    .then(json => {
      Object.keys(json).forEach(function (key, index) {
        sfr[key] = this[key]["sfr"];
      }, json);
      console.log("sfr", sfr);
      step9();
    })
    .catch(error => {
      alert("We couldn't collect SFR data, sorry!");
      step9();
    });
}

function stepvdb() {
  $("#step").html("Currently extracting <b>search volumes</b> via Volumetrics DB.");
  var payload = JSON.stringify({ keywords: results });
  fetch("https://searchfrequencyrank.com/vdb/",
    {
      method: 'POST',
      body: payload,
      headers:
      {
        'Content-Type': 'application/json'
      }
    })
    .then(function (response) {
      return response.json();
    })
    .then(json => {
      data = json.data;
      data.forEach(function (d) {
        var keyword = d.keyword;
        var exact = d.exact;
        var broad = d.broad;
        exact_volumes[keyword] = exact;
        broad_volumes[keyword] = broad;
      });
      stepsfr();
    })
}

function stepnew() {
  $("#step").html("Currently extracting <b>search volumes</b> via SellerSuite.");
  var payload = JSON.stringify({ keywords: results });
  fetch("https://members.sellersuite.tech/api/keywordfindr/kiwi",
    {
      method: 'POST',
      body: payload,
      headers:
      {
        'Content-Type': 'application/json'
      }
    })
    .then(function (response) {
      if (response.status !== 200) {
        throw new Error('you are not logged in SellerSuite');
      }
      else
        return response.json();
    })
    .then(json => {
      data = json.data;
      data.forEach(function (d) {
        var keyword = d.keyword;
        var exact = d.exact;
        var broad = d.broad;
        exact_volumes[keyword] = exact;
        broad_volumes[keyword] = broad;
      });
      stepsfr();
    })
    .catch(error => {
      stepvdb();
    });
}


function countx(kw, kwp) {
  if ($.active < maxconnections) {
    $.ajax({
      type: "GET",
      url: "https://www.amazon.com/mn/search/ajax/?keywords=" + kwp
    })
      .always(function (resp) {

        var m = [];
        var regex = /\s([0-9\,]+?)\sresults\sfor/g;
        m = regex.exec(resp.responseText);
        if (m && m[1])
          count = m[1].replace(/\,/g, '');
        else
          count = 0;
        counts[kw] = count;

        var n = [];
        var regex2 = /AMAZONS_CHOICE_([A-Z0-9]{10})-label/gm;
        n = regex2.exec(resp.responseText);
        var badge = "NA";
        if (n && n[1])
          badge = n[1];
        choice[kw] = badge;

        var matches = [];
        var regex_results = /id=\\\"result_([0-9]+?)\\\"\sdata-asin=\\\"([A-Za-z0-9]{10})\\\"\sclass=\\\"(.+?)\\\"/gm;
        var ranks = [];
        while ((matches = regex_results.exec(resp.responseText)) !== null) {
          if (matches.index === regex_results.lastIndex) {
            regex_results.lastIndex++;
          }

          if (matches && matches[2] && matches[3]) {
            var asin = matches[2];
            var asin_class = matches[3];

            var issponsored = false;

            if (asin_class.indexOf("AdHolder") != -1)
              issponsored = true;

            if (issponsored)
              asins_found.push(asin);
            else {
              ranks.push(asin);
            }
          }
        }

        rankings2[kw] = ranks;
        processed_ajax++;
        $("#processed-status").html(processed_ajax + " / " + total_ajax);
        if (processed_ajax == total_ajax)
          stepnew();
      });
  }
  else {
    setTimeout(function () { countx(kw, kwp); }, ajaxdelay * 1000);
  }
}

function step8() {
  total_ajax = results.length;
  processed_ajax = 0;
  $("#step").html("Currently extracting <b>result counts</b> for each keyword.");
  for (var i = 0; i < results.length; i++) {
    var kw = results[i];
    var kwp = kw.replace(/\s/g, '+');
    countx(kw, kwp);
  }
}

function delayed_ajax_get_2(kw) {
  if ($.active < maxconnections) {
    var enc_kw = kw.trim().replace(/\s/g, "+")
    $.ajax(
      {
        url: "https://advertising.amazon.com/api/asin-search?entityId=" + entityid + "&adType=&page=1&pageSize=200&keywords=" + enc_kw,
        type: "GET",
        contentType: "application/json",
        dataType: "json",
        kw: kw
      })
      .always(function (resp) {
        var ranks = [];
        if (resp && resp.results) {
          resp.results.map(function (x) {
            if (x.variationalParentAsin)
              ranks.push(x.variationalParentAsin);
            else
              ranks.push(x.asin);
          });
        }
        rankings[kw] = ranks;
        processed_ajax++;
        $("#processed-status").html(processed_ajax + " / " + total_ajax);
        if (processed_ajax == total_ajax) {
          step8();
        }
      });
  }
  else {
    setTimeout(function () { delayed_ajax_get_2(kw); }, ajaxdelay);
  }
}

function generate_key(kw) {
  kev1[kw] = score_2[kw] * 365 / 12;
}

function step7() {
  $("#step").html("Currently extracting <b>search rankings</b> for each keyword and ASIN.");
  total_ajax = results.length;
  processed_ajax = 0;
  results.map(function (kw) {
    generate_key(kw);
    kev2[kw] = kev1[kw];
    delayed_ajax_get_2(kw);
  });
}

function append_estimations(values) {
  values.forEach(function (v) {
    var asin = v.asin;
    var sales = v.sales;
    var bsr = v.bsr;
    var age = v.age;
    var brand = v.brand;
    if (asin_details[asin]) {
      asin_details[asin].bsr = bsr;
      asin_details[asin].sales = sales;
      asin_details[asin].age = age;
      asin_details[asin].brand = brand;
    }
  });
  results = suggested_keywords_two.concat(allkws).filter(onlyUnique);
  step7();
}

function estimate_sales() {
  var apiPromises = [];
  var urls = [];
  asins.forEach(function (asin) {
    urls.push("https://kiwiapp.io/estimate_sales/?asin=" + asin);
  });
  var promises = urls.map(url => fetch(url).then(y => y.json()));
  Promise.all(promises).then(results => {
    append_estimations(results);
  });
}

function remove_from_array(array, el) {
  var index = array.indexOf(el);
  if (index > -1) {
    array.splice(index, 1);
  }
}

function step3alt() {
  allkws = suggested_keywords.concat(complete_results).filter(onlyUnique);
  $("#step").html("Currently extracting <b>ASIN details</b>.");
  processed_ajax = 0;
  total_ajax = asins.length;
  for (var i = 0; i < asins.length; i++) {
    let theasin = asins[i];
    var data = '{"browseNode":"","entityId":"ENTITY","keyword":"' + theasin + '"}';
    $.ajax(
      {
        type: "POST",
        url: "https://sellercentral.amazon.com/amazonStores/api/searchProductJson",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: data
      })
      .always(function (resp) {

        if (resp && resp.products && resp.products[0] && resp.products[0].asin) {
          asin = resp.products[0].asin;
        }
        else {
          console.log("ASIN not found", theasin);
          console.log(resp);
          alert(theasin + " triggered a fatal error, so we've had to exclude it from your ASIN list. Sorry!");
          remove_from_array(asins, theasin);
          console.log("new ASINs list", asins);
          processed_ajax++;
          $("#processed-status").html(processed_ajax + " / " + total_ajax);
          if (processed_ajax == total_ajax) {
            estimate_sales();
          }
          return;
        }

        if (!asin_details[asin])
          asin_details[asin] = {};

        if (resp && resp.products && resp.products[0] && resp.products[0].title)
          asin_details[asin].title = resp.products[0].title;
        else
          asin_details[asin].title = "NA";

        if (resp && resp.products && resp.products[0] && resp.products[0].image)
          asin_details[asin].imageUrl = resp.products[0].image;
        else
          asin_details[asin].imageUrl = "NA";

        if (resp && resp.products && resp.products[0] && resp.products[0].price && resp.products[0].price.displayString)
          asin_details[asin].price = resp.products[0].price.displayString;
        else
          asin_details[asin].price = "NA";

        if (resp && resp.products && resp.products[0] && resp.products[0].averageRating && resp.products[0].averageRating.value)
          asin_details[asin].rating = resp.products[0].averageRating.value;
        else
          asin_details[asin].rating = "NA";

        if (resp && resp.products && resp.products[0] && resp.products[0].reviewCount)
          asin_details[asin].reviewCount = resp.products[0].reviewCount;
        else
          asin_details[asin].reviewCount = "NA";

        processed_ajax++;
        $("#processed-status").html(processed_ajax + " / " + total_ajax);
        if (processed_ajax == total_ajax) {
          estimate_sales();
        }

      });
  }
}

function process_score_2(kk, resp) {
  if (resp.data && resp.data.getSuggestedKeywordsByLandingPageURL && resp.data.getSuggestedKeywordsByLandingPageURL.length) {
    var data = resp.data.getSuggestedKeywordsByLandingPageURL;
    for (var i = 0; i < data.length; i++) {
      if (data[i].keyword && data[i].score) {
        var kw = data[i].keyword;
        if (score_2[kw] && data[i].score > score_2[kw])
          score_2[kw] = data[i].score;
        else if (score_2[kw] && data[i].score < score_2[kw]) { }
        else
          score_2[kw] = data[i].score;
        suggested_keywords_two.push(kw);
      }
    }
  }
  processed_ajax++;
  $("#processed-status").html(processed_ajax + " / " + total_ajax);
  if (processed_ajax == total_ajax) {
    step3alt();
  }
}

function get_score_2(kk) {
  if ($.active < maxconnections) {
    var data = '{"operationName":"getSuggestedKeywordsByLandingPageURL","variables":{"landingPageUrl":"https://www.amazon.com/s/?keywords=' + kk + '"},"query":"query getSuggestedKeywordsByLandingPageURL($landingPageUrl: String) {\\n getSuggestedKeywordsByLandingPageURL(landingPageUrl: $landingPageUrl) {\\n suggestionId\\n keyword\\n matchType\\n score\\n }\\n}\\n"}';
    $.ajax(
      {
        url: "https://sellercentral.amazon.com/cb/graphql",
        type: "POST",
        data: data,
        contentType: "application/json"
      })
      .always(function (data) {
        process_score_2(kk, data);
      });
  }
  else {
    setTimeout(function () { get_score_2(kk); }, ajaxdelay);
  }
}

function step2() {
  console.log("number of keywords after filtering: ", allkws.length);
  console.log(allkws);
  $("#step").html("Currently extracting <b>even more related keywords</b>.");
  total_ajax = allkws.length;
  processed_ajax = 0;
  allkws.map(function (e) {
    get_score_2(e);
  });
}

function filterrank(kw) {
  if ($.active < maxconnections) {
    var enc_kw = kw.trim().replace(/\s/g, "+")
    $.ajax(
      {
        url: "https://advertising.amazon.com/api/asin-search?entityId=" + entityid + "&adType=&page=1&pageSize=200&keywords=" + enc_kw,
        type: "GET",
        contentType: "application/json",
        dataType: "json",
        kw: kw
      })
      .always(function (resp) {
        var ranks = [];
        if (resp && resp.results) {
          resp.results.map(function (x) {
            if (x.variationalParentAsin)
              ranks.push(x.variationalParentAsin);
            else
              ranks.push(x.asin);
          });
        }

        var positions = [];
        asins.forEach(function (asin) {
          positions.push(check_rank_2(ranks, asin));
        });
        if (positions.every(isNA)) {
          allkws.splice(allkws.indexOf(kw), 1);
        }

        processed_ajax++;
        $("#processed-status").html(processed_ajax + " / " + total_ajax);
        if (processed_ajax == total_ajax) {
          step2();
        }
      });
  }
  else {
    setTimeout(function () { filterrank(kw); }, ajaxdelay);
  }
}

function step_filter() {
  $("#step").html("Currently filtering out non-ranked keywords</b>.");
  allkws = suggested_keywords.concat(complete_results).filter(onlyUnique);
  total_ajax = allkws.length;
  processed_ajax = 0;
  console.log("number of keywords before filtering: ", allkws.length);
  console.log(allkws);
  allkws.map(function (e) {
    filterrank(e);
  });
}

function process_complete_result(r) {
  var regex = /\,\[\"(.*?)\"\]\,/g;
  x1 = regex.exec(r);
  if (x1 && x1[1]) {
    x2 = x1[1];
    x3 = x2.split("\",\"");
    complete_results = complete_results.concat(x3);
  }
  processed_ajax++;
  $("#processed-status").html(processed_ajax + " / " + total_ajax);
  if (processed_ajax == total_ajax) {
    //step_filter();
    step3alt();
  }
}

function delayed_ajax_get(url) {
  if ($.active < maxconnections) {
    $.ajax(
      {
        type: "GET",
        url: url
      })
      .always(function (response) {
        process_complete_result(response.responseText);
      });
  }
  else {
    setTimeout(function () { delayed_ajax_get(url); }, ajaxdelay);
  }
}

function complete(keyword) {
  //keyword\s
  kw = keyword + " ";
  var url1 = complete_url.replace("{{q}}", encodeURI(kw));
  url1 = url1.replace("{{qs}}", "");
  delayed_ajax_get(url1);

  //\s#keyword	
  var qs = encodeURI(keyword);
  var url2 = complete_url.replace("{{q}}", " ");
  url2 = url2.replace("{{qs}}", qs);
  delayed_ajax_get(url2);

  //key#\s#word
  var words = keyword.split((/\s+/));
  if (words.length >= 2) {
    for (var j = 1; j < words.length; j++) {
      a = words.slice(0, j).join(" ");
      b = words.slice(j, words.length).join(" ");
      var q = encodeURI(a) + "%20";
      var qs = encodeURI(b);
      var url2 = complete_url.replace("{{q}}", q);
      url2 = url2.replace("{{qs}}", qs);
      delayed_ajax_get(url2);
    }
  }
}

function step4() {
  $("#step").html("Currently extracting <b>auto-complete suggestions</b> for each keyword");

  suggested_keywords = suggested_keywords.filter(onlyUnique);

  console.log("total suggested keywords", suggested_keywords.length);

  total_ajax = 0;
  processed_ajax = 0;
  for (var i = 0; i < suggested_keywords.length; i++) {
    var words = suggested_keywords[i].split(/\s+/);
    total_ajax += (1 + words.length);
  }

  for (var i = 0; i < suggested_keywords.length; i++) {
    complete(suggested_keywords[i]);
  }
}

function process_score(asin, scores_string) {
  var kws = [];
  var regex = /{"keyword(.)*?}/g, match;
  while (match = regex.exec(scores_string)) {
    var kx = match[0];
    var regex2 = /"keyword":"(.+?)"(.*)"score":(.+?)}/g, match2;
    match2 = regex2.exec(match[0]);
    suggested_keywords.push(match2[1]);
  }
  processed_ajax++;
  $("#processed-status").html(processed_ajax + " / " + total_ajax);
  if (processed_ajax == total_ajax) {
    step4();
  }
}

function get_score(asin) {
  $.ajax(
    {
      url: "https://advertising.amazon.com/campaigns/sponsored-products/suggested-keywords/?asins=" + asin,
      type: "GET"
    })
    .always(function (data, status, jqxhr) {
      process_score(asin, data);
    });
}

function step1() {
  $("#step").html("Currently extracting <b>relevant keywords</b> for each ASIN.");
  total_ajax = asins.length;
  processed_ajax = 0;
  asins.map(function (e) {
    get_score(e);
  });
}

function extract_parents() {
  total_ajax = asins.length;
  processed_ajax = 0;
  asins.forEach(function (asin) {
    $.ajax(
      {
        type: "GET",
        url: "https://sellercentral.amazon.com/listing/varwiz/search?searchText=" + asin,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        asin: asin
      })
      .always(function (response) {

        if (response && response.uiMessageObjList && response.uiMessageObjList[0] && response.uiMessageObjList[0].type !== "undefined" && response.uiMessageObjList[0].type == "ERROR") {
          parents[asin] = this.asin;
        }
        else {
          if (response && response.variationDetailsList && response.variationDetailsList[0] && response.variationDetailsList[0].asin)
            parents[asin] = response.variationDetailsList[0].asin;
          else
            parents[asin] = asin;
        }
        processed_ajax++;
        if (total_ajax == processed_ajax) {
          step1();
        }
      });
  });
}

// function check_seller_central_origin() {
//   $("#screen1").hide();
//   $("#loading").show();
//   $.ajax(
//     {
//       url: "https://sellercentral.amazon.com/cm",
//       type: "GET",
//     })
//     .always(function (data) {
//       var regex = /customerId:[\s\:]+\"([A-Za-z0-9]+?)\"/gms;
//       var x2 = "";
//       var x1 = regex.exec(data);
//       if (x1 && x1.length > 1)
//         x2 = x1[1];
//       if (x2.length > 10 && x2.length < 20) {
//         mid = x2;
//         console.log("seller id", mid);
//         $("#screen1").show();
//         $("#loading").hide();
//         $("#status").html("");
//       }
//       else {
//         $("#status").html("<span style=\"color:#A00;\">Sorry, KIWI only works if you are logged in a Seller Central account with enabled advertising.</a>");
//         // setTimeout(check_seller_central, 3000);
//       }
//     })
//     .fail(function (data) {
//       $("#status").html("<span style=\"color:#A00;\">Sorry, KIWI only works if you are logged in your Seller Central account.</a>");
//       // setTimeout(check_seller_central, 3000);
//     });
// }

function check_entityid() {
  $("#screen1").show();
  $("#loading").hide();
  $("#status").html("");
  
  var entityid = 'ENTITY34ZJOI2MHPGP2';
  $("#entityid").val(entityid);
}

// function check_entityid_origin() {
//   $("#screen1").hide();
//   $("#loading").show();
//   $.ajax(
//     {
//       url: "https://sellercentral.amazon.com/cm",
//       type: "GET",
//     })
//     .always(function (data) {

//       var regex2 = /entityId:[\s\:]+\"([A-Za-z0-9]+?)\"/gms;
//       var y = regex2.exec(data);
//       if (y && y[1] && y[1].indexOf("ENTITY") == 0) {
//         entityid = y[1];
//         console.log("entity id", entityid);
//         $("#entityid").val(entityid);
//       }
//       else {
//         $("#status").html("<span style=\"color:#A00;\">Sorry, we couldn't connect to the advertising API.</a>");
//         $("#entityid").val("NOT FOUND");
//       }
//     });
// }

// function check_entityid() {
//   $("#status").html("");
//   var entityid = 'ENTITY34ZJOI2MHPGP2';
//   $("#entityid").val(entityid);
// }

// function check_license(license) {
//   $.get(check_url + license, function (data) {
//     if (data.indexOf("ok") !== -1) {
//       chrome.storage.local.set({ 'licenseok': license });
//       $("#licensediv").hide();
//       $("#status").html("Making sure you are logged in Seller Central");
//       check_seller_central();
//       check_entityid();
//     }
//     else {
//       $("#invalidlicense").show();
//     }
//   });
// }

$(document).ready(function () {

  $.xhrPool.abortAll = function () {
    $.each(this, function (i, jqXHR) {
      jqXHR.abort();
      $.xhrPool.splice(i, 1);
    });
  };

  $.ajaxSetup({
    beforeSend: function (jqXHR) {
      $.xhrPool.push(jqXHR);
    },
    complete: function (jqXHR) {
      var i = $.xhrPool.indexOf(jqXHR);   //  get index for current connection completed
      if (i > -1) $.xhrPool.splice(i, 1); //  removes from list by index
    }
  });

  $("#stopall").click(function () {
    console.log("stopping all connections");
    $.xhrPool.abortAll();
  });

  $("#maxconnections").val(maxconnections);
  $("#ajaxdelay").val(ajaxdelay);
  $("#entityid").val(entityid);
  $("#ajaxtimeout").val(ajaxtimeout);

  $("#donedownloading").click(function () {
    $("#loading").hide();
    $("#download-section").hide();
    $("#screen1").show();
  });

  window.setInterval(function () {
    $("#active").html($.active + " active HTTP connections");
  }, 1000);

  $("#status").html("Making sure you are logged in Seller Central");
  check_entityid();

  // chrome.storage.local.get('licenseok', function (result) {
  //   licenseok = result.licenseok;
  //   if (licenseok) {
  //     $("#status").html("Making sure you are logged in Seller Central");
  //     check_seller_central();
  //     check_entityid();
  //   }
  //   else {
  //     $("#licensediv").show();
  //   }
  // });

  // $("#checklicense").click(function () {
  //   var license = $("#license").val();
  //   check_license(license);
  // });

  $("#research").click(function () {
    maxconnections = $("#maxconnections").val();
    ajaxdelay = $("#ajaxdelay").val();
    entityid = $("#entityid").val();

    ajaxtimeout = $("#ajaxtimeout").val();
    $.ajaxSetup(
      {
        timeout: ajaxtimeout * 1000
      });

    suggested_keywords = [];
    suggested_keywords_two = [];
    asins = [];
    asin_details = {};
    all_seeds = [];
    all_keywords = [];

    processed_ajax = 0;
    total_ajax = 0;

    results = [];
    $("#step").html("");
    $("#status").html("");
    $("#active").html("");
    $("#processed-status").html("");
    volumes = [];
    complete_results = [];
    rankings = {};
    rankings2 = {};
    score_2 = {};
    allkws = [];
    exact_volumes = {};
    broad_volumes = {};
    sfr = {};
    choice = {};
    parents = {};
    counts = [];
    asins_found = [];
    kev1 = {};
    kev2 = {};

    $("#screen1").hide();
    $("#loading").show();

    var raw_asins = $("#asins").val().split(/[\,\n\s\t]+/);
    asins = raw_asins.map(function (e) {
      e = e.trim();
      e = e.replace(/[^0-9a-z]/gi, '');
      return e;
    });
    asins = asins.filter(function (e) {
      return e && e.length == 10;
    });
    extract_parents();
  });

});

