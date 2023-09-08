import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html'
})
export class LoginComponent {

  public mdlShow = false;
  public mdlTitle = "";
  public mdlMessage = ""

  constructor(
    private fb: FormBuilder,
    private serv: AuthService,
    private router: Router
  ) {
  }

  get EmailIsValid() {
    return this.login.get('acUser')?.invalid && this.login.get('acUser')?.touched;
  }

  get PasswordIsValid(){
    return this.login.get('acPassword')?.invalid && this.login.get('acPassword')?.touched;
  }

  login = this.fb.group({
    acUser: ['', [Validators.required, Validators.minLength(5), Validators.pattern("[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$")]],
    acPassword: ['', [Validators.required, Validators.minLength(5)]]
  })

  evtLogin() {
    
    if(this.login.invalid){
      return Object.values(this.login.controls).forEach(control => {
        control.markAllAsTouched();
      });
    }
    this.serv.auth(this.login.value).subscribe({
      next: (response) => {
        if(response.ok){
          localStorage.setItem("strToken", response.data.strToken);
          localStorage.setItem("strCode", response.data.strCode);
          localStorage.setItem("fullName", response.data.fullName);
          this.router.navigate(['/home']);
        }else{
          this.mdlShow = true;
          this.mdlTitle = "Error " + response.title;
          this.mdlMessage = response.message;
        }
      },
      error: (error) => {
        this.mdlShow = true;
        this.mdlTitle = "Error " + error.status;
        this.mdlMessage = error.message;
      }
    });
  }

}
