//initial configuration
// Org - Interplanetary Castle of Waffles
// var config = {
//     organizationId: '2aa2e362-51aa-483d-bedd-645ae18cc1f3', //this
//     paymentGatewayId: 'f21c29e4-1a8f-46a1-b1d8-01b5ccc2363d', //and this must correspond with one another
//     enableSandboxMode: true, //set to false for prod
//     recaptchaType: 'organization', //this is also important.
//     spreedlyEnvironmentKey: 'KCE4DaaycL92NvslhfVUNbWgioC', //ask your sysadmin for this
// };

//initial configuration
// Org - Child Hunger Fund
var config = {
    organizationId: 'fdca0c74-1f83-4b6c-afd9-ac265d8f0a52', //this
    paymentGatewayId: '3bf1c8bf-5631-46c4-9296-d71527169688', //and this must correspond with one another
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
			console.log("Executing recaptcha", grecaptcha, this);
			grecaptcha.execute();
			console.log("Post recaptcha");
		},
		handleDonation(recaptchaToken) {
			console.log("Handling donation in recaptcha callback", this);
			let billingContact = {
				salutation: null,
				firstName: this.donor.firstName,
				lastName: this.donor.lastName,
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
				}).then((paymentMethodResult) => {
					var transactionObj = {
		                //RecaptchaSecuredRequest type
		                recaptchaType: config.recaptchaType,
		                recaptchaToken: recaptchaToken,

		                //CreateTransactionRequest type
		                paymentGatewayId: config.paymentGatewayId,
		                paymentMethodId: paymentMethodResult.paymentMethodId,
		                recurringFrequency: this.mapDonationFrequency(),
		                paymentAmount: this.donationAmount,
		                currency: 'USD',
		                billingContact: billingContact,
		                billingAddress: billingAddress,
		                recaptchaToken: recaptchaToken, // TODO - do we support no recaptcha?\
		                corporateMatchingId: -1
		            }

		            if (gift.id > 0) {
		            	transactionObj.customerMeta: {
		            		giftId: gift.id,
		            		giftName: gift.text
		            	};
		            }

					return idonateClient.createTransaction();
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
		var renderRecaptcha = function() {
			grecaptcha.render('recaptcha-wrapper', {
				"class": "g-recaptcha",
				"sitekey": "6LensWUcAAAAAC07JVxQLUjBD6VKniiQqbp5oBWV",
				"callback": this.handleDonation,
				"size": "invisible"
			});
		};

		setTimeout(renderRecaptcha.bind(this), 500);
	}
});