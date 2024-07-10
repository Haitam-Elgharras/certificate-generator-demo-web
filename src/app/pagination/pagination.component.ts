// pagination.component.ts
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { AppStateService } from '../services/app-state.service';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.css']
})
export class PaginationComponent {

  @Output() pageChange: EventEmitter<number> = new EventEmitter<number>();

  constructor(private appStateService: AppStateService) { }

  totalPages : number = 0;
  currentPage : number = 0;

  ngAfterContentChecked() {
    this.totalPages = this.appStateService.candidateState.totalPages;
    this.currentPage = this.appStateService.candidateState.currentPage;
  }

  get pages(): number[] {
    const pages = [];
    const visiblePages = 5; // Number of visible pages
    let startPage = Math.max(1, this.currentPage - Math.floor(visiblePages / 2));
    let endPage = Math.min(this.totalPages, startPage + visiblePages - 1);

    if (endPage - startPage < visiblePages - 1) {
      startPage = Math.max(1, endPage - visiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages;
  }

  changePage(page: number): void {
    if (page > 0 && page <= this.totalPages) {
      this.pageChange.emit(page);
    }
  }
}
