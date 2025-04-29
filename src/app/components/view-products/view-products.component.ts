import { Component } from '@angular/core';
import { Product } from '../../models/product.model';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-view-products',
  standalone: false,
  templateUrl: './view-products.component.html',
  styleUrls: ['./view-products.component.css']
})
export class ViewProductsComponent {
  products: Product[] = [];
  filteredProducts: Product[] = [];

  searchName: string = '';
  searchPrice: string = '';
  searchQuery: string = '';
  
  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    this.fetchProducts();
  }

  // Fetch all products from backend
  fetchProducts(): void {
    this.http.get<Product[]>('http://localhost:8080/api/admin/products')
      .subscribe(data => {
        this.products = data;
        this.filteredProducts = data;
      }, error => {
        console.error('Failed to fetch products', error);
      });
  }

 

filterProducts(): void {
  const query = this.searchQuery.trim().toLowerCase();

  this.filteredProducts = this.products.filter(product => {
    const matchesName = product.name.toLowerCase().includes(query);
    const matchesPrice = product.price.toString().includes(query);
    return matchesName || matchesPrice;
  });
}


  deleteProduct(id: number): void {
    this.http.delete(`http://localhost:8080/api/admin/products/${id}`)
      .subscribe(() => {
        alert('Product deleted successfully!');
        this.fetchProducts();
      }, error => {
        console.error('Error deleting product:', error);
        alert('Failed to delete product.');
      });
  }

  editProduct(id: number, newStock: number): void {
    const stockUpdate = { stock: newStock };
    this.http.put<Product>(`http://localhost:8080/api/admin/products/${id}/stock`, stockUpdate)
      .subscribe(() => {
        alert('Product stock updated successfully!');
        this.fetchProducts();
      }, error => {
        console.error('Error editing product:', error);
        alert('Failed to edit product.');
      });
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
