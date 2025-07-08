import { Component, ElementRef, ViewChild } from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { ChatBotService } from '../../services/chat-bot.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-chat-bot',
  standalone: true,
  imports: [
    DialogModule,
    InputTextModule,
    ButtonModule,
    FormsModule,
    CommonModule,
  ],
  templateUrl: './chat-bot.component.html',
  styleUrl: './chat-bot.component.scss',
})
export class ChatBotComponent {
  @ViewChild('chatButton', { static: false }) chatButton!: ElementRef;
  @ViewChild('scrollMe') private myScrollContainer!: ElementRef;
  userMessage: string = '';
  botMessages: string[] = [];
  messages: string[] = [];
  showChat: boolean = false;
  keyCounter: number = this.messages.length - 1;

  constructor(private chatbotService: ChatBotService) {}

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  scrollToBottom(): void {
    try {
      this.myScrollContainer.nativeElement.scrollTop =
        this.myScrollContainer.nativeElement.scrollHeight;
    } catch (err) {}
  }

  makeLinksClickable(text: string): string {
    const urlRegex = /(https?:\/\/[^\s]+|www\.[^\s]+)/g;

    return text.replace(urlRegex, (url) => {
      const fullUrl = url.startsWith('http') ? url : `https://${url}`;
      return `<a href="${fullUrl}" target="_blank" rel="noopener noreferrer">${url}</a>`;
    });
  }

  sendMessage() {
    if (this.userMessage.trim()) {
      this.messages.push(this.userMessage);
      this.chatbotService.getResponse(this.userMessage).subscribe((res) => {
        this.botMessages.push(this.makeLinksClickable(res)); //.choices[0].message.content);
      });
      this.userMessage = '';
      this.keyCounter = this.messages.length - 1;
    }
  }

  showChatClick() {
    this.showChat = !this.showChat;
    console.log(this.showChat);
  }

  choosePreviousMessage(event: KeyboardEvent) {
    //this.userMessage = this.messages[this.messages.length - 1];
    if (event.key === 'ArrowUp') {
      this.userMessage = this.messages[this.keyCounter];
      if (this.keyCounter > -1) {
        this.keyCounter--;
      }
    }
    if (event.key === 'ArrowDown') {
      this.userMessage = this.messages[this.keyCounter];
      if (this.keyCounter < this.messages.length - 1) {
        this.keyCounter++;
      }
    }
  }
}
