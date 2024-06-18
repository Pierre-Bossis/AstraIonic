import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { loginForm, registerForm } from '../_models/user';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage';
import * as jwt_decode from 'jwt-decode';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
url:string = environment.url
  constructor(private http:HttpClient,private _storage:Storage, private router:Router) { }

  register(user:registerForm){
    console.log(user);
        
    return this.http.post(this.url+"auth/register",user)
  }

  async login(user:loginForm){
    this.http.post(this.url+"auth/login",user, { responseType: 'text' }).subscribe(async (data) => {
      await this.initStorage()
      await this._storage.set('token',data);      
      this.router.navigateByUrl('/');
    })
  }

  private async initStorage() {
    if (!this._storage) {
      this._storage = new Storage();
      const storage = await this._storage.create()
      this._storage = storage;
    }
  }

  async getPseudoFromToken(){
    await this.initStorage()
    const token = await this._storage.get('token')
    
    if (token) {
      let decodedToken: any = jwt_decode.jwtDecode(token)      
      return decodedToken["Pseudo"]
    }
    else
      return null;
  }

  async getRoleFromToken(){
    await this.initStorage()
    const token = await this._storage.get('token')
    
    if (token) {      
      let decodedToken: any = jwt_decode.jwtDecode(token)         
      return decodedToken["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"]
    }
    else
      return null;
  }

  async getIdFromToken(){
    await this.initStorage()
    const token = await this._storage.get('token')
    
    if (token) {      
      let decodedToken: any = jwt_decode.jwtDecode(token)         
      return decodedToken["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/sid"]
    }
    else
      return null;
  }

  async getTokenValidity(){
    await this.initStorage()
    const token = await this._storage.get('token')

    if(!token) return false
    
    try {
      let decodedToken: any = jwt_decode.jwtDecode(token)
      const expiryDate = new Date(decodedToken.exp * 1000)
      return expiryDate > new Date()
    }
    catch(error){
      console.error('Erreur lors du décodage du token :', error)
      return false;
    }
  }

  getByPseudo(pseudo:string){
    return this.http.get<any[]>(this.url + "auth/getbypseudo/" + pseudo)
  }
}
