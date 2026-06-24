import { Component, ElementRef, ViewChild, inject, ViewEncapsulation, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GeminiService } from '../../../core/services/gemini.service';
import { marked } from 'marked';
import DOMPurify from 'dompurify';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-chat-widget',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './chat-widget.component.html',
  styleUrls: ['./chat-widget.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class ChatWidgetComponent {
  geminiService = inject(GeminiService);
  isOpen = false;
  userInput = '';

  @ViewChild('chatContainer') private chatContainer!: ElementRef;

  constructor() {
    effect(() => {
      this.geminiService.chatHistory();
      setTimeout(() => this.scrollToBottom(), 100);
    });
  }

  toggleChat() {
    this.isOpen = !this.isOpen;
    if (this.isOpen && this.geminiService.chatHistory().length === 0) {
      this.geminiService.sendMessage('Hola, soy nuevo en MovieNexus. ¿Qué películas me recomiendas hoy?');
    }
  }

  sendMessage() {
    if (!this.userInput.trim()) return;
    this.geminiService.sendMessage(this.userInput);
    this.userInput = '';
  }

  renderMarkdown(text: string): string {
    const rawHtml = marked.parse(text) as string;
    return DOMPurify.sanitize(rawHtml);
  }

  private scrollToBottom(): void {
    try {
      this.chatContainer.nativeElement.scrollTop = this.chatContainer.nativeElement.scrollHeight;
    } catch(err) { }
  }
}
