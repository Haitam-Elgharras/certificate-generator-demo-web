import { Component, EventEmitter, Output } from '@angular/core';
import { CertificateTemplate } from '../models/certificateTemplate.model';
import { CertificateTemplateService } from '../services/certificate-template.service';
import { Router } from '@angular/router';
import { AppStateService } from '../services/app-state.service';


@Component({
  selector: 'app-template-popup',
  templateUrl: './template-popup.component.html',
  styleUrls: ['./template-popup.component.css'],
})
export class TemplatePopupComponent {
  @Output() closePopup = new EventEmitter<void>();

  constructor(private certificateService: CertificateTemplateService, private router: Router, public appState: AppStateService) {}

  previewUrl: string = '';

  previewTemplate(template:any) {
    this.previewUrl = `http://localhost:8084/certificates/file/${template.id}`;

    // open the preview in a new tab
    window.open(this.previewUrl, '_blank');
  }

  deleteTemplate(id: number) {
    let templates = this.appState.templates;

    // store the deleted template in a variable
    const deletedTemplate = templates.find((template) => template.id === id);

    // remove the template from the list
    this.appState.templates = templates.filter((template) => template.id !== id);

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

  selectTemplate(template: CertificateTemplate) {
    this.appState.setSelectedTemplate(template);
    this.closePopup.emit();
  }

  // previewTemplate(template: CertificateTemplate) {
  //   console.log('Previewing template:', template);
  // }
}
