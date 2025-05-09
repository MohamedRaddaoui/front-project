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
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { AdminGuard } from './guards/admin.guard';

export const routes: Routes = [
  {
    path: 'calendar',
    component: CalendarPageComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'admin-dashboard',
    component: AdminDashboardComponent,
    // canActivate: [AdminGuard],
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
];
