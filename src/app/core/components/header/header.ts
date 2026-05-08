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
    { label: 'Quienes somos', href: '#canas' },
    { label: 'Condiciones de venta', href: '#carretes' },
    { label: 'Viajes', href: '#senuelos' },
    { label: 'Boletines', href: '#ofertas' },
    { label: 'Galeria de fotos', href: '#sobre-nosotros' }
  ] as const;
}
