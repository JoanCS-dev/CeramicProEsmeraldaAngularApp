import { Component, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DataTableDirective } from 'angular-datatables';
import { UserIdleService } from 'angular-user-idle';
import { Subject } from 'rxjs';
import { EmailService } from 'src/app/services/email.service';
import { Constants } from 'src/app/tools/Constants';
import { Editor, Toolbar } from 'ngx-editor';


@Component({
  selector: 'app-email',
  templateUrl: './email.component.html',
  styleUrls: ['./email.component.scss']
})
export class EmailComponent {
  @ViewChild(DataTableDirective, {static: false})
  public dtElement: any = DataTableDirective;
  public dtOptions: DataTables.Settings = { };
  public dtTrigger: Subject<any> = new Subject<any>();
  public spanish: any = Constants.ES_MX;

  public lst_emails: any;

  public mdlErrorShow = false;
  public mdlErrorMessage = "";

  public mdlSuccessShow = false;
  public mdlSuccessMessage = "";

  public mdlProgressShow = false;
  public mdlProgressHtml = Constants.HTML_PROGRESS;

  public mdlConfirmAccept = false;
  public mdlConfirmCancel = false;

  public mdlTitle: string = "Agregar Correo";

  // Begin variables the Timeout
  public mdlConfirmTimeout: boolean = false;
  public minutes_timeout = 0;
  // End variable the Timeout
  
  public editor: any = Editor;

  public form_email= this.fb.group({
    emailID: [0, { nonNullable: true }],
    emSubject: ['', [Validators.required, Validators.minLength(3)]],
    emBody: ['', [Validators.required, Validators.minLength(6)]],
    emEmail: ['', [Validators.required, Validators.pattern("[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$")]],
    emPassword: ['', [Validators.required, Validators.minLength(6)]],
    emEnviarSts: [false, {nonNullable: true}],
    emEnviarEmail: [{value: '', disabled: true}],
    emEmailCC: [''],
    emSTS: ['']
  });

  get emSubject() {
    return this.form_email.get("emSubject")?.invalid && this.form_email.get("emSubject")?.touched;
  }

  get emBody() {
    return this.form_email.get("emBody")?.invalid && this.form_email.get("emBody")?.touched;
  }

  get emEmail() {
    return this.form_email.get("emEmail")?.invalid && this.form_email.get("emEmail")?.touched;
  }

  get emPassword() {
    return this.form_email.get("emPassword")?.invalid && this.form_email.get("emPassword")?.touched;
  }

  get emEmailCC() {
    return this.form_email.get("emEmailCC")?.invalid && this.form_email.get("emEmailCC")?.touched;
  }

  constructor(private emailService: EmailService, private userIdle: UserIdleService, private router: Router, private fb: FormBuilder) {}

  ngOnInit(){
    this.editor = new Editor();
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
    this.dtOptions = {
      language: this.spanish,
      order:[[0, 'desc']]
    };

    this.load();
  }

  ngOnDestroy() {
    this.dtTrigger.unsubscribe();
    this.editor.destroy();
  }

  load() {

    this.mdlProgressShow = true;

    this.emailService.List().subscribe({
      next: (response) => {
        if(response.ok){
          this.lst_emails = response.data;
          this.dtTrigger.next(null);
          setTimeout(() => {
            this.mdlProgressShow = false;
          }, 500)
        }else{
          this.ShowError(response.message);
        }
      },
      error: (error) => {
        this.ShowError(error.message);
      } 
    })

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

  SaveAs() : void {
    
    if(this.form_email.invalid){
      return Object.values(this.form_email.controls).forEach(control => {
        control.markAllAsTouched();
      });
    }

    this.mdlProgressShow = true;

    

    if(this.form_email.get("emailID")?.value == null || this.form_email.get("emailID")?.value == 0) {

      this.emailService.Add(this.form_email.value).subscribe({
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

      this.emailService.Update(this.form_email.value).subscribe({
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

  Edit(d: any){
    this.form_email.reset();
    this.mdlTitle = "Editar Correo"
    
    this.form_email.patchValue({
      emailID: d.item.emailID,
      emSubject: d.item.emSubject,
      emBody: d.item.emBody,
      emEmail: d.item.emEmail,
      emPassword: d.item.emPassword,
      emEnviarSts: d.item.emEnviarSts,
      emEnviarEmail: d.item.emEnviarEmail,
      emEmailCC: d.item.emEmailCC,
      emSTS: d.item.emSTS
    });
  }

  ResetFormAdd() : void {
    this.mdlTitle = "Agregar Correo"
    this.form_email.reset();
  }

  ContinueConnect(): void {
    this.userIdle.resetTimer();
    this.minutes_timeout = 0;
    this.mdlConfirmTimeout = false;
  }

  ChangeSTS(): void {
    
    if(Boolean(this.form_email.get("emEnviarSts")?.value)){
      this.form_email.get("emEnviarEmail")?.enable();
    }else{
      this.form_email.get("emEnviarEmail")?.disable();
    }
  }

  private ShowError(error: any){
    this.mdlProgressShow = false;
    this.mdlErrorShow = true;
    this.mdlErrorMessage = error;
  }
}
