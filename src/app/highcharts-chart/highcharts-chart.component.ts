import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HighchartsChartModule } from 'highcharts-angular';
import * as Highcharts from 'highcharts';

// Set Highcharts default colors
Highcharts.setOptions({
  colors: ['#5470c6', '#91cc75', '#fac858', '#ee6666', '#73c0de', '#3ba272', '#fc8452', '#9a60b4', '#ea7ccc']
});

@Component({
  selector: 'app-highcharts-chart',
  standalone: true,
  imports: [CommonModule, HighchartsChartModule],
  templateUrl: './highcharts-chart.component.html',
  styleUrl: './highcharts-chart.component.css'
})
export class HighchartsChartComponent implements OnInit, OnChanges {
  @Input() type: string = '';
  @Input() options: any = {};
  
  Highcharts: typeof Highcharts = Highcharts;
  chartOptions: Highcharts.Options = {};
  updateFlag = false;
  chartCallback: Highcharts.ChartCallbackFunction = (chart) => {
    // Force reflow after initialization to ensure proper sizing
    setTimeout(() => {
      if (chart && typeof chart.reflow === 'function') {
        chart.reflow();
      }
    }, 100);
    
    // Also reflow on window resize
    const resizeHandler = () => {
      if (chart && typeof chart.reflow === 'function') {
        chart.reflow();
      }
    };
    window.addEventListener('resize', resizeHandler);
    
    // Store the handler for cleanup
    (chart as any).resizeHandler = resizeHandler;
  };

  ngOnInit(): void {
    this.initializeChart();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['options']) {
      const currentOptionsString = JSON.stringify(this.options);
      const previousOptionsString = changes['options'].previousValue ? JSON.stringify(changes['options'].previousValue) : '';
      
      // Only update if options actually changed
      if (currentOptionsString !== previousOptionsString) {
        this.initializeChart();
        this.updateFlag = true;
      }
    }
  }

  private initializeChart(): void {
    // Deep clone the options to avoid mutation issues
    this.chartOptions = JSON.parse(JSON.stringify(this.options));
    
    // Force chart to use full container size
    if (!this.chartOptions.chart) {
      this.chartOptions.chart = {};
    }
    this.chartOptions.chart.width = null;
    this.chartOptions.chart.height = null;
    
    // Ensure responsive behavior
    if (!this.chartOptions.responsive) {
      this.chartOptions.responsive = {
        rules: [{
          condition: {
            maxWidth: 500
          },
          chartOptions: {
            legend: {
              enabled: false
            }
          }
        }]
      };
    }
  }
}
