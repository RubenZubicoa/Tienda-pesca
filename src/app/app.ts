import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly navItems = [
    { label: 'Inicio', href: '#' },
    { label: 'Cañas', href: '#canas' },
    { label: 'Carretes', href: '#carretes' },
    { label: 'Señuelos', href: '#senuelos' },
    { label: 'Ofertas', href: '#ofertas' },
    { label: 'Sobre Nosotros', href: '#sobre-nosotros' }
  ] as const;

  protected readonly categories = [
    { label: 'Cañas', icon: 'rod', href: '#canas' },
    { label: 'Carretes', icon: 'reel', href: '#carretes' },
    { label: 'Señuelos', icon: 'lure', href: '#senuelos' }
  ] as const;

  protected readonly featuredProducts = [
    {
      name: 'Cucharilla Spin Pro 12g',
      price: '12,00 €',
      badge: undefined,
      imageUrl: 'https://source.unsplash.com/600x420/?fishing,lure'
    },
    {
      name: 'Cucharilla Spin Pro 12g',
      price: '12,00 €',
      badge: undefined,
      imageUrl: 'https://source.unsplash.com/600x420/?fishing,bait'
    },
    {
      name: 'Premium Carbono XT-5',
      price: '30,00 €',
      badge: undefined,
      imageUrl: 'https://source.unsplash.com/600x420/?fishing,reel'
    },
    {
      name: 'Caña de Carbono XT-5',
      price: '36,90 €',
      badge: undefined,
      imageUrl: 'https://source.unsplash.com/600x420/?fishing,rod'
    },
    {
      name: 'Cucharilla Spin Pro 12g',
      price: '30,00 €',
      badge: undefined,
      imageUrl: 'https://source.unsplash.com/600x420/?fishing,spinner'
    },
    {
      name: 'Cucharilla Spin Pro 12g',
      price: '30,00 €',
      badge: undefined,
      imageUrl: 'https://source.unsplash.com/600x420/?fishing,tackle'
    },
    {
      name: 'Señuelo Spio Pro 12g',
      price: '36,90 €',
      badge: undefined,
      imageUrl: 'https://source.unsplash.com/600x420/?fishing,lures'
    },
    {
      name: 'Caña de Carbono XT-5',
      price: '28,90 €',
      badge: undefined,
      imageUrl: 'https://source.unsplash.com/600x420/?fishing,rod,carbon'
    }
  ] as const;

  protected readonly seasonOffers = [
    {
      name: 'Cucharilla Spin Pro 12g',
      price: '29,00 €',
      badge: 'OFERTA',
      imageUrl: 'https://source.unsplash.com/600x420/?fishing,hook'
    },
    {
      name: 'Cucharilla Spin Pro 12g',
      price: '25,00 €',
      badge: 'OFERTA',
      imageUrl: 'https://source.unsplash.com/600x420/?fishing,line'
    },
    {
      name: 'Caña de Carbono ZT-5',
      price: '39,00 €',
      badge: 'OFERTA',
      imageUrl: 'https://source.unsplash.com/600x420/?fishing,rod,casting'
    },
    {
      name: 'Caña de Carbono XT-5',
      price: '29,00 €',
      badge: 'OFERTA',
      imageUrl: 'https://source.unsplash.com/600x420/?fishing,reel,spinning'
    }
  ] as const;

  protected readonly mainFeatured = [
    {
      name: 'Cucharilla Spin Pro 12g',
      price: '29,00 €',
      imageUrl: 'https://source.unsplash.com/900x600/?fishing,lure,product'
    },
    {
      name: 'Caña de Carbono XT-5',
      price: '29,00 €',
      imageUrl: 'https://source.unsplash.com/900x600/?fishing,rod,product'
    },
    {
      name: 'Carrete Pro Carbon XT-5',
      price: '29,00 €',
      imageUrl: 'https://source.unsplash.com/900x600/?fishing,reel,product'
    }
  ] as const;
}
