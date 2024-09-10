import { Component, OnInit } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { PeriodicElement, PeriodicElementService } from '../periodic-element.service';
import { EditElementDialogComponent } from '../edit-element-dialog/edit-element-dialog.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-periodic-table',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatProgressSpinnerModule],
  templateUrl: './periodic-table.component.html',
  styleUrls: ['./periodic-table.component.scss']
})
export class PeriodicTableComponent implements OnInit {
  displayedColumns: string[] = ['position', 'name', 'weight', 'symbol', 'actions'];
  dataSource: PeriodicElement[] = [];
  filteredDataSource: PeriodicElement[] = [];
  isLoading: boolean = true;

  private filterSubject = new Subject<string>();
  filterValue: string = '';

  constructor(
    private elementService: PeriodicElementService,
    public dialog: MatDialog
  ) {}

  ngOnInit() {
    this.elementService.getElements().subscribe(data => {
      this.dataSource = data;
      this.filteredDataSource = data;
      this.isLoading = false;

      this.filterSubject.pipe(
        debounceTime(2000)
      ).subscribe(filterValue => {
        this.applyFilter(filterValue);
      });
    });
  }

  applyFilter(filterValue: string): void {
    filterValue = filterValue.trim().toLowerCase();
    this.filteredDataSource = this.dataSource.filter(element => {
      return (
        element.name.toLowerCase().includes(filterValue) ||
        element.symbol.toLowerCase().includes(filterValue) ||
        element.weight.toString().includes(filterValue) ||
        element.position.toString().includes(filterValue)
      );
    });
  }

  editElement(element: PeriodicElement): void {
    const dialogRef = this.dialog.open(EditElementDialogComponent, {
      width: '300px',
      data: element
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.dataSource = this.dataSource.map(el => el.position === result.position ? result : el);
        this.filteredDataSource = this.dataSource;
      }
    });
  }

  onFilterChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.filterSubject.next(input.value);
  }
}
