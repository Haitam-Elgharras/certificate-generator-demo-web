import { Injectable } from '@angular/core';
import { CertificateTemplate } from '../models/certificateTemplate.model';

@Injectable({
  providedIn: 'root'
})
export class AppStateService {

  constructor() { }

  selectedTemplate: CertificateTemplate | null = null;
  public templates: CertificateTemplate[] = [];

  public setSelectedTemplate(template: CertificateTemplate) {
    console.log('Selected Template:', template);
    this.selectedTemplate = template;
  }

  public getSelectedTemplate() {
    return this.selectedTemplate;
  }

  public setTemplates(templates: CertificateTemplate[]) {
    this.templates = templates;
  }
}
