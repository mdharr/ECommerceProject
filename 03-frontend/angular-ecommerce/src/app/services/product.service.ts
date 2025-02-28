import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Product } from '../models/product';
import { ProductCategory } from '../models/product-category';
import { environment } from 'src/environments/environment';

@Injectable({
	providedIn: 'root',
})
export class ProductService {

	// private baseUrl = 'http://localhost:8080/api/products';
	private baseUrl: string = environment.luv2shopApiUrl + '/products';


	// private categoryUrl = 'http://localhost:8080/api/product-category';
	private categoryUrl: string = environment.luv2shopApiUrl + '/product-category';

	constructor(private httpClient: HttpClient) {}

	getProduct(productId: number): Observable<Product> {
		const productUrl = `${this.baseUrl}/${productId}`;
		return this.httpClient.get<Product>(productUrl);
	}

	getProductListPaginate(page: number, pageSize: number, categoryId: number): Observable<GetResponseProducts> {
		const searchUrl = `${this.baseUrl}/search/findByCategoryId?id=${categoryId}`
										+ `&page=${page}&size=${pageSize}`;
		return this.httpClient.get<GetResponseProducts>(searchUrl);
	}

	searchProducts(keyword: string): Observable<Product[]> {
		const searchUrl = `${this.baseUrl}/search/findByNameContaining?name=${keyword}`;
		return this.getProducts(searchUrl);
	}

	searchProductsPaginate(page: number, pageSize: number, keyword: string): Observable<GetResponseProducts> {
		const searchUrl = `${this.baseUrl}/search/findByNameContaining?name=${keyword}`
										+ `&page=${page}&size=${pageSize}`;
		return this.httpClient.get<GetResponseProducts>(searchUrl);
	}

	private getProducts(searchUrl: string): Observable<Product[]> {
		return this.httpClient
			.get<GetResponseProducts>(searchUrl)
			.pipe(map((response) => response._embedded.products));
	}

	getProductCategories(): Observable<ProductCategory[]> {
		return this.httpClient
			.get<GetResponseProductCategory>(this.categoryUrl)
			.pipe(map((response) => response._embedded.productCategory));
	}

}

interface GetResponseProducts {
	_embedded: {
		products: Product[];
	},
	page: {
		size: number,
		totalElements: number,
		totalPages: number,
		number: number
	}
}

interface GetResponseProductCategory {
	_embedded: {
		productCategory: ProductCategory[];
	}
}
