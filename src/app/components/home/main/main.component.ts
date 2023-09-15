import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserIdleService } from 'angular-user-idle';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html'
})
export class MainComponent implements OnInit {

  // Begin variables the Timeout
  public mdlConfirmTimeout: boolean = false;
  public minutes_timeout = 0
  // End variable the Timeout

  constructor(private userIdle: UserIdleService, private router: Router) {
  }

  ngOnInit() {
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
  }

  ContinueConnect(): void {
    this.userIdle.resetTimer();
    this.minutes_timeout = 0;
    this.mdlConfirmTimeout = false;
  }

}
