import { MatDialog } from '@angular/material/dialog';
import { AppStateService } from '../app-state.service';
import { EditElementDialogComponent } from '../edit-element-dialog/edit-element-dialog.component';
import { PeriodicElement } from '../periodic-element.service';
import { Component, OnInit } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CommonModule } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-periodic-table',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatTableModule
  ],
  templateUrl: './periodic-table.component.html',
  styleUrls: ['./periodic-table.component.scss']
})
export class PeriodicTableComponent implements OnInit {
  displayedColumns: string[] = ['position', 'name', 'weight', 'symbol', 'actions'];
  dataSource = new MatTableDataSource<PeriodicElement>();
  private filterSubject = new Subject<string>();

  constructor(
    public dialog: MatDialog,
    public appStateService: AppStateService
  ) {}

  ngOnInit(): void {
    this.appStateService.elements$.subscribe(elements => {
      this.dataSource.data = elements || [];
    });

    this.filterSubject
      .pipe(debounceTime(2000))
      .subscribe(filterValue => {
        this.dataSource.filter = filterValue.trim().toLowerCase();
      });
    
    this.appStateService.filter$.subscribe(filterValue => {
      this.filterSubject.next(filterValue);
    });
  }

  onFilterChange(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value.trim();
    this.appStateService.setFilter(filterValue);
  }

  editElement(element: PeriodicElement): void {
    const dialogRef = this.dialog.open(EditElementDialogComponent, {
      width: '300px',
      data: element
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        this.appStateService.updateElement(result);
      }
    });
  }
}
