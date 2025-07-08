import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    loadComponent: () => {
      return import('./components/chat-bot/chat-bot.component').then(
        (m) => m.ChatBotComponent
      );
    },
  },
];
