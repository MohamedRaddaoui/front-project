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
import { AdminGuard } from './guards/admin.guard';
import { EventdashboardComponent } from './eventdashboard/eventdashboard.component';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { TaskComponent } from './task/task.component';
import { TaskDetailsComponent } from './task-details/task-details.component';
import { NgModule } from '@angular/core';
import { UserDashboardComponent } from './user-dashboard/user-dashboard.component';
import { UnauthorizedComponent } from './unauthorized/unauthorized.component';
import { StatistiquesComponent } from './statistique/statistique.component';
import { ForumComponent } from './forum/forum.component';
import { AskQuestionComponent } from './ask-question/ask-question.component';
import { QuestionViewComponent } from './question-details/question-details.component';
import { BacklogComponent } from './backlog/backlog.component';
import { DetailsBacklogComponent } from './details-backlog/details-backlog.component';
import { UserDetailsComponent } from './user-details/user-details.component';

import { EditBacklogComponent } from './edit-backlog/edit-backlog.component';
import { DetailSprintComponent } from './detail-sprint/detail-sprint.component';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { EventPageComponent } from './event-page/event-page.component';



export const routes: Routes = [
  {
    path: '',
    component: LandingPageComponent,
  },
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
  {
    path: 'tasks',
    component: TaskComponent,
  },
  {
    path: 'task-details',
    component: TaskDetailsComponent,
  },
  {
    path: 'project',
    component: ProjectComponent,
    canActivate: [AuthGuard],
    // data: { roles: ['admin', 'user'] },
    // children: [{ path: '', component: SideBarComponent }],
  },
  {
    path: 'add',
    component: AddProjectComponent,
    canActivate: [AuthGuard],
    // data: { roles: ['admin', 'manager'] },
    // children: [{ path: '', component: SideBarComponent }],
  },
  {
    path: 'event-dashboard',
    component: EventdashboardComponent,
    canActivate: [AuthGuard],
    data: { roles: ['user'] },
  },
  {
    path: 'event/:id',
    component: EventPageComponent,
  },
  {
    path: 'scrum/:id',
    component: ScrumProjectComponent,
    canActivate: [AuthGuard],
    // data: { roles: ['manager'] },
  },
  {
    path: 'PO/:id',
    component: ProductOwnerComponent,
    canActivate: [AuthGuard],
    // data: { roles: ['product_owner', 'admin'] },
  },
  {
    path: 'scrum/:id',
    component: ScrumProjectComponent,
  },
  {
    path: 'standard/:id',
    component: StandardProjectComponent,
    canActivate: [AuthGuard],
    // data: { roles: ['manager'] },
  },
  {
    path: 'delete/:id',
    component: DeleteProjectComponent,
    canActivate: [AuthGuard],
    // data: { roles: ['admin'] },
  },

  {
    path: 'updateProject/:id',
    component: EditProjectComponent,
    canActivate: [AuthGuard],
    // data: { roles: ['admin', 'manager'] },
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
  {
    path: 'updateProject/:id',
    component: EditProjectComponent,
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
  { path: 'forum/:id', component: QuestionViewComponent },
  {
        path: 'backlogDtails/:id',
        component: DetailsBacklogComponent
  },
  { path: 'profile', component: UserDetailsComponent },

        {
        path: 'backlogUpdate/:id',
        component: EditBacklogComponent
       },

  // Q&A routes
  // {
  //   path: 'questions',
  //   children: [
  //     { path: '', component: QuestionsListComponent },
  //     { path: 'create', component: CreateQuestionComponent, canActivate: [AuthGuard], data: { roles: ['user', 'admin'] } },
  //     { path: 'search', component: QuestionsListComponent },
  //     { path: 'search/tags', component: QuestionsListComponent },
  //     { path: 'search/advanced', component: QuestionsListComponent },
  //     { path: 'frequent', component: QuestionsListComponent },
  //     {
  //       path: ':id',
  //       component: QuestionDetailComponent,
  //       children: [
  //         { path: 'answers', component: QuestionDetailComponent },
  //       ],
  //     },
  //   ],
  // },

  // Redirection fallback
//   { path: '**', redirectTo: 'login' },
// ];
//       {
//         path: '',
//         component: QuestionsListComponent
//       },
//       {
//         path: 'create',
//         component: CreateQuestionComponent
//       },
//       {
//         path: 'search',
//         component: QuestionsListComponent
//       },
//       {
//         path: 'search/tags',
//         component: QuestionsListComponent
//       },
//       {
//         path: 'search/advanced',
//         component: QuestionsListComponent
//       },
//       {
//         path: 'frequent',
//         component: QuestionsListComponent
//       },
//       // {
//       //   path: ':id',
//       //   component: QuestionDetailComponent,
//       //   children: [
//       //     {
//       //       path: 'answers',
//       //       component: QuestionDetailComponent
//       //     }
//       //   ]
//       // },
      
//     ]
//   }
       {
        path: 'sprintDtails/:id',
        component: DetailSprintComponent
       },
       
    

/*
  // Q&A routes matching backend API structure
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
      {
        path: '',
        component: QuestionsListComponent,
      },
      {
        path: 'create',
        component: CreateQuestionComponent,
      },
      {
        path: 'search',
        component: QuestionsListComponent,
      },
      {
        path: 'search/tags',
        component: QuestionsListComponent,
      },
      {
        path: 'search/advanced',
        component: QuestionsListComponent,
      },
      {
        path: 'frequent',
        component: QuestionsListComponent,
      },
    ],
  },
];

      // {
      //   path: ':id',
      //   component: QuestionDetailComponent,
      //   children: [
      //     {
      //       path: 'answers',
      //       component: QuestionDetailComponent
      //     }
      //   ]
      // },
     
    ]
  }
      */
];

