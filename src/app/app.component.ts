import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputNumberModule } from 'primeng/inputnumber';
import { SelectModule } from 'primeng/select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { FloatLabelModule } from "primeng/floatlabel"
import { InputTextModule } from 'primeng/inputtext';
import { AlertComponent } from './shared/components/alert/alert.component';
import { LoaderComponent } from "./shared/components/loader/loader.component";
import { ConfirmDialogComponent } from "./shared/components/confirm-dialog/confirm-dialog.component";

@Component({
  imports: [AlertComponent, ConfirmDialogComponent, FormsModule, ReactiveFormsModule, RouterModule, ButtonModule, InputGroupModule, InputGroupAddonModule, FloatLabelModule, InputTextModule, InputNumberModule, SelectModule, LoaderComponent],
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  
}
