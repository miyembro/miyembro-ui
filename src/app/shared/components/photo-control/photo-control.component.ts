import { Component, ElementRef, forwardRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DialogService, DynamicDialogModule, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ToastModule } from 'primeng/toast';
import { PhotoControlCropperComponent } from '../photo-control-cropper/photo-control-cropper.component';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-photo-control',
  imports: [ButtonModule, CommonModule, DynamicDialogModule, ToastModule],
  templateUrl: './photo-control.component.html',
  styleUrl: './photo-control.component.scss',
  providers: [DialogService, MessageService, {
    provide: NG_VALUE_ACCESSOR,
    multi: true,
    useExisting: forwardRef(() => PhotoControlComponent), 
  }],
})
export class PhotoControlComponent implements OnInit, OnDestroy, ControlValueAccessor{

    @Input() buttonLabel = "Update Photo";
    @Input() height  = "200";
    @Input() isEditable = true;
    @Input() isRound = false;
    @Input() isIconButtonOnly = true;
    @Input() styleClass = '';
    @Input() width = "200";;
    @ViewChild('fileInput', { static: false }) fileInput!: ElementRef;

    altUrl = 'assets/default-organization-wallpaper.jpg';
    disabled = false;
    file: File | null = null;  // Store File object when a new image is cropped
    fileUrl = '';      // Store preview URL (initial value or after cropping)
    ref: DynamicDialogRef | undefined;

    private onChange = (value: File | string | null) => {console.log('Image changed');};
    private onTouched = () => {console.log('Input touched');};

    constructor(
        public dialogService: DialogService, 
        public messageService: MessageService
    ) {}

    ngOnInit() {
        if (this.isRound) {
            this.altUrl = 'assets/default-organization-logo.jpg';
        }
    }

    ngOnDestroy() {
        if (this.ref) {
            this.ref.close();
        }
    }

    writeValue(value: File | string | null): void {
        if (value instanceof File) {
            this.file = value;
            this.fileUrl = URL.createObjectURL(value);
        } else if (typeof value === 'string') {
            this.fileUrl = value; // Use existing URL or Base64
            this.file = null;
        } else {
            this.file = null;
            this.fileUrl = '';
        }
        this.onChange(value);
        this.onTouched();
    }

    registerOnChange(fn: any): void {
        this.onChange = fn;
    }

    registerOnTouched(fn: any): void {
        this.onTouched = fn;
    }

    setDisabledState(isDisabled: boolean): void {
        this.disabled = isDisabled;
    }

    onFileSelected(event: Event) {
        const fileInput = event.target as HTMLInputElement;
        const file = fileInput.files?.[0];

        if (file) {
            this.resetInput();

            const reader = new FileReader();
            reader.readAsDataURL(file);

            reader.onload = () => {
                this.show(reader.result as string); // Show cropper with Base64
            };
        }
    }

    openFilePicker() {
        this.fileInput.nativeElement.click();
    }

    show(selectedImage?: string) {
        this.ref = this.dialogService.open(PhotoControlCropperComponent, {
            header: 'Adjust your image',
            modal: true,
            contentStyle: { overflow: 'auto' },
            breakpoints: { '960px': '75vw', '640px': '90vw' },
            data: { image: selectedImage || this.fileUrl, width: this.width, height: this.height, isRound: this.isRound },
            closable: true
        });
    
        this.ref.onClose.subscribe((data: any) => {
            if (data?.croppedImageFile) {
                this.file = data.croppedImageFile;
                this.fileUrl = this.file ? URL.createObjectURL(this.file) : ''; // ✅ Fix applied here
                this.onChange(this.file); // Notify form control
            }
        });
    }

    private resetInput() {
        if (this.fileInput) {
            this.fileInput.nativeElement.value = '';
            this.fileInput.nativeElement.click();
        }
    }

}
