import { Component } from '@angular/core';
import { CommonModule, NgFor } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EventService } from '../services/event.service';
import {} from '@syncfusion/ej2-angular-interactive-chat';

@Component({
  selector: 'app-ai-assistant',
  imports: [FormsModule, CommonModule],
  providers: [],
  templateUrl: './ai-assistant.component.html',
  styleUrl: './ai-assistant.component.css',
})
export class AiAssistantComponent {
  visible = false;
  userPrompt = '';
  messages: { role: string; content: string }[] = [];

  constructor(private eventService: EventService) {}

  sendPrompt() {
    if (!this.userPrompt.trim()) return;

    const prompt = this.userPrompt.trim();
    this.messages.push({ role: 'user', content: prompt });
    this.userPrompt = '';
    this.eventService
      .chatWithAI(prompt)
      .subscribe((res) =>
        this.messages.push({ role: 'assistant', content: res.response })
      );
  }
}
