import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-x-icon',
  templateUrl: './x-icon.component.html',
  styleUrl: './x-icon.component.css'
})
export class XIconComponent {
  @Input() width: number | string = 24;
  @Input() height: number | string = 24;
}