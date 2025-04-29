import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-viewcustomers',
  standalone: false,
  templateUrl: './admin-viewcustomers.component.html',
  styleUrl: './admin-viewcustomers.component.css'
})
export class AdminViewcustomersComponent implements OnInit {
  customers: any[] = [];
 

  constructor(private http: HttpClient,private router: Router) {}

  ngOnInit(): void {
    this.loadCustomers();
  }

  loadCustomers(): void {
    this.http.get<any[]>('http://localhost:8080/api/admin/customers')
      .subscribe({
        next: (data) => {
          this.customers = data;
        },
        error: (err) => {
          console.error('Failed to load customers:', err);
        }
      });
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

  goToDashboard(): void {
    this.router.navigate(['/admin/dashboard']);
  }

  goToViewCustomers(): void {
    this.router.navigate(['/admin/view-customers']);
   }

   goToOrderStatus():void{
    this.router.navigate(['/admin/orderstatus']);
  }
}