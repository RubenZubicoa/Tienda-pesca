export type TripDestination = {
  name: string;
  slug: string;
};

export type TripDestinationGroup = {
  title: string;
  places: TripDestination[];
};

export const tripDestinationGroups: TripDestinationGroup[] = [
  {
    title: 'Agua dulce',
    places: [
      { name: 'Patagonia', slug: 'patagonia' },
      { name: 'Alaska', slug: 'alaska' },
      { name: 'Columbia Británica', slug: 'columbia-britanica' },
      { name: 'Islandia', slug: 'islandia' },
      { name: 'Mongolia', slug: 'mongolia' },
      { name: 'Siberia', slug: 'siberia' },
    ],
  },
  {
    title: 'Agua salada',
    places: [
      { name: 'Christmas Island', slug: 'christmas-island' },
      { name: 'Seychelles', slug: 'seychelles' },
      { name: 'Costa Rica', slug: 'costa-rica' },
      { name: 'Panamá', slug: 'panama' },
      { name: 'Florida', slug: 'florida' },
      { name: 'Cuba', slug: 'cuba' },
    ],
  },
  {
    title: 'Aguas cálidas',
    places: [
      { name: 'Bolivia', slug: 'bolivia' },
      { name: 'Brasil', slug: 'brasil' },
    ],
  },
  {
    title: 'España',
    places: [
      { name: 'León', slug: 'leon' },
      { name: 'Valencia', slug: 'valencia' },
      { name: 'Salamanca', slug: 'salamanca' },
      { name: 'Madrid', slug: 'madrid' },
      { name: 'Cataluña', slug: 'cataluna' },
      { name: 'Castilla La Mancha', slug: 'castilla-la-mancha' },
      { name: 'Asturias', slug: 'asturias' },
      { name: 'País Vasco', slug: 'pais-vasco' },
      { name: 'Galicia', slug: 'galicia' },
      { name: 'La Rioja', slug: 'la-rioja' },
      { name: 'Soria', slug: 'soria' },
    ],
  },
];

export function findTripDestination(slug: string): TripDestination | undefined {
  for (const group of tripDestinationGroups) {
    const match = group.places.find((place) => place.slug === slug);
    if (match) {
      return match;
    }
  }
  return undefined;
}
