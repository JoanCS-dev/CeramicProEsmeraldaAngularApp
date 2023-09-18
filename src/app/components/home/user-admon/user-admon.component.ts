import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { AccountService } from 'src/app/services/account.service';
import { ProfileService } from 'src/app/services/profile.service';
import { Constants } from 'src/app/tools/Constants';
import { DataTableDirective } from 'angular-datatables';
import { UserIdleService } from 'angular-user-idle';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-admon',
  templateUrl: './user-admon.component.html'
})
export class UserAdmonComponent implements OnInit {

  @ViewChild(DataTableDirective, {static: false})
  public dtElement: any = DataTableDirective;

  public mdlTitle: string = "Agregar Cuenta"

  public mdlDeleteShow = false
  public mdlDeactivateShow = false
  
  public mdlErrorShow = false;
  public mdlErrorMessage = ""

  public mdlSuccessShow = false;
  public mdlSuccessMessage = ""

  public mdlProgressShow = false;
  public mdlProgressHtml = Constants.HTML_PROGRESS;
  
  public delete_account: any
  public deactivate_account: any

  public lst_usuarios: any;
  public lst_perfiles: any
  public dtOptions: DataTables.Settings = { };
  public dtTrigger: Subject<any> = new Subject<any>();
  public spanish: any = Constants.ES_MX;

  // Begin variables the Timeout
  public mdlConfirmTimeout: boolean = false;
  public minutes_timeout = 0
  // End variable the Timeout

  get PeFirstName() {
    return this.form_add.controls.peopleVM.get("peFirstName")?.invalid && this.form_add.controls.peopleVM.get("peFirstName")?.touched;
  }

  get PeLastName() {
    return this.form_add.controls.peopleVM.get("peLastName")?.invalid && this.form_add.controls.peopleVM.get("peLastName")?.touched;
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
    accountID: [0, { nonNullable: true }],
    acUser: ['', [Validators.required, Validators.pattern("[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$")]],
    acPassword: ['', [Validators.required, Validators.minLength(8)]],
    acPasswordV: ['', [Validators.required, Validators.minLength(8)]],
    acPhoneNumber: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(10)]],
    token: [''],
    peopleID: [0, { nonNullable: true }],
    profileID: [-1, { nonNullable: true }],
    peopleVM: this.fb.group({
      peopleID: [0, { nonNullable: true }],
      peFirstName: ['', [Validators.required, Validators.minLength(3)]],
      peLastName: ['', [Validators.required, Validators.minLength(3)]]
    })
  })

  constructor(
    private accountServ: AccountService,
    private profileServ: ProfileService,
    private fb: FormBuilder, 
    private userIdle: UserIdleService, 
    private router: Router
  ){
    
  }

  ngOnInit(): void {
    this.userIdle.startWatching();
    this.userIdle.onTimerStart().subscribe(count => console.log(count));
    this.userIdle.onTimeout().subscribe(() => {
      this.mdlConfirmTimeout = true;
      this.minutes_timeout++;
      if(this.minutes_timeout>60){
        this.userIdle.stopWatching();
        this.userIdle.stopTimer();
        this.router.navigate(['/'])
      }
    });
    this.mdlProgressShow = true;
    this.dtOptions = {
      language: this.spanish
    };
    this.load();
    this.Perfiles();
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

  Edit(d: any){
    this.form_add.reset();
    this.mdlTitle = "Editar Cuenta"
    
    this.form_add.patchValue({
      accountID: d.item.accountID,
      acUser: d.item.acUser,
      peopleID: d.item.peopleID,
      acPhoneNumber: d.item.acPhoneNumber,
      profileID: d.item.profileVM.profileID,
      peopleVM: {
        peopleID: d.item.peopleID,
        peFirstName: d.item.peopleVM.peFirstName,
        peLastName: d.item.peopleVM.peLastName
      }
    });
    
  }

  SaveAs() {
    
    if(this.form_add.invalid){
      return Object.values(this.form_add.controls).forEach(control => {
        control.markAllAsTouched();
      });
    }

    this.mdlProgressShow = true;

    if(this.form_add.get("accountID")?.value == 0){
      this.accountServ.Add(this.form_add.value).subscribe({
        next: (response) => {
          if(response.ok){
            this.mdlProgressShow = false;
            this.mdlSuccessShow = true;
            this.mdlSuccessMessage = response.message;
            this.ResetFormAdd();
          }else {
            this.ShowError(response.message);
          }
        },
        error: (error) => {
          this.ShowError(error.message);
        }
      });
    }else{
      this.accountServ.Update(this.form_add.value).subscribe({
        next: (response) => {
          if(response.ok){
            this.mdlProgressShow = false;
            this.mdlSuccessShow = true;
            this.mdlSuccessMessage = response.message;
            this.ResetFormAdd();
          }else {
            this.ShowError(response.message);
          }
        },
        error: (error) => {
          this.ShowError(error.message);
        }
      });
    }

    

  }

  ResetFormAdd() {
    this.mdlTitle = "Agregar Cuenta"
    this.form_add.reset();
  }

  reload(){
    this.mdlSuccessShow = false;
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      // Destroy the table first
      dtInstance.destroy();
      // Call the dtTrigger to rerender again
      this.load();
    });
  }

  load() {

    this.accountServ.List().subscribe({
      next: (response) => {
        if(response.ok){
          this.lst_usuarios = response.data;
          this.dtTrigger.next(null);
          this.mdlProgressShow = false;
        }else{
          this.ShowError(response.message);
        }
      },
      error: (error) => {
        this.ShowError(error.message);
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
        this.ShowError(error.message);
      }
    });

  }

  ShowModalDelete(d: any){
    this.delete_account = d.item
    this.mdlDeleteShow = true
  }

  ShowModalDeactivate(d: any){
    this.deactivate_account = d.item;
    this.mdlDeactivateShow = true
  }

  Delete(){
    this.mdlDeleteShow = false
    this.mdlProgressShow = true;

    this.accountServ.Delete(this.delete_account).subscribe({
      next: (response) => {
        if(response.ok){
          this.mdlProgressShow = false;
          this.mdlSuccessShow = true;
          this.mdlSuccessMessage = response.message;
        }else {
          this.ShowError(response.message);
        }
      },
      error: (error) => {
        this.ShowError(error.message);
      }
    });
  }

  Deactivate(){
    this.mdlDeactivateShow = false;
    this.mdlProgressShow = true;

    this.accountServ.Deactivate(this.deactivate_account).subscribe({
      next: (response) => {
        if(response.ok){
          this.mdlProgressShow = false;
          this.mdlSuccessShow = true;
          this.mdlSuccessMessage = response.message;
        }else {
          this.ShowError(response.message);
        }
      },
      error: (error) => {
        this.ShowError(error.message);
      }
    });
  }

  ContinueConnect(): void {
    this.userIdle.resetTimer();
    this.minutes_timeout = 0;
    this.mdlConfirmTimeout = false;
  }

  private ShowError(error: any){
    this.mdlProgressShow = false;
    this.mdlErrorShow = true;
    this.mdlErrorMessage = error;
  }

}
