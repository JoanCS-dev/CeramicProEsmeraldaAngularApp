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
import { NgxEditorModule } from "ngx-editor";

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
    NgxEditorModule.forRoot({
      locals: {
        // menu
        bold: 'Negritas',
        italic: 'Itálica',
        code: 'Código',
        underline: 'Subrayar',
        strike: 'Pegar',
        blockquote: 'Cita en bloque',
        bullet_list: 'Lista de viñetas',
        ordered_list: 'Lista ordenada',
        heading: 'Título',
        h1: 'Título 1',
        h2: 'Título 2',
        h3: 'Título 3',
        h4: 'Título 4',
        h5: 'Título 5',
        h6: 'Título 6',
        align_left: 'Alinear a la izquierda',
        align_center: 'Alinear al centro',
        align_right: 'Alinear a la derecha',
        align_justify: 'Justificar',
        text_color: 'Color de texto',
        background_color: 'Color de fondo',
        insertLink: 'Insertar el link',
        removeLink: 'Remover link',
        insertImage: 'Insertar Imagen',
    
        // pupups, forms, others...
        url: 'URL',
        text: 'Texto',
        openInNewTab: 'Abrir en una pestaña nueva',
        insert: 'Insertar',
        altText: 'Texto alternativo',
        title: 'Titulo',
        remove: 'Remover',
      }
    })
  ],
  providers: [
    // provideUserIdleConfig({ idle: 600, timeout: 300, ping: 120 })
    provideUserIdleConfig({ idle: 300, timeout: 300, ping: 120 })
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
