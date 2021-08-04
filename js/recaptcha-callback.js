
function recaptchaCallback(recaptchaToken) {
    try {
        //begin process
        idonateClient.tokenizeSpreedlyCreditCard({
            contact: theData.billingContact,
            address: theData.billingAddress,
            card:{
                //infosec: source this data from the html forms themselves
                cardNumber: $('#cardData-cardNumber').val(),
                expirationMonth: $('#cardData-expirationMonth').val(),
                expirationYear: $('#cardData-ExpirationYear').val()
            }
        }).then((tokenResult) => {
            return idonateClient.createPaymentMethod({
                //RecaptchaSecuredRequest type
                recaptchaType: config.recaptchaType,
                recaptchaToken: recaptchaToken,

                //CreatePaymentMethodRequest type
                paymentGatewayId: config.paymentGatewayId,
                paymentMethodType: 'credit_card',
                paymentMethodToken: tokenResult,
                contact: theData.billingContact,
                address: theData.billingAddress
            })
        }).then((paymentMethodResult) => {
            var DOMgiftId;
            var giftOptOut;

            //determine if opted out
            if($('#gift-opt-out').prop('checked') == true){
                DOMgiftId = null;
                giftOptOut = true;
            }else{
                //get selected gift id
                //gift id is visible in the URL when viewing in GMS
                DOMgiftId = $('input[name="gift-option"]:checked').val();
                giftOptOut = false;
            }

            return idonateClient.createTransaction({
                //RecaptchaSecuredRequest type
                recaptchaType: config.recaptchaType,
                recaptchaToken: recaptchaToken,

                //CreateTransactionRequest type
                paymentGatewayId: config.paymentGatewayId,
                paymentMethodId: paymentMethodResult.paymentMethodId,
                recurringFrequency: theData.recurringFrequency,
                paymentAmount: theData.paymentAmount,
                donorPaidFeeAmount: theData
                .donorPaidFeeAmount, //optional field, null if not used
                designations: theData.designations,
                currency: theData.currency,
                billingContact: theData.billingContact,
                billingAddress: theData.billingAddress,
                customerMeta: { //this must be an object
                    yourFieldName: "yourValueName"
                }, 
                recaptchaToken: recaptchaToken,
                corporateMatchingId: -1, //required field, omitted on form

                //TODO: Assign Gift
                giftId: DOMgiftId, //null if opt-out
                giftSkipped: giftOptOut, //explicit logic
            })
        }).then((createTransactionResult) => {

            theData.truncatedCardData = "****" + $('#cardData-cardNumber').val().slice(12,
            16); //for use in receipt page
            
            //render receipt page
            renderReceiptElements(createTransactionResult);
        })
    } catch (e) {
        handleTheError(e);
    }
}
