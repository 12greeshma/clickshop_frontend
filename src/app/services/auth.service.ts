import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private baseUrl = 'http://localhost:8080/api'; 

  constructor(private http: HttpClient, private router: Router) {}

  loginAdmin(credentials: any) {
    return this.http.post(`${this.baseUrl}/admin/login`, credentials);
  }

  loginCustomer(credentials: any) {
    return this.http.post(`${this.baseUrl}/auth/login`, credentials);
  }

  registerCustomer(data: any) {
    return this.http.post('http://localhost:8080/api/auth/customer/cart/add', data);
  }

  storeToken(token: string, role: string) {
    localStorage.setItem('token', token);
    localStorage.setItem('role', role);
  }

  getToken() {
    return localStorage.getItem('token');
  }

  getRole() {
    return localStorage.getItem('role');
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  logout() {
    localStorage.clear();
    this.router.navigate(['/customer/login']);
  }
}
