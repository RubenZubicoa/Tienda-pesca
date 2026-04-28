import { Component } from '@angular/core';

@Component({
  selector: 'app-header',
  imports: [],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {
  protected readonly navItems = [
    { label: 'Inicio', href: '#' },
    { label: 'Cañas', href: '#canas' },
    { label: 'Carretes', href: '#carretes' },
    { label: 'Señuelos', href: '#senuelos' },
    { label: 'Ofertas', href: '#ofertas' },
    { label: 'Sobre Nosotros', href: '#sobre-nosotros' }
  ] as const;
}
