
/*
    *   Sets initial form to invisible.
    *   Assigns data to receipt DOM elements.
    *   Sets receipt to visible.
*/

function renderReceiptElements(dataIn) {
    //accepts CreateTransactionResult object as argument.

    //get current date
    var date = new Date();
    var ddmmyyyy = [
        String(date.getMonth() + 1),
        String(date.getDate()),
        date.getFullYear()
    ];
    var dateText = ddmmyyyy[0] + '/' + ddmmyyyy[1] + '/' + ddmmyyyy[2];

    //name
    $('#receipt-name-text').text("" + dataIn._raw_response.donor.contact.firstname + " " + dataIn._raw_response
        .donor.contact.lastname);

    //date
    $('#receipt-date-text').text("" + dateText);

    //amount
    $('#receipt-gift-text').text("$" + dataIn._raw_response.transaction.total_value);

    //recurring
    $('#receipt-frequency-text').text("" + dataIn._raw_response.form_data.frequency);

    //transaction id
    // $('#receipt-transactionID-text').text("" + dataIn.transactionId);

    //truncated card
    $('#receipt-card-text').text("" + theData.truncatedCardData);

    //set initial form to invisible
    $('#transaction-data').addClass('form-complete');
    $('#transaction-data').css('display', 'none'); //for some reason, addClass doesn't do the trick, so...

    //set receipt to visible
    $('.receipt-container').addClass('receipt-active');
    //for some reason there must be explicit css here 
    $('.receipt-container').css('display', 'block');
    $('.receipt-container').css('opacity', '1');
}
