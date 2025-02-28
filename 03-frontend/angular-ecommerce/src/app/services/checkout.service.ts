import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Purchase } from '../models/purchase';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CheckoutService {

	// private purchaseUrl: string = 'http://localhost:8080/api/checkout/purchase';

		private purchaseUrl: string = environment.luv2shopApiUrl + '/checkout/purchase';
		// private securedEndpoints = [this.endpoint];

  constructor(private http: HttpClient) { }

	placeOrder(purchase: Purchase): Observable<any> {
		return this.http.post<Purchase>(this.purchaseUrl, purchase);
	}
}
