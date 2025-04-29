import { Component, OnInit ,ChangeDetectorRef} from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
declare var Razorpay: any;

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {

  cartItems: any[] = [];
  totalAmount: number = 0;
  successMessage: string = '';
  constructor(private http: HttpClient, private router: Router,private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    const token = localStorage.getItem('token'); 
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    // Get the cart items again for the checkout page
    this.http.get<any[]>('http://localhost:8080/api/customer/cart', { headers })
      .subscribe({
        next: (data) => {
          this.cartItems = data;
          this.totalAmount = this.getTotal(); // Calculate the total amount
        },
        error: (err) => {
          console.error('Error fetching cart items:', err);
        }
      });
  }

  // getTotal() {
  //   return this.cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  // }

  getTotal() {
    return this.cartItems.reduce((total, item) => {
      const extraCharge = item.price < 500 ? 50 : 0;
      return total + (item.price * item.quantity) + extraCharge;
    }, 0);
  }
  

  // placeOrder() {
  //   const token = localStorage.getItem('token');
  //   const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
  
  //   this.http.post<any>('http://localhost:8080/api/customer/place-order', {}, { headers })
  //     .subscribe({
  //       next: (response) => {
  //         this.successMessage = response.message; // Set the success message
  //         this.cdr.detectChanges(); // Trigger change detection to update the UI

  //         setTimeout(() => {
  //           this.successMessage = ''; 
  //           this.router.navigate(['/customer/dashboard']); 
  //         }, 4000); 
  //       },
  //       error: (error) => {
  //         console.error('Error placing order:', error);
  //         alert('Failed to place order.');
  //       }
  //     });
  // }

  
  placeOrder() {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
  
    const options: any = {
      key: 'rzp_test_VQ1UNRiUxYeFru', // Replace with your Razorpay Test Key
      amount: this.totalAmount * 100, // Razorpay expects amount in paise
      currency: 'INR',
      name: 'ClickShop',
      description: 'Order Payment',
      image: 'https://your-logo-url.com/logo.png', // optional
      handler: (response: any) => {
        // Payment success
        console.log('Payment successful', response);
        this.successMessage = 'Payment Successful. Placing Order...';
        this.cdr.detectChanges();
  
        // Now call your backend to place the order
        this.http.post<any>('http://localhost:8080/api/customer/place-order', {}, { headers })
          .subscribe({
            next: (res) => {
              setTimeout(() => {
                this.successMessage = '';
                this.router.navigate(['/customer/dashboard']);
              }, 3000);
            },
            error: (err) => {
              console.error('Error placing order:', err);
            }
          });
      },
      prefill: {
        name: 'Test User',
        email: 'test@example.com',
        contact: '9999999999'
      },
      theme: {
        color: '#3399cc'
      }
    };
  
    const rzp = new Razorpay(options);
    rzp.open();
  }
  
 

  goToCart() {
    this.router.navigate(['/customer/cart']);
  }

  logout() {
    localStorage.clear();
    this.router.navigate(['/customer/login']);
  }
  
}
