import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Customer } from 'src/app/models/customer';
import { Luv2ShopValidators } from 'src/app/validators/luv2-shop-validators';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
	registerFormGroup!: FormGroup;

	emailRegex: RegExp = /^(?!.*\.\.)[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,63}$/;

	constructor(private formBuilder: FormBuilder,
							private router: Router
	) { }

	ngOnInit() {
		this.registerFormGroup = this.formBuilder.group({
			user: this.formBuilder.group({
				username: new FormControl('', [Validators.required, Validators.minLength(2), Luv2ShopValidators.notOnlyWhiteSpace]),
				password: new FormControl('', [Validators.required, Validators.minLength(8), Luv2ShopValidators.notOnlyWhiteSpace]),
				firstName: new FormControl('', [Validators.required, Validators.minLength(2), Luv2ShopValidators.notOnlyWhiteSpace]),
				lastName: new FormControl('', [Validators.required, Validators.minLength(2), Luv2ShopValidators.notOnlyWhiteSpace]),
				email: new FormControl('', [Validators.required, Validators.pattern(this.emailRegex)])
			})
		});
	}

	// user getters
	get username() { return this.registerFormGroup.get('user.username'); }
	get password() { return this.registerFormGroup.get('user.password'); }
	get firstName() { return this.registerFormGroup.get('user.firstName'); }
	get lastName() { return this.registerFormGroup.get('user.lastName'); }
	get email() { return this.registerFormGroup.get('user.email'); }

	get usernameErrors() { return this.registerFormGroup.get('user.username')?.errors; }
	get passwordErrors() { return this.registerFormGroup.get('user.password')?.errors; }
	get firstNameErrors() { return this.registerFormGroup.get('user.firstName')?.errors; }
	get lastNameErrors() { return this.registerFormGroup.get('user.lastName')?.errors; }
	get emailErrors() { return this.registerFormGroup.get('user.email')?.errors; }

	onSubmit() {
		console.log("Handling the form submission");

		if (this.registerFormGroup.invalid) {
			console.log("Form is invalid, marking all fields as touched...");
			this.registerFormGroup.markAllAsTouched();
			return;
		}

		const customer: Customer = { ...this.registerFormGroup.controls['user'].value };
	}

	resetForm() {

		// reset the form
		this.registerFormGroup.reset();

		// navigate back to the products page
		this.router.navigateByUrl("/products");
	}
}
