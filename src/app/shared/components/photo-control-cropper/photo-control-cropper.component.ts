import { Component } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ImageCropperComponent, ImageCroppedEvent, LoadedImage } from 'ngx-image-cropper';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-photo-control-cropper',
  imports: [CommonModule, ImageCropperComponent],
  templateUrl: './photo-control-cropper.component.html',
  styleUrl: './photo-control-cropper.component.scss'
})
export class PhotoControlCropperComponent {

  croppedFile: File | null = null;
  croppedImage: SafeUrl  = '';
  height = 200;
  imageBase64: string | undefined;
  imageChangedEvent: Event | null = null;
  isRound = false;
  width = 200;

  constructor(
    private ref: DynamicDialogRef, 
    public config: DynamicDialogConfig,      
    private sanitizer: DomSanitizer
  ) {
    if (config.data?.image) {
      this.imageBase64 = config.data.image; 
      this.width = config.data.width;
      this.height = config.data.height;
      this.isRound = config.data.isRound;
    }
  }

  closeDialog() {
    if (this.croppedFile) {
      this.ref.close({ croppedImageFile: this.croppedFile }); // Send the cropped file to the parent
    }
  }

  // Method to convert base64 to File
  createFileFromBase64(base64: string, fileName: string): void {
    const byteCharacters = atob(base64.split(',')[1]);
    const byteArrays = [];
    for (let offset = 0; offset < byteCharacters.length; offset++) {
      const byteArray = byteCharacters.charCodeAt(offset);
      byteArrays.push(byteArray);
    }
    const blob = new Blob([new Uint8Array(byteArrays)], { type: 'image/png' });
    this.croppedFile = new File([blob], fileName, { type: 'image/png' }); // Store the file
  }

  // Method to convert object URL to File
  createFileFromObjectUrl(objectUrl: string, fileName: string): void {
    fetch(objectUrl)
      .then(response => response.blob())
      .then(blob => {
        this.croppedFile = new File([blob], fileName, { type: blob.type }); // Store the file
      })
      .catch(error => console.error('Error converting object URL to file:', error));
  }

  cropperReady() {
    // cropper ready
  }

  imageCropped(event: ImageCroppedEvent) {
    if (event.base64) {
      this.croppedImage = this.sanitizer.bypassSecurityTrustUrl(event.base64);
      this.createFileFromBase64(event.base64, 'cropped-image.png'); // Create and store the File
    } else if (event.objectUrl) {
      this.croppedImage = this.sanitizer.bypassSecurityTrustUrl(event.objectUrl);
      this.createFileFromObjectUrl(event.objectUrl, 'cropped-image.png'); // Create and store the File
    } else {
      console.error("No image data available (both base64 and objectUrl are null).");
    }
  }

  imageLoaded(image: LoadedImage) {
    console.log(image);
  }

  loadImageFailed() {
      // show message
  }

  save() {
    if (this.croppedImage) {
      this.closeDialog(); 
    } 
  }
  
}
