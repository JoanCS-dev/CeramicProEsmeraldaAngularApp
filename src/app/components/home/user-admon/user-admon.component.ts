import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { AccountService } from 'src/app/services/account.service';
import { ProfileService } from 'src/app/services/profile.service';
import { Constants } from 'src/app/tools/Constants';

@Component({
  selector: 'app-user-admon',
  templateUrl: './user-admon.component.html'
})
export class UserAdmonComponent implements OnInit {
  
  mdlErrorShow = false;
  mdlErrorMessage = ""

  mdlSuccessShow = false;
  mdlSuccessMessage = ""

  mdlProgressShow = false;
  mdlProgressHtml = `<div class="progress"><div class="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" aria-valuenow="100" aria-valuemin="0" aria-valuemax="100" style="width: 100%"></div></div><small>Por favor espera un momento, este proceso puede tardar</small>`;
  
  
  lst_usuarios: any;
  lst_perfiles: any
  dtOptions: DataTables.Settings = { };
  dtTrigger: Subject<any> = new Subject<any>();
  spanish: any = Constants.ES_MX;

  get PeFirstName() {
    return this.form_add.get("peFirstName")?.invalid && this.form_add.get("peFirstName")?.touched;
  }

  get PeLastName() {
    return this.form_add.get("peLastName")?.invalid && this.form_add.get("peLastName")?.touched;
  }

  get AcUser() {
    return this.form_add.get("acUser")?.invalid && this.form_add.get("acUser")?.touched;
  }

  get AcPassword() {
    return this.form_add.get("acPassword")?.invalid && this.form_add.get("acPassword")?.touched;
  }

  get AcPasswordV() {
    return this.form_add.get("acPasswordV")?.touched && this.form_add.get("acPassword")?.value != this.form_add.get("acPasswordV")?.value;
  }

  get AcPhoneNumber() {
    return this.form_add.get("acPhoneNumber")?.invalid && this.form_add.get("acPhoneNumber")?.touched;
  }

  get ProfileID() {
    return this.form_add.get("profileID")?.touched && this.form_add.get("profileID")?.value == -1;
  }

  form_add = this.fb.group({
    peFirstName: ['', [Validators.required, Validators.minLength(3)]],
    peLastName: ['', [Validators.required, Validators.minLength(3)]],
    acUser: ['', [Validators.required, Validators.pattern("[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$")]],
    acPassword: ['', [Validators.required, Validators.minLength(8)]],
    acPasswordV: ['', [Validators.required, Validators.minLength(8)]],
    acPhoneNumber: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(10)]],
    profileID: [-1]
  })

  constructor(
    private accountServ: AccountService,
    private profileServ: ProfileService,
    private fb: FormBuilder
  ){
    
  }

  ngOnInit(): void {
    this.mdlProgressShow = true;
    this.dtOptions = {
      language: this.spanish
    };
    this.load();
    this.Perfiles();
  }

  SaveAs() {
    if(this.form_add.invalid){
      return Object.values(this.form_add.controls).forEach(control => {
        control.markAllAsTouched();
      });
    }
  }

  ResetFormAdd() {
    this.form_add.reset();
    this.form_add.get("profileID")?.setValue(-1);
  }

  load() {

    this.accountServ.List().subscribe({
      next: (response) => {
        if(response.ok){
          this.lst_usuarios = response.data;
          this.dtTrigger.next(null);
          this.mdlProgressShow = false;
        }
      },
      error: (error) => {
        this.mdlProgressShow = false;
        this.mdlErrorShow = true;
        this.mdlErrorMessage = error.message;
      }
    });

  }

  Perfiles() {

    this.profileServ.DropListProfile().subscribe({
      next: (response) => {
        if(response.ok){
          this.lst_perfiles = response.data;
        }
      },
      error: (error) => {
        this.mdlErrorShow = true;
        this.mdlErrorMessage = error.message;
      }
    });

  }

}
