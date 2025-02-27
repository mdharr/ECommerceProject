import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { LoggedInUser } from '../models/logged-in-user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

	private baseUrl: string = 'http://localhost:8080/api/v1/auth';
	private tokenKey: string = 'authToken';

	private currentUserSubject = new BehaviorSubject<LoggedInUser | null>(null);
	public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {
		this.initializeUser();
	}

	private initializeUser() {
    const token = this.getToken();
    if (token) {
      const decoded = this.decodeToken(token);
      const user: LoggedInUser = {
        username: decoded.sub,
				id: decoded.id,
				firstName: decoded.firstName,
				email: decoded.email,
      };
      this.currentUserSubject.next(user);
    }
  }

	// register(user: any): Observable<any> {
	// 	return this.http.post(`${this.baseUrl}/register`, user);
	// }

	register(user: any): Observable<any> {
		return this.http.post(`${this.baseUrl}/register`, user).pipe(
			tap((response: any) => {
				if (response && response.token) {
					// Store the token in localStorage
					this.setToken(response.token);

					// Decode the token and create the user object
					const decoded = this.decodeToken(response.token);
					const user: LoggedInUser = {
						username: decoded.sub,
						id: decoded.id,
						firstName: decoded.firstName,
						email: decoded.email,
					};

					// Set the current user in the BehaviorSubject
					this.currentUserSubject.next(user);
				}
			})
		);
	}

	login(credentials: { username: string, password: string }): Observable<any> {
		return this.http.post(`${this.baseUrl}/login`, credentials).pipe(
			tap((response: any) => {
				if (response && response.token) {
					this.setToken(response.token);

					const decoded = this.decodeToken(response.token);
					const user: LoggedInUser = {
						username: decoded.sub,
						id: decoded.id,
						firstName: decoded.firstName,
						email: decoded.email,
					};
					this.currentUserSubject.next(user);
				}
			})
		);
	}

	logout(): void {
		localStorage.removeItem(this.tokenKey);
		localStorage.removeItem('authUser');
		// Set current user to null in the BehaviorSubject
		this.currentUserSubject.next(null);
	}

	setToken(token: string): void {
		localStorage.setItem(this.tokenKey, token);
	}

	getToken(): string | null {
		return localStorage.getItem(this.tokenKey);
	}

	decodeToken(token: string): any {
		try {
			const payloadPart = token.split('.')[1]; // get the payload
			const decodedString = atob(payloadPart.replace('-', '+').replace('_', '/'));
			return JSON.parse(decodedString);
		} catch (err) {
			console.error(err);
			return null;
		}
	}

	isAuthenticated(): boolean {
		// A simple check: token exists and is not expired (optional).
    // For a robust check, decode the token and verify its exp field.
		const token = this.getToken();
		if (!token) return false;

		const decoded = this.decodeToken(token);
		if (!decoded || !decoded.exp) return false;

		return decoded.exp > Date.now() / 1000;
	}
}
