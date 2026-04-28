import { Component } from '@angular/core';
import { Product, ProductList } from '../../../shared/components/product-list/product-list';
import { MainCategories } from '../../../shared/components/main-categories/main-categories';

@Component({
  selector: 'app-main',
  imports: [ProductList, MainCategories],
  templateUrl: './main.html',
  styleUrl: './main.scss',
})
export class Main {
  protected readonly mainFeatured: Product[] = [
    {
      name: 'Cucharilla Spin Pro 12g',
      price: '12,00 €',
      badge: undefined,
      imageUrl: 'cucharilla.jpg'
    },
    {
      name: 'Caña de Carbono XT-5',
      price: '29,00 €',
      imageUrl: 'caña.jpg'
    },
    {
      name: 'Carrete Pro Carbon XT-5',
      price: '29,00 €',
      imageUrl: 'carrete.jpg'
    }
  ] as const;

  protected readonly seasonOffers: Product[] = [
    {
      name: 'Cucharilla Spin Pro 12g',
      price: '12,00 €',
      badge: 'OFERTA',
      imageUrl: 'cucharilla.jpg'
    },
    {
      name: 'Cucharilla Spin Pro 12g',
      price: '12,00 €',
      badge: 'OFERTA',
      imageUrl: 'cucharilla.jpg'
    },
    {
      name: 'Caña de Carbono ZT-5',
      price: '39,00 €',
      badge: 'OFERTA',
      imageUrl: 'caña.jpg'
    },
    {
      name: 'Caña de Carbono XT-5',
      price: '29,00 €',
      badge: 'OFERTA',
      imageUrl: 'caña.jpg'
    }
  ] as const;
}
