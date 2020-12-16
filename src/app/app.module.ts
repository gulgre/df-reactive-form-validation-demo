import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { ReactiveFormsModule } from "@angular/forms";

import { AppComponent } from "./app.component";
import { HelloComponent } from "./hello.component";
import { HttpClient, HttpClientModule } from "@angular/common/http";
import { MatTabsModule } from '@angular/material/tabs'
import { NoopAnimationsModule } from "@angular/platform-browser/animations";

@NgModule({
  imports: [BrowserModule, ReactiveFormsModule, HttpClientModule, MatTabsModule, NoopAnimationsModule],
  declarations: [AppComponent, HelloComponent],
  bootstrap: [AppComponent],  
})
export class AppModule {}
