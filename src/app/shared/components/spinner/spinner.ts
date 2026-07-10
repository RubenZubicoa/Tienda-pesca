import { Component, inject } from '@angular/core';
import { LoadingService } from '../../../core/services/loading';

@Component({
  selector: 'app-spinner',
  templateUrl: './spinner.html',
  styleUrl: './spinner.scss',
})
export class Spinner {
  protected readonly loadingService = inject(LoadingService);
}
