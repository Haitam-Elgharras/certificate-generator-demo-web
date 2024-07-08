import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CandidateTableComponent } from './candidate-table/candidate-table.component';
import { CertificateFormComponent } from './certificate-form/certificate-form.component';
import { CertificateTableComponent } from './certificate-table/certificate-table.component';

const routes: Routes = [
  {path: 'candidates', component: CandidateTableComponent},
  {path: 'templates', component: CertificateTableComponent},
  {path: 'certificateForm', component: CertificateFormComponent},
  {path: '', redirectTo: '/candidates', pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { 

}
