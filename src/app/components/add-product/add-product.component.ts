import { Component } from '@angular/core';
import { Product } from '../../models/product.model';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-product',
  standalone: false,
  templateUrl: './add-product.component.html',
  styleUrl: './add-product.component.css'
})
export class AddProductComponent {

  product: Product = {
    id: 0,
    name: '',
    price: 0,
    stock: 0,
    description: '',
    imageUrl: ''
  };

  constructor(private http: HttpClient, private router: Router) {}

  addProduct(): void {
    this.http.post<Product>('http://localhost:8080/api/admin/products', this.product)
      .subscribe(
        response => {
          alert('Product added successfully!');
          this.router.navigate(['/admin/view-products']);
        },
        error => {
          console.error('Error adding product:', error);
          alert('Failed to add product.');
        }
      );
  }

  goToDashboard(): void {
    this.router.navigate(['/admin/dashboard']);
  }

  logout() {
    localStorage.clear();
    this.router.navigate(['/admin/login']);
  }
  

  goToAddProduct(): void {
    this.router.navigate(['/admin/add-product']);
  }

  goToViewProducts(): void {
    this.router.navigate(['/admin/view-products']);
  }

  goToEditProducts(): void {
    this.router.navigate(['/admin/view-products']);
  }

  goToDeleteProducts(): void {
    this.router.navigate(['/admin/view-products']);
  }

  goToViewOrders(): void {
    this.router.navigate(['/admin/view-orders']);
  }

  goToViewCustomers(): void {
    this.router.navigate(['/admin/view-customers']);
   }

   goToOrderStatus():void{
    this.router.navigate(['/admin/orderstatus']);
  }
}