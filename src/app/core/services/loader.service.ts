import { Injectable } from '@angular/core';
import { LoaderOptions } from '../models/loader-options';
import { Subject } from 'rxjs/internal/Subject';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoaderService {

  private loaderSubject = new Subject<LoaderOptions>();

  getLoaders(): Observable<LoaderOptions> {
    return this.loaderSubject.asObservable();
  }

  hideLoader(key: string) {
    this.setLoader({ key: key, showLoader: false, showBlock: false})
  }
  
  showLoader(key: string, showBlock: boolean ) {
    this.setLoader({ key: key, showLoader: true, showBlock: showBlock})
  }

  private setLoader(loaderOptions: LoaderOptions): void {
    this.loaderSubject.next(loaderOptions);
  }
}
