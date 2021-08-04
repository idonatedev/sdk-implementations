//sets up user interface.

function setVal(element, value) {
    $("#" + element).val("" + value);
}

function toggleClass(element, cl) {
    $("#" + element).toggleClass(cl);
}

function clearClasses(clid, clcl) {
    $("." + clid).removeClass(clcl);
}

//bind events to the buttons
document.addEventListener('DOMContentLoaded', function () {

    //bind the click events to custom amounts
    $('#amount1').click(function () {
        clearClasses('amount-option', 'amount-active');
        setVal('paymentAmount', donationAmounts.amount1);
        setVal('custom-amount-text', donationAmounts
            .amount1); //these two keep running into each other
        toggleClass('amount1', 'amount-active');
        $('#gift-container').addClass('field-inactive');
        updateDPFTotal();
        updateGiftsAvailable();
    });
    $('#amount2').click(function () {
        clearClasses('amount-option', 'amount-active');
        setVal('paymentAmount', donationAmounts.amount2);
        setVal('custom-amount-text', donationAmounts.amount2);
        toggleClass('amount2', 'amount-active');
        $('#gift-container').addClass('field-inactive');
        updateDPFTotal();
        updateGiftsAvailable();
    });
    $('#amount3').click(function () {
        clearClasses('amount-option', 'amount-active');
        setVal('paymentAmount', donationAmounts.amount3);
        setVal('custom-amount-text', donationAmounts.amount3);
        toggleClass('amount3', 'amount-active');
        $('#gift-container').addClass('field-inactive');
        updateDPFTotal();
        updateGiftsAvailable();
    });
    $('#amount4').click(function () {
        clearClasses('amount-option', 'amount-active');
        setVal('paymentAmount', donationAmounts.amount4);
        setVal('custom-amount-text', donationAmounts.amount4);
        toggleClass('amount4', 'amount-active');
        $('#gift-container').addClass('field-inactive');
        updateDPFTotal();
        updateGiftsAvailable();
    });
    //custom amount section
    $('#amount5').click(function () {
        clearClasses('amount-option', 'amount-active');
        setVal('paymentAmount', "20");
        toggleClass('amount5', 'amount-active');
        $('#gift-container').removeClass('field-inactive');
        updateDPFTotal();
    });

    //bind the events to the frequency buttons
    $('#once-button').click(function () {
        clearClasses('frequency-option-button', 'frequency-active');
        setVal('recurringFrequency', 'once');
        toggleClass('once-button', 'frequency-active');
        theData.recurringFrequency =
            'once'; //redundant, as fields are passed to theData at run-time
    });
    $('#monthly-button').click(function () {
        clearClasses('frequency-option-button', 'frequency-active');
        setVal('recurringFrequency', 'monthly');
        toggleClass('monthly-button', 'frequency-active');
        theData.recurringFrequency =
            'monthly'; //redundant, as fields are passed to theData at run-time
    });

    //set initial gift amount
    $('#text-gift-amount').text("$" + $('#paymentAmount').val());
    $('#amount-confirmation-text').text("$" + $('#paymentAmount').val());

    //tribute section hide/show
    $('#tribute-checkbox').on('change', function () {
        $('#tribute-form').toggleClass('tribute-hidden');
    });
});
