import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GridsterModule, GridsterConfig, GridsterItem } from 'angular-gridster2';
import { NgxEchartsModule } from 'ngx-echarts';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, GridsterModule, NgxEchartsModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  options!: GridsterConfig;
  dashboard: Array<GridsterItem> = [];

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
      {cols: 2, rows: 2, y: 0, x: 0, type: 'bar'},
      {cols: 2, rows: 2, y: 0, x: 2, type: 'pie'},
      {cols: 2, rows: 2, y: 0, x: 4, type: 'line'},
      {cols: 2, rows: 2, y: 2, x: 0, type: 'scatter'},
      {cols: 2, rows: 2, y: 2, x: 2, type: 'heatmap'},
      {cols: 2, rows: 2, y: 2, x: 4, type: 'radar'}
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

  getChartTitle(type: string): string {
    const titles: {[key: string]: string} = {
      'bar': 'Sales by Region',
      'pie': 'Market Share',
      'line': 'Revenue Trend',
      'scatter': 'Price vs Performance',
      'heatmap': 'Activity Heatmap',
      'radar': 'Skills Assessment'
    };
    return titles[type] || 'Chart';
  }

  getChartOptions(type: string): any {
    const isDark = document.documentElement.classList.contains('dark-theme');
    const textColor = isDark ? '#e0e0e0' : '#333';
    const gridColor = isDark ? '#404040' : '#e0e0e0';
    
    switch(type) {
      case 'bar':
        return {
          tooltip: { trigger: 'axis' },
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
          series: [{
            data: [120, 200, 150, 80, 70, 110],
            type: 'bar',
            itemStyle: {
              color: {
                type: 'linear',
                x: 0, y: 0, x2: 0, y2: 1,
                colorStops: [
                  { offset: 0, color: '#5470c6' },
                  { offset: 1, color: '#91cc75' }
                ]
              }
            }
          }]
        };
      
      case 'pie':
        return {
          tooltip: { trigger: 'item' },
          series: [{
            type: 'pie',
            radius: ['40%', '70%'],
            data: [
              { value: 1048, name: 'Search Engine' },
              { value: 735, name: 'Direct' },
              { value: 580, name: 'Email' },
              { value: 484, name: 'Union Ads' },
              { value: 300, name: 'Video Ads' }
            ],
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            },
            label: { color: textColor }
          }]
        };
      
      case 'line':
        return {
          tooltip: { trigger: 'axis' },
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
          series: [{
            data: [820, 932, 901, 934, 1290, 1330, 1320],
            type: 'line',
            smooth: true,
            areaStyle: {
              color: {
                type: 'linear',
                x: 0, y: 0, x2: 0, y2: 1,
                colorStops: [
                  { offset: 0, color: 'rgba(91, 204, 117, 0.8)' },
                  { offset: 1, color: 'rgba(91, 204, 117, 0.1)' }
                ]
              }
            }
          }]
        };
      
      case 'scatter':
        const data = [];
        for (let i = 0; i < 100; i++) {
          data.push([Math.random() * 100, Math.random() * 100]);
        }
        return {
          xAxis: {
            axisLine: { lineStyle: { color: textColor } },
            axisLabel: { color: textColor },
            splitLine: { lineStyle: { color: gridColor } }
          },
          yAxis: {
            axisLine: { lineStyle: { color: textColor } },
            axisLabel: { color: textColor },
            splitLine: { lineStyle: { color: gridColor } }
          },
          series: [{
            symbolSize: 10,
            data: data,
            type: 'scatter',
            itemStyle: {
              color: {
                type: 'radial',
                x: 0.5, y: 0.5, r: 0.5,
                colorStops: [
                  { offset: 0, color: '#fac858' },
                  { offset: 1, color: '#ee6666' }
                ]
              }
            }
          }]
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
          tooltip: { position: 'top' },
          grid: { height: '70%', top: '10%' },
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
                name: 'Budget Allocated',
                areaStyle: { color: 'rgba(84, 112, 198, 0.5)' }
              },
              {
                value: [5000, 14000, 28000, 26000, 42000, 21000],
                name: 'Actual Spending',
                areaStyle: { color: 'rgba(145, 204, 117, 0.5)' }
              }
            ]
          }]
        };
      
      default:
        return {};
    }
  }
}