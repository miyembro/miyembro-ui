import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HomeService {

  private scrollSubject = new Subject<number>();

  scrollObservable$: Observable<number> = this.scrollSubject.asObservable();

  emitScrollEvent(scrollTop: number): void {
    this.scrollSubject.next(scrollTop);
  }
}
