import { MaterialModule } from './materials/materials.module';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ConfirmComponent } from './confirm/confirm.component';

@NgModule({
  declarations: [AppComponent, ConfirmComponent],
  imports: [BrowserModule, AppRoutingModule, MaterialModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
