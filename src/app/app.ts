import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './shared/components/layout/header/header.component';
import { ChatWidgetComponent } from './shared/components/chat-widget/chat-widget.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HeaderComponent, ChatWidgetComponent],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal('MovieNexus');
}
