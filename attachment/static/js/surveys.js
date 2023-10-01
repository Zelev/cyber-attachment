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

$(document).ready(function () {
    const screens = $(".screen-container");
    const nextButtons = $('button.next-button');
    const prevButtons = $('button.previous-button');
    let currentScreenIndex = 0;
  
    function showScreen(index) {
        screens.addClass("hide");
        screens.removeClass("active");
        screens.eq(index).removeClass("hide");
        screens.eq(index).addClass("active");
        checkRecording();
        // scroll to top of page
        window.scrollTo(0, 0);
    }
  
    nextButtons.on("click", function () {
        if (currentScreenIndex < screens.length - 1) {

            currentScreenIndex++;
            showScreen(currentScreenIndex);
            if (currentScreenIndex !== 0) {
                $('h1.survey-title').addClass("hide");
            }
        }
    });
  
    prevButtons.on("click", function () {
        if (currentScreenIndex > 0) {
            currentScreenIndex--;
            showScreen(currentScreenIndex);
            if (currentScreenIndex === 0) {
                $('h1.survey-title').removeClass("hide");
            }
        }
    });

    showScreen(currentScreenIndex);
});
  
function checkRecording() {
    var recording = $('.screen-container.active audio');
    if (recording.length > 0) {
        $('.screen-container.active button.previous-button').addClass("hide");
        $('.screen-container.active button.next-button').addClass("hide");
        $('.screen-container.active button.submit-button').addClass("hide");
    }
}
  

const startButtons = $('button.startRecording');
const stopButtons = $('button.stopRecording');

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
        var audioPlayer = $('.screen-container.active audio');
        audioPlayer.attr('src', audioUrl);

        // get closer audioBlobInput
        var audioBlobInput = $('.screen-container.active input[id*="audioBlob"]');
        audioBlobInput.val(audioBlob);
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
            data => audioBlobInput.val(data.uuid)
        )
        .catch(error => console.error('Error:', error))
        .then(response => console.log('Success:', response));

    };
    
    startButtons.on("click", function () {
        var parent = $(this).closest('.question-container .recording-container');
        audioChunks = [];
        mediaRecorder.start();
        startButtons.attr("disabled", true);
        stopButtons.attr("disabled", false);
        parent.children('dotlottie-player').removeClass("hide");
        parent.children('audio').addClass("hide");
        setTimeout(function() {
            mediaRecorder.stop(parent);
            startButtons.attr("disabled", false);
            $('.screen-container.active dotlottie-player').addClass("hide");
            // next button
            if (checkHiddenElements()) {
                parent.children('audio').removeClass("hide");
                $('.screen-container.active button.next-button').removeClass("hide");
                $('.screen-container.active button.submit-button').removeClass("hide");
            }
        }
        , 60000); // Record for one minute
    });
    
    stopButtons.on("click", function () {
        mediaRecorder.stop();
        startButtons.disabled = false;
        stopButtons.disabled = true;
        $('.screen-container.active audio').removeClass("hide");
        $('.screen-container.active dotlottie-player').addClass("hide");
        // next button
        if (checkHiddenElements()) {
            $('.screen-container.active button.next-button').removeClass("hide");
            $('.screen-container.active button.submit-button').removeClass("hide");
        }
    });
})
.catch(error => console.error('Error accessing microphone:', error));
