import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Customer } from 'src/app/models/customer';
import { AuthService } from 'src/app/services/auth.service';
import { Luv2ShopValidators } from 'src/app/validators/luv2-shop-validators';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

	loginFormGroup!: FormGroup;
	loginError: string | null = null;

	emailRegex: RegExp = /^(?!.*\.\.)[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,63}$/;

	constructor(private formBuilder: FormBuilder,
							private router: Router,
							private authService: AuthService) { }

	ngOnInit() {
		console.log("Initializing the form...");

		this.loginFormGroup = this.formBuilder.group({
			user: this.formBuilder.group({
				username: new FormControl('', [Validators.required, Validators.minLength(2), Luv2ShopValidators.notOnlyWhiteSpace]),
				password: new FormControl('', [Validators.required, Validators.minLength(8), Luv2ShopValidators.notOnlyWhiteSpace])
			})
		});

		this.resetForm();
		console.log(this.loginFormGroup.value);
	}

	// user getters
	get username() { return this.loginFormGroup.get('user.username'); }
	get password() { return this.loginFormGroup.get('user.password'); }

	get usernameErrors() { return this.loginFormGroup.get('user.username')?.errors; }
	get passwordErrors() { return this.loginFormGroup.get('user.password')?.errors; }

	onSubmit() {
		console.log("Handling the form submission");

		if (this.loginFormGroup.invalid) {
			console.log("Form is invalid, marking all fields as touched...");
			this.loginFormGroup.markAllAsTouched();
			return;
		}

		// Extract credentials
		const { username, password } = this.loginFormGroup.controls['user'].value || {};

		// Call the AuthService login method
		this.authService.login({ username, password }).subscribe({
			next: (response) => {
				console.log("Login successful:", response);
				this.router.navigateByUrl("/products");
			},
			error: (err) => {
				console.error("Login failed:", err);
				this.loginError = "Invalid username or password";
			}
		});
	}

	resetForm() {
		// reset the form
		console.log('reset')
		this.loginFormGroup.reset({
			user: {
				username: '',  // Clear the username field
				password: ''   // Clear the password field
			}
		});
	}

}
