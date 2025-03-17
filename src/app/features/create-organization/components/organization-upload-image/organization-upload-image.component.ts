import { Component, Input, OnInit } from '@angular/core';
import { FileUploadModule } from 'primeng/fileupload';
import { CommonModule } from '@angular/common';
import {  FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AvatarComponent } from 'src/app/shared/components/avatar/avatar.component';

@Component({
  selector: 'app-organization-upload-image',
  imports: [
    AvatarComponent,
    CommonModule,
    FileUploadModule,
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './organization-upload-image.component.html',
  styleUrl: './organization-upload-image.component.scss'
})
export class OrganizationUploadImageComponent {

  @Input() organizationImageFileForm: FormGroup = new FormGroup({});
  
}
