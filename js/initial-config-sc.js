/* configuration re-worked for shopping cart experience */

//initial configuration
const config = {
    organizationId: '2aa2e362-51aa-483d-bedd-645ae18cc1f3', //this
    paymentGatewayId: 'f21c29e4-1a8f-46a1-b1d8-01b5ccc2363d', //and this must correspond with one another
    enableSandboxMode: true, //set to false for prod
    recaptchaType: 'organization', //this is also important.
    spreedlyEnvironmentKey: 'KCE4DaaycL92NvslhfVUNbWgioC', //ask your sysadmin for this
};

//initialize the idonate client
const idonateClient = new idonate.client(config.organizationId, {
    enableSandboxMode: config.enableSandboxMode,
    spreedlyEnvironmentKey: config.spreedlyEnvironmentKey
});

//allocate memory for pertinent data
var theData = {
    billingContact: {
        salutation: null, //required field, workaround is pass null
        firstName: "",
        lastName: "",
        company: null, //see above
        email: "",
        primaryPhone: "",
    },

    billingAddress: {
        address1: "",
        country: "",
        city: "",
        state: "",
        zip: "",
    },

    paymentAmount: 0.0,
    currency: 'USD', //hard-coded for now
    recurringFrequency: "once", //default to once
    customerMeta: {
        'field1': 'value1',
        'work': 'please'
    },
    //dpf stuff
    dpfPercentage: 0.03,
    donorPaidFeeAmount: null,
    dpfActive: false,
    dpfAmount: 0.0,
    dpfTotal: 0.0,
};

//set button behavior
document.addEventListener('DOMContentLoaded', function(){
    $('#dpf-checkbox-element').on('click',function(){
        console.log('dpf clicked');
        recalculate();
    });
});