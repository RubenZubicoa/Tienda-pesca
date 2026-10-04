export type StreamMaterial = {
  productId: string;
  name: string;
  imageUrl?: string;
  price?: number;
};

export type LiveStream = {
  id: string;
  title: string;
  description?: string;
  videoUrl: string;
  isLive: boolean;
  recordedAt?: string;
  materials: StreamMaterial[];
};

const VIDEO_A = encodeURI('videos/10000000_560301428005601_404081440818666394_n.mp4');
const VIDEO_B = encodeURI('videos/joined_video_ad444e0893154a5084a12bb85e0262eb.mp4');

/** Plantillas de streams sin materiales (se rellenan con productos reales o fallback). */
export const liveStreamTemplates: Omit<LiveStream, 'materials'>[] = [
  {
    id: 'live-cdc',
    title: 'Montaje CDC en directo',
    description: 'Paso a paso de una emergente CDC para trucha en ríos de montaña.',
    videoUrl: VIDEO_A,
    isLive: true,
  },
  {
    id: 'archive-pheasant',
    title: 'Pheasant Tail Nymph',
    description: 'Clásico de fondeo: proporciones, peso y variantes de cola.',
    videoUrl: VIDEO_B,
    isLive: false,
    recordedAt: '2026-08-12T18:00:00.000Z',
  },
  {
    id: 'archive-streamer',
    title: 'Streamer de conejo',
    description: 'Montaje de streamer con tiras de conejo y flash para aguas teñidas.',
    videoUrl: VIDEO_A,
    isLive: false,
    recordedAt: '2026-07-28T17:30:00.000Z',
  },
  {
    id: 'archive-dry',
    title: 'Seca Adams',
    description: 'Adams clásica: hackle, alas y equilibrio en el flotador.',
    videoUrl: VIDEO_B,
    isLive: false,
    recordedAt: '2026-06-15T19:00:00.000Z',
  },
];

export const fallbackMaterials: StreamMaterial[] = [
  {
    productId: 'demo-material-1',
    name: 'Plumas CDC naturales',
    imageUrl: 'placeholder.png',
    price: 12.9,
  },
  {
    productId: 'demo-material-2',
    name: 'Hilo de montaje 8/0',
    imageUrl: 'placeholder.png',
    price: 4.5,
  },
  {
    productId: 'demo-material-3',
    name: 'Anzuelos secos #14',
    imageUrl: 'placeholder.png',
    price: 8.75,
  },
  {
    productId: 'demo-material-4',
    name: "Dubbing hare's ear",
    imageUrl: 'placeholder.png',
    price: 5.2,
  },
];

export function assignMaterialsToStreams(
  materialsByStream: StreamMaterial[][],
): LiveStream[] {
  return liveStreamTemplates.map((template, index) => ({
    ...template,
    materials: materialsByStream[index] ?? fallbackMaterials,
  }));
}
