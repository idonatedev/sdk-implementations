//initial configuration
var config = {
    organizationId: '2aa2e362-51aa-483d-bedd-645ae18cc1f3', //this
    paymentGatewayId: 'f21c29e4-1a8f-46a1-b1d8-01b5ccc2363d', //and this must correspond with one another
    enableSandboxMode: true, //set to false for prod
    recaptchaType: 'organization', //this is also important.
    spreedlyEnvironmentKey: 'KCE4DaaycL92NvslhfVUNbWgioC', //ask your sysadmin for this
};

//initialize the idonate client
var idonateClient = new idonate.client(config.organizationId, {
    enableSandboxMode: config.enableSandboxMode,
    spreedlyEnvironmentKey: config.spreedlyEnvironmentKey
});

var idonateApp = new Vue({
	el: '#idonateApp',
	data: {
		donationAmount: 50, // default app value,
		donationFrequency: 'one_time', // default app value
		donorEmail: '',
		donorPhone: '',
		donor: {
			firstName: '',
			lastName: ''
		},
		partner: {
			firstName: '',
			lastName: ''
		},
		dedicatedTo: '',
		billing: {
			street: '',
			country: '',
			city: '',
			state: '',
			zip: ''
		},
		shipping: {
			street: '',
			country: '',
			city: '',
			state: '',
			zip: ''
		},
		payment: {
			type: '',
			ccNumber: '',
			expMonth: '',
			expYear: '',
			cvv: '',
			zip: '',
			firstName: '',
			lastName: '',
			bankAccountType: 'checking',
		},
		reuseName: false,
		giftSelection: 'no_gift',
		showingModal: false,
		gift: {
			id: -1,
			text: ''
		},
		stateArray: [
			"AK", "AL", "AR", "AZ", "CA", "CO", "CT", "DC", "DE", "FL", "GA", "HI", "IA", "ID", "IL", "IN", "KS",
			"KY", "LA", "MA", "MD", "ME", "MI", "MN", "MO", "MS", "MT", "NC", "ND", "NE", "NH", "NJ", "NM", "NV",
			"NY", "OH", "OK", "OR", "PA", "PR", "RI", "SC", "SD", "TN", "TX", "UT", "VA", "VT", "WA", "WI", "WV",
			"WY"
		]
	},
	methods: {
		claimGift(id, text) {
			this.gift = { id, text };
			this.showingModal = false;
		},
		executeRecaptcha() {
			console.log("Executing recaptcha", grecaptcha);
			grecaptcha.execute();
			console.log("Post recaptcha");
		},
		handleDonation() {
			console.log("Handling donation in recaptcha callback");
			let billingContact = {
				salutation: null,
				firstName: this.firstName,
				lastName: this.lastName,
				company: null,
				email: this.donorEmail,
				primaryPhone: this.donorPhone
			};
			let billingAddress = {
				address1: this.billing.street,
				country: this.billing.country,
				city: this.billing.city,
				state: this.billing.state,
				zip: this.billing.zip
			};
			// process payment
			try {
				idonateClient.tokenizeSpreedlyCreditCard({
					contact: billingContact,
					address: billingAddress,
					card: {
						cardNumber: this.payment.ccNumber,
						expirationMonth: this.payment.expMonth,
						expirationYear: this.payment.expYear
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
		                contact: billingContact,
		                address: billingAddress
		            });
				}).then((paymentResult) => {
					return idonateClient.createTransaction({
		                //RecaptchaSecuredRequest type
		                recaptchaType: config.recaptchaType,
		                recaptchaToken: recaptchaToken,

		                //CreateTransactionRequest type
		                paymentGatewayId: config.paymentGatewayId,
		                paymentMethodId: paymentMethodResult.paymentMethodId,
		                recurringFrequency: mapDonationFrequency(),
		                paymentAmount: donationAmount,
		                currency: 'USD',
		                billingContact: billingContact,
		                billingAddress: billingAddress,
		                customerMeta: { // TODO - is this where we can temporarily store gift id/title?
		                    yourFieldName: 'value'
		                }, 
		                recaptchaToken: recaptchaToken, // TODO - do we support no recaptcha?\
		                corporateMatchingId: -1
		            });
				}).then((createTransactionResult) => {
					console.log("Transaction created, ", createTransactionResult);
				});
			} catch (ex) {
				console.error(ex);
			}
		},
		mapDonationFrequency() {
			if (this.donationFrequency === 'one_time') {
				return 'once';
			} else {
				return this.donationFrequency;
			}
		},
		showGiftModal() {
			console.log("Showing gift modal");
			this.showingModal = true;
		}
	},
	watch: {
		donationFrequency(value) {
			console.log("Value", value);
			if (value === 'one_time') {
				this.donationAmount = 50;
			} else if (value === 'monthly') {
				this.donationAmount = 8;
			}
		}
	},
	mounted() {
		console.log("mounted", grecaptcha);
		setTimeout(function() {
			grecaptcha.render('recaptcha-wrapper', {
				"class": "g-recaptcha",
				"sitekey": "6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI",
				"callback": this.handleDonation,
				"size": "invisible"
			});
		}, 500);
	}
});