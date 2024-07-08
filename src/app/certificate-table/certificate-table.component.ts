import { Component } from '@angular/core';
import { CertificateTemplateService } from '../services/certificate-template.service';
import { CertificateTemplate } from '../models/certificateTemplate.model';
import { AppStateService } from '../services/app-state.service';

@Component({
  selector: 'app-certificate-table',
  templateUrl: './certificate-table.component.html',
  styleUrl: './certificate-table.component.css'
})
export class CertificateTableComponent {
deletetemplate(arg0: number) {
throw new Error('Method not implemented.');
}
updateTemaplate() {
throw new Error('Method not implemented.');
}


  constructor(private certificateService: CertificateTemplateService, private appState: AppStateService){};

  certificateTemplates: CertificateTemplate[] = [];


  ngOnInit() {
    this.certificateService.getCertificateTemplates()
    .subscribe({
      next: (certificateTemplates: CertificateTemplate[]) => {
        this.certificateTemplates = certificateTemplates;
      },
      error: (err) => {
        console.error(err);
      }
    });
  }

  deleteTemplate(id: number) {
    let templates = this.appState.templates;

    // store the deleted template in a variable
    const deletedTemplate = templates.find((template) => template.id === id);

    // remove the template from the list
    this.appState.templates = templates.filter((template) => template.id !== id);
    this.certificateTemplates = this.appState.templates;

    // send delete request to the server
    this.certificateService.deleteCertificateTemplate(id).subscribe({
      next: (response) => {
        console.log('Template deleted:', response);
      },
      error: (error) => {
        // if the delete request fails, add the template back to the list
        if(deletedTemplate)
          this.appState.templates.push(deletedTemplate);
      },
    });
  }


}
