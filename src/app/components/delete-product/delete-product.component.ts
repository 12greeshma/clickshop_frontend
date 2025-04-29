import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Product } from '../../models/product.model';

@Component({
  selector: 'app-delete-product',
  standalone: false,
  templateUrl: './delete-product.component.html',
  styleUrls: ['./delete-product.component.css']
})
export class DeleteProductComponent implements OnInit {

  productId: number = 0;
  product: Product | null = null;
  isDeleted: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Get the product ID from the route parameters
    this.route.paramMap.subscribe(params => {
      this.productId = +params.get('id')!;
      this.fetchProductDetails();
    });
  }

  // Fetch the product details using the product ID
  fetchProductDetails(): void {
    this.http.get<Product>(`http://localhost:8080/api/admin/products/${this.productId}`)
      .subscribe(
        response => {
          this.product = response;
        },
        error => {
          console.error('Error fetching product details:', error);
          alert('Failed to fetch product details.');
        }
      );
  }

  // Delete the product
  deleteProduct(): void {
    this.http.delete(`http://localhost:8080/api/admin/products/${this.productId}`)
      .subscribe(
        () => {
          this.isDeleted = true;
          alert('Product deleted successfully!');
          this.router.navigate(['/admin/view-products']);
        },
        error => {
          console.error('Error deleting product:', error);
          alert('Failed to delete product.');
        }
      );
  }

  // Cancel and go back to the products list
  cancelDelete(): void {
    this.router.navigate(['/admin/view-products']);
  }
}
