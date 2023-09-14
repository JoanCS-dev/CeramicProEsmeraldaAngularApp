import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { HomeComponent } from './components/home/home.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { MainComponent } from './components/home/main/main.component';
import { UserAdmonComponent } from './components/home/user-admon/user-admon.component';
import { QuotesComponent } from './components/home/quotes/quotes.component';

const routes_home: Routes = [
  { path: "", component: MainComponent },
  { path: "main", component: MainComponent },
  { path: "users", component: UserAdmonComponent },
  { path: "quotes", component: QuotesComponent },
  { path: "**", component: PageNotFoundComponent }
];

const routes: Routes = [
  { path: "", component: LoginComponent },
  { path: "home", component: HomeComponent, children: routes_home },
  { path: "**", component: PageNotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
