import { Component, ElementRef, ViewChild, inject, ViewEncapsulation, effect, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GeminiService } from '../../../core/services/gemini.service';
import { marked } from 'marked';
import DOMPurify from 'dompurify';
import { RouterModule } from '@angular/router';

declare var window: any;

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
  private ngZone = inject(NgZone);
  
  isOpen = false;
  userInput = '';
  isRecording = false;
  
  private recognition: any;
  private speechTimeout: any;

  @ViewChild('chatContainer') private chatContainer!: ElementRef;

  constructor() {
    effect(() => {
      this.geminiService.chatHistory();
      setTimeout(() => this.scrollToBottom(), 100);
    });

    if (typeof window !== 'undefined') {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        this.recognition = new SpeechRecognition();
        this.recognition.continuous = true;
        this.recognition.interimResults = true;
        this.recognition.lang = 'es-ES';

        this.recognition.onresult = (event: any) => {
          this.ngZone.run(() => {
            if (!this.isRecording) return;
            
            let transcript = '';
            for (let i = event.resultIndex; i < event.results.length; ++i) {
              transcript += event.results[i][0].transcript;
            }
            this.userInput = transcript;

            clearTimeout(this.speechTimeout);
            this.speechTimeout = setTimeout(() => {
              this.stopDictationAndSend();
            }, 600);
          });
        };

        this.recognition.onerror = (event: any) => {
          this.ngZone.run(() => {
            console.error('Error en reconocimiento de voz:', event.error);
            this.isRecording = false;
          });
        };

        this.recognition.onend = () => {
          this.ngZone.run(() => {
            this.isRecording = false;
          });
        };
      }
    }
  }

  toggleChat() {
    this.isOpen = !this.isOpen;
    if (this.isOpen && this.geminiService.chatHistory().length === 0) {
      this.geminiService.sendMessage('Hola, soy nuevo en MovieNexus. ¿Qué películas me recomiendas hoy?');
    }
  }

  toggleDictation() {
    if (!this.recognition) return;
    
    if (this.isRecording) {
      this.recognition.stop();
      this.isRecording = false;
      clearTimeout(this.speechTimeout);
    } else {
      this.userInput = '';
      this.recognition.start();
      this.isRecording = true;
    }
  }

  stopDictationAndSend() {
    if (this.isRecording) {
      this.recognition.stop();
      this.isRecording = false;
    }
    if (this.userInput.trim()) {
      this.sendMessage();
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
