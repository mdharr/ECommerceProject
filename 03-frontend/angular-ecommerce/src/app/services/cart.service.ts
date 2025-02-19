import { Injectable } from '@angular/core';
import { CartItem } from '../models/cart-item';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {

	// cartItems: CartItem[] = [];
	cartItems: Map<number, CartItem> = new Map<number, CartItem>();

	totalPrice: Subject<number> = new Subject<number>();
	totalQuantity: Subject<number> = new Subject<number>();

  constructor() { }

	addToCart(cartItem: CartItem) {
		// check if we already have the item in our cart
		if (this.cartItems.has(cartItem.id)) {
			const item = this.cartItems.get(cartItem.id);
			if (!item) return;
			this.cartItems.set(cartItem.id, { ...item, quantity: item.quantity + 1 } as CartItem);
		} else {
			this.cartItems.set(cartItem.id, { ...cartItem, quantity: 1 } as CartItem);
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
}
