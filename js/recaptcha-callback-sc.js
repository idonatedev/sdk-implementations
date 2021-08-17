/* recaptcha callback repurposed for the shopping cart experience */

function recaptchaCallback(recaptchaToken) {
    try {
        //begin process
        console.log('beginning recaptcha callback function');

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

            return idonateClient.createTransaction({
                //RecaptchaSecuredRequest type
                recaptchaType: config.recaptchaType,
                recaptchaToken: recaptchaToken,

                //CreateTransactionRequest type
                paymentGatewayId: config.paymentGatewayId,
                paymentMethodId: paymentMethodResult.paymentMethodId,
                recurringFrequency: theData.recurringFrequency,
                paymentAmount: theData.paymentAmount,
                donorPaidFeeAmount: theData.donorPaidFeeAmount, //optional field, null if not used
                designations: theData.designations,
                currency: theData.currency,
                billingContact: theData.billingContact,
                billingAddress: theData.billingAddress,
                customerMeta: { //this must be an object
                    yourFieldName: "yourValueName"
                }, 
                recaptchaToken: recaptchaToken,
                corporateMatchingId: -1, //required field, omitted on form
            })
        }).then((createTransactionResult) => {

            theData.truncatedCardData = "****" + $('#cardData-cardNumber').val().slice(12,
            16); //for use in receipt page
            
            //render receipt page
            renderReceiptElements(createTransactionResult);
        })
    } catch (e) {
        console.log('error in recaptchaCallback');
        handleTheError(e);
    }
}
