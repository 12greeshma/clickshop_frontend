import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
@Component({
  selector: 'app-customer-register',
  standalone: true,
  imports: [CommonModule, FormsModule,RouterModule],
  templateUrl: './customer-register.component.html',
  styleUrls: ['./customer-register.component.css']
})
export class CustomerRegisterComponent {
  customer = {
    name: '',
    email: '',
    password: '',
    mobileNumber: ''
  };

  error = '';
  success='';
  otpSent=false;
  otp='';
  emailForOtp='';
  constructor(private http: HttpClient, private router: Router) {}

  register() {

    this.error = '';
    this.success = '';
    if (!this.customer.name || !this.customer.email || !this.customer.password || !this.customer.mobileNumber) {
      this.error = 'All fields are required';
      return;
    }

    const mobileRegex = /^[6-9]\d{9}$/;
    if (!mobileRegex.test(this.customer.mobileNumber)) {
      this.error = 'Invalid mobile number';
      return;
    }

    const gmailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
    if (!gmailRegex.test(this.customer.email)) {
      this.error = 'Email must be a valid Gmail address ';
      return;
    }

    this.http.post('http://localhost:8080/api/auth/register', this.customer, { responseType: 'text' })
      .subscribe({
        next: (res) => {
          this.success = res; 
        //  resetting the form
          this.emailForOtp=this.customer.email;
          this.customer = { name: '', email: '', password: '', mobileNumber: '' };
          this.otpSent=true;
        },
        error: (err) => {
          this.error = 'Registration failed. ' + (err?.error || 'Try again');
        }
      });
  }


  verifyOtp() {
    this.http.post('http://localhost:8080/api/auth/verify-otp', {
      email: this.emailForOtp,
      otp: this.otp
    }, { responseType: 'text' }).subscribe({
      next: (res) => {
        this.success = 'Registration complete. You can now log in.';
        this.otpSent = false;
        this.customer = { name: '', email: '', password: '', mobileNumber: '' };
        this.emailForOtp='';
      },
      error: (err) => {
        this.error = 'OTP verification failed. ' + (err?.error || 'Try again');
      }
    });
  }
  
}
