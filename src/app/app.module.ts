import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { ResizableModule } from 'angular-resizable-element';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TableTasksComponent } from './table-tasks/table-tasks.component';

@NgModule({
  declarations: [
    AppComponent,
    TableTasksComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    DragDropModule,
    ResizableModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
