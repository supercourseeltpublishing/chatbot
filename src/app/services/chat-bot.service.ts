import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, Observable, of, switchMap } from 'rxjs';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class ChatBotService {
  private apiUrl = 'https://api.openai.com/v1/chat/completions';
  private apiKey = environment.OPENAI_API_KEY;

  /*private responses: any = {
    hello: 'Hi there! How can I assist you today?',
    bye: 'Goodbye! Have a great day!',
    'how are you?': "I'm fine, how about you?",
    bot: 'I am a bot. ;)',
    // Add more responses here
  };*/

  constructor(private http: HttpClient) {}

  getResponse(userInput: string): Observable<string> {
    const classifyIntentPrompt = `
    You are an assistant that responds as a teacher.
    Respond with lesson_feedback:$name where $name is the name of the person if the user is talking about past lessons only.
    Respond with schedule_query:$name where $name is the name of the person if the user is asking about upcoming lessons, class times, or class dates and room info.
    Respond with progress_info:$name where $name is the name of the person, if the user is asking about score, progress, grades, etc.
    
    Respond with courses:$name where $name if the the name of the person, if the user is asking about course start and end dates.
    Respond with assignments:$name where $name is the name of the person, if the user is asking about upcoming assignments and due dates.
    Respond with exams:$name where $name is the name of the person, if the user is asking about exam dates and formats.
    Respond with tasks:$name where $name is the name of the person, if the user is asking about pending tasks.
    Respond with calendar:$name where $name is the name of the person, if the user is asking about calendar reminders.
    
    Respond with contact_info:$name where $name is the name of the person to contact (excluding miss, dr. etc.),
    if the user is asking about contact information of a person or a teacher (phone, working hours, office hours etc.)
    Respond to the user normally with only your answer (don't notify how you respond to the user) if the user is just talking generally.
    If the user asks for info about something that is not related to the above, respond with "Sorry I can't help you with that.".
    User message: "${userInput}"
  `;

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.apiKey}`,
    });

    const body = {
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: 'You are a helpful assistant.' },
        { role: 'user', content: classifyIntentPrompt },
      ],
      stream: false,
    };

    return this.http.post<any>(this.apiUrl, body, { headers }).pipe(
      switchMap((response) => {
        console.log(response);
        const aiReply = response.choices[0].message.content.trim();

        if (aiReply.startsWith('contact_info:')) {
          const name = aiReply.split(':')[1].trim();

          return of('Sorry I cannot provide you with info at this moment.');
          //this.http
          //.get<any>(`/api/contact-info?name=${encodeURIComponent(name)}`)
          //.pipe(
          //map((contactInfo) => {
          //return `${contactInfo.name}'s office hours are ${contactInfo.officeHours}. You can contact them at ${contactInfo.email}.`;
          //}),
          //catchError(() =>
          //of(`Sorry, I couldn't find contact info for ${name}.`)
          //)
          //);
        } else if (aiReply.startsWith('schedule_query:')) {
          const name = aiReply.split(':')[1].trim();
          return of(
            'You can view your upcoming sessions in the session section.'
          );
        } else if (aiReply.startsWith('progress_info:')) {
          const name = aiReply.split(':')[1].trim();
          return of(
            'Sorry I cannot provide you with grade or progress info at this moment.'
          );
        } else if (aiReply.startsWith('courses:')) {
          const name = aiReply.split(':')[1].trim();
          return of(
            'Sorry I cannot provide you with course start and end dates at this moment.'
          );
        } else if (aiReply.startsWith('assignments:')) {
          const name = aiReply.split(':')[1].trim();
          return of(
            'Sorry I cannot provide you with upcoming assingments and due dates at this moment.'
          );
        } else if (aiReply.startsWith('exams:')) {
          const name = aiReply.split(':')[1].trim();
          return of(
            'Sorry I cannot provide you with exam dates and formats at this moment.'
          );
        } else if (aiReply.startsWith('tasks:')) {
          const name = aiReply.split(':')[1].trim();
          return of(
            'Sorry I cannot provide you with pending tasks at this moment.'
          );
        } else if (aiReply.startsWith('calendar:')) {
          const name = aiReply.split(':')[1].trim();
          return of(
            'Sorry I cannot provide you with calendar reminders info at this moment.'
          );
          //this.http
          //.get<any>(`/api/progress?name=${encodeURIComponent(name)}`)
          //.pipe(
          //map((info) => {
          //return `${info.name}'s current progress is ${info.progress}%. Their last score was ${info.lastScore}.`;
          //}),
          //catchError(() =>
          //of(`Sorry, I couldn't find anything for ${name}.`)
          //)
          //);
        } else if (aiReply.startsWith('lesson_feedback:')) {
          const name = aiReply.split(':')[1].trim();
          return of(
            'Sorry I cannot provide you with feedback on your previous lessons.'
          ); //'Thanks for your feedback on previous lessons!');
        } else {
          return of(aiReply);
        }
      }),
      catchError((err) => of('Something went wrong. Please try again later.'))
    );
  }
}
