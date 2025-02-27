import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { LoggedInUser } from 'src/app/models/logged-in-user';
import { OrderHistory } from 'src/app/models/order-history';
import { AuthService } from 'src/app/services/auth.service';
import { OrderHistoryService } from 'src/app/services/order-history.service';

@Component({
  selector: 'app-order-history',
  templateUrl: './order-history.component.html',
  styleUrls: ['./order-history.component.css']
})
export class OrderHistoryComponent implements OnInit {

	orderHistoryList: OrderHistory[] = [];

	currentUser$: Observable<LoggedInUser | null>;

	storage: Storage = sessionStorage;

	constructor(private authService: AuthService, private orderHistoryService: OrderHistoryService) {
		this.currentUser$ = this.authService.currentUser$;
	}

	ngOnInit() {
    this.currentUser$.subscribe(user => {
      console.log("Current user changed:", user);
			if (!this.storage.getItem('userEmail') || this.storage.getItem('userEmail') !== user?.email) {
				this.storage.setItem('userEmail', user?.email!);
			}
    });

		this.handleOrderHistory();
	}

	handleOrderHistory() {

		// read the user's email address from browser storage
		const email = this.storage.getItem('userEmail');

		// retrieve data from the service
		this.orderHistoryService.getOrderHistory(email!).subscribe(
			data => {
				this.orderHistoryList = data._embedded.orders;
			}
		);
	}
}
