import { Component } from '@angular/core';import { AIAssistViewModule, ChatUIModule } from '@syncfusion/ej2-angular-interactive-chat';
import { DialogModule, TooltipModule } from '@syncfusion/ej2-angular-popups';
import { TextBoxModule, TextAreaModule, NumericTextBoxModule, MaskedTextBoxModule, SliderModule, UploaderModule, ColorPickerModule, SignatureModule, RatingModule, OtpInputModule, SmartTextAreaModule, SpeechToTextModule } from '@syncfusion/ej2-angular-inputs';
import { ButtonModule, CheckBoxModule, RadioButtonModule, SwitchModule, ChipListModule, FabModule, SpeedDialModule, SmartPasteButtonModule } from '@syncfusion/ej2-angular-buttons';

import {
  ScheduleModule,
  RecurrenceEditorModule,
} from '@syncfusion/ej2-angular-schedule';

import { RouterOutlet } from '@angular/router';
import { provideHttpClient, withFetch } from '@angular/common/http';

@Component({
  selector: 'app-root',
  imports: [AIAssistViewModule, ChatUIModule, DialogModule, TooltipModule, TextBoxModule, TextAreaModule, NumericTextBoxModule, MaskedTextBoxModule, SliderModule, UploaderModule, ColorPickerModule, SignatureModule, RatingModule, OtpInputModule, SmartTextAreaModule, SpeechToTextModule, ButtonModule, CheckBoxModule, RadioButtonModule, SwitchModule, ChipListModule, FabModule, SpeedDialModule, SmartPasteButtonModule, 
    ScheduleModule,
    RecurrenceEditorModule,
    RouterOutlet,
    
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'front-project';
}
