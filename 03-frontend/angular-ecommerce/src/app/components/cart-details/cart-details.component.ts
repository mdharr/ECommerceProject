import { Component, OnInit } from '@angular/core';
import { CartItem } from 'src/app/models/cart-item';
import { CartService } from 'src/app/services/cart.service';

@Component({
  selector: 'app-cart-details',
  templateUrl: './cart-details.component.html',
  styleUrls: ['./cart-details.component.css']
})
export class CartDetailsComponent implements OnInit {

	cartItems: Map<string, CartItem> = new Map<string, CartItem>();
	totalPrice: number = 0;
	totalQuantity: number = 0;

	constructor(private cartService: CartService) {}

	ngOnInit() {
		this.listCartDetails();
	}

	listCartDetails() {

		// get a handle to the cart items
		this.cartItems = this.cartService.cartItems;
		// subscribe to the cart totalPrice
		this.cartService.totalPrice.subscribe(
			data => this.totalPrice = data
		);
		// subscribe to the cart totalQuantity
		this.cartService.totalQuantity.subscribe(
			data => this.totalQuantity = data
		);
		// compute cart total price and quantity
		this.cartService.computeCartTotals();
	}

	get cartItemsArray() {
		return Array.from(this.cartItems.values());
	}

	incrementQuantity(cartItem: CartItem) {
		this.cartService.addToCart(cartItem);
	}

	decrementQuantity(cartItem: CartItem) {
		this.cartService.decrementQuantity(cartItem);
	}

	remove(cartItem: CartItem) {
		this.cartService.remove(cartItem);
	}
}
