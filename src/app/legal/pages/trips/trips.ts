import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

type TripDestinationGroup = {
  title: string;
  places: string[];
};

@Component({
  selector: 'app-trips',
  imports: [RouterLink],
  templateUrl: './trips.html',
  styleUrl: './trips.scss',
})
export class Trips {
  protected readonly gallery = [
    {
      src: 'viajes/viajes-01.png',
      alt: 'Gran trucha arcoíris junto a una caña de mosca en la orilla',
    },
    {
      src: 'viajes/viajes-02.png',
      alt: 'Pescador con una gran trucha en un río de paisaje árido',
    },
    {
      src: 'viajes/viajes-03.png',
      alt: 'Primer plano de una trucha sostenida en aguas claras',
    },
    {
      src: 'viajes/viajes-04.png',
      alt: 'Trucha y carrete Sage sobre piedras del río',
    },
    {
      src: 'viajes/viajes-05.png',
      alt: 'Payara o pez vampiro con grandes colmillos',
    },
    {
      src: 'viajes/viajes-06.png',
      alt: 'Primer plano de la cabeza de un gran salmón',
    },
    {
      src: 'viajes/viajes-07.png',
      alt: 'Dorado dorado con la boca abierta en el agua',
    },
    {
      src: 'viajes/viajes-08.png',
      alt: 'Gran trucha en aguas cristalinas junto a una caña Sage One',
    },
  ] as const;

  protected readonly destinationGroups: TripDestinationGroup[] = [
    {
      title: 'Agua dulce',
      places: ['Patagonia', 'Alaska', 'Columbia Británica', 'Islandia', 'Mongolia', 'Siberia'],
    },
    {
      title: 'Agua salada',
      places: ['Christmas Island', 'Seychelles', 'Costa Rica', 'Panamá', 'Florida', 'Cuba'],
    },
    {
      title: 'Aguas cálidas',
      places: ['Bolivia', 'Brasil'],
    },
    {
      title: 'España',
      places: [
        'León',
        'Valencia',
        'Salamanca',
        'Madrid',
        'Cataluña',
        'Castilla La Mancha',
        'Asturias',
        'País Vasco',
        'Galicia',
        'La Rioja',
        'Soria',
      ],
    },
  ];
}
