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

var check_url = "https://ssfinder.com/check/?license=";
var madebylink = "https://sellerhacks.com";
var license = "123456789";

// function check_license(license) {
//   $.ajax({
//     url: check_url + license,
//     license: license,
//     success: function (data) {
//       if (data.indexOf("ok") !== -1) {
//         console.log("valid license");
//         chrome.storage.local.set({ 'license': this.license });
//         $("#licensediv").hide();
//         $("#screen1").show();
//       }
//       else {
//         $("#invalidlicense").show();
//       }
//     }
//   });
// }

function open_extension(id, license) {
  chrome.runtime.sendMessage(id, { openExtension: license },
    function (response) {
      if (response == undefined)
        alert("Extension Unavailable");
    });
}


$(document).ready(function () {

  // $("#rankscraper").click(function () {
  //   open_extension("hllkjcahamhmchkolednmieeifkimiif", license);
  // });

  // $("#sponsoredspy").click(function () {
  //   open_extension("lhmfjgblffbeplednjogkjmjoldlbaoj", license);
  // });

  // $("#keywordspy").click(function () {
  //   open_extension("heeipmpoidaibpidnglmdpkgkbbdfgih", license);
  // });

  // $("#sweespotfinder").click(function () {
  //   open_extension("ldhdaemcehnllbmelccmndkooaigbbia", license);
  // });

  // $("#roicalculator").click(function () {
  //   open_extension("annakeopimipeipaoehmdjjmhncpliin", license);
  // });

  $("#copydna").click(function () {
    open_extension("cpfcddemjgonmiokaieenfpcoepifabd", license);
  });

  // $("#relevancehack").click(function () {
  //   open_extension("ilhpmhgckfbfoinpenclbcbkkjoledhn", license);
  // });

  // $("#volumetrics").click(function () {
  //   open_extension("fndledkhmgipgfdmdjbepdbdgecekkhp", license);
  // });

  // $("#resultcount").click(function () {
  //   open_extension("ijjlmpjjhdpmljaoldhmpccdfemdfoda", license);
  // });

  // $("#reviewlookup").click(function () {
  //   open_extension("apflbegbdkgaphcefkgaahopndcgcbhl", license);
  // });

  // $("#asinscraper").click(function () {
  //   open_extension("beobbcenalldkidigcbmekhgaoccfkcm", license);
  // });



  // chrome.storage.local.get('license', function (result) {
  //   license = result.license;
  //   if (license) {
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




