import { Component, OnInit } from '@angular/core';
import { PostService } from '../_services/post.service';
import { Post } from '../_models/post';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../_services/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
posts:Post[] = []
files:File[] = []
pseudo!:string
postFormGroup!:FormGroup
  constructor(private postService:PostService,private formBuilder:FormBuilder,private authService:AuthService){ }

  async ngOnInit() {
    this.pseudo = await this.authService.getPseudoFromToken()
    this.postFormGroup = this.formBuilder.group({
      contenu: ['',[Validators.required,Validators.minLength(1)]],
      user_pseudo: [this.pseudo,[Validators.required]]
    })
    await this.loadData()    
  }

  private async loadData(){
    this.postService.getAll().subscribe((data) => {
      this.posts = data.filter(post => post.dateCreation).sort((a, b) => new Date(b.dateCreation).getTime() - new Date(a.dateCreation).getTime());
    })
  }

  loadFile(e: any) {
    const fileList: FileList = e.target.files;
    for (let i = 0; i < fileList.length; i++) {
      if(this.files.length < 4)
        this.files.push(fileList[i]);
    }
  }
  onSubmit(){
    console.log(this.postFormGroup.value);
    
    this.postService.create(this.postFormGroup.value,this.files).subscribe(() => {
      this.loadData()
      this.postFormGroup.reset()
      this.files = []
    })
  }
}
