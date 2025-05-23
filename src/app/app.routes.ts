import { Routes } from '@angular/router';
import { CalendarPageComponent } from './calendar-page/calendar-page.component';
import { AiAssistantComponent } from './ai-assistant/ai-assistant.component';
// import { SideBarComponent } from './side-bar/side-bar.component';
import { ProjectComponent } from './project/project.component';
import { SideBarComponent } from './side-bar/side-bar.component';
import { AddProjectComponent } from './add-project/add-project.component';
import { ScrumProjectComponent } from './scrum-project/scrum-project.component';
import { StandardProjectComponent } from './standard-project/standard-project.component';
import { DeleteProjectComponent } from './delete-project/delete-project.component';


import { TaskComponent } from './task/task.component';
import { TaskDetailsComponent } from './task-details/task-details.component';
import { EditProjectComponent } from './edit-project/edit-project.component';
import { ProductOwnerComponent } from './product-owner/product-owner.component';
import { AuthGuard } from './guards/auth.guard';
import { ForgetPasswordComponent } from './forgetpassword/forgetpassword.component';
import { ResetPasswordComponent } from './resetpassword/resetpassword.component';

import { AdminGuard } from './guards/admin.guard';


import { EventdashboardComponent } from './eventdashboard/eventdashboard.component';

import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';




import { UserDashboardComponent } from './user-dashboard/user-dashboard.component';


export const routes: Routes = [
  {
    path: 'calendar',
    component: CalendarPageComponent,
    canActivate: [AuthGuard],
  },

  {
    path: 'user-dashboard',
    component: UserDashboardComponent,
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
    path: 'project',
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



  {
    path: 'scrum/:id',
    component:ScrumProjectComponent,
   

  },

   {
    path: 'PO/:id',
    component:ProductOwnerComponent,
   

  },

  {
    path: 'standard/:id',
    component:StandardProjectComponent,
    

  },

  {
    path: 'delete/:id',
    component:DeleteProjectComponent,
    

  },


   {
    path: 'updateProject/:id',
    component:EditProjectComponent,
    

  },







  

];
