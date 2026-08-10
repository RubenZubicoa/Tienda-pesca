import { Component, EventEmitter, inject, Output } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CurrentUserService } from '../../../auth/services/current-user-service';
import { TokenService } from '../../../auth/services/token-service';
import { CartService } from '../../services/cart';
import { Login } from '../../../auth/services/login';

@Component({
  selector: 'app-header',
  imports: [RouterModule],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {
  @Output() menuToggle = new EventEmitter<void>();
  protected readonly cart = inject(CartService);
  protected readonly currentUser = inject(CurrentUserService);
  protected readonly tokenService = inject(TokenService); 
  protected readonly loginService = inject(Login);
  
  protected readonly navItems = [
    { label: 'Inicio', route: '/' },
    { label: 'Quienes somos', route: '/quienes-somos' },
    { label: 'Condiciones de venta', route: '/condiciones-de-venta' },
    { label: 'La empresa y contacto', route: '/la-empresa-y-contacto' },
    { label: 'Formas de pago y envíos', route: '/formas-de-pago-y-envios' },
    { label: 'Viajes', route: '/viajes' },
    { label: 'Boletines', route: '/boletines' },
    { label: 'Galeria de fotos', route: '/galeria' },
  ] as const;

  protected logout() {
    this.loginService.logout();
  }
}
