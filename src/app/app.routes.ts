import { Routes } from '@angular/router';
import { CalendarPageComponent } from './calendar-page/calendar-page.component';
import { AiAssistantComponent } from './ai-assistant/ai-assistant.component';

export const routes: Routes = [
  {
    path: 'calendar',
    component: CalendarPageComponent,
  },
  {
    path: 'chatbot',
    component: AiAssistantComponent,
  },
];
