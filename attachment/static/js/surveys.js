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

const startButton = document.getElementById('startButton');
const stopButton = document.getElementById('stopButton');
const audioPlayer = document.getElementById('audioPlayer');
const audioBlobInput = document.querySelectorAll('input[id*="audioBlob"]')[0];

let mediaRecorder;
let audioChunks = [];

navigator.mediaDevices.getUserMedia({ audio: true })
.then(stream => {
    mediaRecorder = new MediaRecorder(stream);
    
    mediaRecorder.ondataavailable = event => {
        if (event.data.size > 0) {
            audioChunks.push(event.data);
        }
    };
    
    mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/wav; codecs=0' });
        const audioUrl = URL.createObjectURL(audioBlob);
        audioPlayer.src = audioUrl;
        audioBlobInput.value = audioBlob;
        var formData = new FormData();
        formData.append('audioBlob', audioBlob);
        formData.append('csrfmiddlewaretoken', document.getElementsByName('csrfmiddlewaretoken')[0].value);
        formData.append('language', document.querySelector('input[name="language"]').value);
        fetch(`${window.location.pathname}recording/`, {
            method: 'POST',
            body: formData
        }) 
        // get the uuid response from the server and print in the console
        .then(
            response => response.json()
        )
        .then(
            data => audioBlobInput.value = data.uuid
        )
        .catch(error => console.error('Error:', error))
        .then(response => console.log('Success:', response));

    };
    
    startButton.addEventListener('click', () => {
        audioChunks = [];
        mediaRecorder.start();
        startButton.disabled = true;
        stopButton.disabled = false;
        setTimeout(function() {
            mediaRecorder.stop();
            startButton.disabled = false;
        }, 60000); // Record for one minute
        

        
    });
    
    stopButton.addEventListener('click', () => {
        mediaRecorder.stop();
        startButton.disabled = false;
        stopButton.disabled = true;
    });
})
.catch(error => console.error('Error accessing microphone:', error));

$(document).ready(function () {
    const screens = $(".screen-container");
    const nextButtons = $('button.next-button');
    const prevButtons = $('button.previous-button');
    let currentScreenIndex = 0;
  
    function showScreen(index) {
      screens.addClass("hide");
      screens.eq(index).removeClass("hide");
    }
  
    nextButtons.on("click", function () {
      if (currentScreenIndex < screens.length - 1) {
        currentScreenIndex++;
        showScreen(currentScreenIndex);
      }
    });
  
    prevButtons.on("click", function () {
      if (currentScreenIndex > 0) {
        currentScreenIndex--;
        showScreen(currentScreenIndex);
      }
    });

    showScreen(currentScreenIndex);
});
  
  
  
  
  
