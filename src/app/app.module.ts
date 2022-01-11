import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import {HttpClientModule} from '@angular/common/http';
import { ElementCardComponent } from './element-card/element-card.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { ChartsModule } from 'ng2-charts';
import { PeriodicTableComponent } from './periodic-table/periodic-table.component';
import { CanvasDisplayComponent } from './canvas-display/canvas-display.component';
import { ParseElementVarPipe } from './pipes/parse-element-var.pipe';
import { MultiSelectComponent } from './multi-select/multi-select.component';

@NgModule({
  declarations: [
    AppComponent,
    ElementCardComponent,
    PeriodicTableComponent,
    CanvasDisplayComponent,
    ParseElementVarPipe,
    MultiSelectComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    ChartsModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
