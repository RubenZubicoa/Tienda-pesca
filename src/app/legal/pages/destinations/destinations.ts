import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

type DestinationCategory = {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
  image: string;
  imageAlt: string;
  cta: string;
};

@Component({
  selector: 'app-destinations',
  imports: [RouterLink],
  templateUrl: './destinations.html',
  styleUrl: './destinations.scss',
})
export class Destinations {
  protected readonly categories: DestinationCategory[] = [
    {
      id: 'freshwater',
      eyebrow: 'Ríos y lagos',
      title: 'Agua dulce',
      description:
        'Destinos de río y lago, abarcando todo un gran cúmulo de especies, tanto residentes como migratorias (trucha, salmón, reos, steelhead, lucio, bass, carpas, barbos, siluros, etc).',
      image: 'viajes/viajes-01.png',
      imageAlt: 'Gran trucha arcoíris junto a una caña de mosca',
      cta: 'Ver viajes',
    },
    {
      id: 'saltwater',
      eyebrow: 'Océano y flats',
      title: 'Agua salada',
      description:
        'Destinos que se desarrollan en agua salada o semi salada, tanto pescado desde embarcación como recorriendo los bajíos o flats y cubriendo un sin fin de especies que te harán vibrar y utilizar todas tus habilidades ante tal desafío.',
      image: 'viajes/viajes-03.png',
      imageAlt: 'Primer plano de una trucha sostenida en aguas claras',
      cta: 'Ver viajes',
    },
    {
      id: 'warmwater',
      eyebrow: 'Amazonas y trópicos',
      title: 'Aguas cálidas',
      description:
        'Aventuras en El Amazonas y aguas tropicales en general, con la plena garantía de haber seleccionado los mejores y más apasionantes destinos del Mundo, con una total exclusividad y seguridad.',
      image: 'viajes/viajes-05.png',
      imageAlt: 'Payara o pez vampiro con grandes colmillos',
      cta: 'Ver viajes',
    },
  ];
}
