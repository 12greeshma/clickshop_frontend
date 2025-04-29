const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';

import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';

interface Order {
  id: number;
  customerId: number;
  totalAmount: number;
  status: string;
  orderDate: string;
  productId: number;
}

@Component({
  selector: 'app-view-orders',
  standalone: false,
  templateUrl: './view-orders.component.html',
  styleUrl: './view-orders.component.css'
})
export class ViewOrdersComponent {
  orders: Order[] = [];
  filteredOrders: Order[] = [];

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    this.fetchOrders();
  }

  fetchOrders(): void {
    this.http.get<Order[]>('http://localhost:8080/api/admin/orders').subscribe({
      next: (data) => {
        this.orders = data;
        this.filteredOrders = this.getOrdersLastNDays(7);
      },
      error: (err) => {
        console.error('Error fetching orders', err);
        alert('Failed to fetch orders.');
      }
    });
  }

  getOrdersLastNDays(days: number): Order[] {
    const today = new Date();
    const pastDate = new Date();
    pastDate.setDate(today.getDate() - days);

    return this.orders.filter(order => {
      const orderDate = new Date(order.orderDate);
      return orderDate >= pastDate && orderDate <= today;
    });
  }

  exportAllOrders(): void {
    this.exportToExcel(this.orders, 'ClickShop_All_Orders');
  }

  exportLast7DaysOrders(): void {
    const recentOrders = this.getOrdersLastNDays(7);
    this.exportToExcel(recentOrders, 'ClickShop_Last7Days_Orders');
  }

  private exportToExcel(data: Order[], fileName: string): void {
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);
    const workbook: XLSX.WorkBook = {
      Sheets: { 'Orders': worksheet },
      SheetNames: ['Orders']
    };

    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    this.saveAsExcelFile(excelBuffer, fileName);
  }

  private saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], { type: EXCEL_TYPE });
    FileSaver.saveAs(data, `${fileName}_export_${new Date().getTime()}.xlsx`);
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

  goToOrderStatus(): void {
    this.router.navigate(['/admin/orderstatus']);
  }
}
