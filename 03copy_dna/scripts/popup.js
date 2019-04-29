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

var check_url = "https://copy-dna.com/check/?license=";
var madebylink = "https://itunes.apple.com/ca/podcast/elevated-ecommerce-podcast-ben-cummings-traian-turcu/id1066411346?";

var licenseok = 1;
var stopwords = [];
var max_words = 7;
var count_all = [];
var rating_choice = "all_star";

//sort object by values
function sortbyvalue(obj) {
  var sortable = [];
  for (var key in obj)
    if (obj.hasOwnProperty(key))
      sortable.push([key, obj[key]]);
  sortable.sort(function (a, b) {
    return b[1] - a[1];
  });
  return sortable;
}

//replace contracted forms
function replace_contracted(str) {
  var contractions = [['an\'t', 'an not'], ['n\'t', ' not'], ['\'ve', ' have'], ['\'m', ' am'], ['\'ll', ' will'], ['\'d', ' would'], ['\'ve', ' have'], ['\'re', ' are'], ['\'s', ' is']];
  contractions.forEach(function (el, i, arr) {
    var re = new RegExp(el[0], 'g');
    str = str.replace(re, el[1]);
  });
  return str;
}

function count_phrases(str, how_many) {
  var result = {};
  str = replace_contracted(str);
  var words = str.toLowerCase().split(/\W+/).filter(function (a) { return a.length >= 1 && stopwords.indexOf(a) == -1; });
  for (i = 0; i < words.length - how_many + 1; i++) {
    var phrase = "";
    for (j = 0; j < how_many; j++)
      phrase += words[i + j] + " ";
    result[phrase] = result[phrase] ? ++result[phrase] : 1;
  }
  result = sortbyvalue(result);
  return result;
}

var reviews = [];

function check_license(license) {
  $.get(check_url + license, function (data) {
    if (data.indexOf("ok") !== -1) {
      console.log("valid license");
      chrome.storage.local.set({ 'licenseok': data });
      $("#licensediv").hide();
      $("#screen1").show();
    }
    else {
      $("#invalidlicense").show();
    }
  });
}


function extracttext(data, asin) {
  var regexbody = /review-body.*?\">(.*?)<\/span/g;
  var match, matches = [];
  do {
    match = regexbody.exec(data);
    console.log(match)
    if (match !== null) {
      console.log(match[1])
      var review_body = match[1];
      reviews.push(review_body);
    }
  } while (match);
}


function extractdata(asin, step) {
  url = "https://www.amazon.com/hz/reviews-render/ajax/reviews/get/ref=cm_cr_getr_d_paging_btm_" + step;
  var data = {
    sortBy: "recent",
    reviewerType: "all_reviews",
    formatType: "",
    filterByStar: rating_choice,
    pageNumber: step,
    filterByKeyword: "",
    shouldAppend: "undefined",
    deviceType: "desktop",
    reftag: "cm_cr_getr_d_paging_btm_" + step,
    pageSize: "50",
    asin: asin,
    scope: "reviewsAjax3"
  };
  $.ajax({
    type: 'POST',
    url: url,
    data: data,
    beforeSend: function (data) { },
    success: function (data) { extracttext(data.responseText, asin); },
    error: function (data) { extracttext(data.responseText, asin); }
  });
}


function loopextract(asin, n) {
  requeststomake = Math.ceil(n / 50);
  for (var i = 1; i <= requeststomake; i++) {
    extractdata(asin, i);
  }
}

