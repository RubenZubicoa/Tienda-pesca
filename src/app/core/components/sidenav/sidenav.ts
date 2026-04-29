import { Component } from '@angular/core';

type SidenavItem = Readonly<{
  label: string;
  href: string;
  children?: readonly SidenavItem[];
}>;

@Component({
  selector: 'app-sidenav',
  imports: [],
  templateUrl: './sidenav.html',
  styleUrl: './sidenav.scss',
})
export class Sidenav {
  protected expanded = new Set<string>();

  protected readonly items: readonly SidenavItem[] = [
    { label: 'Dashboard', href: '#' },
    {
      label: 'Catálogo',
      href: '#',
      children: [
        { label: 'Categorías', href: '#' },
        { label: 'Productos', href: '#' },
        { label: 'Marcas', href: '#' },
      ],
    },
    {
      label: 'Ventas',
      href: '#',
      children: [
        { label: 'Pedidos', href: '#' },
        { label: 'Clientes', href: '#' },
        { label: 'Cupones', href: '#' },
      ],
    },
    {
      label: 'Ajustes',
      href: '#',
      children: [
        { label: 'Perfil', href: '#' },
        { label: 'Configuración', href: '#' },
      ],
    },
  ];

  protected toggle(label: string) {
    if (this.expanded.has(label)) {
      this.expanded.delete(label);
      return;
    }

    this.expanded.add(label);
  }

  protected isExpanded(label: string) {
    return this.expanded.has(label);
  }

  protected groupId(label: string) {
    return `sidenav-group-${label.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
  }
}

