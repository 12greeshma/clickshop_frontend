import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

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
  selector: 'app-customer-cart',
  standalone: true,
  imports: [CommonModule, FormsModule,RouterModule],
  templateUrl: './customer-cart.component.html',
  styleUrls: ['./customer-cart.component.css']
})
export class CustomerCartComponent implements OnInit {
  cartItems: CartItem[] = [];
  name = localStorage.getItem('name') || 'Customer';
  promoCode: string = '';
  discount: number = 0;
  isLoading: boolean = false;
  error: string | null = null;

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
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

  getSubtotal(): number {
    return this.cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  }

  getShipping(): number {
    const subtotal = this.getSubtotal();
    // Free shipping for orders over ₹500
    return subtotal > 500 ? 0 : 50;
  }

  getDiscount(): number {
    return this.discount;
  }

  // getTax(): number {
  //   const subtotal = this.getSubtotal();
  //   return subtotal * 0.18;
  // }

  getTotal(): number {
    return this.getSubtotal() + this.getShipping()  - this.getDiscount();
  }

  increaseQuantity(item: CartItem): void {
    item.quantity += 1;
    this.updateQuantity(item);
  }

  decreaseQuantity(item: CartItem): void {
    if (item.quantity > 1) {
      item.quantity -= 1;
      this.updateQuantity(item);
    }
  }

  updateQuantity(item: CartItem): void {
    if (item.quantity < 1) {
      item.quantity = 1;
    }
    
    const token = localStorage.getItem('token');
    if (!token) {
      this.router.navigate(['/customer/login']);
      return;
    }
    
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    
    const body = {
      productId: item.productId,
      quantity: item.quantity
    };
    
    this.http.put('http://localhost:8080/api/customer/cart/update', body, { headers })
      .subscribe({
        next: (updatedItem: any) => {
          console.log('Quantity updated successfully:', updatedItem);
        },
        error: (err: HttpErrorResponse) => {
          console.error('Failed to update quantity:', err);
          alert('Failed to update quantity. Please try again.');
          
          // Revert the quantity if update fails
          this.fetchCartItems();
        }
      });
  }

  removeItemFromCart(productId: number): void {
    const token = localStorage.getItem('token');
    if (!token) {
      this.router.navigate(['/customer/login']);
      return;
    }
    
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    
    this.http.delete(`http://localhost:8080/api/customer/cart/remove/${productId}`, { headers })
      .subscribe({
        next: (response: any) => {
          console.log('Item removed successfully:', response);
          // Filter out the removed item
          this.cartItems = this.cartItems.filter(item => item.productId !== productId);
        },
        error: (err: HttpErrorResponse) => {
          console.error('Error removing item:', err);
          alert('Failed to remove item from cart. Please try again.');
        }
      });
  }

  applyPromoCode(): void {
    if (!this.promoCode) {
      alert('Please enter a promo code');
      return;
    }
    
    const token = localStorage.getItem('token');
    if (!token) {
      this.router.navigate(['/customer/login']);
      return;
    }
    
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    
    this.http.post('http://localhost:8080/api/customer/cart/promo', { code: this.promoCode }, { headers })
      .subscribe({
        next: (response: any) => {
          if (response.valid) {
            this.discount = response.discount;
            alert(`Promo code applied! You saved ₹${this.discount}`);
          } else {
            alert('Invalid promo code');
          }
        },
        error: (err: HttpErrorResponse) => {
          console.error('Error applying promo code:', err);
          alert('Failed to apply promo code. Please try again.');
        }
      });
  }

  checkout(): void {
    if (this.cartItems.length === 0) {
      alert('Your cart is empty');
      return;
    }
    
    this.router.navigate(['/customer/checkout']);
  }

  toDashboard(): void {
    this.router.navigate(['/customer/dashboard']);
  }

  goToCart(): void {
    // Already on cart page
  }

  goToOrders(): void {
    this.router.navigate(['/customer/orders']);
  }

  logout(): void {
    localStorage.clear();
    this.router.navigate(['/customer/login']);
  }
}