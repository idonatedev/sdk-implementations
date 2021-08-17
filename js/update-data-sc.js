
/**
 * 
 * @param {u} dataIn html dom form data, json format
 * the function that fires when Donate Now is selected
 */

function updateData(dataIn) {
    console.log('updating data...');

    theData.billingContact = dataIn.billingContact;
    theData.billingAddress = dataIn.billingAddress;
    theData.paymentAmount = parseFloat($('#total-text').html());
    theData.recurringFrequency = 'once';
    theData.customerMeta = dataIn.customerMeta;

    //designation array
    theData.designations = createDesignationArray();

    console.log('data updated.  -> grecaptcha.execute()');

    //send to the recaptcha callback
    grecaptcha.execute();
}