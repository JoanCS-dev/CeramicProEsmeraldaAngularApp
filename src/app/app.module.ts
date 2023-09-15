import { BrowserModule } from "@angular/platform-browser";
import { HttpClientModule } from '@angular/common/http';
import { AppComponent } from "./app.component";
import { AppRoutingModule } from "./app-routing.module";
import { NgModule } from "@angular/core";
import { LoginComponent } from './components/login/login.component';
import { HomeComponent } from './components/home/home.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { MainComponent } from './components/home/main/main.component';
import { UserAdmonComponent } from './components/home/user-admon/user-admon.component';
import { ReactiveFormsModule } from "@angular/forms";
import { SweetAlert2Module } from "@sweetalert2/ngx-sweetalert2";
import { DataTablesModule } from "angular-datatables";
import { QuotesComponent } from './components/home/quotes/quotes.component';
import { provideUserIdleConfig } from "angular-user-idle";
import { EmailComponent } from './components/home/email/email.component';
import { AngularEditorModule } from "@kolkov/angular-editor";

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    PageNotFoundComponent,
    MainComponent,
    UserAdmonComponent,
    QuotesComponent,
    EmailComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    SweetAlert2Module.forRoot(),
    HttpClientModule,
    DataTablesModule,
    AngularEditorModule 
  ],
  providers: [
    // provideUserIdleConfig({ idle: 600, timeout: 300, ping: 120 })
    provideUserIdleConfig({ idle: 300, timeout: 300, ping: 120 })
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
