import { Component } from '@angular/core';

@Component({
  selector: 'app-main-categories',
  imports: [],
  templateUrl: './main-categories.html',
  styleUrl: './main-categories.scss',
})
export class MainCategories {
  protected readonly categories = [
    { label: 'Cañas', icon: 'rod', href: '#canas' },
    { label: 'Carretes', icon: 'reel', href: '#carretes' },
    { label: 'Señuelos', icon: 'lure', href: '#senuelos' }
  ] as const;
}
