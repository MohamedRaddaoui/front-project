
import { Component,NgModule } from '@angular/core';
import { DropDownListModule } from '@syncfusion/ej2-angular-dropdowns';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import {
  AIAssistViewModule,
  ChatUIModule,
} from '@syncfusion/ej2-angular-interactive-chat';
import { DialogModule, TooltipModule } from '@syncfusion/ej2-angular-popups';
import {
  TextBoxModule,
  TextAreaModule,
  NumericTextBoxModule,
  MaskedTextBoxModule,
  SliderModule,
  UploaderModule,
  ColorPickerModule,
  SignatureModule,
  RatingModule,
  OtpInputModule,
  SmartTextAreaModule,
  SpeechToTextModule,
} from '@syncfusion/ej2-angular-inputs';
import {
  ButtonModule,
  CheckBoxModule,
  RadioButtonModule,
  SwitchModule,
  ChipListModule,
  FabModule,
  SpeedDialModule,
  SmartPasteButtonModule,
} from '@syncfusion/ej2-angular-buttons';
import { Router, NavigationEnd } from '@angular/router';

import {
  ScheduleModule,
  RecurrenceEditorModule,
} from '@syncfusion/ej2-angular-schedule';

import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AiAssistantComponent } from './ai-assistant/ai-assistant.component';

@Component({
  selector: 'app-root',
  imports: [
    AIAssistViewModule,
    ChatUIModule,
    DialogModule,
    TooltipModule,
    TextBoxModule,
    TextAreaModule,
    NumericTextBoxModule,
    MaskedTextBoxModule,
    SliderModule,
    UploaderModule,
    ColorPickerModule,
    SignatureModule,
    RatingModule,
    OtpInputModule,
    SmartTextAreaModule,
    SpeechToTextModule,
    ButtonModule,
    CheckBoxModule,
    RadioButtonModule,
    SwitchModule,
    ChipListModule,
    FabModule,
    SpeedDialModule,
    SmartPasteButtonModule,
    ScheduleModule,
    RecurrenceEditorModule,
    RouterOutlet,
    DropDownListModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    AiAssistantComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'front-project';
  showNavbar: boolean = true;

  constructor(private router: Router) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.showNavbar = ![
          '/login',
          '/signup',
          '/forget-password',
          '/reset-password',
          '/calendar',
        ].includes(event.url);
      }
    });
  }

  isAuthPage(): boolean {
    const authRoutes = [
      '/login',
      '/signup',
      '/forget-password',
      '/reset-password',
      '/calendar',
    ];
    return authRoutes.includes(this.router.url);
  }
}
