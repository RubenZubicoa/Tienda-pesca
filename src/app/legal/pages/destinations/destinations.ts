import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { tripDestinationGroups, TripDestination } from '../../data/trip-destinations';

type DestinationCategory = {
  id: string;
  index: string;
  accent: 'fresh' | 'salt' | 'warm';
  eyebrow: string;
  title: string;
  description: string;
  image: string;
  imageAlt: string;
  places: TripDestination[];
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
        'Destinos de río y lago, abarcando especies residentes y migratorias: trucha, salmón, reos, steelhead, lucio, bass, carpas, barbos, siluros y más.',
      image: 'viajes/viajes-01.png',
      imageAlt: 'Gran trucha arcoíris junto a una caña de mosca',
      places: tripDestinationGroups.find((g) => g.title === 'Agua dulce')?.places ?? [],
    },
    {
      id: 'saltwater',
      index: '02',
      accent: 'salt',
      eyebrow: 'Océano y flats',
      title: 'Agua salada',
      description:
        'Pesca desde embarcación o recorriendo bajíos y flats: un desafío que pone a prueba todas tus habilidades ante un sinfín de especies.',
      image: 'viajes/viajes-08.png',
      imageAlt: 'Gran pez en aguas cristalinas junto a una caña',
      places: tripDestinationGroups.find((g) => g.title === 'Agua salada')?.places ?? [],
    },
    {
      id: 'warmwater',
      index: '03',
      accent: 'warm',
      eyebrow: 'Amazonas y trópicos',
      title: 'Aguas cálidas',
      description:
        'Aventuras en El Amazonas y aguas tropicales, con destinos exclusivos seleccionados por emoción, calidad y seguridad.',
      image: 'viajes/viajes-05.png',
      imageAlt: 'Payara o pez vampiro con grandes colmillos',
      places: tripDestinationGroups.find((g) => g.title === 'Aguas cálidas')?.places ?? [],
    },
  ];

  protected readonly spainPlaces =
    tripDestinationGroups.find((g) => g.title === 'España')?.places ?? [];
}
