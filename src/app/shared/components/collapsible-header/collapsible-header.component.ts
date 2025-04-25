import {  Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ShrinkedHeaderComponent } from '../shrinked-header/shrinked-header.component';
import { ProfileHeaderComponent } from '../profile-header/profile-header.component';
import { HomeService } from 'src/app/core/services/home.service';
import { Subscription } from 'rxjs';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { SplitButtonModule } from 'primeng/splitbutton';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-collapsible-header',
  imports: [ButtonModule, CommonModule, FormsModule, ProfileHeaderComponent, ShrinkedHeaderComponent, SplitButtonModule],
  templateUrl: './collapsible-header.component.html',
  styleUrl: './collapsible-header.component.scss'
})
export class CollapsibleHeaderComponent implements OnInit{

  @Input() backgroundImageUrl: string | undefined;
  @Input() isEditAllowed = false;
  @Input() loading = false;
  @Input() logoUrl: string | undefined;
  @Input() title: string | undefined;
  @Output() backgroundImageUrlChange = new EventEmitter<string>(); 
  @Output() logoUrlChange = new EventEmitter<string>(); 
  
  scrollSubscription!: Subscription;
  schrunk = false;
  triggerHeight = 240;


  constructor(
    private homeService: HomeService,
  ) {

  }

  ngOnInit(): void {
    this.scrollSubscription = this.homeService.scrollObservable$.subscribe(
      (scrollTop) => {
        if (scrollTop >= this.triggerHeight) {
          this.schrunk = true;
        } else {
          this.schrunk = false;
        }
      }
    );
  }

  onBackgroundImageChange(newBackgroundImageUrl: string) {
    this.backgroundImageUrl = newBackgroundImageUrl;
    this.backgroundImageUrlChange.emit(newBackgroundImageUrl); 
  }

  onLogoChange(newLogoUrl: string) {
    this.logoUrl = newLogoUrl;
    this.logoUrlChange.emit(newLogoUrl); 
  }
  
}
