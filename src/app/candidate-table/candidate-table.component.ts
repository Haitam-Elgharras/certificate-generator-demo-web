import { Component } from '@angular/core';
import { Candidate } from '../models/candidate.model';
import { CandidateService } from '../services/candidate.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { PDFDocument, rgb } from 'pdf-lib';
import { CertificateTemplateService } from '../services/certificate-template.service';
import { AppStateService } from '../services/app-state.service';

@Component({
  selector: 'app-candidate-table',
  templateUrl: './candidate-table.component.html',
  styleUrls: ['./candidate-table.component.css']
})
export class CandidateTableComponent {

  candidates: Candidate[] = [];
  updateCandidateForm!: FormGroup;
  addCandidateForm!: FormGroup;
  selectedCandidate: Candidate | null = null;
  showTemplatePopup: boolean = false;
  showViewDetailsPopup: boolean = false;
  showUpdatePopup: boolean = false;
  showPreviewPopup: boolean = false;
  showAddPopup: boolean = false;
  previewUrl: string = '';

  constructor(private candidateService: CandidateService, private router: Router, private fb: FormBuilder, private certificateTemplateService: CertificateTemplateService, private appState: AppStateService) {}

  ngOnInit() {
    // load the candidates
    this.candidateService.getCandidates().subscribe({
      next: (res) => {
        this.candidates = res.body as Array<Candidate>;
        console.log('Candidates:', this.candidates);
      },
      error: (error) => {
        console.error('Error fetching candidates:', error);
      }
    });

    // load the certificate templates
    this.certificateTemplateService.getCertificateTemplates().subscribe({
      next: (templates) => {
        this.appState.setTemplates(templates);
      },
      error: (error) => {
        console.error('Error fetching templates:', error);
      },
    });

    this.updateCandidateForm = this.fb.group({
      name: [''],
      score: [''],
    });

    this.addCandidateForm = this.fb.group({
      name: [''],
      score: [''],
      dateNaissance: [''],
    });
  }

  printCandidate(id: number) {
    const candidate = this.candidates.find(c => c.id === id);
    if (candidate) {
      this.selectedCandidate = candidate;
      console.log('Selected Candidate:', this.selectedCandidate); // Log the selected candidate
      
      this.downloadPDF();
    } else {
      console.error('Candidate not found for ID:', id);
    }
  }

  onAddCandidate() {
    // get the values from the form
    this.candidateService.createCandidate(this.addCandidateForm.value).subscribe({
      next: (res) => {
        console.log('Candidate added:', res);
        this.candidates.push(res as Candidate);
        this.showAddPopup = false;
      },
      error: (error) => {
        console.error('Error adding candidate:', error);
      }
    });
  }
  
  updateCandidateDetails(candidate: Candidate) {
    this.selectedCandidate = candidate;
    this.showUpdatePopup = true;

    this.updateCandidateForm.setValue({
      name: candidate.name,
      score: candidate.score
    });
  }

  deleteCandidate(id: number) {
    this.candidateService.deleteCandidate(id).subscribe({
      next: () => {
        this.candidates = this.candidates.filter(c => c.id !== id);
      },
      error: (error) => {
        console.error('Error deleting candidate:', error);
      }
    });
  }

  onSubmit() {
    if (this.selectedCandidate) {
      this.candidateService.updateCandidate(this.selectedCandidate.id, this.updateCandidateForm.value)
      .subscribe({
        next: (response) => {
          console.log('Candidate updated:', response);
          this.showUpdatePopup = false;

          // Update the candidate in the list
          const updatedCandidate = this.candidates.find(c => c.id === this.selectedCandidate?.id);
          if (updatedCandidate) {
            updatedCandidate.name = this.updateCandidateForm.value.name;
            updatedCandidate.score = this.updateCandidateForm.value.score;
          }
        },
        error: (error) => {
          console.error('Error updating candidate:', error);
        }
      });
    }
  }

  viewDetails(candidate: Candidate) {
    // show the details popup
    this.selectedCandidate = candidate;
    this.showViewDetailsPopup = true;
  }

  addTemplate() {
    // redirect to the certificate form
    this.router.navigate(['certificateForm']);
  }

  previewCertificate(candidate: Candidate) {
    this.selectedCandidate = candidate;
    this.previewCertificateUrl();
    this.showPreviewPopup = true;
  }


