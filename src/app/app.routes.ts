import { Routes } from '@angular/router';
import { CalendarPageComponent } from './calendar-page/calendar-page.component';
import { AiAssistantComponent } from './ai-assistant/ai-assistant.component';
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
import { EventdashboardComponent } from './eventdashboard/eventdashboard.component';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { TaskComponent } from './task/task.component';
import { TaskDetailsComponent } from './task-details/task-details.component';
import { NgModule } from '@angular/core';
import { QuestionsListComponent } from './questions-list/questions-list.component';
import { QuestionDetailComponent } from './question-detail/question-detail.component';
import { CreateQuestionComponent } from './create-question/create-question.component';
import { UserDashboardComponent } from './user-dashboard/user-dashboard.component';
import { UnauthorizedComponent } from './unauthorized/unauthorized.component';
import { StatistiquesComponent } from './statistique/statistique.component';



export const routes: Routes = [
  {
    path: 'calendar',
    component: CalendarPageComponent,
    canActivate: [AuthGuard],
    data: { roles: ['admin', 'user', 'manager'] },
  },

  {
    path: 'user-dashboard',
    component: UserDashboardComponent,
    canActivate: [AuthGuard],
    data: { roles: ['user', 'admin', 'manager'] },
  },

  { path: 'signup', component: SignupComponent },
  { path: 'login', component: LoginComponent },
  { path: 'forget-password', component: ForgetPasswordComponent },
  { path: 'reset-password/:token', component: ResetPasswordComponent },

  {
    path: 'task-details/:id',
    component: TaskDetailsComponent,
    canActivate: [AuthGuard],
    data: { roles: ['user', 'manager'] },
  },
  {
    path: 'tasks',
    component: TaskComponent,
    canActivate: [AuthGuard],
    data: { roles: ['user', 'manager'] },
  },

  {
    path: 'project',
    component: ProjectComponent,
    canActivate: [AuthGuard],
    data: { roles: ['admin', 'user'] },
    children: [{ path: '', component: SideBarComponent }],
  },

  {
    path: 'add',
    component: AddProjectComponent,
    canActivate: [AuthGuard],
    data: { roles: ['admin', 'manager'] },
    children: [{ path: '', component: SideBarComponent }],
  },

  {
    path: 'event-dashboard',
    component: EventdashboardComponent,
    canActivate: [AuthGuard],
    data: { roles: ['user'] },
  },

  {
    path: 'scrum/:id',
    component: ScrumProjectComponent,
    canActivate: [AuthGuard],
    data: { roles: ['manager'] },
  },

  {
    path: 'PO/:id',
    component: ProductOwnerComponent,
    canActivate: [AuthGuard],
    data: { roles: ['product_owner', 'admin'] },
  },

  {
    path: 'standard/:id',
    component: StandardProjectComponent,
    canActivate: [AuthGuard],
    data: { roles: ['manager'] },
  },

  {
    path: 'delete/:id',
    component: DeleteProjectComponent,
    canActivate: [AuthGuard],
    data: { roles: ['admin'] },
  },

  {
    path: 'updateProject/:id',
    component: EditProjectComponent,
    canActivate: [AuthGuard],
    data: { roles: ['admin', 'manager'] },
  },
  {
  path: 'unauthorized',
  component: UnauthorizedComponent,
  },
  {
  path: 'statistiques',
  component: StatistiquesComponent,
  canActivate: [AuthGuard], // optionnel selon ta sécurité
  },

  // Q&A routes
  {
    path: 'questions',
    children: [
      { path: '', component: QuestionsListComponent },
      { path: 'create', component: CreateQuestionComponent, canActivate: [AuthGuard], data: { roles: ['user', 'admin'] } },
      { path: 'search', component: QuestionsListComponent },
      { path: 'search/tags', component: QuestionsListComponent },
      { path: 'search/advanced', component: QuestionsListComponent },
      { path: 'frequent', component: QuestionsListComponent },
      {
        path: ':id',
        component: QuestionDetailComponent,
        children: [
          { path: 'answers', component: QuestionDetailComponent },
        ],
      },
    ],
  },

  // Redirection fallback
  { path: '**', redirectTo: 'login' },
];
