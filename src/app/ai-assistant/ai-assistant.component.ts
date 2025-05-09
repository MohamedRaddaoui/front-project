import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { EventService } from '../services/event.service';

interface ChatMessage {
  role: string;
  content: SafeHtml;
}

@Component({
  selector: 'app-ai-assistant',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './ai-assistant.component.html',
  styleUrls: ['./ai-assistant.component.css'],
})
export class AiAssistantComponent {
  visible = false;
  userPrompt = '';
  messages: ChatMessage[] = [];

  constructor(
    private eventService: EventService,
    private sanitizer: DomSanitizer
  ) {}

  sendPrompt() {
    if (!this.userPrompt.trim()) return;

    const prompt = this.userPrompt.trim();
    this.messages.push({ 
      role: 'user', 
      content: this.sanitizer.bypassSecurityTrustHtml(prompt)
    });
    this.userPrompt = '';

    this.eventService.chatWithAI(prompt).subscribe({
      next: (res) => {
        this.messages.push({ 
          role: 'assistant', 
          content: this.sanitizer.bypassSecurityTrustHtml(res.message)
        });
      },
      error: (error) => {
        console.error('AI chat error:', error);
        this.messages.push({
          role: 'assistant',
          content: this.sanitizer.bypassSecurityTrustHtml(
            'Sorry, I encountered an error. Please try again.'
          )
        });
      },
    });
  }

  toggleChat() {
    this.visible = !this.visible;
  }

  clearChat() {
    this.messages = [];
    this.userPrompt = '';
  }
}
