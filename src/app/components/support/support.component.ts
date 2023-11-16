import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SupportService } from 'src/app/services/support.service';

@Component({
  selector: 'app-support',
  templateUrl: './support.component.html'
})
export class SupportComponent {
  public mdlShow = false;
  public mdlTitle = "";
  public mdlMessage = ""
  public isLoading = false
  public textBtn = "Enviar"

  public mdlSuccessShow = false;
  public mdlSuccessMessage = "";

  constructor(
    private fb: FormBuilder,
    private serv: SupportService,
    private router: Router
  ) {
  }
  
  form_support = this.fb.group({
    fullname: ['', [Validators.required, Validators.minLength(20)]],
    email: ['', [Validators.required, Validators.minLength(5), Validators.pattern("[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$")]],
    problem: ['', [Validators.required, Validators.minLength(20)]]
  })

  get FullnameIsValid() {
    return this.form_support.get("fullname")?.invalid && this.form_support.get("fullname")?.touched;
  }

  get EmailIsValid() {
    return this.form_support.get("email")?.invalid && this.form_support.get("email")?.touched;
  }

  get ProblemIsValid() {
    return this.form_support.get("problem")?.invalid && this.form_support.get("problem")?.touched;
  }

  reset(){
    this.form_support.reset();
  }

  evtSupport(){
    if(this.form_support.invalid){
      return Object.values(this.form_support.controls).forEach(control => {
        control.markAllAsTouched();
      });
    }
    this.isLoading = true
    this.textBtn = "Enviar"
    this.serv.add(this.form_support.value).subscribe({
      next: (response) => {
        if(response.ok){
          this.mdlSuccessShow = true;
          this.mdlSuccessMessage = response.message;
          this.textBtn = "Enviar"
          this.isLoading = false
        }else{
          this.mdlShow = true;
          this.mdlTitle = "Error " + response.title;
          this.mdlMessage = response.message;
          this.textBtn = "Enviar"
          this.isLoading = false
        }
      },
      error: (error) => {
        this.mdlShow = true;
        this.mdlTitle = "Error " + error.status;
        this.mdlMessage = error.message;
        this.textBtn = "Enviar"
        this.isLoading = false
      }
    });
  }
}
