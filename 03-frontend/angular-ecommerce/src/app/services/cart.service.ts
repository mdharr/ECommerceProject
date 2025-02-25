import { Injectable } from '@angular/core';
import { CartItem } from '../models/cart-item';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {

	cartItems: Map<string, CartItem> = new Map<string, CartItem>();

	totalPrice: Subject<number> = new BehaviorSubject<number>(0.00);
	totalQuantity: Subject<number> = new BehaviorSubject<number>(0);

	// storage: Storage = sessionStorage;
	storage: Storage = localStorage;

  constructor() {

		// read data from storage
		let data = JSON.parse(this.storage.getItem('cartItems')!);

		if (data != null) {
			this.cartItems = new Map(data);
		}
		else {
			this.cartItems = new Map();
		}
		// compute totals based on the data that is read from storage
		this.computeCartTotals();
	}

	persistCartItems() {
		this.storage.setItem('cartItems', JSON.stringify(Array.from(this.cartItems)));
	}

	addToCart(cartItem: CartItem) {
		const cartItemId = String(cartItem.id);
		// check if we already have the item in our cart
		if (this.cartItems.has(cartItemId)) {
			const item = this.cartItems.get(cartItemId);
			if (!item) return;
			this.cartItems.set(cartItemId, { ...item, quantity: item.quantity + 1 } as CartItem);
		} else {
			this.cartItems.set(cartItemId, { ...cartItem, quantity: 1 } as CartItem);
		}

		// compute cart total price and total quantity
		this.computeCartTotals();
	}

	computeCartTotals() {
		let totalPriceValue: number = 0;
		let totalQuantityValue: number = 0;

		for (const currentCartItem of this.cartItems.values()) {
			totalPriceValue += currentCartItem.unitPrice * currentCartItem.quantity;
			totalQuantityValue += currentCartItem.quantity;
		}
		// publish events to subscribers
		this.totalPrice.next(totalPriceValue);
		this.totalQuantity.next(totalQuantityValue);

		// log cart data just for debugging purposes
		this.logCartData(totalPriceValue, totalQuantityValue);

		// persist cart data
		this.persistCartItems();
	}

	logCartData(price: number, quantity: number) {
		console.log('Contents of the cart');
		for (const cartItem of this.cartItems.values()) {
			const subTotalPrice = cartItem.quantity * cartItem.unitPrice;
			console.log(`name=${cartItem.name}, quantity=${cartItem.quantity}, unitPrice=${cartItem.unitPrice}, subTotalPrice=${subTotalPrice}`);
		}

		console.log(`totalPrice: ${price.toFixed(2)}, totalQuantity: ${quantity}`);
		console.log('----------------------------------');
	}

	decrementQuantity(cartItem: CartItem) {
		cartItem.quantity--;
		if (cartItem.quantity === 0) {
			this.remove(cartItem);
		}
		else {
			this.computeCartTotals();
		}
	}

	remove(cartItem: CartItem) {
		const cartItemId = String(cartItem.id);
		if (this.cartItems.has(cartItemId)) {
			this.cartItems.delete(cartItemId);
			this.computeCartTotals();
		}
	}

}
