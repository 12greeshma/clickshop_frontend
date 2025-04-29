import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Product } from '../../models/product.model';
import { RouterModule } from '@angular/router';
declare var $: any;

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
  selector: 'app-customer-dashboard',
  templateUrl: './customer-dashboard.component.html',
  styleUrls: ['./customer-dashboard.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
})

export class CustomerDashboardComponent implements OnInit {
  
  products: Product[] = [];
  filteredProducts: Product[] = [];
  cartProducts: Product[] = [];
  cartItemCount: number = 0; 
  cartItems: CartItem[] = [];
  // bind this to the search input
  searchTerm: string = '';
  
  // New arrays for best selling and trending products
  bestSellingProducts: Product[] = [];
  trendingProducts: Product[] = [];
  
  // for pagination
  currentPage: number = 1; // current page number
  pageSize: number = 8; // number of products per page
  totalProducts: number = 0; // total number of products
  totalPages: number = 0;
  
  name = localStorage.getItem('name') || 'Customer';
  message: string = '';
  error: string | undefined;
  isLoading: boolean | undefined;

  constructor(private http: HttpClient, private router: Router) {}

  customerName = '';
  customerEmail = '';


  testimonials = [
    {
      id: 1,
      name: 'Divya',
      position: 'Regular Customer',
      quote: 'I\'ve been shopping at ClickShop from long time and I\'m always impressed by the quality of products and customer service. The website is easy to navigate and delivery is always on time!',
      // image: 'assets/images/testimonials/customer-1.jpg'
    },
    {
      id: 2,
      name: 'Arun',
      position: 'Verified Buyer',
      quote: 'ClickShop has the best prices I\'ve found online. Their product range is extensive and the checkout process is seamless. Definitely my go-to online store!',
      // image: 'assets/images/testimonials/customer-2.jpg'
    },
    {
      id: 3,
      name: 'Priya',
      position: 'Loyal Customer',
      quote: 'The customer support at ClickShop is exceptional. I had an issue with my order and they resolved it immediately. Plus, their product recommendations are always spot on!',
      // image: 'assets/images/testimonials/customer-3.jpg'
    }
  ];

  ngOnInit() {
    this.customerName = localStorage.getItem('name') || '';
    this.customerEmail = localStorage.getItem('email') || '';
    this.fetchProducts();
    this.fetchCartItems();
    this.fetchBestSellingProducts();
    this.fetchTrendingProducts();
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
  
  ngAfterViewInit() {
    setTimeout(() => {
      // Initialize Slick Carousel after view initialization
      $('.slider').slick({
        autoplay: true, 
        autoplaySpeed: 3000,  
        dots: true,  
        arrows: false,  
        speed: 500,  
        fade: false, 
        cssEase: 'ease-in-out',
        Infinity: true
      });
      
      // Initialize carousels for best selling and trending products
      $('.best-selling-carousel, .trending-carousel').slick({
        slidesToShow: 4,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 3000,
        arrows: true,
        dots: false,
        responsive: [
          {
            breakpoint: 1200,
            settings: {
              slidesToShow: 3
            }
          },
          {
            breakpoint: 768,
            settings: {
              slidesToShow: 2
            }
          },
          {
            breakpoint: 576,
            settings: {
              slidesToShow: 1
            }
          }
        ]
      });
    }, 0);



    $('.testimonial-carousel').slick({
      slidesToShow: 3,
      slidesToScroll: 1,
      autoplay: true,
      autoplaySpeed: 4000,
      arrows: false,
      dots: true,
      pauseOnHover: false,
      responsive: [
        {
          breakpoint: 992,
          settings: {
            slidesToShow: 2
          }
        },
        {
          breakpoint: 768,
          settings: {
            slidesToShow: 1
          }
        }
      ]
    });
  }

  fetchProducts() {
    this.http.get<Product[]>('http://localhost:8080/api/customer/products')
      .subscribe({
        next: (data) => {
          this.products = data;
          // initialize filteredProducts
          this.filteredProducts = data;

          this.totalProducts = data.length;
          this.totalPages = Math.ceil(this.totalProducts / this.pageSize);
          this.setPage(1); // initialize with page 1
        },
        error: (err) => {
          console.error('Failed to fetch products', err);
        }
      });
  }
  
  // method to fetch best selling products
  fetchBestSellingProducts() {
    this.http.get<Product[]>('http://localhost:8080/api/customer/products')
      .subscribe({
        next: (data) => {
          this.bestSellingProducts = data;
        },
        error: (err) => {
          console.error('Failed to fetch best selling products', err);
        
          this.http.get<Product[]>('http://localhost:8080/api/customer/products')
            .subscribe({
              next: (products) => {
                
                this.bestSellingProducts = products.slice(0, 8);
              }
            });
        }
      });
  }
  
  // method to fetch trending products
  fetchTrendingProducts() {
    this.http.get<Product[]>('http://localhost:8080/api/customer/products')
    .subscribe({
      next: (products) => {
      
        this.trendingProducts = products.slice(8, 16);
      },
        error: (err) => {
          console.error('Failed to fetch trending products', err);
         
          this.http.get<Product[]>('http://localhost:8080/api/customer/products')
            .subscribe({
              next: (products) => {
              
                this.trendingProducts = products.slice(8, 16);
              }
            });
        }
      });
  }

  setPage(page: number): void {
    this.currentPage = page;
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.filteredProducts = this.products.slice(startIndex, endIndex);
  }
  
  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.setPage(this.currentPage + 1);
    }
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.setPage(this.currentPage - 1);
    }
  }

  isInCart(productId: number): boolean {
    return this.cartProducts.some(p => p.id === productId);
  }

  searchProducts() {
    const term = this.searchTerm.trim().toLowerCase();
    if (!term) {
      this.filteredProducts = this.products;
      return;
    }
  
    const maybeNumber = Number(term);
    if (!isNaN(maybeNumber)) {
      this.filteredProducts = this.products.filter(p => p.price === maybeNumber);
    } else {
      this.filteredProducts = this.products.filter(p =>
        p.name.toLowerCase().includes(term)
      );
    }
  }

  addToCart(product: Product) {
    if (product.stock === 0) {
      this.message = `${product.name} is out of stock and cannot be added to the cart.`;
      setTimeout(() => this.message = '', 3000);
      return;
    }
    const token = localStorage.getItem('token');
    const headers = { headers: { Authorization: `Bearer ${token}` } };
    const cartItem = { productId: product.id, quantity: 1, imageUrl: product.imageUrl };

    this.http.post('http://localhost:8080/api/customer/cart/add', cartItem, headers)
      .subscribe({
        next: () => {
          this.message = `${product.name} added to cart!`;
          setTimeout(() => this.message = '', 8000);
          this.fetchCartItems(); 
        },
        error: (err) => {
          console.error('Error adding to cart:', err);
          this.message = `Failed to add ${product.name} to cart.`;
        },
      });
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

  viewProductDetails(productId: number) {
    this.router.navigate([`/customer/products/${productId}`]);
  }
  
  showSuggestions = false;

  hideSuggestionsWithDelay() {
    setTimeout(() => {
      this.showSuggestions = false;
    }, 200); // slight delay to allow click event to trigger
  }







  
}