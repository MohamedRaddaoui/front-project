import { bootstrapApplication } from '@angular/platform-browser';
import { enableProdMode } from '@angular/core';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { environment } from './environment/env';
import { registerLicense } from '@syncfusion/ej2-base';
import { Chart } from 'chart.js';
import { CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';

Chart.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

registerLicense(
  'Ngo9BigBOggjHTQxAR8/V1NNaF1cWWhPYVF0WmFZfVtgfV9EZFZUTWY/P1ZhSXxWdkBhWn1fcnFRQ2RVUUZ9XUs= '
);

if (environment.production) {
  enableProdMode();
}

bootstrapApplication(AppComponent, appConfig).catch((err) =>
  console.error(err)
);
