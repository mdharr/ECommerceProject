import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CartItem } from 'src/app/models/cart-item';
import { Product } from 'src/app/models/product';
import { CartService } from 'src/app/services/cart.service';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css']
})
export class ProductDetailsComponent implements OnInit {

	product!: Product;

	constructor(private productService: ProductService, private route: ActivatedRoute, private cartService: CartService) {}

	ngOnInit(): void {
		this.route.paramMap.subscribe(() => {
			this.handleProductDetails();
		});
	}

	handleProductDetails() {
		const productId: number = +this.route.snapshot.paramMap.get('id')!;

		this.productService.getProduct(productId).subscribe(
			data => {
				this.product = data;
			}
		)
	}

	addToCart() {
		console.log(`Adding to cart: ${this.product.name}, ${this.product.unitPrice}`);
		const cartItem = new CartItem(this.product);
		this.cartService.addToCart(cartItem);
	}
}
