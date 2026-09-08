import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

type DestinationCategory = {
  id: string;
  index: string;
  accent: 'fresh' | 'salt' | 'warm';
  eyebrow: string;
  title: string;
  description: string;
  species: string[];
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
      index: '01',
      accent: 'fresh',
      eyebrow: 'Ríos y lagos',
      title: 'Agua dulce',
      description:
        'Destinos de río y lago, abarcando todo un gran cúmulo de especies, tanto residentes como migratorias.',
      species: ['Trucha', 'Salmón', 'Steelhead', 'Lucio', 'Bass', 'Siluro'],
      image: 'viajes/viajes-01.png',
      imageAlt: 'Gran trucha arcoíris junto a una caña de mosca',
      cta: 'Explorar agua dulce',
    },
    {
      id: 'saltwater',
      index: '02',
      accent: 'salt',
      eyebrow: 'Océano y flats',
      title: 'Agua salada',
      description:
        'Pesca desde embarcación o recorriendo bajíos y flats: un desafío que pone a prueba todas tus habilidades.',
      species: ['Flats', 'Embarcación', 'Semi-salada'],
      image: 'viajes/viajes-08.png',
      imageAlt: 'Gran pez en aguas cristalinas junto a una caña',
      cta: 'Explorar agua salada',
    },
    {
      id: 'warmwater',
      index: '03',
      accent: 'warm',
      eyebrow: 'Amazonas y trópicos',
      title: 'Aguas cálidas',
      description:
        'Aventuras en El Amazonas y aguas tropicales, con destinos exclusivos seleccionados por emoción y seguridad.',
      species: ['Amazonas', 'Trópicos', 'Exclusivo'],
      image: 'viajes/viajes-05.png',
      imageAlt: 'Payara o pez vampiro con grandes colmillos',
      cta: 'Explorar aguas cálidas',
    },
  ];
}
