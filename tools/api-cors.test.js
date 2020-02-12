var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;


var createCORSRequest = function(method, url) {
  var xhr = new XMLHttpRequest();
  if ("withCredentials" in xhr) {
    // Most browsers.
    xhr.open(method, url, true);
  } else if (typeof XDomainRequest != "undefined") {
    // IE8 & IE9
    xhr = new XDomainRequest();
    xhr.open(method, url);
  } else {
    // CORS not supported.
    xhr = null;
  }
  return xhr;
};

var url = 'http://127.0.0.1:3000/auth/login';
var method = 'POST';
var xhr = createCORSRequest(method, url);

xhr.onload = function() {
  // Success code goes here.
  console.log('SUCCESS');
};

xhr.onerror = function() {
  // Error code goes here.
  console.log('FAIL');
};

xhr.withCredentials = true;
xhr.send();