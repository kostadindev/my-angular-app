import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideEcharts } from 'ngx-echarts';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideEcharts()
  ]
};
