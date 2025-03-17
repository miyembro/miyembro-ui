import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { OrganizationResponse } from 'src/app/core/models/organization-reponse';
import { CollapsibleHeaderComponent } from "../../../../shared/components/collapsible-header/collapsible-header.component";
import { OrganizationService } from 'src/app/core/services/organization.service';
import { LoaderService } from 'src/app/core/services/loader.service';
import { Router } from '@angular/router';
import { ImageType } from 'src/app/core/models/image-type.enum';
import { AlertService } from 'src/app/core/services/alert.service';
import { UpdateOrganizationPhotoRequest } from '../../../../core/models/update-organization-photo-request';
import { ProfileHeaderService } from 'src/app/core/services/profile-header.service';

@Component({
  selector: 'app-organization-collapsing-header',
  imports: [CollapsibleHeaderComponent],
  templateUrl: './organization-collapsing-header.component.html',
  styleUrl: './organization-collapsing-header.component.scss'
})
export class OrganizationCollapsingHeaderComponent implements OnInit, OnChanges {
  
    @Input() organization: OrganizationResponse | null = null;
    @Input() isEditAllowed = false;

  backgroundImageUrl: string | undefined;
  logoUrl: string | undefined;
  title: string | undefined;


  constructor( 
    private alertService: AlertService,
    private loaderService: LoaderService,
    private organizationService: OrganizationService,
    private profileHeaderService: ProfileHeaderService,
    private router: Router,
  ) {

  }


  ngOnInit(): void {
    this.profileHeaderService.getBackgroundImageUpdate().subscribe((res)=> {
      if(res && this.backgroundImageUrl !== res && (res instanceof File)) {
        this.onOrganizationBackgroundImageUrlUpdate(res);
      }
    });
    this.profileHeaderService.getLogoImageUpdate().subscribe((res)=> {
      if(res && this.logoUrl !== res && (res instanceof File)) {
        this.onOrganizationLogoUrlUpdate(res);
      }
    });
  }


  ngOnChanges(changes: SimpleChanges): void {
    if (changes['organization'] && this.organization) {
      this.backgroundImageUrl = `${this.organization.backgroundImageUrl}?v=${new Date().getTime()}`;
      this.logoUrl = `${this.organization.logoUrl}?v=${new Date().getTime()}`;
      this.title = this.organization.name;
    }
  }

  onOrganizationBackgroundImageUrlUpdate(event: any) {
    const updateOrganizationPhotoRequest: UpdateOrganizationPhotoRequest = {
      imageType: ImageType.BACKGROUND_IMAGE
    }
    this.updateOrganizationPhoto(event, updateOrganizationPhotoRequest );
  }

  onOrganizationLogoUrlUpdate(event: any) {
    const updateOrganizationPhotoRequest: UpdateOrganizationPhotoRequest = {
      imageType: ImageType.LOGO_IMAGE
    }
    this.updateOrganizationPhoto(event, updateOrganizationPhotoRequest );
  }


  updateOrganizationPhoto(file: any, updateOrganizationPhotoRequest: UpdateOrganizationPhotoRequest) {
    const formData = new FormData();

    if(file) {
      formData.append('image', file);
    }

    formData.append('imageType', updateOrganizationPhotoRequest.imageType);
    this.loaderService.showLoader(this.router.url, false);
    this.organizationService.updateOrganizationPhoto(this.organization?.organizationId, formData).subscribe(
      (res) => {
        this.backgroundImageUrl = `${res.backgroundImageUrl}?v=${new Date().getTime()}`;
        this.logoUrl = `${res.logoUrl}?v=${new Date().getTime()}`;
        this.loaderService.hideLoader(this.router.url);
        this.alertService.success('/login', 'Success', 'Succefully updated image');
      },
      (err: any) => {
        this.loaderService.hideLoader(this.router.url);
        this.alertService.error('/login', 'Error', err);
      }
    );
  }

    

}
