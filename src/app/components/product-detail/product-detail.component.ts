import { Component, OnInit } from '@angular/core';
import { Product } from '../../models/product.model';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';

interface CartItem {
  productId: number;
  productName: string;
  price: number;
  quantity: number;
  imageUrl: string;
  category?: string;
  seller?: string;
}

@Component({
  selector: 'app-product-detail',
  standalone: false,
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.css'
})

export class ProductDetailComponent implements OnInit {
  
  product: Product | null = null;
  message: string = '';
  loading: boolean = true;
  name = localStorage.getItem('name') || 'Customer';

  
  cartItems: CartItem[] = [];
  error: string | undefined;
  isLoading: boolean | undefined;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit(): void {
    const productId = +this.route.snapshot.paramMap.get('productId')!;
    this.fetchProductDetails(productId);
    this.fetchCartItems();
  }

  fetchProductDetails(productId: number): void {
    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };
  
    this.http.get<Product>(`http://localhost:8080/api/customer/products/${productId}`, { headers })
      .subscribe({
        next: (data) => {
          this.product = data;
          this.loading = false;
        },
        error: (err) => {
          this.message = 'Failed to fetch product details.';
          this.loading = false;
        }
      });
  }
  
  fetchCartItems(): void {
    this.isLoading = true;
    const token = localStorage.getItem('token');
    
    if (!token) {
      this.router.navigate(['/customer/login']);
      return;
    }
    
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    
    this.http.get<CartItem[]>('http://localhost:8080/api/customer/cart', { headers })
      .subscribe({
        next: (data) => {
          this.cartItems = data;
          console.log('Fetched cart items:', data);
          this.isLoading = false;
        },
        error: (err: HttpErrorResponse) => {
          console.error('Error fetching cart items:', err);
          this.error = 'Failed to load cart items. Please try again.';
          this.isLoading = false;
          
          if (err.status === 401) {
            localStorage.clear();
            this.router.navigate(['/customer/login']);
          }
        }
      });
  }

  addToCart(product: Product): void {
    if (product.stock === 0) {
      this.message = `${product.name} is out of stock and cannot be added to the cart.`;
      setTimeout(() => this.message = '', 3000);
      return;
    }

    const token = localStorage.getItem('token');
    const headers = { headers: { Authorization: `Bearer ${token}` } };
    const cartItem = { productId: product.id, quantity: 1 };

    this.http.post('http://localhost:8080/api/customer/cart/add', cartItem, headers)
      .subscribe({
        next: () => {
          this.message = `${product.name} added to cart!`;
          setTimeout(() => this.message = '', 3000);
        },
        error: (err) => {
          console.error('Error adding to cart:', err);
          this.message = `Failed to add ${product.name} to cart.`;
        }
      });
  }

  goToCatalog(): void {
    this.router.navigate(['/customer/dashboard']);
  }

  logout() {
    localStorage.clear();
    this.router.navigate(['/customer/login']);
  }
  goToCart() {
    this.router.navigate(['/customer/cart']);
  }
  goToOrders() {
    this.router.navigate(['/customer/orders']);
  }

  

 
  
}