  async previewCertificateUrl(): Promise<any> {
    if (this.selectedCandidate) {
      try {
        let templateId = this.appState.getSelectedTemplate()?.id || this.appState.templates[0].id;

        if (!templateId)
          throw new Error('No certificate template selected.');

        // Load the certificate template
        const blob = await this.certificateTemplateService.loadCertificateTemplate(templateId).toPromise();
        
        if (!blob) {
          throw new Error('Failed to load certificate template.');
        }
  
        // Load the PDF document from the blob
        const arrayBuffer = await blob.arrayBuffer();
        const pdfDoc = await PDFDocument.load(arrayBuffer);
  
        // Log the candidate details being used for the PDF
        console.log('Modifying PDF for Candidate:', this.selectedCandidate.name);
  
        // Example of modifying the PDF document
        const pages = pdfDoc.getPages();
        if (pages.length === 0) {
          throw new Error('No pages found in the PDF document.');
        }
        const firstPage = pages[0];
        const { width, height } = firstPage.getSize();
  
        // Estimate the width of the text
        const text = this.selectedCandidate.name || 'Default Name';
        const fontSize = 25;
        const textWidth = fontSize * text.length * 0.6; // Estimate text width (0.6 is an approximation factor)
  
        // Calculate coordinates to center the text
        const x = (width - textWidth) / 2;
        const y = height / 2 - 50;
  
        firstPage.drawText(text, {
          x,
          y,
          size: fontSize,
          color: rgb(0, 0, 0), // Set the text color to black
        });
  
        // Serialize the PDFDocument to bytes
        const pdfBytes = await pdfDoc.save();
  
        // Create a blob from the PDF bytes and trigger a download
        const downloadBlob = new Blob([pdfBytes], { type: 'application/pdf' });
        const pdfUrl = URL.createObjectURL(downloadBlob);
       
        this.previewUrl = pdfUrl;

        console.log(this.previewUrl || 'No URL found');

      } catch (error) {
        console.error('Error downloading PDF:', error);
      }
    } else {
      console.error('No candidate selected for PDF download.');
    }
  }

  async downloadPDF() {
    if (this.selectedCandidate) {
      try {
        let templateId = this.appState.getSelectedTemplate()?.id || this.appState.templates[0].id;

        if (!templateId)
          throw new Error('No certificate template selected.');

        // Load the certificate template
        const blob = await this.certificateTemplateService.loadCertificateTemplate(templateId).toPromise();
        
        if (!blob) {
          throw new Error('Failed to load certificate template.');
        }
  
        // Load the PDF document from the blob
        const arrayBuffer = await blob.arrayBuffer();
        const pdfDoc = await PDFDocument.load(arrayBuffer);
  
        // Log the candidate details being used for the PDF
        console.log('Modifying PDF for Candidate:', this.selectedCandidate.name);
  
        // Example of modifying the PDF document
        const pages = pdfDoc.getPages();
        if (pages.length === 0) {
          throw new Error('No pages found in the PDF document.');
        }
        const firstPage = pages[0];
        const { width, height } = firstPage.getSize();
  
        // Estimate the width of the text
        const text = this.selectedCandidate.name || 'Default Name';
        const fontSize = 25;
        const textWidth = fontSize * text.length * 0.6; // Estimate text width (0.6 is an approximation factor)
  
        // Calculate coordinates to center the text
        const x = (width - textWidth) / 2;
        const y = height / 2 - 50;
  
        firstPage.drawText(text, {
          x,
          y,
          size: fontSize,
          color: rgb(0, 0, 0), // Set the text color to black
        });
  
        // Serialize the PDFDocument to bytes
        const pdfBytes = await pdfDoc.save();
  
        // Create a blob from the PDF bytes and trigger a download
        const downloadBlob = new Blob([pdfBytes], { type: 'application/pdf' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(downloadBlob);
        link.download = `${this.selectedCandidate.name.replace(' ', '_')}_Certificate.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
  
        console.log('PDF download triggered successfully.');

        this.selectedCandidate.certificatePrinted = true;
        console.log('Updating candidate:', this.selectedCandidate);
        this.candidateService.updateCandidate(this.selectedCandidate.id, this.selectedCandidate)
        .subscribe({
          next: (response) => {
            console.log('Candidate updated:', response);
          },
          error: (error) => {
            console.error('Error updating candidate:', error);
          }
        });
      } catch (error) {
        console.error('Error downloading PDF:', error);
      }
    } else {
      console.error('No candidate selected for PDF download.');
    }
  }
}