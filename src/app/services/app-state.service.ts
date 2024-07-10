import { Injectable } from '@angular/core';
import { CertificateTemplate } from '../models/certificateTemplate.model';
import { CandidateState } from '../models/candidateState.model';

@Injectable({
  providedIn: 'root'
})
export class AppStateService {

  constructor() { }

  selectedTemplate: CertificateTemplate | null = null;
  public templates: CertificateTemplate[] = [];

  public candidateState: CandidateState = {
    candidates: [],
    keyword: "",
    totalPages: 0,
    pageSize: 4,
    currentPage: 1,
    totalCandidates: 0,
    status: "",
    error: ""
  };

  public setCandidateState(state:any){
    this.candidateState = {...this.candidateState, ...state};
  }

  public setSelectedTemplate(template: CertificateTemplate) {
    this.selectedTemplate = template;
  }

  public getSelectedTemplate() {
    return this.selectedTemplate;
  }

  public setTemplates(templates: CertificateTemplate[]) {
    this.templates = templates;
  }
}
