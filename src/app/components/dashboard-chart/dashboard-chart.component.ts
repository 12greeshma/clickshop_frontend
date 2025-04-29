import { AfterViewInit, Component, Input, OnChanges, OnDestroy, SimpleChanges } from '@angular/core';
import Chart from 'chart.js/auto';

@Component({
  selector: 'app-dashboard-chart',
  standalone: true,
  templateUrl: './dashboard-chart.component.html',
  styleUrl: './dashboard-chart.component.css'
})
export class DashboardChartComponent implements OnChanges, AfterViewInit, OnDestroy {
  @Input() totalCustomers: number[] = [];
  @Input() totalProducts: number[] = [];
  @Input() lowStockProducts: number[] = [];
  @Input() totalOrders: number[] = [];

  customersChart: Chart | null = null;
  productsChart: Chart | null = null;
  lowStockChart: Chart | null = null;
  ordersChart: Chart | null = null;
  
  // Charts are ready to be rendered
  private chartsReady = false;

  ngAfterViewInit() {
    this.chartsReady = true;
    // Render charts after view initialization
    setTimeout(() => this.renderCharts(), 0);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (!this.chartsReady) return;
    
    if (changes['totalCustomers'] || changes['totalProducts'] || 
        changes['lowStockProducts'] || changes['totalOrders']) {
      // Use setTimeout to avoid ExpressionChangedAfterItHasBeenCheckedError
      setTimeout(() => this.renderCharts(), 0);
    }
  }

  ngOnDestroy() {
    // Clean up charts when component is destroyed
    this.destroyCharts();
  }

  private destroyCharts() {
    if (this.customersChart) this.customersChart.destroy();
    if (this.productsChart) this.productsChart.destroy();
    if (this.lowStockChart) this.lowStockChart.destroy();
    if (this.ordersChart) this.ordersChart.destroy();
    
    this.customersChart = null;
    this.productsChart = null;
    this.lowStockChart = null;
    this.ordersChart = null;
  }

  renderCharts() {
    // Destroy previous charts to avoid duplicates
    this.destroyCharts();

    // Only render if we have data
    if (!this.totalCustomers.length || !this.totalProducts.length ||
        !this.lowStockProducts.length || !this.totalOrders.length) {
      return;
    }

    const chartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            stepSize: Math.max(1, Math.ceil(Math.max(...this.totalCustomers) / 5))
          }
        },
        x: {
          grid: {
            display: false
          }
        }
      },
      plugins: {
        legend: {
          display: true,
          position: 'top' as const
        },
        tooltip: {
          mode: 'index' as const,
          intersect: false
        }
      }
    };

    const generateLabels = (length: number) => {
      const today = new Date();
      return Array.from({ length }, (_, i) => {
        const date = new Date();
        date.setDate(today.getDate() - (length - 1 - i));
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      });
    };

    // Create line chart for Total Customers
    const customersChartEl = document.getElementById('customersChart') as HTMLCanvasElement;
    if (customersChartEl) {
      this.customersChart = new Chart(customersChartEl, {
        type: 'line',
        data: {
          labels: generateLabels(this.totalCustomers.length),
          datasets: [
            {
              label: 'Total Customers',
              data: this.totalCustomers,
              borderColor: 'rgba(75, 192, 192, 1)',
              backgroundColor: 'rgba(75, 192, 192, 0.2)',
              fill: true,
              tension: 0.4,
              pointBackgroundColor: 'rgba(75, 192, 192, 1)',
              pointBorderColor: '#fff',
            },
          ],
        },
        options: chartOptions
      });
    }

    // Create line chart for Total Products
    const productsChartEl = document.getElementById('productsChart') as HTMLCanvasElement;
    if (productsChartEl) {
      this.productsChart = new Chart(productsChartEl, {
        type: 'line',
        data: {
          labels: generateLabels(this.totalProducts.length),
          datasets: [
            {
              label: 'Total Products',
              data: this.totalProducts,
              borderColor: 'rgba(255, 206, 86, 1)',
              backgroundColor: 'rgba(255, 206, 86, 0.2)',
              fill: true,
              tension: 0.4,
              pointBackgroundColor: 'rgba(255, 206, 86, 1)',
              pointBorderColor: '#fff',
            },
          ],
        },
        options: chartOptions
      });
    }

    // Create line chart for Low Stock Products
    const lowStockChartEl = document.getElementById('lowStockChart') as HTMLCanvasElement;
    if (lowStockChartEl) {
      this.lowStockChart = new Chart(lowStockChartEl, {
        type: 'line',
        data: {
          labels: generateLabels(this.lowStockProducts.length),
          datasets: [
            {
              label: 'Low Stock Products',
              data: this.lowStockProducts,
              borderColor: 'rgba(255, 99, 132, 1)',
              backgroundColor: 'rgba(255, 99, 132, 0.2)',
              fill: true,
              tension: 0.4,
              pointBackgroundColor: 'rgba(255, 99, 132, 1)',
              pointBorderColor: '#fff',
            },
          ],
        },
        options: chartOptions
      });
    }

    // Create line chart for Total Orders
    const ordersChartEl = document.getElementById('ordersChart') as HTMLCanvasElement;
    if (ordersChartEl) {
      this.ordersChart = new Chart(ordersChartEl, {
        type: 'line',
        data: {
          labels: generateLabels(this.totalOrders.length),
          datasets: [
            {
              label: 'Total Orders',
              data: this.totalOrders,
              borderColor: 'rgba(153, 102, 255, 1)',
              backgroundColor: 'rgba(153, 102, 255, 0.2)',
              fill: true,
              tension: 0.4,
              pointBackgroundColor: 'rgba(153, 102, 255, 1)',
              pointBorderColor: '#fff',
            },
          ],
        },
        options: chartOptions
      });
    }
  }
}