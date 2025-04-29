import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AdminLoginComponent } from './components/admin-login/admin-login.component';
import { CustomerLoginComponent } from './components/customer-login/customer-login.component';
import { CustomerRegisterComponent } from './components/customer-register/customer-register.component';
import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard.component';
import { CustomerDashboardComponent } from './components/customer-dashboard/customer-dashboard.component';
import { AuthInterceptor } from './auth.interceptor';
import { HomeComponent } from './home/home.component';
import { CustomerCartComponent } from './customer-cart/customer-cart.component';
import { CheckoutComponent } from './checkout/checkout.component';
import { OrdersComponent } from './components/orders/orders.component';
import { AddProductComponent } from './components/add-product/add-product.component';
import { EditProductComponent } from './components/edit-product/edit-product.component';
import { ViewProductsComponent } from './components/view-products/view-products.component';
import { DeleteProductComponent } from './components/delete-product/delete-product.component';
import { ViewOrdersComponent } from './components/view-orders/view-orders.component';
import { ProductDetailComponent } from './components/product-detail/product-detail.component';
import { AdminViewcustomersComponent } from './components/admin-viewcustomers/admin-viewcustomers.component';
import { DashboardChartComponent } from './components/dashboard-chart/dashboard-chart.component';
import { NgCircleProgressModule } from 'ng-circle-progress';
import { AdminOrderstatusComponent } from './components/admin-orderstatus/admin-orderstatus.component';
import { AboutusComponent } from './components/aboutus/aboutus.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    AddProductComponent,
    EditProductComponent,
    ViewProductsComponent,
    DeleteProductComponent,
    ViewOrdersComponent,
    ProductDetailComponent,
    AdminViewcustomersComponent,
    AdminOrderstatusComponent,
    AboutusComponent,
    
  ],
  imports: [BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    AdminDashboardComponent,       
    CustomerDashboardComponent,
    CustomerCartComponent,  
    CheckoutComponent,
    OrdersComponent,
    NgCircleProgressModule,
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
