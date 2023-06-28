// Check if the form includes any hidden elements with the class "hidden"

function checkHiddenElements() {
    var hiddenElements = document.getElementsByClassName("hide");
    if (hiddenElements.length > 0) {
        return true;
    } else {
        return false;
    }
}

function checkGADS() {
    var hiddenElements = document.getElementsByClassName("hide");
    for (var i = 0; i < hiddenElements.length; i++) {
        if (hiddenElements[i].name.includes("GADS")) {
            return true;
        }
    }
}

function showGADS() {
    var hiddenElements = document.querySelectorAll('div.hiddable input[name*="GADS"]');
    var hiddenDivs = Array.from(hiddenElements).map(function(element) {
        return element.closest(".hiddable");
      });
    var gads_inputs = document.querySelectorAll('[name*="GADS"]:checked');
    var gads_values = Array.from(gads_inputs).map(input => input.value);
    const countYes = gads_values.filter(value => value === "yes").length;
    if (countYes >= 2) {
        for (var i = 0; i < hiddenElements.length; i++) {
            hiddenDivs[i].classList.remove("hide");
        }
    } else {
        hideGADS();
    }
}

function hideGADS() {
    var hiddenElements = document.querySelectorAll('div.hiddable input[name*="GADS"]');
    var hiddenDivs = Array.from(hiddenElements).map(function(element) {
        return element.closest(".hiddable");
      });
    for (var i = 0; i < hiddenElements.length; i++) {
        hiddenDivs[i].classList.add("hide");
        hiddenElements[i].checked = false;
    }
}

var gadsElements = document.querySelectorAll('input[name*="GADS"]');

for (var i = 0; i < gadsElements.length; i++) {
  gadsElements[i].addEventListener("click", showGADS);
}