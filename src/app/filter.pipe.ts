import { Pipe, PipeTransform } from '@angular/core';
import { PeriodicElement } from './periodic-element.service';

@Pipe({
  name: 'filter',
  standalone: true
})
export class FilterPipe implements PipeTransform {
  transform(elements: PeriodicElement[] | null, filterValue: string): PeriodicElement[] {
    if (!elements || !filterValue) {
      return elements || [];
    }

    const lowerCaseFilter = filterValue.toLowerCase();

    return elements.filter(element => this.matchesFilter(element, lowerCaseFilter));
  }

  private matchesFilter(element: PeriodicElement, filter: string): boolean {
    return Object.values(element).some(value =>
      value.toString().toLowerCase().includes(filter)
    );
  }
}
