import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { LoggedInUser } from 'src/app/models/logged-in-user';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login-status',
  templateUrl: './login-status.component.html',
  styleUrls: ['./login-status.component.css']
})
export class LoginStatusComponent implements OnInit {

	currentUser$: Observable<LoggedInUser | null>;

	constructor(private authService: AuthService, private router: Router) {
		this.currentUser$ = this.authService.currentUser$;
	}

	ngOnInit() {
    this.currentUser$.subscribe(user => {
      console.log("Current user changed:", user);
    });
	}

	onLogout() {
		this.authService.logout();
		this.router.navigateByUrl('/products');
	}


}
