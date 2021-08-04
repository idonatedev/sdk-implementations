/*
    set up html form, set up custom form logic, set up monthly/once logic
*/

//REMEMBER: Explicitly type the buttons as type="button", otherwise it will default to type="submit"

function updatePaymentAmount() { //used for updating real-time messages
    $('#text-gift-amount').text("$" + $('#paymentAmount').val());
    $('#amount-confirmation-text').text(" $" + $('#paymentAmount').val());
}

function updateMonthlyStatusMessage(event) { //used for updating real-time messages
    if (event.data.yesOrNo == true) {
        $('#monthly-or-no').text("monthly");
        $('#confirmation-monthly-or-no').text("monthly");
    } else if (event.data.yesOrNo == false) {
        $('#monthly-or-no').text("");
        $('#confirmation-monthly-or-no').text("");
    } else {
        $('#monthly-or-no').text("");
    }
}

document.addEventListener('DOMContentLoaded', function () {
    
    //wrap the form.  very important.
    wrapForm('transaction-data', updateData);

    document.getElementById('paymentAmount').value = donationAmounts.amount2;
    document.getElementById('custom-amount-text').value = donationAmounts
    .amount2; //set payment default to avoid errors at runtime

    $('.amount-option').click(updatePaymentAmount);
    $('#paymentAmount').blur(
    updatePaymentAmount); //used for custom amounts.  bug fix: 'input' listener was causing a ton of calls to the updater.

    $('#paymentAmount').on('input', updateDPFTotal); //used for dpf on custom amounts
    $('#amount5').off('click', updatePaymentAmount); //deactivate listener for custom

    //custom amount logic
    $('#amount5').on('click', function () {
        $('#custom-amount').removeClass('section-inactive');
    });
    $('#amount4').on('click', function () {
        $('#custom-amount').addClass('section-inactive');
    });
    $('#amount3').on('click', function () {
        $('#custom-amount').addClass('section-inactive');
    });
    $('#amount2').on('click', function () {
        $('#custom-amount').addClass('section-inactive');
    });
    $('#amount1').on('click', function () {
        $('#custom-amount').addClass('section-inactive');
    });

    $('#custom-amount-text').blur(function () {
        $('#paymentAmount').val($('#custom-amount-text').val());
        updatePaymentAmount();
        updateDPFTotal();
        updateGiftsAvailable();
    });

    $('#monthly-button').on('click', {
        yesOrNo: true
    }, updateMonthlyStatusMessage);
    $('#once-button').on('click', {
        yesOrNo: false
    }, updateMonthlyStatusMessage);

    updatePaymentAmount();

});
