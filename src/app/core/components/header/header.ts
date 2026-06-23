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
    { label: 'Inicio', href: '#' },
    { label: 'Quienes somos', href: '#canas' },
    { label: 'Condiciones de venta', href: '#carretes' },
    { label: 'Viajes', href: '#senuelos' },
    { label: 'Boletines', href: '#ofertas' },
    { label: 'Galeria de fotos', href: '#sobre-nosotros' }
  ] as const;

  protected logout() {
    this.loginService.logout();
  }
}
