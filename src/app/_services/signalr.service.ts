import { Injectable } from '@angular/core';
import { HubConnection, HubConnectionBuilder  } from '@microsoft/signalr';
import { Subject } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class SignalrService {
private hubConnection! : HubConnection
 private messageSubject: Subject<{ user: string, message: string }> = new Subject<{ user: string, message: string }>()
  constructor(private authService:AuthService) { }

  async startConnection(){
    this.hubConnection = new HubConnectionBuilder()
      .withUrl('https://localhost:7281/chat-hub?userId=' + await this.authService.getIdFromToken())
      .build()

    return this.hubConnection.start()
      .then(() => {
        console.log('Connection started')
        this.addMessageListener()
      })
      .catch(err => console.log('Error while starting connection: ' + err))
  }

  private addMessageListener = () => {
    this.hubConnection.on('ReceivePrivateMessage', (user: string, message: string) => {
      this.messageSubject.next({ user, message })
    });
  }

  sendPrivateMessage(userId:string,message:string){
    this.hubConnection.invoke('SendPrivateMessage', userId,message)
        .catch(err => console.error(err));
  }


  getMessageSubject(): Subject<{ user: string, message: string }> {
    return this.messageSubject
  }
}
