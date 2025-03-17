import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, Input, Renderer2, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-readable-title',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './readable-title.component.html',
  styleUrl: './readable-title.component.scss'
})
export class ReadableTitleComponent implements AfterViewInit, OnDestroy {

  @Input() imageId: string | undefined = ''; // Pass the imageId here
  @Input() styleClass: string | undefined = '';
  @Input() text: string | undefined = '';

  textColor = 'black';
  
  private observer: MutationObserver | undefined;
  private debounceTimeout: any;

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  ngAfterViewInit() {
    this.updateTextColor();

    // Observe the image element for changes to its source (in case the image changes)
    this.observer = new MutationObserver(() => this.debouncedUpdateTextColor());
    const imageElement = document.getElementById(this.imageId!) as HTMLImageElement;

    if (imageElement) {
      this.observer.observe(imageElement, {
        attributes: true,
        attributeFilter: ['src']
      });
    }
  }

  ngOnDestroy() {
    this.observer?.disconnect();
    if (this.debounceTimeout) {
      clearTimeout(this.debounceTimeout);
    }
  }

  private debouncedUpdateTextColor() {
    if (this.debounceTimeout) {
      clearTimeout(this.debounceTimeout);
    }
    this.debounceTimeout = setTimeout(() => this.updateTextColor(), 100); // Adjust the delay as needed
  }

  private extractRGB(color: string): number[] | null {
    if (color.startsWith('rgb')) {
      const match = color.match(/\d+/g);
      return match ? match.slice(0, 3).map(Number) : null;
    }
    return null;
  }

  private getContrastColor(bgColor: string): string {
    const rgb = this.extractRGB(bgColor);
    if (!rgb) return 'black';

    // Check if the color is white (or near-white)
    if (rgb[0] === 255 && rgb[1] === 255 && rgb[2] === 255) {
      return 'black'; // Special handling for white backgrounds
    }

    // Standard luminance calculation for other colors
    const luminance = (0.299 * rgb[0] + 0.587 * rgb[1] + 0.114 * rgb[2]) / 255;
    return luminance > 0.5 ? 'black' : 'white';
  }

  private async getImageAverageColor(imageUrl: string): Promise<string> {
    return new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = 'Anonymous';
      img.src = imageUrl;

      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        if (!ctx) return resolve('rgb(255, 255, 255)'); // Fallback to white if no context

        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0, img.width, img.height);

        // Get the center pixel color for contrast
        const x = img.width / 2;
        const y = img.height / 2;
        const pixel = ctx.getImageData(x, y, 1, 1).data;
        const avgColor = `rgb(${pixel[0]}, ${pixel[1]}, ${pixel[2]})`;

        resolve(avgColor);
      };

      img.onerror = () => resolve('rgb(255, 255, 255)'); // Fallback to white if image fails to load
    });
  }

  private updateTextColor() {
    const imageElement = document.getElementById(this.imageId!) as HTMLImageElement;

    if (imageElement && imageElement.src) {
      // Delay the color update until the image is fully loaded
      this.getImageAverageColor(imageElement.src).then(avgColor => {
        // If average color calculation is successful, update text color
        if (avgColor) {
          this.textColor = this.getContrastColor(avgColor);
          this.renderer.setStyle(this.el.nativeElement, 'color', this.textColor);
        }
      });
    }
  }
 
}