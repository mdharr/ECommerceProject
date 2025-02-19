import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CartItem } from 'src/app/models/cart-item';
import { Product } from 'src/app/models/product';
import { CartService } from 'src/app/services/cart.service';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {

  products: Product[] = [];
  currentCategoryId: number = 1;
	previousCategoryId: number = 1;
  searchMode: boolean = false;

	// new properties for pagination
	pageNumber: number = 1;
	pageSize: number = 5;
	totalElements: number = 0;

	previousKeyword: string = "";

  constructor(private productService: ProductService,
              private route: ActivatedRoute,
							private cartService: CartService) { }

  ngOnInit() {
		this.getUserPageSize();

    this.route.paramMap.subscribe(() => {
      this.listProducts();
    });
  }

  listProducts() {
    this.searchMode = this.route.snapshot.paramMap.has('keyword');

    if (this.searchMode) {
      this.handleSearchProducts();
    }
    else {
      this.handleListProducts();
    }
  }

  handleListProducts() {
    // check if "id" parameter is available
    const hasCategoryId: boolean = this.route.snapshot.paramMap.has('id');

    if (hasCategoryId) {
      // get the "id" param string and convert string to a number using the "+" symbol
      this.currentCategoryId = + this.route.snapshot.paramMap.get('id')!;
    }
    else {
      // not category id available ... default to category 1
      this.currentCategoryId = 1;
    }

		//
		// Check if we have a different category than previous
		// Note: Angular will reuse a component if it is currently being viewed
		//

		// if we have a different category id than previous
		// then set the pageNumber back to 1
		if (this.previousCategoryId != this.currentCategoryId) {
			this.pageNumber = 1;
		}

		this.previousCategoryId = this.currentCategoryId;

		console.log(`currentCategoryId=${this.currentCategoryId}, pageNumber=${this.pageNumber}`);

    // now get the products for the given category id
    this.productService.getProductListPaginate(this.pageNumber - 1, this.pageSize, this.currentCategoryId).subscribe(this.processResult());
  }

  handleSearchProducts() {
    const keyword: string = this.route.snapshot.paramMap.get('keyword')!;

		// if we have a different keyword than previous
		// then set pageNumber to 1

		if (this.previousKeyword != keyword) {
			this.pageNumber = 1;
		}

		this.previousKeyword = keyword;

		console.log(`keyword=${keyword}, pageNumber=${this.pageNumber}`);

    this.productService.searchProductsPaginate(this.pageNumber - 1, this.pageSize, keyword).subscribe(this.processResult());
  }

	updatePageSize(pageSize: string) {
		this.pageSize = +pageSize;
		this.pageNumber = 1;
		localStorage.setItem('userPageSize', pageSize);
		this.listProducts();
	}

	processResult() {
		return (data: any) => {
			this.products = data._embedded.products;
			this.pageNumber = data.page.number + 1;
			this.pageSize = data.page.size;
			this.totalElements = data.page.totalElements;
		}
	}

	getUserPageSize() {
		const pageSize = localStorage.getItem('userPageSize');
		if(pageSize) {
			this.pageSize = +pageSize;
		}
	}

	addToCart(product: Product) {
		console.log(`Adding to cart: name=${product.name}, price=${product.unitPrice}`);

		// TODO ... do the real work
		const cartItem = new CartItem(product);

		this.cartService.addToCart(cartItem);
	}
}
