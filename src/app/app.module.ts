import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { FileUploaderComponent } from '@components/file-uploader/file-uploader.component';
import { HttpClientModule } from '@angular/common/http';
import { DropDirective } from './drop.directive';
import { LoaderComponent } from '@components/loader/loader.component';
import { DriversListComponent } from '@components/drivers-list/drivers-list.component';
import { ErrorsComponent } from '@components/errors/errors.component';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [
    AppComponent,
    FileUploaderComponent,
    DropDirective,
    LoaderComponent,
    DriversListComponent,
    ErrorsComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    CommonModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
