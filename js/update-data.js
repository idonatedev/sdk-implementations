
/**
 * 
 * @param {u} dataIn html dom form data, json format
 * the function that fires when Donate Now is selected
 */

function updateData(dataIn) {

    updateGiftsAvailable(); //prevents manual radio button checking exploit

    theData.billingContact = dataIn.billingContact;
    theData.billingAddress = dataIn.billingAddress;
    theData.paymentAmount = dataIn.paymentAmount;
    //theData.currency = dataIn.currency; //currency currently defaults to USD
    theData.recurringFrequency = dataIn.recurringFrequency;
    theData.customerMeta = dataIn.customerMeta;

    //dpf amount is assigned in script id="dpf-helper"
    if ($('#dpf-checkbox').prop('checked') == true) {
        theData.donorPaidFeeAmount = dpfCalculatedPercentage;
    } else {
        theData.donorPaidFeeAmount = 0;
    }

    //tribute checkbox logic
    if ($('#tribute-checkbox').prop('checked') == true) {
        theData.tribute = dataIn.tribute;
    } else {
        //do nothing
    }

    //designation
    theData.designations = {
        id: dataIn.designations.id,
        amount: theData.paymentAmount
    };

    setButtonPressed(); //spinning animation while api is being called

    //send to the recaptcha callback
    grecaptcha.execute();
}
