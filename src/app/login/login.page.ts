import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../_services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit{
  displayInscription:boolean = false
  registerFormGroup!:FormGroup
  loginFormGroup!:FormGroup

  constructor(private formBuilder:FormBuilder, private authService:AuthService,private router:Router) { }
  ngOnInit(): void {
    this.registerFormGroup = this.formBuilder.group({
      email: ['',[Validators.required,Validators.minLength(1)]],
      pseudo: ['',[Validators.required,Validators.minLength(1)]],
      motDePasse: ['',[Validators.required,Validators.minLength(1)]],
      confirm : [null, [Validators.required,Validators.minLength(4),Validators.maxLength(20)]],
      photoProfilPath: [null],
      photoBannierePath: [null]
    }, {
      validators: this.passwordMatchValidator
    })
    this.loginFormGroup = this.formBuilder.group({
      email: ['',[Validators.required,Validators.minLength(1)]],
      motDePasse: ['',[Validators.required,Validators.minLength(1)]],
    })
  }

  passwordMatchValidator(formGroup: FormGroup) {
    const password = formGroup.get('motDePasse')?.value;
    const confirmPassword = formGroup.get('confirm')?.value;

    if (password !== confirmPassword) {
      formGroup.get('confirm')?.setErrors({ mismatch: true });
    } else {
      formGroup.get('confirm')?.setErrors(null);
    }
  }

  inscriptionForm(){    
    this.displayInscription = !this.displayInscription
  }

  register(){
    this.registerFormGroup.removeControl('confirm');
    this.authService.register(this.registerFormGroup.value).subscribe()
    this.displayInscription = !this.displayInscription
  }

async connexion() {
  this.authService.login(this.loginFormGroup.value)
}

}
