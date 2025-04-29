import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

interface Order {
  id: number;
  orderDate: string;
  totalAmount: number;
  // Add more fields as per your Order entity
}
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
  standalone: true, // 👈 if you're using standalone
  imports: [CommonModule],
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})
export class OrdersComponent implements OnInit {

  orders: Order[] = [];
  cartItems: CartItem[] = [];
  name = localStorage.getItem('name') || 'Customer';
  error: string | undefined;
  isLoading: boolean | undefined;
  
  constructor(private http: HttpClient, private router: Router) {}


  ngOnInit(): void {
    this.getOrders();
    this.fetchCartItems();
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

  getOrders(): void {
    const token = localStorage.getItem('token'); // adjust if stored differently
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    this.http.get<Order[]>('http://localhost:8080/api/customer/orders', { headers })
      .subscribe({
        next: data => this.orders = data,
        error: err => console.error('Failed to fetch orders', err)
      });
  }

  
  toDashboard():void {
   
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
