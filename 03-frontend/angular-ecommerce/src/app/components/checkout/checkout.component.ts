import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Country } from 'src/app/models/country';
import { State } from 'src/app/models/state';
import { CartService } from 'src/app/services/cart.service';
import { Luv2ShopFormService } from 'src/app/services/luv2-shop-form.service';
import { Luv2ShopValidators } from 'src/app/validators/luv2-shop-validators';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {

	checkoutFormGroup!: FormGroup;

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

	constructor(private formBuilder: FormBuilder,
							private luv2ShopFormService: Luv2ShopFormService,
							private cartService: CartService
	) { }

	ngOnInit() {

		this.reviewCartDetails();

		this.checkoutFormGroup = this.formBuilder.group({
			customer: this.formBuilder.group({
				firstName: new FormControl('', [Validators.required, Validators.minLength(2), Luv2ShopValidators.notOnlyWhiteSpace]),
				lastName: new FormControl('', [Validators.required, Validators.minLength(2), Luv2ShopValidators.notOnlyWhiteSpace]),
				email: new FormControl('', [Validators.required, Validators.pattern(this.emailRegex)])
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
				cardType: new FormControl('', [Validators.required]),
				nameOnCard: new FormControl('', [Validators.required, Validators.minLength(2), Luv2ShopValidators.notOnlyWhiteSpace]),
				cardNumber: new FormControl('', [Validators.required, Validators.pattern('[0-9]{16}')]), // 16 digits
				securityCode: new FormControl('', [Validators.required, Validators.pattern('[0-9]{3}')]), // 3 digits
				expirationMonth: [''],
				expirationYear: ['']
			}),
		});

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

		// populate countries
		this.luv2ShopFormService.getCountries().subscribe(
			data => {
				console.log(`retrievedCountries=${JSON.stringify(data)}`);
				this.countries = data;
			}
		)

		// populate states
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

    console.log("Form submitted successfully!");
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

	reviewCartDetails() {
		// subscribe to the cart totalPrice
		this.cartService.totalPrice.subscribe(
			data => this.totalPrice = data);
		// subscribe to the cart totalQuantity
		this.cartService.totalQuantity.subscribe(
			data => this.totalQuantity = data);
	}
}
