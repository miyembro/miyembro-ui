import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProfileHeaderService {

  
  backgroundImage: File | string | null = null;
  logoImage: File | string | null = null;

  private profileHeaderBackgroundSubject = new Subject<File | string | null>();
  private profileHeaderLogoSubject = new Subject<File | string | null>();

  getBackgroundImageUpdate(): Observable<File | string | null> {
    return this.profileHeaderBackgroundSubject.asObservable();
  }

  getLogoImageUpdate(): Observable<File | string | null> {
    return this.profileHeaderLogoSubject.asObservable();
  }

  setBackgroundImage(backgroundImage: File | string | null): void {
    this.profileHeaderBackgroundSubject.next(backgroundImage);
  }

  setLogoImage(logo: File | string | null): void {
    this.profileHeaderLogoSubject.next(logo);
  }

}
