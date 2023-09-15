import { Component, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { DataTableDirective } from 'angular-datatables';
import { UserIdleService } from 'angular-user-idle';
import { Subject } from 'rxjs';
import { EmailService } from 'src/app/services/email.service';
import { Constants } from 'src/app/tools/Constants';

@Component({
  selector: 'app-email',
  templateUrl: './email.component.html'
})
export class EmailComponent {
  @ViewChild(DataTableDirective, {static: false})
  public dtElement: any = DataTableDirective;
  public dtOptions: DataTables.Settings = { };
  public dtTrigger: Subject<any> = new Subject<any>();
  public spanish: any = Constants.ES_MX;

  public lst_emails: any;

  public mdlErrorShow = false;
  public mdlErrorMessage = ""

  public mdlSuccessShow = false;
  public mdlSuccessMessage = ""

  public mdlProgressShow = false;
  public mdlProgressHtml = Constants.HTML_PROGRESS;

  public mdlConfirmAccept = false;
  public mdlConfirmCancel = false;

  // Begin variables the Timeout
  public mdlConfirmTimeout: boolean = false;
  public minutes_timeout = 0
  // End variable the Timeout

  public editorConfig: AngularEditorConfig = {
    editable: true,
      spellcheck: true,
      height: 'auto',
      minHeight: '0',
      maxHeight: 'auto',
      width: 'auto',
      minWidth: '0',
      translate: 'yes',
      enableToolbar: true,
      showToolbar: true,
      placeholder: 'Enter text here...',
      defaultParagraphSeparator: '',
      defaultFontName: '',
      defaultFontSize: '',
      fonts: [
        {class: 'arial', name: 'Arial'},
        {class: 'times-new-roman', name: 'Times New Roman'},
        {class: 'calibri', name: 'Calibri'},
        {class: 'comic-sans-ms', name: 'Comic Sans MS'}
      ],
      customClasses: [
      {
        name: 'quote',
        class: 'quote',
      },
      {
        name: 'redText',
        class: 'redText'
      },
      {
        name: 'titleText',
        class: 'titleText',
        tag: 'h1',
      },
    ],
    toolbarHiddenButtons: [
      ['bold', 'italic'],
      ['fontSize']
    ],
};

  public form_email= this.fb.group({
    emailID: [0, {nonNullable: false}],
    emSubject: [''],
    emBody: [''],
    emEmail: [''],
    emPassword: [''],
    emEnviarSts: [false, {nonNullable: false}],
    emEnviarEmail: [''],
    emEmailCC: [''],
    emSTS: ['']
  });;

  constructor(private emailService: EmailService, private userIdle: UserIdleService, private router: Router, private fb: FormBuilder) {}

  ngOnInit(){
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
  }

  load() {

    this.mdlProgressShow = true;

    this.emailService.List().subscribe({
      next: (response) => {
        if(response.ok){
          this.lst_emails = response.data;
          this.dtTrigger.next(null);
          this.mdlProgressShow = false;
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
