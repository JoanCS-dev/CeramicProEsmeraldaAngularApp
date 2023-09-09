import { Component, OnInit, ViewChild } from '@angular/core';
import { Subject } from 'rxjs';
import { AccountService } from 'src/app/services/account.service';
import { Constants } from 'src/app/tools/Constants';

@Component({
  selector: 'app-user-admon',
  templateUrl: './user-admon.component.html'
})
export class UserAdmonComponent implements OnInit {
  
  mdlShowProgress = false;
  mdlHtmlProgress = `
    <div class="progress">
      <div class="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" aria-valuenow="100" aria-valuemin="0" aria-valuemax="100" style="width: 100%"></div>
    </div>
    <small>Por favor espera un momento, este proceso puede tardar</small>
  `;
  lst_usuarios: any;
  dtOptions: DataTables.Settings = { };
  dtTrigger: Subject<any> = new Subject<any>();
  spanish: any = Constants.ES_MX;

  constructor(
    private accountServ: AccountService
  ){
    
  }

  ngOnInit(): void {
    this.mdlShowProgress = true;
    this.dtOptions = {
      language: this.spanish
    };
    this.load();
    
  }

  load() {

    this.accountServ.List().subscribe({
      next: (response) => {
        console.log(response);
        if(response.ok){
          this.lst_usuarios = response.data;
          this.dtTrigger.next(null);
          this.mdlShowProgress = false;
        }
      },
      error: (error) => {
        console.log(error);
        this.mdlShowProgress = false;
      }
    });

  }

}
