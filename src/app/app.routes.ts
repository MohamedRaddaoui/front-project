import { Routes } from '@angular/router';
import { CalendarPageComponent } from './calendar-page/calendar-page.component';
import { AiAssistantComponent } from './ai-assistant/ai-assistant.component';
// import { SideBarComponent } from './side-bar/side-bar.component';
import { ProjectComponent } from './project/project.component';
import { SideBarComponent } from './side-bar/side-bar.component';
import { AddProjectComponent } from './add-project/add-project.component';
import { SignupComponent } from './signup/signup.component';
import { LoginComponent } from './login/login.component';
import { AuthGuard } from './guards/auth.guard';
import { ForgetPasswordComponent } from './forgetpassword/forgetpassword.component';
import { ResetPasswordComponent } from './resetpassword/resetpassword.component';
import { AdminGuard } from './guards/admin.guard';

import { TaskComponent } from './task/task.component';
import { TaskDetailsComponent } from './task-details/task-details.component';
import { EventdashboardComponent } from './eventdashboard/eventdashboard.component';
export const routes: Routes = [
  {
    path: 'calendar',
    component: CalendarPageComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'signup',
    component: SignupComponent,
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'forget-password',
    component: ForgetPasswordComponent,
  },
  {
    path: 'reset-password/:token',
    component: ResetPasswordComponent,
  },
  {
    path: 'task-details/:id',
    component: TaskDetailsComponent,
  },
  { path: 'task-details', component: TaskDetailsComponent },
  {
    path: 'tasks',
    component: TaskComponent,
  },
  {
    path: '',
    component: ProjectComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        component: SideBarComponent,
      },
    ],
  },
  {
    path: 'add',
    component: AddProjectComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        component: SideBarComponent,
      },
    ],
  },
  {
    path: 'event-dashboard',
    component: EventdashboardComponent,
    // canActivate: [AuthGuard, AdminGuard],
  },
];
