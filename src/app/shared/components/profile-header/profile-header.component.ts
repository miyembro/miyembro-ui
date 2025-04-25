import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AvatarModule } from 'primeng/avatar';
import { AvatarGroupModule } from 'primeng/avatargroup';
import { FormsModule } from '@angular/forms';
import { PhotoControlComponent } from '../photo-control/photo-control.component';
import { ChipModule } from 'primeng/chip';
import { ProfileHeaderService } from '../../../core/services/profile-header.service';
import { Skeleton } from 'primeng/skeleton';

@Component({
  selector: 'app-profile-header',
  imports: [
    AvatarGroupModule, 
    AvatarModule, 
    ChipModule, 
    CommonModule, 
    FormsModule, 
    PhotoControlComponent, 
    Skeleton
  ],
  templateUrl: './profile-header.component.html',
  styleUrl: './profile-header.component.scss'
})
export class ProfileHeaderComponent {

  @Input() backgroundImageUrl: string | undefined;
  @Input() isEditAllowed = false;
  @Input() loading = false;
  @Input() logoUrl: string | undefined;
  @Input() title: string | undefined;

  @Output() backgroundImageUrlChange = new EventEmitter<string>(); 
  @Output() logoUrlChange = new EventEmitter<string>(); 

  constructor(
    private profileHeaderService: ProfileHeaderService
  ) {
    
  }

  onBackgroundImageChange(newBackgroundImageUrl: string) {
    if(this.backgroundImageUrl != newBackgroundImageUrl) {
      this.profileHeaderService.setBackgroundImage(newBackgroundImageUrl);
    }
  }

  onLogoChange(newLogoUrl: string) {
    if(this.logoUrl != newLogoUrl) {
      this.profileHeaderService.setLogoImage(newLogoUrl);
    }
  }

}
