import { Component, OnDestroy, OnInit } from '@angular/core';
import { SignalrService } from '../_services/signalr.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { AuthService } from '../_services/auth.service';
import { userSearch } from '../_models/user';
import { Router } from '@angular/router';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.page.html',
  styleUrls: ['./messages.page.scss'],
})
export class MessagesPage{
  userFound:any[] = []
  constructor(private signalRService:SignalrService, private formBuilder:FormBuilder,private authService:AuthService,private router:Router) { }

  onSearch(ev: Event) {
    let inputEvent = ev as KeyboardEvent;
    let pseudo = (inputEvent.target as HTMLInputElement).value;
    if (pseudo.length > 0) {
      this.authService.getByPseudo(pseudo).subscribe((data: any[]) => {
        this.userFound = data.map(item => ({ id: item.id, pseudo: item.pseudo }));
      });
    } else {
      this.userFound = []
    }
  }

  onMessage(user:userSearch){
    this.router.navigate(['/tabs/messages/conversation'], { state: { user: user } });
  }
}
