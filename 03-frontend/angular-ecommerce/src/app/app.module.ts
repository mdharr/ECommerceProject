import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Routes, RouterModule, Router } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { ProductListComponent } from './components/product-list/product-list.component';
import { ProductService } from './services/product.service';
import { ProductCategoryMenuComponent } from './components/product-category-menu/product-category-menu.component';
import { SearchComponent } from './components/search/search.component';
import { ProductDetailsComponent } from './components/product-details/product-details.component';
import { CartStatusComponent } from './components/cart-status/cart-status.component';
import { CartDetailsComponent } from './components/cart-details/cart-details.component';
import { CheckoutComponent } from './components/checkout/checkout.component';
import { LoginComponent } from './components/login/login.component';
import { LoginStatusComponent } from './components/login-status/login-status.component';
import { AuthInterceptor } from './interceptors/auth.interceptor';
import { authGuardFn } from './guards/auth.guard';
import { RegisterComponent } from './components/register/register.component';
import { MembersPageComponent } from './components/members-page/members-page.component';
import { noAuthGuardFn } from './guards/no-auth.guard';
import { OrderHistoryComponent } from './components/order-history/order-history.component';

const routes: Routes = [
	{path: 'register', component: RegisterComponent, canActivate: [noAuthGuardFn]},
	{path: 'login', component: LoginComponent, canActivate: [noAuthGuardFn]},
  {path: 'order-history', component: OrderHistoryComponent, canActivate: [authGuardFn]},
  {path: 'members', component: MembersPageComponent, canActivate: [authGuardFn]},
  {path: 'checkout', component: CheckoutComponent, canActivate: [authGuardFn]},
  {path: 'cart-details', component: CartDetailsComponent},
  {path: 'search/:keyword', component: ProductListComponent},
  {path: 'category/:id', component: ProductListComponent},
  {path: 'category', component: ProductListComponent},
  {path: 'products', component: ProductListComponent},
  {path: 'products/:id', component: ProductDetailsComponent},
  {path: '', redirectTo: '/products', pathMatch: 'full'},
  {path: '**', redirectTo: '/products', pathMatch: 'full'},
];

@NgModule({
  declarations: [
    AppComponent,
    ProductListComponent,
    ProductCategoryMenuComponent,
    SearchComponent,
    ProductDetailsComponent,
    CartStatusComponent,
    CartDetailsComponent,
    CheckoutComponent,
    LoginComponent,
    LoginStatusComponent,
    RegisterComponent,
    MembersPageComponent,
    OrderHistoryComponent
  ],
  imports: [
    RouterModule.forRoot(routes),
    BrowserModule,
    HttpClientModule,
    NgbModule,
		ReactiveFormsModule
  ],
  providers: [
		ProductService,
		{ provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
	],
  bootstrap: [AppComponent]
})
export class AppModule { }
