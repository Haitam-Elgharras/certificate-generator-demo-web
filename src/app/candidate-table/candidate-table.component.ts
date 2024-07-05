import { Component } from '@angular/core';
import { Candidate } from '../models/candidate.model';
import { CandidateService } from '../services/candidate.service';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { Router } from '@angular/router';

@Component({
  selector: 'app-candidate-table',
  templateUrl: './candidate-table.component.html',
  styleUrls: ['./candidate-table.component.css']
})
export class CandidateTableComponent {
  candidates: Candidate[] = [];
  selectedCandidate: Candidate | null = null;
  showTemplatePopup: boolean = false;
  showViewDetailsPopup: boolean = false;

  constructor(private candidateService: CandidateService, private router: Router) {}

  ngOnInit() {
    this.candidateService.getCandidates().subscribe({
      next: (candidates) => {
        this.candidates = candidates;
      },
      error: (error) => {
        console.error('Error fetching candidates:', error);
      }
    });
  }

  printCandidate(id: number) {
    const candidate = this.candidates.find(c => c.id === id);
    if (candidate) {
      this.selectedCandidate = candidate;
      setTimeout(() => this.downloadPDF(), 100); // Wait for view to update
    }
  }

  downloadPDF() {
    const elementToPrint = document.getElementById('certificate');
  
    html2canvas(elementToPrint!, { scale: 2 }).then((canvas) => {
      const imgWidth = (894 * 25.4) / 96;
      const imgHeight = (494 * 25.4) / 96;
  
      // Create a PDF with the same size as the canvas
      const pdf = new jsPDF({
        orientation: imgWidth > imgHeight ? 'l' : 'p',
        unit: 'mm',
        format: [imgWidth, imgHeight]
      });
  
      // Reduce image quality (e.g., 0.75) to reduce PDF size
      const imageData = canvas.toDataURL('image/png', 0.75); // Adjust the second parameter to reduce quality
  
      pdf.addImage(imageData, 'PNG', 0, 0, imgWidth, imgHeight);
  
      pdf.save(this.selectedCandidate?.name + '-certificate.pdf');
    });
  }

  
  updateCandidate(id: number) {
    // navigate to the update page
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

  viewDetails(candidate: Candidate) {
    // show the details popup
    this.showViewDetailsPopup = true;
    this.selectedCandidate = candidate;
  }

  addTemplate() {
    // redirect to the certificate form
    this.router.navigate(['certificateForm']);
  }
}