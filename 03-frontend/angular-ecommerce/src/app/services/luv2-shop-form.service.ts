import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class Luv2ShopFormService {

  constructor() { }

	getCreditCardMonths(startMonth: number): Observable<number[]> {

		let data: number[] = [];

		// build an array for "Month" dropdown list
		// - start at current month and loop until month 12

		for (let month = startMonth; month <= 12; month++) {
			data.push(month);
		}

		// wrap an object as an Observable, we use an observable here because our component
		// will subscribe to this method to receive async data
		return of(data);
	}

	getCreditCardYears(): Observable<number[]> {

		let data: number[] = [];

		// build an array for "Year" dropdown list
		// - start at current year and loop for next 10 years

		const startYear: number = new Date().getFullYear();
		const endYear: number = startYear + 10;

		for (let year = startYear; year <= endYear; year++) {
			data.push(year);
		}

		return of(data);
	}
}
