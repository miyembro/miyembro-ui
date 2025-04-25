import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ButtonModule } from 'primeng/button';
import { OrganizationResponse } from 'src/app/core/models/organization-reponse';

@Component({
  selector: 'app-organization-description',
  imports: [
    ButtonModule
  ],
  templateUrl: './organization-description.component.html',
  styleUrl: './organization-description.component.scss'
})
export class OrganizationDescriptionComponent implements OnChanges{

  @Input() organization: OrganizationResponse | null = null;
  
  safeDescription: any = null;

  constructor(
    private sanitizer: DomSanitizer,
  ) {

  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['organization'] && this.organization) {
      this.safeDescription = this.sanitizeHTML(this.organization.description);
    }
  }

  private sanitizeHTML(content: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(content);
  }


}
