import { Routes } from '@angular/router';
import { CalendarPageComponent } from './calendar-page/calendar-page.component';
import { AiAssistantComponent } from './ai-assistant/ai-assistant.component';
// import { SideBarComponent } from './side-bar/side-bar.component';
import { ProjectComponent } from './project/project.component';
import { SideBarComponent } from './side-bar/side-bar.component';
import { AddProjectComponent } from './add-project/add-project.component';
import { TaskComponent } from './task/task.component';
import { TaskDetailsComponent } from './task-details/task-details.component';
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
  path: 'task-details/:id',
  component: TaskDetailsComponent
  },
  {path: 'task-details',
  component: TaskDetailsComponent
  },
{
    path: 'tasks',
    component: TaskComponent,
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
