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
    { name: 'Cucharilla Spin Pro 12g', price: '12,00 €', badge: undefined },
    { name: 'Cucharilla Spin Pro 12g', price: '12,00 €', badge: undefined },
    { name: 'Premium Carbono XT-5', price: '30,00 €', badge: undefined },
    { name: 'Caña de Carbono XT-5', price: '36,90 €', badge: undefined },
    { name: 'Cucharilla Spin Pro 12g', price: '30,00 €', badge: undefined },
    { name: 'Cucharilla Spin Pro 12g', price: '30,00 €', badge: undefined },
    { name: 'Señuelo Spio Pro 12g', price: '36,90 €', badge: undefined },
    { name: 'Caña de Carbono XT-5', price: '28,90 €', badge: undefined }
  ] as const;

  protected readonly seasonOffers = [
    { name: 'Cucharilla Spin Pro 12g', price: '29,00 €', badge: 'OFERTA' },
    { name: 'Cucharilla Spin Pro 12g', price: '25,00 €', badge: 'OFERTA' },
    { name: 'Caña de Carbono ZT-5', price: '39,00 €', badge: 'OFERTA' },
    { name: 'Caña de Carbono XT-5', price: '29,00 €', badge: 'OFERTA' }
  ] as const;
}
