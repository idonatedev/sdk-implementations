//bind toggle action to checkbox
//calculate dpf amount
var dpfPercentage = 0.08; //set to your dpf percentage
var dpfCalculatedPercentage;
var newTotal;

//calculate total
function updateDPFTotal() {
    //
    dpfCalculatedPercentage = parseFloat(dpfPercentage * parseFloat(
        $('#paymentAmount').val())).toFixed(2);
    $('#dpf-amount').text("$" + dpfCalculatedPercentage);

    //trying to get that dpf bug fixed
    if ($('#dpf-checkbox').prop('checked')) {
        var activeAmount = parseFloat($('.amount-active')[0].innerHTML.slice(1));
        $('#paymentAmount').val(
            activeAmount + parseFloat(dpfCalculatedPercentage)
        );
    }
}

//set up dpf checkbox
window.addEventListener('DOMContentLoaded', function () {
    updateDPFTotal();

    $('#dpf-checkbox').click(function () {
        if ($('#dpf-checkbox').prop('checked')) {
            theData.donorPaidFeeAmount = dpfCalculatedPercentage;
            $('#paymentAmount').val(
                (parseFloat($('#custom-amount-text').val()) + parseFloat(
                    dpfCalculatedPercentage)).toFixed(2)
            );
            updatePaymentAmount();
        } else {
            theData.donorPaidFeeAmount = null;
            var originalAmount = $('.amount-active')[0].innerHTML.slice(
            1); //this solved the dpf bug for some reason
            $('#paymentAmount').val(
                $('#custom-amount-text').val()
            );
            updatePaymentAmount();
        }
    });
});
