import { Component, Input, Output, EventEmitter, OnInit, OnChanges, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import Cropper from 'cropperjs';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-image-cropper',
  templateUrl: './image-cropper.component.html',
  styleUrls: ['./image-cropper.component.scss'],
  imports: [ButtonModule, CommonModule]
})
export class ImageCropperComponent implements OnInit, OnChanges, AfterViewInit {

  @Input() image  = '';  // The image input (Blob URL or base64)
  @Input() isCoverPhoto = false;
  @Output() dialogClosed = new EventEmitter<void>();
  @Output() imageSelected = new EventEmitter<string | null>();
  @ViewChild('imageElement', { static: false }) imageElement!: ElementRef<HTMLImageElement>;

  cropper!: Cropper;
  sanitizedUrl!: SafeUrl; // The sanitized version of the image URL
  
  constructor(private sanitizer: DomSanitizer) {}

  ngOnInit(): void {
    this.sanitizeImage();
  }

  ngOnChanges(): void {
    this.sanitizeImage();
  }

  ngAfterViewInit() {
    // Ensure the image element is available before initializing the Cropper
    if (this.imageElement?.nativeElement) {
      this.initCropper();
    }
  }

  crop() {
    // Ensure that the cropper is initialized
    if (this.cropper) {
      // Get the cropped canvas
      const croppedCanvas = this.cropper.getCroppedCanvas();

      if (croppedCanvas) {
        // Get the base64 image data from the cropped canvas
        const result = croppedCanvas.toDataURL();
        this.imageSelected.emit(result); // Emit the cropped image back to the parent component
        this.dialogClosed.emit(); // Notify the parent that the dialog is closed
      }
    } else {
      console.error('Cropper is not initialized.');
    }
  }
  
  reset() {
    if (this.cropper) {
      this.cropper.clear();
      this.cropper.crop();
    }
  }

  private initCropper() {
    if (this.imageElement?.nativeElement) {
      const imageElement = this.imageElement.nativeElement;
      
      const cropperOptions: Cropper.Options = {
        aspectRatio: this.isCoverPhoto ? 851 / 315 : 1,  
        viewMode: 1, 
        guides: false,
        background: false,
        responsive: true,
        autoCropArea: 0.8,
        cropBoxResizable: true,
        minContainerWidth: this.isCoverPhoto ? 851 : 200, 
        minContainerHeight: this.isCoverPhoto ? 315 : 200,
        cropBoxMovable: true, 
        checkOrientation: true 
      };
      this.cropper = new Cropper(imageElement, cropperOptions);
    } else {
      console.error('Image element not found.');
    }
  }

  private sanitizeImage() {
    this.sanitizedUrl = this.sanitizer.bypassSecurityTrustUrl(this.image);
  }

}
