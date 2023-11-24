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
    var hiddenDivs = Array.from(hiddenElements).map(function (element) {
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
    var hiddenDivs = Array.from(hiddenElements).map(function (element) {
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

let missing_count = 0;
let first_missing = null;

function check_exclusion(element) {
    var value = $(element).val().trim();
    var question = $(element).closest('.question-container');
    if (question.attr("exclusion-value") === undefined || question.attr("exclusion-value") === "" || question.attr("exclusion-value") === null) {
        return false;
    }
    var exclusion_value = JSON.parse(question.attr("exclusion-value"))
    if (
        (exclusion_value !== undefined || exclusion_value !== "" || exclusion_value !== null)
    ) {
        var excluded = exclusion_value.includes(value);
        var selected = false;
        switch ($(element).attr('type')) {
            case 'radio':
                if($(element).is(':checked')) {
                    selected = true;
                }
                break;

            default:
                break;
        }
        return excluded && selected;
    }
    return false;
}

function check_radio_input(element) {
    var radio_name = $(element).attr('name');
    var radio_checked = $('input[name="' + radio_name + '"]:checked');
    if (radio_checked.length <= 0) {
        $(element).closest('.question-container').addClass('alert');
        missing_count++;
        if (first_missing === null) {
            first_missing = $(element).closest('.question-container');
        }
    }
}

function check_hidden_input(element) {
    var value = $(element).val().trim();
    if (value === "" || value === null || value === undefined) {
        $(element).closest('.question-container').addClass('alert');
        missing_count++;
        if (first_missing === null) {
            first_missing = $(element).closest('.question-container');
        }
    }
}

function check_text_input(element) {
    var value = $(element).val().trim();
    if (value === "" || value === null || value === undefined) {
        $(element).closest('.question-container').addClass('alert');
        missing_count++;
        if (first_missing === null) {
            first_missing = $(element).closest('.question-container');
        }
    }
}

function check_select_input(element) {
}

function check_checkbox_input(element) {
    var checkbox_name = $(element).attr('name');
    var checkbox_checked = $('input[name="' + checkbox_name + '"]:checked');
    if (checkbox_checked.length <= 0) {
        $(element).closest('.question-container').addClass('alert');
        missing_count++;
        if (first_missing === null) {
            first_missing = $(element).closest('.question-container');
        }
    }
}

function check_textarea_input(element) {
    var value = $(element).val().trim();
    if (value === "" || value === null || value === undefined) {
        $(element).closest('.question-container').addClass('alert');
        missing_count++;
        if (first_missing === null) {
            first_missing = $(element).closest('.question-container');
        }
    }
}

function check_number_input(element) {
    var value = $(element).val().trim();
    // Check that value contains only numbers
    var regex = /^\d+$/;
    if (
        (value === "" || value === null || value === undefined) &&
        !regex.test(value)
    ) {
        $(element).closest('.question-container').addClass('alert');
        missing_count++;
        if (first_missing === null) {
            first_missing = $(element).closest('.question-container');
        }
    }
}


function dataValidation(current_screen) {
    missing_count = 0;
    first_missing = null;
    //Check that all questions in screen have been
    current_screen.find('input, textarea, select').each(function () {
        // if it is a radio button check if there's any option checked
        switch ($(this).attr('type')) {
            case 'radio':
                check_radio_input(this);
                break;

            case 'number':
                check_number_input(this);
                break;

            case 'text':
                check_text_input(this);
                break;

            case 'hidden':
                check_hidden_input(this);
                break

            default:
                check_text_input(this);
                break;
        }
        if (missing_count > 0) {
            return false;
        }
        if (check_exclusion(this)) {
            // submit form
            // add 'excluded' = true to the form
            $('form').append('<input type="hidden" name="excluded" value="true">');
            $('form').submit();
            return false;
        }
    });
    if (missing_count > 0) {
        first_missing.get(0).scrollIntoView({ behavior: 'smooth' });
        return false;
    }
    return true;
}


$(document).ready(function () {
    const screens = $(".screen-container");
    const nextButtons = $('button.next-button');
    const prevButtons = $('button.previous-button');

    let currentScreenIndex = 0;

    function showScreen(index) {
        screens.addClass("hide");
        screens.removeClass("active");
        screens.css("opacity", 0)
        var active_screen = screens.eq(index);
        active_screen.removeClass("hide");
        // fade in
        active_screen.animate(
            { opacity: 1 },
            { duration: 500, queue: false }
        );
        active_screen.addClass("active");
        checkRecording();
        // scroll to top of page
        window.scrollTo(0, 0);
    }

    nextButtons.on("click", function () {
        if (currentScreenIndex < screens.length - 1) {
            if (!dataValidation(screens.eq(currentScreenIndex))) {
                return false;
            }
            currentScreenIndex++;
            showScreen(currentScreenIndex);
            if (currentScreenIndex !== 0) {
                $('h1.survey-title').addClass("hide");
            }
            if ($('.screen-container.active .recording-container').length > 0) {
                $('.screen-container.active button.next-button').addClass("hide");
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

    // validate form before submitting
    $('form').on("submit", function (event) {
        if(!dataValidation(screens.eq(currentScreenIndex))) {
            event.preventDefault();
        }
    });

    // add a listener to all inputs to remove the alert class when the user starts typing
    $('input, textarea, select').on("input", function () {
        $(this).closest('.question-container').removeClass('alert');
    });
});

function checkRecording() {
    var recording = $('.screen-container.active audio');
    if (recording.length > 0) {
        $('.screen-container.active button.previous-button').addClass("hide");
        $('.screen-container.active button.next-button').addClass("hide");
        $('.screen-container.active button.submit-button').addClass("hide");
    }
    var audio_value = $('.screen-container.active input[id*="audioBlob"]').val();
    if (audio_value !== "" || audio_value !== null || audio_value !== undefined) {
        $('.screen-container.active button.next-button').removeClass("hide");
        $('.screen-container.active button.submit-button').removeClass("hide");
    }
}


const startButtons = $('button.startRecording');
const stopButtons = $('button.stopRecording');

let mediaRecorder;
let audioChunks = [];

navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => {
    var stopped = false;
    mediaRecorder = new MediaRecorder(stream);

    mediaRecorder.ondataavailable = event => {
        if (event.data.size > 0) {
            audioChunks.push(event.data);
        }
    };

    mediaRecorder.onstop = () => {
        stopped = true;
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
        stopped = false;
        var parent = $(this).closest('.question-container .recording-container');
        var active_screen = $(this).closest('.screen-container');
        $(this).closest('.question-container').removeClass('alert');
        audioChunks = [];
        mediaRecorder.start();
        startButtons.attr("disabled", true);
        stopButtons.attr("disabled", false);
        active_screen.find('button.startRecording').addClass('hide');
        parent.find('dotlottie-player').removeClass("hide");
        parent.find('audio').addClass("hide");
        setTimeout(function () {
            active_screen.find('button.stopRecording').removeClass('hide');
            active_screen.find('button.startRecording').addClass('hide');
        }, 20000);
        setTimeout(function () {
            if (stopped) {
                return;
            }
            mediaRecorder.stop(parent);
            startButtons.attr("disabled", false);
            active_screen.find('dotlottie-player').addClass("hide");
            active_screen.find('button.stopRecording').addClass('hide');
            // next button
            if (checkHiddenElements()) {
                parent.find('audio').removeClass("hide");
                active_screen.find('button.next-button').removeClass("hide");
                active_screen.find('button.submit-button').removeClass("hide");
            }
        }, 60000); // Record for one minute
    });

    stopButtons.on("click", function () {
        var active_screen = $(this).closest('.screen-container');
        mediaRecorder.stop();
        startButtons.attr("disabled", false);
        stopButtons.attr("disabled", true);
        active_screen.find('audio').removeClass("hide");
        active_screen.find('dotlottie-player').addClass("hide");
        active_screen.find('button.stopRecording').addClass('hide');
        // next button
        if (checkHiddenElements()) {
            active_screen.find('button.next-button').removeClass("hide");
            active_screen.find('button.submit-button').removeClass("hide");
        }
    });
})
.catch(error => console.error('Error accessing microphone:', error));
