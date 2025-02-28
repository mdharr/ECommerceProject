import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { OrderHistory } from '../models/order-history';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OrderHistoryService {

	// private orderUrl = 'http://localhost:8080/api/orders';
	private orderUrl: string = environment.luv2shopApiUrl + '/orders';


  constructor(private httpClient: HttpClient) { }

	getOrderHistory(email: string): Observable<GetResponseOrderHistory> {

		// need to build URL based on the customer email
		const orderHistoryUrl = `${this.orderUrl}/search/findByCustomerEmailOrderByDateCreatedDesc?email=${email}`;

		return this.httpClient.get<GetResponseOrderHistory>(orderHistoryUrl);
	}
}

interface GetResponseOrderHistory {
	_embedded: {
		orders: OrderHistory[];
	}
}
