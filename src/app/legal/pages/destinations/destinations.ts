import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { tripDestinationGroups } from '../../data/trip-destinations';

type DestinationCategory = {
  title: string;
  description: string;
  places: { name: string; slug: string }[];
};

@Component({
  selector: 'app-destinations',
  imports: [RouterLink],
  templateUrl: './destinations.html',
  styleUrl: './destinations.scss',
})
export class Destinations {
  private readonly categoryCopy: Record<string, string> = {
    'Agua dulce':
      'Destinos de río y lago, abarcando todo un gran cúmulo de especies, tanto residentes como migratorias (trucha, salmón, reos, steelhead, lucio, bass, carpas, barbos, siluros, etc).',
    'Agua salada':
      'Destinos que se desarrollan en agua salada o semi salada, tanto pescado desde embarcación como recorriendo los bajíos o flats y cubriendo un sin fin de especies que te harán vibrar y utilizar todas tus habilidades ante tal desafío.',
    'Aguas cálidas':
      'Aventuras en El Amazonas y aguas tropicales en general, con la plena garantía de haber seleccionado los mejores y más apasionantes destinos del Mundo, con una total exclusividad y seguridad.',
  };

  protected readonly categories: DestinationCategory[] = tripDestinationGroups
    .filter((group) => group.title in this.categoryCopy)
    .map((group) => ({
      title: group.title,
      description: this.categoryCopy[group.title],
      places: group.places,
    }));
}
