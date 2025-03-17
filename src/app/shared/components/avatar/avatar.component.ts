import { Component, forwardRef, Input, OnInit, ViewChild } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor, FormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { CommonModule } from '@angular/common';
import { ImageCropperComponent } from "../image-cropper/image-cropper.component";
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-avatar',
  standalone: true,
  imports: [ButtonModule, CommonModule, DialogModule, FormsModule, ImageCropperComponent],
  templateUrl: './avatar.component.html',
  styleUrls: ['./avatar.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: forwardRef(() => AvatarComponent), // ✅ Use forwardRef
    }
  ]
})
export class AvatarComponent implements OnInit, ControlValueAccessor {

  @Input() avatarSize = 'normal';
  @Input() isButtonEdit = false;
  @Input() isCoverPhoto = false;
  @ViewChild('fileInput') fileInput: any;

  dialogVisible = false; 
  disabled = false;
  file = '';          
  image = '';          
  uniqueId = '';

  private onChange = (fileUrl: string) => { console.log('Image changed'); };
  private onTouched = () => { console.log('Input touched'); };

  constructor() {  
    this.dialogVisible = false;
  }

  ngOnInit(): void {
    this.uniqueId = `avatar-input-file-${Math.random().toString(36).substr(2, 9)}`;
  }

  writeValue(_file: string): void {
    this.file = _file;
    this.onChange(this.file); // Not
    this.onTouched();
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  onDialogClose(): void {
    this.dialogVisible = false; // Close the dialog on cancel or outside click
  }

  onFileChange(event: any) {
    const files = event.target.files as FileList;

    if (files.length > 0) {
      // Create a Blob URL from the selected file
      const _file = URL.createObjectURL(files[0]);
      this.resetInput();
      this.openAvatarEditor(_file);
    }
  }

  onImageSelected(result: string | null): void {
    if (result) {
      this.file = result;
      this.onChange(this.file);  // Update form control with the new image URL
      this.onTouched();
      this.dialogVisible = false; // Close the dialog after selection
    }
    this.dialogVisible = false; // Close the dialog after selection
  }

  triggerFileInput() {
    this.fileInput.nativeElement.click(); 
  }
   
  private openAvatarEditor(image: string): void {
    this.dialogVisible = true;
    this.image = image;  // Set the image URL for cropping
  }

  private resetInput() {
    const input = document.getElementById('avatar-input-file') as HTMLInputElement;
    if (input) {
      input.value = '';
    }
  }

}
