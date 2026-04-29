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
    { label: 'Cañas', href: '#' },
    { label: 'Carretes', href: '#' },
    { label: 'Líneas', href: '#' },
    {
      label: 'Hilos',
      href: '#',
      children: [
        { label: 'Bajos de línea', href: '#' },
        { label: 'Colas de rata', href: '#' },
        { label: 'Anillas', href: '#' },
        { label: 'Destorcedores', href: '#' },
        { label: 'Clips', href: '#' },
      ],
    },
    {
      label: 'Material de montaje',
      href: '#',
      children: [
        { label: 'Sedas, hilos, polys, etc.', href: '#' },
        { label: 'Tinseles y uv', href: '#' },
        { label: 'Anzuelos', href: '#' },
        { label: 'Ojos, cabezas y beads', href: '#' },
        { label: 'Dubbings', href: '#' },
        { label: 'Materiales para cuerpos', href: '#' },
        { label: 'Gomas, cauchos y foams', href: '#' },
        { label: 'Barnices, etc.', href: '#' },
      ],
    },
    {
      label: 'Plumas',
      href: '#',
      children: [
        { label: 'Gallo', href: '#' },
        { label: 'Leon', href: '#' },
        { label: 'CDP', href: '#' },
        { label: 'Varias', href: '#' },
      ],
    },

    { label: 'Botas y waders', href: '#' },
    { label: 'Ropa', href: '#' },
    { label: 'Chalecos', href: '#' },
    { label: 'Moscas', href: '#' },
    {
      label: 'Accesorios',
      href: '#',
      children: [
        { label: 'Gafas', href: '#' },
        { label: 'Líquidos y pastas', href: '#' },
        { label: 'Sacaderas', href: '#' },
        { label: 'Porta cañas', href: '#' },
        { label: 'Carritos', href: '#' },
        { label: 'Cajas de moscas', href: '#' },
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

