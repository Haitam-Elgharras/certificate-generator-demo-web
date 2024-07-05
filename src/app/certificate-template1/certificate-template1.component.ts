import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-certificate-template1',
  templateUrl: './certificate-template1.component.html',
  styleUrls: ['./certificate-template1.component.css']
})
export class CertificateComponent {
  @Input() candidateName: string | undefined;
}
