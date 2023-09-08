import { Component } from '@angular/core';
import { AccountService } from 'src/app/services/account.service';

@Component({
  selector: 'app-user-admon',
  templateUrl: './user-admon.component.html'
})
export class UserAdmonComponent {

  constructor(
    private accountServ: AccountService
  ){
    this.load();
  }

  load() {

    this.accountServ.List().subscribe({
      next: (response) => {
        console.log(response);
      },
      error: (error) => {
        console.log(error);
      }
    });

  }

}
