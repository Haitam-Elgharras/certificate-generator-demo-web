import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { PdfViewerModule } from 'ng2-pdf-viewer';

import { CandidateTableComponent } from './candidate-table/candidate-table.component';
import { TemplatePopupComponent } from './template-popup/template-popup.component';
import { CertificateComponent } from './certificate-template1/certificate-template1.component';
import { CertificateFormComponent } from './certificate-form/certificate-form.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PdfToImageComponent } from './pdf-to-image/pdf-to-image.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { XIconComponent } from './components/x-icon/x-icon.component';
import { CertificateTableComponent } from './certificate-table/certificate-table.component';

@NgModule({
  declarations: [
    AppComponent,
    CandidateTableComponent,
    TemplatePopupComponent,
    CertificateComponent,
    CertificateFormComponent,
    PdfToImageComponent,
    XIconComponent,
    CertificateTableComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    PdfViewerModule,
  ],
  providers: [
    provideAnimationsAsync()
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
