import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { DataTableDirective } from 'angular-datatables';
import { UserIdleService } from 'angular-user-idle';
import { Subject } from 'rxjs';
import { QuotesService } from 'src/app/services/quotes.service';
import { Constants } from 'src/app/tools/Constants';

@Component({
  selector: 'app-quotes',
  templateUrl: './quotes.component.html'
})
export class QuotesComponent {

  @ViewChild(DataTableDirective, {static: false})
  public dtElement: any = DataTableDirective;
  public dtOptions: DataTables.Settings = { };
  public dtTrigger: Subject<any> = new Subject<any>();
  public spanish: any = Constants.ES_MX;

  public lst_quotes: any;

  public mdlErrorShow = false;
  public mdlErrorMessage = ""

  public mdlSuccessShow = false;
  public mdlSuccessMessage = ""

  public mdlProgressShow = false;
  public mdlProgressHtml = Constants.HTML_PROGRESS;
  
  public mdlConfirmAccept = false;
  public mdlConfirmCancel = false;

  public item_accept_or_cancel: any;

   // Begin variables the Timeout
   public mdlConfirmTimeout: boolean = false;
   public minutes_timeout = 0
   // End variable the Timeout
  
  constructor(private quotesService: QuotesService, private userIdle: UserIdleService, private router: Router) {}

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
      order:[[4, 'desc']]
    };
    this.load();
  }

  ngOnDestroy() {
    this.dtTrigger.unsubscribe();
  }

  load() {

    this.mdlProgressShow = true;

    this.quotesService.List().subscribe({
      next: (response) => {
        if(response.ok){
          this.lst_quotes = response.data;
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

  ShowConfirmAccept(d: any){
    this.item_accept_or_cancel = d.item;
    this.mdlConfirmAccept = true;
  }

  ShowConfirmCancel(d: any){
    this.item_accept_or_cancel = d.item;
    this.mdlConfirmCancel = true;
  }

  Accept(){
    this.mdlConfirmAccept = false;
    this.mdlProgressShow = true;

    this.quotesService.Accept(this.item_accept_or_cancel).subscribe({
      next: (response) => {
        if(response.ok){
          this.mdlProgressShow = false;
          this.mdlSuccessShow = true;
          this.mdlSuccessMessage = response.message;
        }else{
          this.ShowError(response.message);
        }
      },
      error: (error) => {
        this.ShowError(error.message);
      } 
    })
  }

  Cancel(){
    this.mdlConfirmCancel = false;
    this.mdlProgressShow = true;

    this.quotesService.Cancel(this.item_accept_or_cancel).subscribe({
      next: (response) => {
        if(response.ok){
          this.mdlProgressShow = false;
          this.mdlSuccessShow = true;
          this.mdlSuccessMessage = response.message;
        }else{
          this.ShowError(response.message);
        }
      },
      error: (error) => {
        this.ShowError(error.message);
      } 
    })
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
