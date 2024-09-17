import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { PeriodicElement, PeriodicElementService } from './periodic-element.service';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AppStateService {
  private elementsSubject = new BehaviorSubject<PeriodicElement[]>([]);
  elements$: Observable<PeriodicElement[]> = this.elementsSubject.asObservable();
  
  private filterSubject = new BehaviorSubject<string>('');
  filter$: Observable<string> = this.filterSubject.asObservable();
  
  private isLoadingSubject = new BehaviorSubject<boolean>(true);
  isLoading$: Observable<boolean> = this.isLoadingSubject.asObservable();

  constructor(private elementService: PeriodicElementService) {
    this.loadElements();
  }

  loadElements(): void {
    this.isLoadingSubject.next(true);
    this.elementService.getElements().pipe(
      tap((elements) => {
        this.elementsSubject.next(elements);
        this.isLoadingSubject.next(false);
      })
    ).subscribe();
  }

  setFilter(filterValue: string): void {
    this.filterSubject.next(filterValue);
  }

  updateElement(element: PeriodicElement): void {
    this.elementsSubject.next(this.elementsSubject.value.map((e) => {
      if (e.position === element.position) {
        return element;
      }
      return e;
    }));
  }
}
