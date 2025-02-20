import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, of } from 'rxjs';
import { Country } from '../models/country';
import { State } from '../models/state';

@Injectable({
  providedIn: 'root'
})
export class Luv2ShopFormService {

	private countriesUrl = 'http://localhost:8080/api/countries';
	private statesUrl = 'http://localhost:8080/api/states';

  constructor(private httpClient: HttpClient) { }

	getCountries(): Observable<Country[]> {
		return this.httpClient.get<GetResponseCountries>(this.countriesUrl).pipe(
			map(response => response._embedded.countries)
		);
	}

	getStates(countryCode: string): Observable<State[]> {
		const searchStatesUrl = `${this.statesUrl}/search/findByCountryCode?code=${countryCode}`;
		return this.httpClient.get<GetResponseStates>(searchStatesUrl).pipe(
			map(response => response._embedded.states)
		)
	}

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

interface GetResponseCountries {
	_embedded: {
		countries: Country[];
	}
}

interface GetResponseStates {
	_embedded: {
		states: State[];
	}
}
