import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { LoaderService } from '../../../core/services/loader.service';
import { ProgressBarModule } from 'primeng/progressbar';
import { ToastModule } from 'primeng/toast';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-loader',
  imports: [CommonModule, ProgressBarModule, ToastModule],
  templateUrl: './loader.component.html',
  styleUrl: './loader.component.scss'
})
export class LoaderComponent implements OnInit, OnDestroy {

  @Input() loaderKey?: string;
  
  loading = false;

  private unsubscribe: Subject<any> = new Subject();

  constructor(
    private loaderService: LoaderService,
    private router: Router
  ) {

  }

  ngOnInit(): void {
    this.loaderKey = this.loaderKey || this.router.url || 'default-loader-key';

    this.loaderService
          .getLoaders()
          .pipe(takeUntil(this.unsubscribe))
          .subscribe((loaderOptions) => {
            this.loading = loaderOptions.showLoader;
          });
  }

  ngOnDestroy(): void {
    this.unsubscribe.next(0);
    this.unsubscribe.complete();
  }
  
}
