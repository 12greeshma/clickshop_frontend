import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminLoginComponent } from './components/admin-login/admin-login.component';
import { CustomerLoginComponent } from './components/customer-login/customer-login.component';
import { CustomerRegisterComponent } from './components/customer-register/customer-register.component';
import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard.component';
import { CustomerDashboardComponent } from './components/customer-dashboard/customer-dashboard.component';
import { AuthGuard } from './guards/auth.guard';
import { HomeComponent } from './home/home.component';
import { CustomerCartComponent } from './customer-cart/customer-cart.component';
import { CheckoutComponent } from './checkout/checkout.component';
import { OrdersComponent } from './components/orders/orders.component';
import { ViewProductsComponent } from './components/view-products/view-products.component';
import { AddProductComponent } from './components/add-product/add-product.component';
import { DeleteProductComponent } from './components/delete-product/delete-product.component';
import { ViewOrdersComponent } from './components/view-orders/view-orders.component';
import { ProductDetailComponent } from './components/product-detail/product-detail.component';
import { AdminViewcustomersComponent } from './components/admin-viewcustomers/admin-viewcustomers.component';
import { AdminOrderstatusComponent } from './components/admin-orderstatus/admin-orderstatus.component';
import { AboutusComponent } from './components/aboutus/aboutus.component';
const routes: Routes = [
  { path: 'admin/login', component: AdminLoginComponent },
  { path: 'customer/login', component: CustomerLoginComponent },
  { path: 'customer/register', component: CustomerRegisterComponent },
  { path: '', component: HomeComponent }, 
  { path: 'home', component: HomeComponent },
  { path: 'admin/dashboard', component: AdminDashboardComponent, canActivate: [AuthGuard], data: { role: 'ROLE_ADMIN' } },
  { path: 'customer/dashboard', component: CustomerDashboardComponent,canActivate: [AuthGuard] ,data: { role: 'ROLE_CUSTOMER' }},
  { path: 'customer/login', component: CustomerLoginComponent },
  { path: 'customer/cart', component: CustomerCartComponent },
  { path: 'customer/checkout', component: CheckoutComponent },
  {path: 'customer/orders', component: OrdersComponent},
  { path: 'admin/view-products', component: ViewProductsComponent },
  { path: 'admin/add-product',component: AddProductComponent},
  { path: 'admin/delete-product',component: DeleteProductComponent},
  { path: 'admin/view-orders', component: ViewOrdersComponent },
  { path: 'customer/products/:productId', component: ProductDetailComponent },
  { path: 'admin/view-customers', component: AdminViewcustomersComponent },
  { path: 'admin/orderstatus',component:AdminOrderstatusComponent},
  { path: 'customer/aboutus',component:AboutusComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
