//validate phone number
function validatePhoneNumber(numberIn) {
    var phoneRegex = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;

    if (numberIn.match(phoneRegex)) {
        return true;
    } else {
        return false;
    }
}

//validate email address
function validateEmail(email) {
    const re =
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

//validate card number
function validateCreditCardNumber(numberIn) {

    var ccNum = numberIn;
    var visaRegEx = /^(?:4[0-9]{12}(?:[0-9]{3})?)$/;
    var mastercardRegEx = /^(?:5[1-5][0-9]{14})$/;
    var amexpRegEx = /^(?:3[47][0-9]{13})$/;
    var discovRegEx = /^(?:6(?:011|5[0-9][0-9])[0-9]{12})$/;
    var isValid = false;

    if (visaRegEx.test(ccNum)) {
        isValid = true;
    } else if (mastercardRegEx.test(ccNum)) {
        isValid = true;
    } else if (amexpRegEx.test(ccNum)) {
        isValid = true;
    } else if (discovRegEx.test(ccNum)) {
        isValid = true;
    }

    if (isValid) {
        return true;
    } else {
        return false;
    }
}

//validate payment amount
function validateCustomAmount(valIn) {
    return /^-?\d*\.?\d*$/.test(valIn);
}

function validateZip(valIn) {
    return /\b\d{5}\b/g.test(valIn);
}

function checkIfBlank(valIn) {
    if (valIn === "" && valIn != undefined) {
        //yes is blank
        return true;
    } else {
        //no not blank
        return false;
    }
}

function validateAllFields() {
    var allValid = true;
    var elements = $('.required-field');
    var invalids = $('.invalid-data-input');

    //check for blanks
    for (var i = 0; i < elements.length; i++) {
        if (elements[i].value == "") { //TODO: checkIfBlank redundant
            allValid = false;
        }
    }

    //check for invalids
    if (invalids.length > 0) {
        allValid = false;
    }

    return allValid;
}

//individual field listeners
window.addEventListener('DOMContentLoaded', function () {
    /*
        *  VALIDATOR FOR DONATION BUTTON 
    */
    $('.required-field').focusout(function () {
        //validate all fields!
        if (validateAllFields() == true) {
            //we're good.
            $('#the-button').removeClass('donation-button-inactive');
        } else {
            //nope.
            $('#the-button').addClass('donation-button-inactive');
        }
    });

    /*
            Redundant focus checker
    */
    $('.required-field').focusin(function () {
        //validate all fields!
        if (validateAllFields() == true) {
            //we're good.
            $('#the-button').removeClass('donation-button-inactive');
        } else {
            //nope.
            $('#the-button').addClass('donation-button-inactive');
        }
    });


    /*
        *   INDIVIDUAL VALIDATORS
    */

    $('#billingAddress-city').blur(function () {
        if (checkIfBlank($('#billingAddress-city').val()) == true) {
            //blank value, invalid
            $('#billingAddress-city').addClass('invalid-data-input');
        } else {
            //not invalid
            $('#billingAddress-city').removeClass('invalid-data-input');
        }
    });

    $('#billingAddress-country').blur(function () {
        if (checkIfBlank($('#billingAddress-country').val()) == true) {
            //blank value, invalid
            $('#billingAddress-country').addClass('invalid-data-input');
        } else {
            //not invalid
            $('#billingAddress-country').removeClass('invalid-data-input');
        }
    });

    $('#billingAddress-address1').blur(function () {
        if (checkIfBlank($('#billingAddress-address1').val()) == true) {
            //blank value, invalid
            $('#billingAddress-address1').addClass('invalid-data-input');
        } else {
            //not invalid
            $('#billingAddress-address1').removeClass('invalid-data-input');
        }
    });

    $('#billingContact-lastName').blur(function () {
        if (checkIfBlank($('#billingContact-lastName').val()) == true) {
            //blank value, invalid
            $('#billingContact-lastName').addClass('invalid-data-input');
        } else {
            //not invalid
            $('#billingContact-lastName').removeClass('invalid-data-input');
        }
    });

    $('#billingContact-firstName').blur(function () {
        if (checkIfBlank($('#billingContact-firstName').val()) == true) {
            //blank value, invalid
            $('#billingContact-firstName').addClass('invalid-data-input');
        } else {
            //not invalid
            $('#billingContact-firstName').removeClass('invalid-data-input');
        }
    });

    $('#billingAddress-zip').blur(function () {
        if (validateZip($('#billingAddress-zip').val()) == true) {
            //valid
            console.log('zip code valid: ', $('#billingAddress-zip').val());
            $('#billingAddress-zip').removeClass('invalid-data-input');
        } else {
            //invalid
            console.log('zip code invalid: ', $('#billingAddress-zip').val());
            $('#billingAddress-zip').addClass('invalid-data-input');
        }
    });

    $('#paymentAmount').blur(function () {
        console.log('validating payment amount');
        if (validateCustomAmount($('#paymentAmount').val()) ===
            true /* //TODO 7-9 || checkIfBlank($('#paymentAmount').val())== false*/ ) {
            //valid
            console.log('valid payment amount: ', $('#paymentAmount').val());
            $('#paymentAmount').removeClass('invalid-data-input');
        } else {
            //the opposite of valid
            console.log('invalid payment amount: ', $('#paymentAmount').val());
            $('#paymentAmount').addClass('invalid-data-input');
        }
    });

    $('#billingContact-primaryPhone').blur(function () {
        console.log('validating phone number');
        if (validatePhoneNumber($('#billingContact-primaryPhone').val()) === true) {
            //all good buddy
            $('#billingContact-primaryPhone').removeClass('invalid-data-input');
        } else {
            //not all good.  put a red border around it and set valid to false.
            $('#billingContact-primaryPhone').addClass('invalid-data-input');
        }
    });

    $('#billingContact-email').blur(function () {
        console.log('validating email.');
        if (validateEmail($('#billingContact-email').val()) === true) {
            //yep, we good
            $('#billingContact-email').removeClass('invalid-data-input');
        } else {
            $('#billingContact-email').addClass('invalid-data-input');
        }
    });

    $('#cardData-cardNumber').blur(function () {
        console.log('validating credit card.');
        if (validateCreditCardNumber($('#cardData-cardNumber').val()) === true) {
            $('#cardData-cardNumber').removeClass('invalid-data-input');

        } else {
            $('#cardData-cardNumber').addClass('invalid-data-input');

        }
    });
});