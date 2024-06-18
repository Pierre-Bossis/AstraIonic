import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { userSearch } from 'src/app/_models/user';
import { AuthService } from 'src/app/_services/auth.service';
import { SignalrService } from 'src/app/_services/signalr.service';

@Component({
  selector: 'app-conversation',
  templateUrl: './conversation.page.html',
  styleUrls: ['./conversation.page.scss'],
})
export class ConversationPage implements OnInit, OnDestroy {
  user!:userSearch
  sendMessageFormGroup!: FormGroup;
  sender!:string
  pseudoStorage!:string
  messages: { user: string, message: string }[] = [];
  private messageSubscription!: Subscription;
  constructor(private signalRService:SignalrService, private formBuilder:FormBuilder,private authService:AuthService,private router:Router) { }

  ngOnInit() {
    const navigation = this.router.getCurrentNavigation();
    if (navigation && navigation.extras.state) {
      this.user = navigation.extras.state['user'];
    }

    this.signalRService.startConnection()
    .then(() => {
      this.messageSubscription = this.signalRService.getMessageSubject().subscribe((message) => {
        this.messages.push(message)
      })
    })
    .catch((error:any) => {
      console.error('Error while starting SignalR connection: ' + error);
    })

    this.sendMessageFormGroup = this.formBuilder.group({
      message: ['',[Validators.required]],
    })
    this.authService.getPseudoFromToken().then((data) => {
      this.sender = data
    })

    this.authService.getPseudoFromToken().then((data) => {
      this.pseudoStorage = data
    })
  }

  async sendMessage() {
    this.signalRService.sendPrivateMessage(this.user.id,this.sendMessageFormGroup.get("message")?.value)
    this.sendMessageFormGroup.get("message")?.reset()
  }

  ngOnDestroy() {
    if (this.messageSubscription) {
      this.messageSubscription.unsubscribe()
    }
  }

  authorPlacementMessage(pseudo: string) {
    if (pseudo == this.pseudoStorage) { 
      return true;
    }
    return false;
  }
}
