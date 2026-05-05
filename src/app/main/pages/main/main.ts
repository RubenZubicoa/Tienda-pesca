import { Component } from '@angular/core';
import { ProductList } from '../../../shared/components/product-list/product-list';
import { Product } from '../../../core/models/Product';
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
      uuid: '1',
      name: 'Cucharilla Spin Pro 12g',
      price: 12.00,
      brandId: '1',
      stock: 10,
      categoryId: '1',
      images: ['cucharilla.jpg']
    },
    {
      uuid: '2',
      name: 'Caña de Carbono XT-5',
      price: 29.00,
      brandId: '1',
      stock: 10,
      categoryId: '1',
      images: ['caña.jpg']
    },
    {
      uuid: '3',
      name: 'Carrete Pro Carbon XT-5',
      price: 29.00,
      brandId: '1',
      stock: 10,
      categoryId: '1',
      images: ['carrete.jpg']
    }
  ] as const;

  protected readonly seasonOffers: Product[] = [
    {
      uuid: '1',
      name: 'Cucharilla Spin Pro 12g',
      price: 12.00,
      brandId: '1',
      stock: 10,
      categoryId: '1',
      images: ['cucharilla.jpg']
    },
    {
      uuid: '2',
      name: 'Cucharilla Spin Pro 12g',
      price: 12.00,
      brandId: '1',
      stock: 10,
      categoryId: '1',
      images: ['cucharilla.jpg']
    },
    {
      uuid: '3',
      name: 'Caña de Carbono ZT-5',
      price: 39.00,
      brandId: '1',
      stock: 10,
      categoryId: '1',
      images: ['caña.jpg']
    },
    {
      uuid: '4',
      name: 'Caña de Carbono XT-5',
      price: 29.00,
      brandId: '1',
      stock: 10,
      categoryId: '1',
      images: ['caña.jpg']
    }
  ] as const;
}
