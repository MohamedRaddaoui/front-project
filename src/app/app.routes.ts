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


import { EditProjectComponent } from './edit-project/edit-project.component';
import { ProductOwnerComponent } from './product-owner/product-owner.component';
import { AuthGuard } from './guards/auth.guard';
import { ForgetPasswordComponent } from './forgetpassword/forgetpassword.component';
import { ResetPasswordComponent } from './resetpassword/resetpassword.component';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';



import { TaskComponent } from './task/task.component';
import { TaskDetailsComponent } from './task-details/task-details.component';
import { UserDashboardComponent } from './user-dashboard/user-dashboard.component';
import { ForumComponent } from './forum/forum.component';
import { AskQuestionComponent } from './ask-question/ask-question.component';
import { QuestionDetailsComponent } from './question-details/question-details.component';

export const routes: Routes = [
  {
    path: 'calendar',
    component: CalendarPageComponent,
    canActivate: [],
  },
  {
    path: 'admin-dashboard',
    component: AdminDashboardComponent,
    // canActivate: [AdminGuard],
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
    path: 'forum',
    component: ForumComponent,
    canActivate: [],
  },
  {
    path: 'ask-question',
    component: AskQuestionComponent,
    canActivate: [],
  },
   { path: 'forum/:questionId', 
    component: QuestionDetailsComponent 
  },
  {
    path: 'project',
    component: ProjectComponent,
    canActivate: [],
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
    path: 'scrum/:id',
    component: ScrumProjectComponent,
  },
  {
    path: 'PO/:id',
    component: ProductOwnerComponent,
  },
  {
    path: 'standard/:id',
    component: StandardProjectComponent,
  },
  {
    path: 'delete/:id',
    component: DeleteProjectComponent,
  },
  {
    path: 'updateProject/:id',
    component: EditProjectComponent,
  },
  {
    path: '**',
    redirectTo: '/project',
    pathMatch: 'full'
  }
];
