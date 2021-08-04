/**
 * slideshow tool.
 * used for cycling through form sections.
 * recurring prompt.
 */

var activeSlide;
var slideElements;
var promptDisplayed = false; //avoid duplication of recurring prompt

//initial state
window.addEventListener('DOMContentLoaded', function () {

    //gather all elements of class .swap-out-item (aka Slides)
    slideElements = $('.swap-out-item');
    activeSlide = 0; //corresponds to slideElements[0]

    //deactivate unused option for initial state
    $('#prev').addClass('button-inactive');

    //all but slideElements[0] is visible.
    for (var i = 1; i < slideElements.length; i++) {
        slideElements[i].classList.toggle('section-inactive');
    }

    //listeners
    document.getElementById('prev').addEventListener('click', function () {
        changeSlide(-1);
    });
    document.getElementById('next').addEventListener('click', function () {
        changeSlide(1);
    });
});

//hide the recurring prompt section
function hideRecurringPrompt() {
    $('#recurring-prompt').addClass('recurring-prompt-hidden');
}

//display the recurring prompt section
function displayRecurringPrompt() {

    $('#recurring-prompt-yes').click(function () {
        $('#recurringFrequency').val('monthly');
        var recurringEvent = {
            data: {
                yesOrNo: true
            }
        };
        $('#once-button').removeClass('frequency-active');
        $('#monthly-button').addClass('frequency-active');

        updateMonthlyStatusMessage(recurringEvent);
        hideRecurringPrompt();
    });
    
    $('#recurring-prompt-no').click(function () {
        hideRecurringPrompt();
    });

    if (promptDisplayed == false) {
        //render the element, then
        $('#recurring-prompt').removeClass('recurring-prompt-hidden');
        promptDisplayed = true;
    }
}

//previous/next
function changeSlide(direction) {
    // direction: 1 for forward, -1 for backward
    if (activeSlide + direction < 0) {
        activeSlide = 0;
    } else if (activeSlide + direction > slideElements.length - 1) {
        activeSlide = slideElements.length - 1;
    } else {
        slideElements[activeSlide].classList.toggle('section-inactive');
        slideElements[activeSlide + direction].classList.toggle('section-inactive');
        activeSlide += direction;
    }

    if (activeSlide == 0) {
        //set previous button to gray-out
        $('#prev').addClass('button-inactive');
    } else if (activeSlide == slideElements.length - 1) { //-2 because of receipt page
        //set next button to gray-out
        $('#next').addClass('button-inactive');

        //say the line bart, say the recurring prompt!
        if ($('#recurringFrequency').val() == 'once' && parseFloat($('#paymentAmount').val()) > 99) {
            displayRecurringPrompt();
        }
    } else {
        //remove inactive state if present
        if ($('#prev').hasClass('button-inactive')) {
            $('#prev').removeClass('button-inactive');
        } else if ($('#next').hasClass('button-inactive')) {
            $('#next').removeClass('button-inactive');
        }
    }
}