import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { DashboardChartComponent } from '../dashboard-chart/dashboard-chart.component';
import { CircleProgressOptions, NgCircleProgressModule } from 'ng-circle-progress';
@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule,
    NgCircleProgressModule,
      
  ],
  providers: [
    {
      provide: CircleProgressOptions,
      useValue: {
        radius: 60,
        outerStrokeWidth: 10,
        innerStrokeWidth: 5,
        outerStrokeColor: "#4882c2",
        innerStrokeColor: "#e7e8ea",
        animation: true,
        animationDuration: 300,
        showTitle: false,
      }
    }
  ]
})
export class AdminDashboardComponent implements OnInit{

  
  
  totalCustomers: number = 0;
  totalProducts: number = 0;
  lowStockProducts: number = 0;
  totalOrders: number = 0;
  customerList: any[] = [];

  customerProgress: number = 0;
  productProgress: number = 0;
  lowStockProgress: number = 0;
  orderProgress: number = 0;
  

  constructor(private router: Router, private http: HttpClient) {}



  ngOnInit(): void {
    this.fetchAnalytics();
    
  }

  
  fetchAnalytics(): void {
    this.http.get<any>('http://localhost:8080/api/admin/analytics')
      .subscribe({
        next: (data) => {
          this.totalCustomers = data.totalCustomers;
          this.totalProducts = data.totalProducts;
          this.lowStockProducts = data.lowStockProducts;
          this.totalOrders = data.totalOrders;

          // Optional: calculate progress % for visual progress ring
        this.customerProgress = Math.min((this.totalCustomers / 500) * 100, 100);
        this.productProgress = Math.min((this.totalProducts / 500) * 100, 100);
        this.lowStockProgress = Math.min((this.lowStockProducts / 500) * 100, 100);
        this.orderProgress = Math.min((this.totalOrders / 500) * 100, 100);
        },
        error: (err) => {
          console.error('Dashboard data fetch failed:', err);
        }
      });
  }
  

  

  goToViewCustomers(): void {
   this.router.navigate(['/admin/view-customers']);
  }

  goToOrderStatus():void{
    this.router.navigate(['/admin/orderstatus']);
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
}
