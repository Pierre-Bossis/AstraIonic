import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit{
  themeToggle = false;
  constructor(private storage:Storage){}
  async ngOnInit() {
    const storage = await this.storage.create();
    this.storage = storage;

    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
    this.initializeDarkTheme(prefersDark.matches);

    prefersDark.addEventListener('change', (mediaQuery) => this.initializeDarkTheme(mediaQuery.matches));
  }

  async initializeDarkTheme(isDark:any) {
    if(await this.storage.get('themeToggleValue') == true){
      this.themeToggle = isDark;
    }
  }

  async toggleChange(ev:any) {
    this.toggleDarkTheme(ev.detail.checked);
    this.storage.set('themeToggleValue', ev.detail.checked);
  }

  toggleDarkTheme(shouldAdd:any) {
    document.body.classList.toggle('dark', shouldAdd);
  }
}
