import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';

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
  selector: 'app-aboutus',
  standalone: false,
  templateUrl: './aboutus.component.html',
  styleUrl: './aboutus.component.css'
})


export class AboutusComponent {

  name = localStorage.getItem('name') || 'Customer';
  message: string = '';
  error: string | undefined;
  isLoading: boolean | undefined;
  cartItemCount: number = 0; 
  cartItems: CartItem[] = [];
  

  customerName = '';
  customerEmail = '';
  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit() {
    this.customerName = localStorage.getItem('name') || '';
    this.customerEmail = localStorage.getItem('email') || '';
    
    this.fetchCartItems();
    
  }
  goToCart() {
    this.router.navigate(['/customer/cart']);
  }
  
  goToOrders() {
    this.router.navigate(['/customer/orders']);
  }

  logout() {
    localStorage.clear();
    this.router.navigate(['/customer/login']);
  }

  aboutus(){
    this.router.navigate(['/customer/aboutus']);
  }

  toDashboard(): void {
    this.router.navigate(['/customer/dashboard']);
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
  
}
