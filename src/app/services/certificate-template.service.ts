import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { CertificateTemplate } from '../models/certificateTemplate.model';

@Injectable({
  providedIn: 'root'
})
export class CertificateTemplateService {

  baseUrl = environment.baseUrl + '/certificates';

  constructor(private http : HttpClient) { }

  getCertificateTemplates() {
    return this.http.get<CertificateTemplate[]>(this.baseUrl);
  }

  getCertificateTemplateById(id: number) {
    return this.http.get(this.baseUrl + '/' + id);
  }

  createCertificateTemplate(file: File, templateName: string) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('templateName', templateName);
  
    // Extracting the file extension
    const fileExtension = file.name.split('.').pop();
  
    // Appending the file extension as a query parameter named 'format'
    const urlWithFormat = `${this.baseUrl}?format=${fileExtension}`;
  
    return this.http.post(urlWithFormat, formData);
  }
    

  updateCertificateTemplate(certificateTemplate: CertificateTemplate) {
    return this.http.put(this.baseUrl, certificateTemplate);
  }

  deleteCertificateTemplate(id: number) {
    return this.http.delete(this.baseUrl + '/' + id);
  }

  loadCertificateTemplate(id: number) {
    return this.http.get(this.baseUrl + '/file/' + id, { responseType: 'blob' });
  }

}
