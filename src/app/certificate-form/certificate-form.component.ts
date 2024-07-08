import { Component } from '@angular/core';
import { CertificateTemplateService } from '../services/certificate-template.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CertificateTemplate } from '../models/certificateTemplate.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-certificate-form',
  templateUrl: './certificate-form.component.html',
  styleUrl: './certificate-form.component.css'
})
export class CertificateFormComponent {

  certificateForm!: FormGroup;
  templates: CertificateTemplate[] = [];
  selectedFile: File | null = null;

  constructor(private certificateService: CertificateTemplateService, private fb: FormBuilder, private router: Router) {}

  ngOnInit() {
    this.certificateService.getCertificateTemplates()
    .subscribe({
      next: (templates) => {
        this.templates = templates;
      },
      error: (error) => {
        console.error('Error fetching templates:', error);
      }
    });

    this.certificateForm = this.fb.group({
      name: [''],
    });
  }

  onFileSelected(event: Event) {
    const element = event.currentTarget as HTMLInputElement;
    let fileList: FileList | null = element.files;
    if (fileList)
      this.selectedFile = fileList[0];
    console.log('Selected file:', this.selectedFile);
  }

  onSubmit() {
    if (this.selectedFile) {
      this.certificateService.createCertificateTemplate(this.selectedFile, this.certificateForm.value.name)
      .subscribe({
        next: (response) => {
          // navigate to the candidate table with the list of certificates opened
          this.router.navigate(['/candidates']);
        },
        error: (error) => {
          console.error('Error creating certificate template:', error);
        }
      });
    }
  }


}
