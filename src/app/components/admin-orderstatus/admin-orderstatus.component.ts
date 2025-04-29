import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-orderstatus',
  standalone: false,
  templateUrl: './admin-orderstatus.component.html',
  styleUrls: ['./admin-orderstatus.component.css']
})
export class AdminOrderstatusComponent {
  orderId: number = 0;  // Order ID provided by admin
  status: string = 'Shipped';  // Default status
  updateMessage: string = '';  // To display success or error message

  private apiUrl = 'http://localhost:8080/api/admin/orders'; 

  constructor(private http: HttpClient, private router: Router) {}

  
ngOnInit(): void {
    // Initialize any required data
  }
  
  updateStatus(): void {
    if (!this.orderId || !this.status) {
      this.updateMessage = 'Please provide a valid order ID and status.';
      return;
    }
  
    const statusUpdate = { status: this.status };
    const token = localStorage.getItem('token'); // Assuming token is in localStorage
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
  
    this.http.put<any>(`http://localhost:8080/api/admin/orders/${this.orderId}/status`, statusUpdate, { headers })
      .subscribe(
        (response) => {
          // Check if the HTTP status is 200
          if (response) {
            this.updateMessage = 'Order status updated successfully!';
          }
        },
        (error) => {
          // Check if the error is an HttpErrorResponse and the status code is 200
          if (error.status === 200) {
            this.updateMessage = 'Order status updated successfully!';
          } else {
            console.error('Error updating order status:', error);
            this.updateMessage = 'Failed to update order status';
          }
        }
      );
  }
  

  // Other navigation methods
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
