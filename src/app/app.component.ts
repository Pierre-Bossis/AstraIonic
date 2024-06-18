import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage';
import { AuthService } from './_services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {
  constructor(private storage:Storage,private router:Router,private authService:AuthService) {}
  isDark!:any

  async ngOnInit() {
    const storage = await this.storage.create();
    this.storage = storage;
    this.isDark= await this.storage.get('themeToggleValue')
    if(await this.storage.get('themeToggleValue') == true)
    document.body.classList.toggle('dark', this.isDark);
    await this.checkToken();
  }
  private async checkToken() {
    const isTokenValid = await this.authService.getTokenValidity()

    if (isTokenValid) {      
      this.router.navigateByUrl('/')
    }
    else{
      console.log("Token expiré.")      
      await this.storage.remove('token')
      this.router.navigateByUrl('login')
    }
  }
  
}
