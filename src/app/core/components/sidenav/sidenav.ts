import { Component } from '@angular/core';

@Component({
  selector: 'app-sidenav',
  imports: [],
  templateUrl: './sidenav.html',
  styleUrl: './sidenav.scss',
})
export class Sidenav {
  protected readonly items = [
    { label: 'Dashboard', href: '#' },
    { label: 'Categorías', href: '#' },
    { label: 'Productos', href: '#' },
    { label: 'Marcas', href: '#' },
    { label: 'Pedidos', href: '#' },
    { label: 'Clientes', href: '#' },
    { label: 'Ajustes', href: '#' },
  ] as const;
}

