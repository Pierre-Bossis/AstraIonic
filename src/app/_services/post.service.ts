import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Post, PostForm } from '../_models/post';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { UploadService } from './upload.service';

@Injectable({
  providedIn: 'root'
})
export class PostService {
url:string = environment.url
  constructor(private http:HttpClient, private upload:UploadService) { }

  getAll():Observable<Post[]>{
    return this.http.get<Post[]>(this.url + "post")
  }

  create(post:PostForm,files:File[]):Observable<any>{
    const newPost = this.upload.upload(files)

    newPost.append('Contenu',post.contenu)
    newPost.append('User_Pseudo',post.user_pseudo)

    return this.http.post(this.url + "post/create",newPost)
  }
}