var Base64 = { _keyStr: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=", encode: function (e) { var t = ""; var n, r, i, s, o, u, a; var f = 0; e = Base64._utf8_encode(e); while (f < e.length) { n = e.charCodeAt(f++); r = e.charCodeAt(f++); i = e.charCodeAt(f++); s = n >> 2; o = (n & 3) << 4 | r >> 4; u = (r & 15) << 2 | i >> 6; a = i & 63; if (isNaN(r)) { u = a = 64 } else if (isNaN(i)) { a = 64 } t = t + this._keyStr.charAt(s) + this._keyStr.charAt(o) + this._keyStr.charAt(u) + this._keyStr.charAt(a) } return t }, decode: function (e) { var t = ""; var n, r, i; var s, o, u, a; var f = 0; e = e.replace(/[^A-Za-z0-9+/=]/g, ""); while (f < e.length) { s = this._keyStr.indexOf(e.charAt(f++)); o = this._keyStr.indexOf(e.charAt(f++)); u = this._keyStr.indexOf(e.charAt(f++)); a = this._keyStr.indexOf(e.charAt(f++)); n = s << 2 | o >> 4; r = (o & 15) << 4 | u >> 2; i = (u & 3) << 6 | a; t = t + String.fromCharCode(n); if (u != 64) { t = t + String.fromCharCode(r) } if (a != 64) { t = t + String.fromCharCode(i) } } t = Base64._utf8_decode(t); return t }, _utf8_encode: function (e) { e = e.replace(/rn/g, "n"); var t = ""; for (var n = 0; n < e.length; n++) { var r = e.charCodeAt(n); if (r < 128) { t += String.fromCharCode(r) } else if (r > 127 && r < 2048) { t += String.fromCharCode(r >> 6 | 192); t += String.fromCharCode(r & 63 | 128) } else { t += String.fromCharCode(r >> 12 | 224); t += String.fromCharCode(r >> 6 & 63 | 128); t += String.fromCharCode(r & 63 | 128) } } return t }, _utf8_decode: function (e) { var t = ""; var n = 0; var r = c1 = c2 = 0; while (n < e.length) { r = e.charCodeAt(n); if (r < 128) { t += String.fromCharCode(r); n++ } else if (r > 191 && r < 224) { c2 = e.charCodeAt(n + 1); t += String.fromCharCode((r & 31) << 6 | c2 & 63); n += 2 } else { c2 = e.charCodeAt(n + 1); c3 = e.charCodeAt(n + 2); t += String.fromCharCode((r & 15) << 12 | (c2 & 63) << 6 | c3 & 63); n += 3 } } return t } }

function count_reviews(asin) {
  var b64 = Base64.encode(asin);
  $.get("https://www.amazon.com/gp/aw/ybh/handlers/rvi-faceouts.html?asins=" + b64 + "&types=CustomerViewedItems&positions=1&deviceType=desktop", function (data, status) {
    data = JSON.stringify(data);

    var n = 0;
    var regex = /asin-reviews\\\">\((.+)?\)/g;
    var match = [];
    if ((match = regex.exec(data)) !== null)
      n = match[1];
    console.log("Number of reviews: " + n);
    loopextract(asin, n);
  });

}


function exportToCsv(filename, data) {
  var blob = new Blob([data], { type: 'text/csv;charset=utf-8;' });
  if (navigator.msSaveBlob) { // IE 10+
    navigator.msSaveBlob(blob, filename);
  }
  else {
    var link = document.createElement("a");
    if (link.download !== undefined) {
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


function striphtml(html) {
  var tmp = document.createElement("DIV");
  tmp.innerHTML = html;
  return tmp.textContent || tmp.innerText || "";
}



function max_array_length(arrays) {
  var max = 0;
  for (var i = 0; i < arrays.length; i++)
    if (arrays[i].length > max)
      max = arrays[i].length;
  return max;
}

$(document).ready(function () {

  $("#ignore").click(function () {

    if ($(this).prop("checked"))
      $("#stopwords").show();
    else
      $("#stopwords").hide();

  });


  var default_stopwords = ["a", "about", "above", "after", "again", "against", "all", "am", "an", "and", "any", "are", "as", "at", "be", "because", "been", "before", "being", "below", "between", "both", "but", "by", "could", "did", "do", "does", "doing", "down", "during", "each", "few", "for", "from", "further", "had", "has", "have", "having", "he", "he'd", "he'll", "he's", "her", "here", "here's", "hers", "herself", "him", "himself", "his", "how", "how's", "i", "i'd", "i'll", "i'm", "i've", "if", "in", "into", "is", "it", "it's", "its", "itself", "let's", "me", "more", "most", "my", "myself", "nor", "of", "on", "once", "only", "or", "other", "ought", "our", "ours", "ourselves", "out", "over", "own", "same", "she", "she'd", "she'll", "she's", "should", "so", "some", "such", "than", "that", "that's", "the", "their", "theirs", "them", "themselves", "then", "there", "there's", "these", "they", "they'd", "they'll", "they're", "they've", "this", "those", "through", "to", "too", "under", "until", "up", "very", "was", "we", "we'd", "we'll", "we're", "we've", "were", "what", "what's", "when", "when's", "where", "where's", "which", "while", "who", "who's", "whom", "why", "why's", "with", "would", "you", "you'd", "you'll", "you're", "you've", "your", "yours", "yourself", "yourselves"];;

  $("#stopwords").val(default_stopwords.join(" "));


  $(document).ajaxStop(function () {
    if (licenseok)
      setTimeout(function () {
        console.log(reviews.length);
        var all_reviews = reviews.join();
        all_reviews = striphtml(all_reviews);
        for (var j = 0; j < max_words; j++) {
          var k = j + 1;
          count_all[j] = count_phrases(all_reviews, k);
          console.log("there are " + count_all[j].length + " phrases with " + k + " words");
        }
        var n = max_array_length(count_all);

        var data = "";
        for (var j = 0; j < max_words - 1; j++) {
          var k = j + 1;
          data += k + "-Word Phrase," + k + "-Word Count,";
        }
        data += max_words + "-Word Phrase," + max_words + "-Word Count\n";

        for (var i = 0; i < n; i++) {
          for (var j = 0; j < max_words; j++) {
            if (i < count_all[j].length) {
              data += count_all[j][i][0] + "," + count_all[j][i][1] + ",";
            }
            else {
              data += ",,";
            }
          }
          data += "\n";

        }
        //////
        var asins = $("#asins").val().split("\n");
        var filename = asins.join();
        $("#screen1").show();
        $("#loading").hide();
        exportToCsv(filename + ".csv", data);
        //////
        console.log("done");
      }, 3000);

  });



  $("#analyze").click(function () {

    $("#screen1").hide();
    $("#loading").show();

    reviews = [];
    count_all = [];

    var asins = $("#asins").val().split("\n");
    if ($("#ignore").prop("checked"))
      stopwords = $("#stopwords").val().split(" ");
    else
      stopwords = [];
    max_words = $("#words").val();
    rating_choice = $("#rating_choice").val();

    for (var i = 0; i < asins.length; i++) {
      var asin = asins[i].replace(/\s/g, '');
      count_reviews(asin);
    }

  });





  // chrome.storage.local.get('licenseok', function (result) {
  //   licenseok = result.licenseok;
  //   if (licenseok) {
  //     $("#screen1").show();
  //   }
  //   else {
  //     $("#licensediv").show();
  //   }
  // });

  // $("#checklicense").click(function () {
  //   var license = $("#license").val();
  //   check_license(license);
  // });

  $("#shlink1").click(function () {
    console.log("shlink");
    var newURL = madebylink;
    chrome.tabs.create({ url: newURL });
  });

  $("#shlink2").click(function () {
    console.log("shlink");
    var newURL = madebylink;
    chrome.tabs.create({ url: newURL });
  });

});




