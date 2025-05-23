import { Routes } from '@angular/router';
import { CalendarPageComponent } from './calendar-page/calendar-page.component';
import { AiAssistantComponent } from './ai-assistant/ai-assistant.component';
import { ProjectComponent } from './project/project.component';
import { SideBarComponent } from './side-bar/side-bar.component';
import { AddProjectComponent } from './add-project/add-project.component';
import { QuestionsListComponent } from './questions-list/questions-list.component';
import { QuestionDetailComponent } from './question-detail/question-detail.component';
import { CreateQuestionComponent } from './create-question/create-question.component';

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
    component: ProjectComponent,
    children: [
      {
        path: '',
        component: SideBarComponent,
      }
    ]
  },
  {
    path: 'add',
    component: AddProjectComponent,
    children: [
      {
        path: '',
        component: SideBarComponent,
      }
    ]
  },
  // Q&A routes matching backend API structure
  {
    path: 'questions',
    children: [
      {
        path: '',
        component: QuestionsListComponent
      },
      {
        path: 'create',
        component: CreateQuestionComponent
      },
      {
        path: 'search',
        component: QuestionsListComponent
      },
      {
        path: 'search/tags',
        component: QuestionsListComponent
      },
      {
        path: 'search/advanced',
        component: QuestionsListComponent
      },
      {
        path: 'frequent',
        component: QuestionsListComponent
      },
      {
        path: ':id',
        component: QuestionDetailComponent,
        children: [
          {
            path: 'answers',
            component: QuestionDetailComponent
          }
        ]
      }
    ]
  }
];