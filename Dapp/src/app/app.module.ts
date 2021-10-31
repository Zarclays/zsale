import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { HomeComponent } from './modules/general/home/home.component';
import { NotFoundComponent } from './modules/general/not-found/not-found.component';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { ServicesModule } from './modules/services/services.module';

import { MdbFormsModule } from 'mdb-angular-ui-kit/forms';
import { MdbTooltipModule } from 'mdb-angular-ui-kit/tooltip';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    NotFoundComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ServicesModule,
    MdbFormsModule,
    MdbTooltipModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }