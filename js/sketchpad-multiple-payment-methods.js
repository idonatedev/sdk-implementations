function recaptchaCallback(recaptchaToken) {
    /*demo for 10-29-21: adjusted version to allow for different payment types*/
    try {
        /*
            In practice, the user will select an HTML element to choose either credit card or bank account, and the result of that choice will determine which tokenizer we use.
        */
        (function(){ //had to use anonymous function to get the switch statement to play nice with .then() when returning things
            var resultString = ""; //store the result of the following switch statement

            switch(theData.paymentMethod){ //in practice theData.paymentMethod will be a jquery statement looking at the payment method dom element
                case 'credit_card':
                    //tokenize credit card
                    resultString = idonateClient.tokenizeSpreedlyCreditCard(
                    {
                        contact: theData.billingContact,
                        address: theData.billingAddress,
                        //card: theData.cardData //infosec:nope
                        card:{
                            cardNumber: $('#cardData-cardNumber').val(),
                            expirationMonth: $('#cardData-expirationMonth').val(),
                            expirationYear: $('#cardData-ExpirationYear').val()
                        }    
                    });
                    break;
                case 'bank_account':
                    /*
                      The New Thing 10/27/21
                    */
                    //tokenize bank account
                    resultString = idonateClient.tokenizeCardConnectBankAccount({
                        /*
                            Note: In practice, this section will look more like the card section, where the declarations are jquery statements instead.
                        */
                        accountNumber: "" + theData.achData.accountNumber, //string
                        routingNumber: "" + theData.achData.routingNumber, //string

                        accountHolderType: '' + theData.achData.accountHolderType, //'personal' | 'business'
                        accountType: '' + theData.achData.accountType //'checking' | 'savings'
                    });
                    break;
                default:
                    console.log('unexpected value');
                    return -1;
            }

            return resultString;
        }
        ).then((tokenResult) => {
            return idonateClient.createPaymentMethod({
                //RecaptchaSecuredRequest type
                recaptchaType: config.recaptchaType,
                recaptchaToken: recaptchaToken,

                //CreatePaymentMethodRequest type
                paymentGatewayId: config.paymentGatewayId,
                paymentMethodType: theData.paymentMethod == 'credit_card' ? 'credit_card' : 'bank_account', //switch out for ach if ach==true
                paymentMethodToken: tokenResult,
                contact: theData.billingContact,
                address: theData.billingAddress
            })
        }).then((paymentMethodResult) => {
            var DOMgiftId;
            var giftOptOut;

            if($('#gift-opt-out').prop('checked') == true){
                DOMgiftId = null;
                giftOptOut = true;
            }else{
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
                customerMeta: {
                    field1: "yes, field 1"
                }, //this cannot be plaintext.  has to be an object.  so in practice, probably need to use the delineator to go from form to object.
                recaptchaToken: recaptchaToken,
                corporateMatchingId: -1, //this is fine apparently

                //TODO: Assign Gift
                giftId: DOMgiftId, //null if opt-out
                giftSkipped: giftOptOut, //explicit logic
            })
        }).then((createTransactionResult) => {
            console.log(createTransactionResult);

            theData.truncatedCardData = "****" + $('#cardData-cardNumber').val().slice(12,16); //for use in receipt page
            //theData.cardData = null; //'stonks' guy but its 'secur'

            renderReceiptElements(createTransactionResult);
        })
    } catch (e) {
        handleTheError(e);
    }
}
