import { Component } from '@angular/core';
import { HeaderComponent } from "../../components/header/header.component";
import { RouterModule } from '@angular/router';
import { FooterComponent } from "../../components/footer/footer.component";
import { trigger, transition, style, animate } from '@angular/animations';
import { CommonModule } from '@angular/common';
import { InfiniteScrollDirective } from 'ngx-infinite-scroll';
import { HomeService } from '../../../../core/services/home.service';

@Component({
  selector: 'app-home',
  imports: [
    CommonModule,
    FooterComponent,
    HeaderComponent,
    InfiniteScrollDirective,
    RouterModule
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('0.25s ease-in', style({ opacity: 1 })),
      ]),
    ]),
  ],
})
export class HomeComponent {

  constructor(
    private homeService: HomeService
  ) {}

  onNativeScroll(event: Event): void {
    const target = event.target as HTMLElement;
    this.homeService.emitScrollEvent(target.scrollTop);
  }
  

}
