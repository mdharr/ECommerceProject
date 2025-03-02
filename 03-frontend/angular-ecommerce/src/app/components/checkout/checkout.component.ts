import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Address } from 'src/app/models/address';
import { Country } from 'src/app/models/country';
import { Customer } from 'src/app/models/customer';
import { LoggedInUser } from 'src/app/models/logged-in-user';
import { Order } from 'src/app/models/order';
import { OrderItem } from 'src/app/models/order-item';
import { PaymentInfo } from 'src/app/models/payment-info';
import { Purchase } from 'src/app/models/purchase';
import { State } from 'src/app/models/state';
import { AuthService } from 'src/app/services/auth.service';
import { CartService } from 'src/app/services/cart.service';
import { CheckoutService } from 'src/app/services/checkout.service';
import { Luv2ShopFormService } from 'src/app/services/luv2-shop-form.service';
import { Luv2ShopValidators } from 'src/app/validators/luv2-shop-validators';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {

	checkoutFormGroup!: FormGroup;

	currentUser$: Observable<LoggedInUser | null>;
	userEmail: string = '';

	storage: Storage = sessionStorage;

	totalPrice: number = 0.00;
	totalQuantity: number = 0;

	creditCardYears: number[] = [];
	creditCardMonths: number[] = [];

	countries: Country[] = [];
	states: State[] = [];

	shippingAddressStates: State[] = [];
	billingAddressStates: State[] = [];

	billingAddressSameAsShippingAddress: boolean = false;

	emailRegex: RegExp = /^(?!.*\.\.)[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,63}$/;

	// initialize Stripe API
	stripe = Stripe(environment.stripePublishableKey);

	paymentInfo: PaymentInfo = new PaymentInfo();
	cardElement: any;
	displayError: any = "";

	isDisabled: boolean = false;

	constructor(private formBuilder: FormBuilder,
							private luv2ShopFormService: Luv2ShopFormService,
							private cartService: CartService,
							private checkoutService: CheckoutService,
							private router: Router,
							private authService: AuthService
	) {
		this.currentUser$ = this.authService.currentUser$;
	}

	ngOnInit() {

		// setup Stripe payment form
		this.setupStripePaymentForm();

		this.currentUser$.subscribe(user => {
      console.log("Current user changed:", user);
			if (!this.storage.getItem('userEmail') || this.storage.getItem('userEmail') !== user?.email) {
				this.storage.setItem('userEmail', user?.email!);
			}
			this.userEmail = this.storage.getItem('userEmail')!;
    });

		this.reviewCartDetails();

		this.checkoutFormGroup = this.formBuilder.group({
			customer: this.formBuilder.group({
				firstName: new FormControl('', [Validators.required, Validators.minLength(2), Luv2ShopValidators.notOnlyWhiteSpace]),
				lastName: new FormControl('', [Validators.required, Validators.minLength(2), Luv2ShopValidators.notOnlyWhiteSpace]),
				email: new FormControl({value: this.userEmail, disabled: true}, [Validators.required, Validators.pattern(this.emailRegex)])
			}),
			shippingAddress: this.formBuilder.group({
				street: new FormControl('', [Validators.required, Validators.minLength(2), Luv2ShopValidators.notOnlyWhiteSpace]),
				city: new FormControl('', [Validators.required, Validators.minLength(2), Luv2ShopValidators.notOnlyWhiteSpace]),
				state: new FormControl('', [Validators.required]),
				country: new FormControl('', [Validators.required]),
				zipCode: new FormControl('', [Validators.required, Validators.minLength(2), Luv2ShopValidators.notOnlyWhiteSpace])
			}),
			billingAddress: this.formBuilder.group({
				street: new FormControl('', [Validators.required, Validators.minLength(2), Luv2ShopValidators.notOnlyWhiteSpace]),
				city: new FormControl('', [Validators.required, Validators.minLength(2), Luv2ShopValidators.notOnlyWhiteSpace]),
				state: new FormControl('', [Validators.required]),
				country: new FormControl('', [Validators.required]),
				zipCode: new FormControl('', [Validators.required, Validators.minLength(2), Luv2ShopValidators.notOnlyWhiteSpace])
			}),
			creditCard: this.formBuilder.group({
				/*
				cardType: new FormControl('', [Validators.required]),
				nameOnCard: new FormControl('', [Validators.required, Validators.minLength(2), Luv2ShopValidators.notOnlyWhiteSpace]),
				cardNumber: new FormControl('', [Validators.required, Validators.pattern('[0-9]{16}')]), // 16 digits
				securityCode: new FormControl('', [Validators.required, Validators.pattern('[0-9]{3}')]), // 3 digits
				expirationMonth: [''],
				expirationYear: ['']
				*/
			}),
		});

		/*
		// populate credit card months
		const startMonth: number= new Date().getMonth() + 1;
		console.log(`startMonth=${startMonth}`);
		this.luv2ShopFormService.getCreditCardMonths(startMonth).subscribe(
			data => {
				console.log("Retrieved credit card months: " + JSON.stringify(data));
				this.creditCardMonths = data;
			}
		);

		// populate credit card years
		this.luv2ShopFormService.getCreditCardYears().subscribe(
			data => {
				console.log("Retrieved credit card years: " + JSON.stringify(data));
				this.creditCardYears = data;
			}
		);
		*/

		// populate countries
		this.luv2ShopFormService.getCountries().subscribe(
			data => {
				console.log(`retrievedCountries=${JSON.stringify(data)}`);
				this.countries = data;
			}
		);

	}

	copyShippingAddressToBillingAddress(event: Event) {
		const isChecked = (event.target as HTMLInputElement).checked;

		if (isChecked) {
			this.checkoutFormGroup.get('billingAddress')?.setValue(
				this.checkoutFormGroup.get('shippingAddress')?.value
			);

			// bug fix for states
			this.billingAddressStates = this.shippingAddressStates;
			this.billingAddressSameAsShippingAddress = true;
		}
		else {
			this.checkoutFormGroup.get('billingAddress')?.reset();

			// bug fix for states
			this.billingAddressStates = [];
			this.billingAddressSameAsShippingAddress = false;
		}
	}

	// customer getters
	get firstName() { return this.checkoutFormGroup.get('customer.firstName'); }
	get lastName() { return this.checkoutFormGroup.get('customer.lastName'); }
	get email() { return this.checkoutFormGroup.get('customer.email'); }

	get firstNameErrors() { return this.checkoutFormGroup.get('customer.firstName')?.errors; }
	get lastNameErrors() { return this.checkoutFormGroup.get('customer.lastName')?.errors; }
	get emailErrors() { return this.checkoutFormGroup.get('customer.email')?.errors; }

	// shipping address getters
	get shippingAddressStreet() { return this.checkoutFormGroup.get('shippingAddress.street'); }
	get shippingAddressCity() { return this.checkoutFormGroup.get('shippingAddress.city'); }
	get shippingAddressState() { return this.checkoutFormGroup.get('shippingAddress.state'); }
	get shippingAddressCountry() { return this.checkoutFormGroup.get('shippingAddress.country'); }
	get shippingAddressZipCode() { return this.checkoutFormGroup.get('shippingAddress.zipCode'); }

	get shippingAddressStreetErrors() { return this.checkoutFormGroup.get('shippingAddress.street')?.errors; }
	get shippingAddressCityErrors() { return this.checkoutFormGroup.get('shippingAddress.city')?.errors; }
	get shippingAddressStateErrors() { return this.checkoutFormGroup.get('shippingAddress.state')?.errors; }
	get shippingAddressCountryErrors() { return this.checkoutFormGroup.get('shippingAddress.country')?.errors; }
	get shippingAddressZipCodeErrors() { return this.checkoutFormGroup.get('shippingAddress.zipCode')?.errors; }

	// billing address getters
	get billingAddressStreet() { return this.checkoutFormGroup.get('billingAddress.street'); }
	get billingAddressCity() { return this.checkoutFormGroup.get('billingAddress.city'); }
	get billingAddressState() { return this.checkoutFormGroup.get('billingAddress.state'); }
	get billingAddressCountry() { return this.checkoutFormGroup.get('billingAddress.country'); }
	get billingAddressZipCode() { return this.checkoutFormGroup.get('billingAddress.zipCode'); }

	get billingAddressStreetErrors() { return this.checkoutFormGroup.get('billingAddress.street')?.errors; }
	get billingAddressCityErrors() { return this.checkoutFormGroup.get('billingAddress.city')?.errors; }
	get billingAddressStateErrors() { return this.checkoutFormGroup.get('billingAddress.state')?.errors; }
	get billingAddressCountryErrors() { return this.checkoutFormGroup.get('billingAddress.country')?.errors; }
	get billingAddressZipCodeErrors() { return this.checkoutFormGroup.get('billingAddress.zipCode')?.errors; }

	// credit card getters
	get creditCardType() { return this.checkoutFormGroup.get('creditCard.cardType'); }
	get creditCardNameOnCard() { return this.checkoutFormGroup.get('creditCard.nameOnCard'); }
	get creditCardNumber() { return this.checkoutFormGroup.get('creditCard.cardNumber'); }
	get creditCardSecurityCode() { return this.checkoutFormGroup.get('creditCard.securityCode'); }

	get creditCardTypeErrors() { return this.checkoutFormGroup.get('creditCard.cardType')?.errors; }
	get creditCardNameOnCardErrors() { return this.checkoutFormGroup.get('creditCard.nameOnCard')?.errors; }
	get creditCardNumberErrors() { return this.checkoutFormGroup.get('creditCard.cardNumber')?.errors; }
	get creditCardSecurityCodeErrors() { return this.checkoutFormGroup.get('creditCard.securityCode')?.errors; }


  onSubmit() {
    console.log("Handling the form submission");

    if (this.checkoutFormGroup.invalid) {
      console.log("Form is invalid, marking all fields as touched...");
      this.checkoutFormGroup.markAllAsTouched();
      return;
    }

		// set up order
		const order = new Order(this.totalQuantity, this.totalPrice);

		// get cart items
		const cartItems = this.cartService.cartItems;

		// create orderItems from cartItems
		const orderItems: OrderItem[] = Array.from(cartItems).map(cartItem => new OrderItem(cartItem[1]));

		// populate purchase - customer
		// const customer: Customer = { ...this.checkoutFormGroup.controls['customer'].value };
		const customer: Customer = { ...this.checkoutFormGroup.controls['customer'].getRawValue() }; // use getRawValue() because email field is disabled

		// populate purchase - shipping address -> extract name for state and country
		const shippingAddressValue: AddressFormValue = this.checkoutFormGroup.controls['shippingAddress'].value;
		const shippingAddress: Address = new Address(
			shippingAddressValue.street,
			shippingAddressValue.city,
			shippingAddressValue.state.name,
			shippingAddressValue.country.name,
			shippingAddressValue.zipCode
		);

		// populate purchase - billing address -> extract name for state and country
		const billingAddressValue: AddressFormValue = this.checkoutFormGroup.controls['billingAddress'].value;
		const billingAddress: Address = new Address(
			billingAddressValue.street,
			billingAddressValue.city,
			billingAddressValue.state.name,
			billingAddressValue.country.name,
			billingAddressValue.zipCode
		);

		// set up and populate purchase
		const purchase: Purchase = new Purchase(customer, shippingAddress, billingAddress, order, orderItems);

		// compute payment info
		// this.paymentInfo.amount = this.totalPrice * 100;
		this.paymentInfo.amount = Math.round(this.totalPrice * 100);
		this.paymentInfo.currency = "USD";
		this.paymentInfo.receiptEmail = purchase.customer.email;


		console.log(`this.paymentInfo.amount: ${ this.paymentInfo.amount }`);
		// if valid form then
		// - create payment intent
		// - confirm card payment
		// - place order

		if (!this.checkoutFormGroup.invalid && this.displayError.textContent === "") {

			this.isDisabled = true;

			this.checkoutService.createPaymentIntent(this.paymentInfo).subscribe(
				(paymentIntentResponse) => {
					this.stripe.confirmCardPayment(paymentIntentResponse.client_secret,
						{
							payment_method: {
								card: this.cardElement,
								billing_details: {
									email: purchase.customer.email,
									name: `${purchase.customer.firstName} ${purchase.customer.lastName}`,
									address: {
										line1: purchase.billingAddress.street,
										city: purchase.billingAddress.state,
										postal_code: purchase.billingAddress.zipCode,
										country: this.billingAddressCountry?.value.code
									}
								}
							}
						}, { handleActions: false }
					).then((result: any) => {
						if (result.error) {
							// inform the customer there was an error
							alert(`There was an error processing your payment: ${result.error.message}`);
						}
						else {
							// call REST API via the CheckoutService
							this.checkoutService.placeOrder(purchase).subscribe({
								next: (response: any) => {
									alert(`Your order has been received.\nOrder tracking number: ${response.orderTrackingNumber}`);

									// reset cart
									this.resetCart();
									this.isDisabled = false;
								},
								error: (err: any) => {
									alert(`There was an error: ${err.message}`);
									this.isDisabled = false;
								}
							});
						}
					});
				}
			);
		}
		else {
			this.checkoutFormGroup.markAllAsTouched();
			return;
		}


		/* pre Stripe checkout
		// call REST API via the CheckoutService
		this.checkoutService.placeOrder(purchase).subscribe({
			next: (response) => {
				alert(`Your order has been received.\nOrder tracking number: ${response.orderTrackingNumber}`);

				this.resetCart();
			},
			error: (err) => {
				alert(`There was an error: ${err.message}`);
			}
		});
		*/
  }

	resetCart() {
		// reset cart data
		this.cartService.cartItems = new Map();
		this.cartService.totalPrice.next(0.00);
		this.cartService.totalQuantity.next(0);
		this.cartService.persistCartItems();

		// reset the form
		this.checkoutFormGroup.reset();

		// navigate back to the products page
		this.router.navigateByUrl("/products");
	}


	handleMonthsAndYears() {

		const creditCardFormGroup = this.checkoutFormGroup.get('creditCard');

		const currentYear: number = new Date().getFullYear();
		const selectedYear: number = Number(creditCardFormGroup?.value.expirationYear);

		// if the current year equals the selected year, then start with current month

		let startMonth: number;

		if (currentYear === selectedYear) {
			startMonth = new Date().getMonth() + 1;
		}
		else {
			startMonth = 1;
		}

		this.luv2ShopFormService.getCreditCardMonths(startMonth).subscribe(
			data => {
				console.log("Retrieved credit card months: " + JSON.stringify(data));
				this.creditCardMonths = data;
			}
		);
	}

	getStates(formGroupName: string) {
		const formGroup = this.checkoutFormGroup.get(formGroupName);

		const countryCode = formGroup?.value.country.code;
		const countryName = formGroup?.value.country.name;

		console.log(`${formGroupName} country code: ${countryCode}`);
		console.log(`${formGroupName} country code: ${countryName}`);

		this.luv2ShopFormService.getStates(countryCode).subscribe(
			data => {
				if (formGroupName === 'shippingAddress') {
					this.shippingAddressStates = data;
				}
				else {
					this.billingAddressStates = data;
				}

				// select first state as default
				formGroup?.get('state')?.setValue(data[0]);
			}
		);
	}

	setupStripePaymentForm() {

		// get a handle to stripe elements
		var elements = this.stripe.elements();

		// Create a card element ... and hide the zip-code field
		this.cardElement = elements.create('card', { hidePostalCode: true });

		// Add an instance of card UI component into the 'card-element' div
		this.cardElement.mount('#card-element');

		// Add event binding for the 'change' event on the card element
		this.cardElement.on('change', (event: any) => {
			// get a handle to card-errors element
			this.displayError = document.getElementById('card-errors');

			if (event.complete) {
				this.displayError.textContent = "";
			}
			else if (event.error) {
				// show validation error to customer
				this.displayError.textContent = event.error.message;
			}
		});

	}

	reviewCartDetails() {
		// subscribe to the cart totalPrice
		this.cartService.totalPrice.subscribe(
			data => this.totalPrice = data);
		// subscribe to the cart totalQuantity
		this.cartService.totalQuantity.subscribe(
			data => this.totalQuantity = data);
	}
}

interface AddressFormValue {
  street: string;
  city: string;
  state: { id: number; name: string };
  country: { id: number; code: string; name: string };
  zipCode: string;
}
