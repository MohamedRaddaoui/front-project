import { Routes } from '@angular/router';
import { CalendarPageComponent } from './calendar-page/calendar-page.component';
import { AiAssistantComponent } from './ai-assistant/ai-assistant.component';
// import { SideBarComponent } from './side-bar/side-bar.component';
import { ProjectComponent } from './project/project.component';
import { SideBarComponent } from './side-bar/side-bar.component';
import { AddProjectComponent } from './add-project/add-project.component';


export const routes: Routes = [
  {
    path: 'calendar',
    component: CalendarPageComponent,
  },
  {
    path: 'chatbot',
    component: AiAssistantComponent,
  },

  {
    path: '',
    component:ProjectComponent,
    children: [
      {
        path: '',
        component: SideBarComponent,
      }
    ]

  },

  {
    path: 'add',
    component:AddProjectComponent,
    children: [
      {
        path: '',
        component: SideBarComponent,
      }
    ]

  },




  
  
];
