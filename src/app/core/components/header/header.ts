import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CartService } from '../../services/cart';

@Component({
  selector: 'app-header',
  imports: [RouterModule],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {
  protected readonly cart = inject(CartService);

  protected readonly navItems = [
    { label: 'Inicio', href: '#' },
    { label: 'Cañas', href: '#canas' },
    { label: 'Carretes', href: '#carretes' },
    { label: 'Señuelos', href: '#senuelos' },
    { label: 'Ofertas', href: '#ofertas' },
    { label: 'Sobre Nosotros', href: '#sobre-nosotros' }
  ] as const;
}
