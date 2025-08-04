import { Component, Input, OnInit, OnChanges, SimpleChanges, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgChartsModule } from 'ng2-charts';
import { ChartConfiguration, ChartType } from 'chart.js';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-chartjs-chart',
  standalone: true,
  imports: [CommonModule, NgChartsModule],
  templateUrl: './chartjs-chart.component.html',
  styleUrl: './chartjs-chart.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChartjsChartComponent implements OnInit, OnChanges {
  @Input() type: string = '';
  @Input() data: any = {};
  
  chartType: ChartType = 'bar';
  chartData: ChartConfiguration['data'] = {
    labels: [],
    datasets: []
  };
  
  chartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 0 // Disable animations to prevent flicker
    },
    plugins: {
      legend: {
        display: true,
        position: 'top'
      }
    }
  };
  
  private lastDataString: string = '';
  
  ngOnInit(): void {
    this.updateChart();
  }
  
  ngOnChanges(changes: SimpleChanges): void {
    // Only update if data actually changed
    const currentDataString = JSON.stringify(this.data);
    if (currentDataString !== this.lastDataString) {
      this.lastDataString = currentDataString;
      this.updateChart();
    }
  }
  
  private updateChart(): void {
    // Map chart types
    switch(this.type) {
      case 'bar':
        this.chartType = 'bar';
        break;
      case 'pie':
        this.chartType = 'pie';
        break;
      case 'line':
        this.chartType = 'line';
        break;
      case 'scatter':
        this.chartType = 'scatter';
        break;
      case 'heatmap':
        // Chart.js doesn't have native heatmap, use bar as fallback
        this.chartType = 'bar';
        break;
      default:
        this.chartType = 'bar';
    }
    
    // Deep clone to prevent mutation
    this.chartData = JSON.parse(JSON.stringify(this.data));
  }
}