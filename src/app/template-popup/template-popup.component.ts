import { Component, EventEmitter, Output } from '@angular/core';
import { CertificateTemplate } from '../models/certificateTemplate.model';
import { CertificateTemplateService } from '../services/certificate-template.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-template-popup',
  templateUrl: './template-popup.component.html',
  styleUrls: ['./template-popup.component.css'],
})
export class TemplatePopupComponent {
  @Output() closePopup = new EventEmitter<void>();

  constructor(private certificateService: CertificateTemplateService, private router: Router) {}

  templates: CertificateTemplate[] = [];

  selectedTemplate: CertificateTemplate | null = null;

  previewUrl: string = '';

  previewTemplate(template:any) {
    this.previewUrl = `http://localhost:8084/certificates/file/${template.id}`;

    // open the preview in a new tab
    window.open(this.previewUrl, '_blank');
  }

  ngOnInit() {
    this.certificateService.getCertificateTemplates().subscribe({
      next: (templates) => {
        this.templates = templates;
      },
      error: (error) => {
        console.error('Error fetching templates:', error);
      },
    });
  }

  deleteTemplate(id: number) {
    // store the deleted template in a variable
    const deletedTemplate = this.templates.find((template) => template.id === id);

    // remove the template from the list
    this.templates = this.templates.filter((template) => template.id !== id);

    // send delete request to the server
    this.certificateService.deleteCertificateTemplate(id).subscribe({
      next: (response) => {
        console.log('Template deleted:', response);
      },
      error: (error) => {
        // if the delete request fails, add the template back to the list
        if(deletedTemplate)
          this.templates.push(deletedTemplate);
      },
    });
  }

  selectTemplate(template: CertificateTemplate) {
    this.selectedTemplate = template;
    this.closePopup.emit();
  }

  // previewTemplate(template: CertificateTemplate) {
  //   console.log('Previewing template:', template);
  // }
}
