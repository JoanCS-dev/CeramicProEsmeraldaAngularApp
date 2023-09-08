import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html'
})
export class LoginComponent {

  constructor(
    private fb: FormBuilder
  ) {
  }

  get EmailIsValid() {
    return this.login.get('email')?.invalid && this.login.get('email')?.touched;
  }

  get PasswordIsValid(){
    return this.login.get('password')?.invalid && this.login.get('password')?.touched;
  }

  login = this.fb.group({
    email: ['', [Validators.required, Validators.minLength(5), Validators.pattern("[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$")]],
    password: ['', [Validators.required, Validators.minLength(5)]]
  })

  evtLogin() {
    if(this.login.invalid){
      return Object.values(this.login.controls).forEach(control => {
        control.markAllAsTouched();
      });
    }
    console.log(JSON.stringify(this.login.value));
  }

}
