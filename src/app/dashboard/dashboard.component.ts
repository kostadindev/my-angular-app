import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GridsterModule, GridsterConfig, GridsterItem } from 'angular-gridster2';
import { NgxEchartsModule } from 'ngx-echarts';
import { HighchartsChartComponent } from '../highcharts-chart/highcharts-chart.component';
import { ChartjsChartComponent } from '../chartjs-chart/chartjs-chart.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, GridsterModule, NgxEchartsModule, HighchartsChartComponent, ChartjsChartComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  options!: GridsterConfig;
  dashboard: Array<GridsterItem> = [];
  
  // Filter properties
  selectedTimeRange: string = 'last30days';
  selectedCategory: string = 'all';
  selectedRegion: string = 'all';
  selectedChartLibrary: string = 'echarts';
  
  // Cached data to prevent jittering
  private cachedChartData: Map<string, any> = new Map();
  
  timeRanges = [
    { value: 'last7days', label: 'Last 7 Days' },
    { value: 'last30days', label: 'Last 30 Days' },
    { value: 'last90days', label: 'Last 90 Days' },
    { value: 'thisYear', label: 'This Year' }
  ];
  
  categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'electronics', label: 'Electronics' },
    { value: 'clothing', label: 'Clothing' },
    { value: 'food', label: 'Food & Beverage' },
    { value: 'services', label: 'Services' }
  ];
  
  regions = [
    { value: 'all', label: 'All Regions' },
    { value: 'north', label: 'North' },
    { value: 'south', label: 'South' },
    { value: 'east', label: 'East' },
    { value: 'west', label: 'West' }
  ];
  
  chartLibraries = [
    { value: 'echarts', label: 'ECharts' },
    { value: 'ng2-charts', label: 'Chart.js' },
    { value: 'highcharts', label: 'Highcharts' }
  ];

  ngOnInit() {
    this.options = {
      gridType: 'verticalFixed',
      compactType: 'none',
      margin: 10,
      outerMargin: true,
      outerMarginTop: null,
      outerMarginRight: null,
      outerMarginBottom: null,
      outerMarginLeft: null,
      useTransformPositioning: true,
      mobileBreakpoint: 640,
      minCols: 1,
      maxCols: 100,
      minRows: 1,
      maxRows: 100,
      maxItemCols: 100,
      minItemCols: 1,
      maxItemRows: 100,
      minItemRows: 1,
      maxItemArea: 2500,
      minItemArea: 1,
      defaultItemCols: 1,
      defaultItemRows: 1,
      fixedColWidth: 105,
      fixedRowHeight: 105,
      keepFixedHeightInMobile: false,
      keepFixedWidthInMobile: false,
      scrollSensitivity: 10,
      scrollSpeed: 20,
      enableEmptyCellClick: false,
      enableEmptyCellContextMenu: false,
      enableEmptyCellDrop: false,
      enableEmptyCellDrag: false,
      enableOccupiedCellDrop: false,
      emptyCellDragMaxCols: 50,
      emptyCellDragMaxRows: 50,
      ignoreMarginInRow: false,
      draggable: {
        enabled: true,
      },
      resizable: {
        enabled: true,
      },
      swap: false,
      pushItems: true,
      disablePushOnDrag: false,
      disablePushOnResize: false,
      pushDirections: {north: true, east: true, south: true, west: true},
      pushResizeItems: false,
      displayGrid: 'onDrag&Resize',
      disableWindowResize: false,
      disableWarnings: false,
      scrollToNewItems: false
    };

    this.dashboard = [
      {cols: 2, rows: 3, y: 0, x: 0, type: 'bar'},
      {cols: 2, rows: 3, y: 0, x: 2, type: 'pie'},
      {cols: 2, rows: 3, y: 0, x: 4, type: 'line'},
      {cols: 2, rows: 3, y: 3, x: 0, type: 'scatter'},
      {cols: 2, rows: 3, y: 3, x: 2, type: 'heatmap'},
      // {cols: 2, rows: 3, y: 3, x: 4, type: 'radar'},
      // {cols: 2, rows: 3, y: 6, x: 0, type: 'gauge'},
      // {cols: 2, rows: 3, y: 6, x: 2, type: 'funnel'},
      // {cols: 2, rows: 3, y: 6, x: 4, type: 'treemap'},
      // {cols: 2, rows: 3, y: 9, x: 0, type: 'sunburst'},
      // {cols: 2, rows: 3, y: 9, x: 2, type: 'candlestick'},
      // {cols: 2, rows: 3, y: 9, x: 4, type: 'boxplot'}
    ];
  }

  changedOptions() {
    if (this.options.api && this.options.api.optionsChanged) {
      this.options.api.optionsChanged();
    }
  }

  removeItem(item: GridsterItem) {
    this.dashboard.splice(this.dashboard.indexOf(item), 1);
  }

  onChartClick(event: any, type: string) {
    if (type === 'pie') {
      const message = `You clicked on: ${event.name}\nValue: ${event.value} (${event.percent}%)`;
      alert(message);
    }
  }

  onFilterChange() {
    // Clear cached data to force regeneration
    this.cachedChartData.clear();
    // Force gridster to update without causing re-renders
    this.changedOptions();
  }

  resetFilters() {
    this.selectedTimeRange = 'last30days';
    this.selectedCategory = 'all';
    this.selectedRegion = 'all';
    this.onFilterChange();
  }
  
  onChartLibraryChange() {
    // Clear cache when switching libraries
    this.cachedChartData.clear();
    this.changedOptions();
  }
  
  // Get cached chart options to prevent continuous re-rendering
  getCachedChartOptions(type: string): any {
    const cacheKey = `${type}-${this.selectedTimeRange}-${this.selectedCategory}-${this.selectedRegion}-${this.selectedChartLibrary}`;
    
    if (!this.cachedChartData.has(cacheKey)) {
      this.cachedChartData.set(cacheKey, this.generateChartOptions(type));
    }
    
    return this.cachedChartData.get(cacheKey);
  }
  
  // Methods for different chart libraries
  getNgxChartData(type: string): any {
    const baseOptions = this.generateChartOptions(type);
    
    switch(type) {
      case 'bar':
        // Convert series data to ngx-charts format
        const barData: any[] = [];
        const categories = baseOptions.xAxis?.data || [];
        baseOptions.series?.forEach((series: any) => {
          series.data?.forEach((value: number, index: number) => {
            const existingCategory = barData.find(d => d.name === categories[index]);
            if (existingCategory) {
              existingCategory.series.push({ name: series.name, value: value });
            } else {
              barData.push({
                name: categories[index],
                series: [{ name: series.name, value: value }]
              });
            }
          });
        });
        return barData;
        
      case 'pie':
        // Convert pie data to ngx-charts format
        return baseOptions.series?.[0]?.data?.map((item: any) => ({
          name: item.name,
          value: item.value
        })) || [];
        
      case 'line':
        // Convert line data to ngx-charts format
        return baseOptions.series?.map((series: any) => ({
          name: series.name,
          series: series.data?.map((value: number, index: number) => ({
            name: baseOptions.xAxis?.data?.[index] || index,
            value: value
          })) || []
        })) || [];
        
      case 'scatter':
        // Convert scatter data to ngx-charts bubble format
        return baseOptions.series?.map((series: any) => ({
          name: series.name,
          series: series.data?.map((point: number[]) => ({
            x: point[0],
            y: point[1],
            r: 5, // Fixed radius for bubbles
            name: `${series.name}: (${point[0].toFixed(1)}, ${point[1].toFixed(1)})`
          })) || []
        })) || [];
        
      case 'heatmap':
        // Convert heatmap data to ngx-charts format
        const heatmapData: any[] = [];
        const hours = baseOptions.xAxis?.data || [];
        const days = baseOptions.yAxis?.data || [];
        baseOptions.series?.[0]?.data?.forEach((item: number[]) => {
          const hourIndex = item[0];
          const dayIndex = item[1];
          const value = item[2];
          heatmapData.push({
            name: days[dayIndex] || `Day ${dayIndex}`,
            series: [{
              name: hours[hourIndex] || `Hour ${hourIndex}`,
              value: value
            }]
          });
        });
        return heatmapData;
        
      default:
        return [];
    }
  }
  
  getChartJsData(type: string): any {
    // Use cached data for Chart.js to prevent constant updates
    const cacheKey = `chartjs-${type}-${this.selectedTimeRange}-${this.selectedCategory}-${this.selectedRegion}`;
    
    if (this.cachedChartData.has(cacheKey)) {
      return this.cachedChartData.get(cacheKey);
    }
    
    const baseOptions = this.generateChartOptions(type);
    let chartData: any;
    
    switch(type) {
      case 'bar':
        chartData = {
          labels: baseOptions.xAxis?.data || [],
          datasets: baseOptions.series?.map((series: any, index: number) => ({
            label: series.name,
            data: series.data,
            backgroundColor: ['#5470c6', '#91cc75', '#fac858'][index] || '#5470c6',
            borderColor: ['#5470c6', '#91cc75', '#fac858'][index] || '#5470c6',
            borderWidth: 1
          })) || []
        };
        break;
        
      case 'pie':
        const pieData = baseOptions.series?.[0]?.data || [];
        chartData = {
          labels: pieData.map((item: any) => item.name),
          datasets: [{
            data: pieData.map((item: any) => item.value),
            backgroundColor: ['#5470c6', '#91cc75', '#fac858', '#ee6666', '#73c0de'],
            borderWidth: 1
          }]
        };
        break;
        
      case 'line':
        chartData = {
          labels: baseOptions.xAxis?.data || [],
          datasets: baseOptions.series?.map((series: any, index: number) => ({
            label: series.name,
            data: series.data,
            borderColor: ['#5470c6', '#ee6666', '#91cc75'][index] || '#5470c6',
            backgroundColor: ['rgba(84, 112, 198, 0.2)', 'rgba(238, 102, 102, 0.2)', 'rgba(145, 204, 117, 0.2)'][index] || 'rgba(84, 112, 198, 0.2)',
            tension: 0.4,
            fill: true
          })) || []
        };
        break;
        
      case 'scatter':
        chartData = {
          datasets: baseOptions.series?.map((series: any, index: number) => ({
            label: series.name,
            data: series.data?.map((point: number[]) => ({ x: point[0], y: point[1] })),
            backgroundColor: ['#5470c6', '#91cc75', '#fac858'][index] || '#5470c6',
            pointRadius: 5
          })) || []
        };
        break;
        
      case 'heatmap':
        // Chart.js doesn't support heatmap natively, convert to bar chart
        chartData = {
          labels: Array.from({length: 24}, (_, i) => `${i}:00`),
          datasets: [{
            label: 'Activity Level',
            data: Array.from({length: 24}, () => Math.floor(Math.random() * 50)),
            backgroundColor: '#5470c6'
          }]
        };
        break;
        
      default:
        chartData = { labels: [], datasets: [] };
    }
    
    this.cachedChartData.set(cacheKey, chartData);
    return chartData;
  }
  
  getHighchartsOptions(type: string): any {
    // Use cached data for Highcharts to prevent constant updates
    const cacheKey = `highcharts-${type}-${this.selectedTimeRange}-${this.selectedCategory}-${this.selectedRegion}`;
    
    if (this.cachedChartData.has(cacheKey)) {
      return this.cachedChartData.get(cacheKey);
    }
    
    const baseOptions = this.generateChartOptions(type);
    const isDark = document.documentElement.classList.contains('dark-theme');
    const textColor = isDark ? '#e0e0e0' : '#333';
    
    // Common options for all charts
    const commonOptions = {
      credits: { enabled: false },
      chart: {
        backgroundColor: 'transparent',
        style: {
          fontFamily: 'inherit'
        },
        spacing: [10, 10, 15, 10], // top, right, bottom, left
        reflow: true
      },
      title: {
        style: { color: textColor },
        margin: 15
      },
      legend: {
        itemStyle: { color: textColor },
        margin: 10
      },
      tooltip: {
        backgroundColor: isDark ? '#2a2a2a' : '#ffffff',
        style: { color: isDark ? '#e0e0e0' : '#333' }
      }
    };
    
    // Convert ECharts options to Highcharts format
    let chartOptions: any;
    
    switch(type) {
      case 'bar':
        chartOptions = {
          ...commonOptions,
          chart: { 
            ...commonOptions.chart,
            type: 'column' 
          },
          title: { 
            text: 'Sales by Region',
            style: commonOptions.title.style
          },
          xAxis: {
            categories: baseOptions.xAxis?.data || [],
            title: { 
              text: baseOptions.xAxis?.name || '',
              style: { color: textColor }
            },
            labels: {
              style: { color: textColor }
            }
          },
          yAxis: {
            title: { 
              text: baseOptions.yAxis?.name || 'Value',
              style: { color: textColor }
            },
            labels: {
              style: { color: textColor }
            }
          },
          plotOptions: {
            column: {
              borderRadius: 3,
              dataLabels: {
                enabled: false
              }
            }
          },
          series: baseOptions.series?.map((s: any) => ({
            name: s.name,
            data: s.data,
            type: 'column'
          })) || []
        };
        break;
      
      case 'pie':
        chartOptions = {
          ...commonOptions,
          chart: { 
            ...commonOptions.chart,
            type: 'pie' 
          },
          title: { 
            text: 'Market Share',
            style: commonOptions.title.style
          },
          plotOptions: {
            pie: {
              allowPointSelect: true,
              cursor: 'pointer',
              dataLabels: {
                enabled: true,
                format: '<b>{point.name}</b>: {point.percentage:.1f} %',
                style: { color: textColor }
              },
              showInLegend: true
            }
          },
          series: [{
            name: baseOptions.series?.[0]?.name || 'Share',
            type: 'pie',
            data: baseOptions.series?.[0]?.data?.map((item: any) => ({
              name: item.name,
              y: item.value
            })) || []
          }]
        };
        break;
        
      case 'line':
        chartOptions = {
          ...commonOptions,
          chart: { 
            ...commonOptions.chart,
            type: 'line' 
          },
          title: { 
            text: 'Revenue Trend',
            style: commonOptions.title.style
          },
          xAxis: {
            categories: baseOptions.xAxis?.data || [],
            labels: {
              style: { color: textColor }
            }
          },
          yAxis: {
            title: { 
              text: 'Value',
              style: { color: textColor }
            },
            labels: {
              style: { color: textColor }
            }
          },
          plotOptions: {
            line: {
              dataLabels: {
                enabled: false
              },
              marker: {
                enabled: true,
                radius: 4
              }
            }
          },
          series: baseOptions.series?.map((s: any) => ({
            name: s.name,
            data: s.data,
            type: 'line'
          })) || []
        };
        break;
        
      case 'scatter':
        chartOptions = {
          ...commonOptions,
          chart: { 
            ...commonOptions.chart,
            type: 'scatter',
            zoomType: 'xy'
          },
          title: { 
            text: 'Price vs Performance',
            style: commonOptions.title.style
          },
          xAxis: {
            title: { 
              text: 'Price',
              style: { color: textColor }
            },
            labels: {
              style: { color: textColor }
            },
            startOnTick: true,
            endOnTick: true,
            showLastLabel: true
          },
          yAxis: {
            title: { 
              text: 'Performance',
              style: { color: textColor }
            },
            labels: {
              style: { color: textColor }
            }
          },
          plotOptions: {
            scatter: {
              marker: {
                radius: 5,
                states: {
                  hover: {
                    enabled: true,
                    lineColor: 'rgb(100,100,100)'
                  }
                }
              },
              tooltip: {
                headerFormat: '<b>{series.name}</b><br>',
                pointFormat: 'Price: {point.x}, Performance: {point.y}'
              }
            }
          },
          series: baseOptions.series?.map((s: any) => ({
            name: s.name,
            data: s.data,
            type: 'scatter'
          })) || []
        };
        break;
        
      case 'heatmap':
        // For heatmap, we'll use a simple column chart as Highcharts heatmap requires additional module
        const hours = baseOptions.xAxis?.data || [];
        chartOptions = {
          ...commonOptions,
          chart: { 
            ...commonOptions.chart,
            type: 'column' 
          },
          title: { 
            text: 'Activity Heatmap',
            style: commonOptions.title.style
          },
          xAxis: {
            categories: hours.slice(0, 24),
            title: {
              text: 'Hour of Day',
              style: { color: textColor }
            },
            labels: {
              style: { color: textColor }
            }
          },
          yAxis: {
            title: { 
              text: 'Activity Level',
              style: { color: textColor }
            },
            labels: {
              style: { color: textColor }
            }
          },
          plotOptions: {
            column: {
              colorByPoint: true,
              dataLabels: {
                enabled: false
              }
            }
          },
          series: [{
            name: 'Activity',
            data: Array.from({length: 24}, () => Math.floor(Math.random() * 50)),
            type: 'column'
          }]
        };
        break;
        
      default:
        chartOptions = { 
          ...commonOptions,
          series: [] 
        };
    }
    
    this.cachedChartData.set(cacheKey, chartOptions);
    return chartOptions;
  }

  // Helper method to generate data based on filters with stable seed
  private getFilteredData(baseValue: number, variance: number = 0.3, seed: number = 1): number {
    let multiplier = 1;
    
    // Adjust based on time range
    switch (this.selectedTimeRange) {
      case 'last7days': multiplier *= 0.7; break;
      case 'last90days': multiplier *= 1.3; break;
      case 'thisYear': multiplier *= 1.5; break;
    }
    
    // Adjust based on category
    switch (this.selectedCategory) {
      case 'electronics': multiplier *= 1.2; break;
      case 'clothing': multiplier *= 0.9; break;
      case 'food': multiplier *= 0.8; break;
      case 'services': multiplier *= 1.1; break;
    }
    
    // Adjust based on region
    switch (this.selectedRegion) {
      case 'north': multiplier *= 1.1; break;
      case 'south': multiplier *= 0.95; break;
      case 'east': multiplier *= 1.15; break;
      case 'west': multiplier *= 1.05; break;
    }
    
    const value = baseValue * multiplier;
    // Use a deterministic pseudo-random based on seed and filter values
    const hash = this.hashCode(`${seed}-${this.selectedTimeRange}-${this.selectedCategory}-${this.selectedRegion}`);
    const pseudoRandom = ((hash % 1000) / 1000 - 0.5) * variance;
    const randomVariance = 1 + pseudoRandom;
    return Math.round(value * randomVariance);
  }
  
  // Simple hash function for deterministic randomness
  private hashCode(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return Math.abs(hash);
  }

  getChartTitle(type: string): string {
    const titles: {[key: string]: string} = {
      'bar': 'Sales by Region',
      'pie': 'Market Share',
      'line': 'Revenue Trend',
      'scatter': 'Price vs Performance',
      'heatmap': 'Activity Heatmap',
      'radar': 'Skills Assessment',
      'gauge': 'Performance Gauge',
      'funnel': 'Sales Funnel',
      'treemap': 'Market Share Treemap',
      'sunburst': 'Category Breakdown',
      'candlestick': 'Stock Price',
      'boxplot': 'Data Distribution'
    };
    return titles[type] || 'Chart';
  }

  getChartOptions(type: string): any {
    return this.getCachedChartOptions(type);
  }

  private generateChartOptions(type: string): any {
    const isDark = document.documentElement.classList.contains('dark-theme');
    const textColor = isDark ? '#e0e0e0' : '#333';
    const gridColor = isDark ? '#404040' : '#e0e0e0';
    
    switch(type) {
      case 'bar':
        return {
          tooltip: { trigger: 'axis' },
          legend: {
            data: ['Product A', 'Product B', 'Product C'],
            textStyle: { color: textColor },
            top: 0
          },
          grid: {
            top: 40,
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
          },
          xAxis: {
            type: 'category',
            data: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            axisLine: { lineStyle: { color: textColor } },
            axisLabel: { color: textColor }
          },
          yAxis: {
            type: 'value',
            axisLine: { lineStyle: { color: textColor } },
            axisLabel: { color: textColor },
            splitLine: { lineStyle: { color: gridColor } }
          },
          series: [
            {
              name: 'Product A',
              data: [
                this.getFilteredData(120, 0.3, 1),
                this.getFilteredData(200, 0.3, 2),
                this.getFilteredData(150, 0.3, 3),
                this.getFilteredData(80, 0.3, 4),
                this.getFilteredData(70, 0.3, 5),
                this.getFilteredData(110, 0.3, 6)
              ],
              type: 'bar',
              itemStyle: { color: '#5470c6' }
            },
            {
              name: 'Product B',
              data: [
                this.getFilteredData(95, 0.3, 7),
                this.getFilteredData(170, 0.3, 8),
                this.getFilteredData(120, 0.3, 9),
                this.getFilteredData(60, 0.3, 10),
                this.getFilteredData(90, 0.3, 11),
                this.getFilteredData(80, 0.3, 12)
              ],
              type: 'bar',
              itemStyle: { color: '#91cc75' }
            },
            {
              name: 'Product C',
              data: [
                this.getFilteredData(65, 0.3, 13),
                this.getFilteredData(85, 0.3, 14),
                this.getFilteredData(90, 0.3, 15),
                this.getFilteredData(40, 0.3, 16),
                this.getFilteredData(60, 0.3, 17),
                this.getFilteredData(70, 0.3, 18)
              ],
              type: 'bar',
              itemStyle: { color: '#fac858' }
            }
          ]
        };
      
      case 'pie':
        return {
          tooltip: { 
            trigger: 'item',
            formatter: '{a} <br/>{b}: {c} ({d}%)'
          },
          legend: {
            orient: 'vertical',
            left: 'left',
            data: ['Search Engine', 'Direct', 'Email', 'Union Ads', 'Video Ads'],
            textStyle: { color: textColor },
            selectedMode: 'multiple'
          },
          series: [{
            name: 'Traffic Source',
            type: 'pie',
            radius: ['40%', '70%'],
            center: ['60%', '50%'],
            data: [
              { value: this.getFilteredData(1048, 0.3, 19), name: 'Search Engine' },
              { value: this.getFilteredData(735, 0.3, 20), name: 'Direct' },
              { value: this.getFilteredData(580, 0.3, 21), name: 'Email' },
              { value: this.getFilteredData(484, 0.3, 22), name: 'Union Ads' },
              { value: this.getFilteredData(300, 0.3, 23), name: 'Video Ads' }
            ],
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            },
            label: { 
              color: textColor,
              formatter: '{b}\n{d}%'
            }
          }]
        };
      
      case 'line':
        return {
          tooltip: { trigger: 'axis' },
          legend: {
            data: ['Revenue', 'Costs', 'Profit'],
            textStyle: { color: textColor },
            top: 0
          },
          grid: {
            top: 40,
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
          },
          xAxis: {
            type: 'category',
            boundaryGap: false,
            data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            axisLine: { lineStyle: { color: textColor } },
            axisLabel: { color: textColor }
          },
          yAxis: {
            type: 'value',
            axisLine: { lineStyle: { color: textColor } },
            axisLabel: { color: textColor },
            splitLine: { lineStyle: { color: gridColor } }
          },
          series: [
            {
              name: 'Revenue',
              data: [
                this.getFilteredData(820, 0.3, 24),
                this.getFilteredData(932, 0.3, 25),
                this.getFilteredData(901, 0.3, 26),
                this.getFilteredData(934, 0.3, 27),
                this.getFilteredData(1290, 0.3, 28),
                this.getFilteredData(1330, 0.3, 29),
                this.getFilteredData(1320, 0.3, 30)
              ],
              type: 'line',
              smooth: true,
              itemStyle: { color: '#5470c6' },
              areaStyle: {
                color: {
                  type: 'linear',
                  x: 0, y: 0, x2: 0, y2: 1,
                  colorStops: [
                    { offset: 0, color: 'rgba(84, 112, 198, 0.5)' },
                    { offset: 1, color: 'rgba(84, 112, 198, 0.1)' }
                  ]
                }
              }
            },
            {
              name: 'Costs',
              data: [
                this.getFilteredData(320, 0.2, 31),
                this.getFilteredData(432, 0.2, 32),
                this.getFilteredData(401, 0.2, 33),
                this.getFilteredData(434, 0.2, 34),
                this.getFilteredData(590, 0.2, 35),
                this.getFilteredData(530, 0.2, 36),
                this.getFilteredData(520, 0.2, 37)
              ],
              type: 'line',
              smooth: true,
              itemStyle: { color: '#ee6666' },
              areaStyle: {
                color: {
                  type: 'linear',
                  x: 0, y: 0, x2: 0, y2: 1,
                  colorStops: [
                    { offset: 0, color: 'rgba(238, 102, 102, 0.5)' },
                    { offset: 1, color: 'rgba(238, 102, 102, 0.1)' }
                  ]
                }
              }
            },
            {
              name: 'Profit',
              data: [
                this.getFilteredData(500, 0.4, 38),
                this.getFilteredData(500, 0.4, 39),
                this.getFilteredData(500, 0.4, 40),
                this.getFilteredData(500, 0.4, 41),
                this.getFilteredData(700, 0.4, 42),
                this.getFilteredData(800, 0.4, 43),
                this.getFilteredData(800, 0.4, 44)
              ],
              type: 'line',
              smooth: true,
              itemStyle: { color: '#91cc75' }
            }
          ]
        };
      
      case 'scatter':
        const dataA = [];
        const dataB = [];
        const dataC = [];
        for (let i = 0; i < 50; i++) {
          dataA.push([Math.random() * 80 + 10, Math.random() * 60 + 20]);
          dataB.push([Math.random() * 70 + 20, Math.random() * 70 + 10]);
          dataC.push([Math.random() * 60 + 30, Math.random() * 80 + 5]);
        }
        return {
          tooltip: {
            trigger: 'item',
            formatter: function(params: any) {
              return params.seriesName + '<br/>X: ' + params.value[0].toFixed(2) + '<br/>Y: ' + params.value[1].toFixed(2);
            }
          },
          legend: {
            data: ['Category A', 'Category B', 'Category C'],
            textStyle: { color: textColor },
            top: 0
          },
          grid: {
            top: 40,
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
          },
          xAxis: {
            axisLine: { lineStyle: { color: textColor } },
            axisLabel: { color: textColor },
            splitLine: { lineStyle: { color: gridColor } },
            name: 'Price',
            nameLocation: 'middle',
            nameGap: 25,
            nameTextStyle: { color: textColor }
          },
          yAxis: {
            axisLine: { lineStyle: { color: textColor } },
            axisLabel: { color: textColor },
            splitLine: { lineStyle: { color: gridColor } },
            name: 'Performance',
            nameLocation: 'middle',
            nameGap: 35,
            nameTextStyle: { color: textColor }
          },
          series: [
            {
              name: 'Category A',
              symbolSize: 8,
              data: dataA,
              type: 'scatter',
              itemStyle: { color: '#5470c6' }
            },
            {
              name: 'Category B',
              symbolSize: 8,
              data: dataB,
              type: 'scatter',
              itemStyle: { color: '#91cc75' }
            },
            {
              name: 'Category C',
              symbolSize: 8,
              data: dataC,
              type: 'scatter',
              itemStyle: { color: '#fac858' }
            }
          ]
        };
      
      case 'heatmap':
        const hours = ['12a', '1a', '2a', '3a', '4a', '5a', '6a',
                      '7a', '8a', '9a','10a','11a',
                      '12p', '1p', '2p', '3p', '4p', '5p',
                      '6p', '7p', '8p', '9p', '10p', '11p'];
        const days = ['Saturday', 'Friday', 'Thursday',
                     'Wednesday', 'Tuesday', 'Monday', 'Sunday'];
        const heatmapData = [];
        for (let i = 0; i < 7; i++) {
          for (let j = 0; j < 24; j++) {
            heatmapData.push([j, i, Math.floor(Math.random() * 50)]);
          }
        }
        return {
          tooltip: { 
            position: 'top',
            formatter: function(params: any) {
              return hours[params.value[0]] + ' on ' + days[params.value[1]] + '<br/>Activity Level: ' + params.value[2];
            }
          },
          title: {
            text: 'Weekly Activity Pattern',
            left: 'center',
            top: 0,
            textStyle: { color: textColor, fontSize: 14 }
          },
          grid: { height: '65%', top: '12%' },
          xAxis: {
            type: 'category',
            data: hours,
            splitArea: { show: true },
            axisLine: { lineStyle: { color: textColor } },
            axisLabel: { color: textColor }
          },
          yAxis: {
            type: 'category',
            data: days,
            splitArea: { show: true },
            axisLine: { lineStyle: { color: textColor } },
            axisLabel: { color: textColor }
          },
          visualMap: {
            min: 0,
            max: 50,
            calculable: true,
            orient: 'horizontal',
            left: 'center',
            bottom: '5%',
            textStyle: { color: textColor },
            inRange: {
              color: ['#313695', '#4575b4', '#74add1', '#abd9e9', '#e0f3f8', '#ffffbf', '#fee090', '#fdae61', '#f46d43', '#d73027', '#a50026']
            }
          },
          series: [{
            name: 'Activity',
            type: 'heatmap',
            data: heatmapData,
            label: { show: false },
            emphasis: {
              itemStyle: { shadowBlur: 10, shadowColor: 'rgba(0, 0, 0, 0.5)' }
            }
          }]
        };
      
      case 'radar':
        return {
          tooltip: { trigger: 'item' },
          legend: {
            data: ['Q1 Budget', 'Q1 Actual', 'Q2 Budget', 'Q2 Actual'],
            textStyle: { color: textColor },
            bottom: 0,
            selectedMode: 'multiple'
          },
          radar: {
            indicator: [
              { name: 'Sales', max: 6500 },
              { name: 'Marketing', max: 16000 },
              { name: 'Development', max: 30000 },
              { name: 'Support', max: 38000 },
              { name: 'Tech', max: 52000 },
              { name: 'Admin', max: 25000 }
            ],
            axisName: { color: textColor },
            splitLine: { lineStyle: { color: gridColor } },
            splitArea: { areaStyle: { color: isDark ? ['rgba(64, 64, 64, 0.2)', 'rgba(64, 64, 64, 0.4)'] : ['rgba(250, 250, 250, 0.3)', 'rgba(200, 200, 200, 0.3)'] } }
          },
          series: [{
            type: 'radar',
            data: [
              {
                value: [4200, 3000, 20000, 35000, 50000, 18000],
                name: 'Q1 Budget',
                itemStyle: { color: '#5470c6' },
                areaStyle: { color: 'rgba(84, 112, 198, 0.3)' }
              },
              {
                value: [5000, 14000, 28000, 26000, 42000, 21000],
                name: 'Q1 Actual',
                itemStyle: { color: '#91cc75' },
                areaStyle: { color: 'rgba(145, 204, 117, 0.3)' }
              },
              {
                value: [4500, 8000, 25000, 37000, 48000, 20000],
                name: 'Q2 Budget',
                itemStyle: { color: '#fac858' },
                areaStyle: { color: 'rgba(250, 200, 88, 0.3)' }
              },
              {
                value: [4800, 10000, 27000, 35000, 45000, 22000],
                name: 'Q2 Actual',
                itemStyle: { color: '#ee6666' },
                areaStyle: { color: 'rgba(238, 102, 102, 0.3)' }
              }
            ]
          }]
        };
      
      case 'gauge':
        return {
          tooltip: { formatter: '{a} <br/>{b}: {c}%' },
          series: [{
            name: 'Performance',
            type: 'gauge',
            radius: '90%',
            center: ['50%', '60%'],
            detail: { 
              formatter: '{value}%',
              textStyle: { color: textColor, fontSize: 20 }
            },
            data: [{ value: 75, name: 'Score' }],
            axisLine: {
              lineStyle: {
                color: [[0.3, '#ee6666'], [0.7, '#fac858'], [1, '#91cc75']],
                width: 15
              }
            },
            splitLine: { lineStyle: { color: textColor } },
            axisTick: { lineStyle: { color: textColor } },
            axisLabel: { color: textColor },
            title: { 
              offsetCenter: [0, '-30%'],
              textStyle: { color: textColor }
            }
          }]
        };

      case 'funnel':
        return {
          tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b}: {c}%'
          },
          legend: {
            data: ['Visit', 'Inquiry', 'Order', 'Click', 'Purchase'],
            textStyle: { color: textColor }
          },
          series: [{
            name: 'Sales Funnel',
            type: 'funnel',
            left: '10%',
            top: 60,
            bottom: 60,
            width: '80%',
            min: 0,
            max: 100,
            minSize: '0%',
            maxSize: '100%',
            sort: 'descending',
            gap: 2,
            label: {
              show: true,
              position: 'inside',
              color: '#fff'
            },
            labelLine: { show: false },
            itemStyle: { borderColor: '#fff', borderWidth: 1 },
            emphasis: {
              label: { fontSize: 20 }
            },
            data: [
              { value: 100, name: 'Visit', itemStyle: { color: '#5470c6' } },
              { value: 80, name: 'Inquiry', itemStyle: { color: '#91cc75' } },
              { value: 60, name: 'Order', itemStyle: { color: '#fac858' } },
              { value: 40, name: 'Click', itemStyle: { color: '#ee6666' } },
              { value: 20, name: 'Purchase', itemStyle: { color: '#73c0de' } }
            ]
          }]
        };

      case 'treemap':
        return {
          tooltip: {
            formatter: function(info: any) {
              const value = info.value;
              const treePathInfo = info.treePathInfo;
              const treePath = [];
              for (let i = 1; i < treePathInfo.length; i++) {
                treePath.push(treePathInfo[i].name);
              }
              return [
                '<div class="tooltip-title">' + treePath.join(' → ') + '</div>',
                'Value: ' + value
              ].join('');
            }
          },
          series: [{
            type: 'treemap',
            data: [
              {
                name: 'Technology',
                value: 40,
                itemStyle: { color: '#5470c6' },
                children: [
                  { name: 'Software', value: 15 },
                  { name: 'Hardware', value: 12 },
                  { name: 'Services', value: 13 }
                ]
              },
              {
                name: 'Finance',
                value: 30,
                itemStyle: { color: '#91cc75' },
                children: [
                  { name: 'Banking', value: 18 },
                  { name: 'Insurance', value: 12 }
                ]
              },
              {
                name: 'Healthcare',
                value: 20,
                itemStyle: { color: '#fac858' },
                children: [
                  { name: 'Pharma', value: 12 },
                  { name: 'Medical Devices', value: 8 }
                ]
              },
              {
                name: 'Retail',
                value: 10,
                itemStyle: { color: '#ee6666' }
              }
            ],
            levels: [
              {
                itemStyle: {
                  borderColor: '#777',
                  borderWidth: 0,
                  gapWidth: 1
                }
              },
              {
                itemStyle: {
                  borderColor: '#555',
                  borderWidth: 5,
                  gapWidth: 1
                },
                colorSaturation: [0.35, 0.5]
              }
            ]
          }]
        };

      case 'sunburst':
        return {
          tooltip: {
            trigger: 'item',
            formatter: function(params: any) {
              return params.name + ': ' + params.value;
            }
          },
          series: [{
            type: 'sunburst',
            data: [
              {
                name: 'Products',
                itemStyle: { color: '#5470c6' },
                children: [
                  {
                    name: 'Electronics',
                    value: 15,
                    children: [
                      { name: 'Phones', value: 8 },
                      { name: 'Laptops', value: 7 }
                    ]
                  },
                  {
                    name: 'Clothing',
                    value: 10,
                    children: [
                      { name: 'Mens', value: 4 },
                      { name: 'Womens', value: 6 }
                    ]
                  }
                ]
              },
              {
                name: 'Services',
                itemStyle: { color: '#91cc75' },
                children: [
                  { name: 'Consulting', value: 8 },
                  { name: 'Support', value: 7 }
                ]
              }
            ],
            radius: [0, '90%'],
            label: {
              rotate: 'radial',
              color: textColor
            },
            itemStyle: {
              borderRadius: 7,
              borderColor: isDark ? '#1a1d23' : '#fff',
              borderWidth: 2
            },
            levels: [
              {},
              {
                r0: '15%',
                r: '45%',
                label: { rotate: 0 }
              },
              {
                r0: '45%',
                r: '70%',
                label: { align: 'right' }
              },
              {
                r0: '70%',
                r: '72%',
                label: { position: 'outside', padding: 3, silent: false },
                itemStyle: { borderWidth: 3 }
              }
            ]
          }]
        };

      case 'candlestick':
        const candleData = [];
        let basePrice = 2500;
        for (let i = 0; i < 30; i++) {
          const open = basePrice + Math.random() * 100 - 50;
          const close = open + Math.random() * 100 - 50;
          const low = Math.min(open, close) - Math.random() * 20;
          const high = Math.max(open, close) + Math.random() * 20;
          candleData.push([open.toFixed(2), close.toFixed(2), low.toFixed(2), high.toFixed(2)]);
          basePrice = parseFloat(close.toFixed(2));
        }
        return {
          tooltip: {
            trigger: 'axis',
            axisPointer: { type: 'cross' }
          },
          grid: {
            left: '10%',
            right: '10%',
            bottom: '15%'
          },
          xAxis: {
            type: 'category',
            data: Array.from({length: 30}, (_, i) => `Day ${i + 1}`),
            axisLine: { lineStyle: { color: textColor } },
            axisLabel: { color: textColor }
          },
          yAxis: {
            scale: true,
            axisLine: { lineStyle: { color: textColor } },
            axisLabel: { color: textColor },
            splitLine: { lineStyle: { color: gridColor } }
          },
          series: [{
            name: 'Stock Price',
            type: 'candlestick',
            data: candleData,
            itemStyle: {
              color: '#91cc75',
              color0: '#ee6666',
              borderColor: '#91cc75',
              borderColor0: '#ee6666'
            }
          }]
        };

      case 'boxplot':
        const boxData = [
          [850, 740, 900, 1070, 930, 850, 950, 980, 980, 880, 1000, 980, 930, 650, 760, 810, 1000, 1000, 960, 960],
          [960, 940, 960, 940, 880, 800, 850, 880, 900, 840, 830, 790, 810, 880, 880, 830, 800, 790, 760, 800],
          [880, 880, 880, 860, 720, 720, 620, 860, 970, 950, 880, 910, 850, 870, 840, 840, 850, 840, 840, 840],
          [890, 810, 810, 820, 800, 770, 760, 740, 750, 760, 910, 920, 890, 860, 880, 720, 840, 850, 850, 780],
          [890, 840, 780, 810, 760, 810, 790, 810, 820, 850, 870, 870, 810, 740, 810, 940, 950, 800, 810, 870]
        ];
        
        const boxplotData = boxData.map((data) => {
          const sorted = data.sort((a, b) => a - b);
          const q1 = sorted[Math.floor(sorted.length * 0.25)];
          const median = sorted[Math.floor(sorted.length * 0.5)];
          const q3 = sorted[Math.floor(sorted.length * 0.75)];
          const min = sorted[0];
          const max = sorted[sorted.length - 1];
          return [min, q1, median, q3, max];
        });
        
        return {
          tooltip: {
            trigger: 'item',
            formatter: function(params: any) {
              return `${params.name}<br/>Min: ${params.value[1]}<br/>Q1: ${params.value[2]}<br/>Median: ${params.value[3]}<br/>Q3: ${params.value[4]}<br/>Max: ${params.value[5]}`;
            }
          },
          grid: {
            left: '10%',
            right: '10%',
            bottom: '15%'
          },
          xAxis: {
            type: 'category',
            data: ['Team A', 'Team B', 'Team C', 'Team D', 'Team E'],
            axisLine: { lineStyle: { color: textColor } },
            axisLabel: { color: textColor }
          },
          yAxis: {
            type: 'value',
            name: 'Performance Score',
            axisLine: { lineStyle: { color: textColor } },
            axisLabel: { color: textColor },
            splitLine: { lineStyle: { color: gridColor } }
          },
          series: [{
            name: 'Performance',
            type: 'boxplot',
            data: boxplotData,
            itemStyle: {
              color: '#5470c6',
              borderColor: textColor
            }
          }]
        };

      default:
        return {};
    }
  }
}