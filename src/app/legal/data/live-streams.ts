export type StreamMaterial = {
  productId: string;
  name: string;
  imageUrl?: string;
  price?: number;
};

export type StreamFly = {
  id: string;
  name: string;
  materials: StreamMaterial[];
};

export type LiveStream = {
  id: string;
  title: string;
  description?: string;
  videoUrl: string;
  isLive: boolean;
  recordedAt?: string;
  flies: StreamFly[];
};

type LiveStreamTemplate = Omit<LiveStream, 'flies'> & {
  flies: Omit<StreamFly, 'materials'>[];
};

const VIDEO_A = encodeURI('videos/10000000_560301428005601_404081440818666394_n.mp4');
const VIDEO_B = encodeURI('videos/joined_video_ad444e0893154a5084a12bb85e0262eb.mp4');

/** Plantillas de streams sin materiales (se rellenan con productos reales o fallback). */
export const liveStreamTemplates: LiveStreamTemplate[] = [
  {
    id: 'live-cdc',
    title: 'Sesión de montaje en directo',
    description: 'Varias moscas para trucha: emergente CDC y una seca de apoyo.',
    videoUrl: VIDEO_A,
    isLive: true,
    flies: [
      { id: 'live-cdc-emergente', name: 'Emergente CDC' },
      { id: 'live-cdc-adams', name: 'Parachute Adams' },
    ],
  },
  {
    id: 'archive-nymphs',
    title: 'Sesión de ninfas',
    description: 'Dos clásicos de fondeo: proporciones, peso y variantes.',
    videoUrl: VIDEO_B,
    isLive: false,
    recordedAt: '2026-08-12T18:00:00.000Z',
    flies: [
      { id: 'archive-pheasant', name: 'Pheasant Tail Nymph' },
      { id: 'archive-hares-ear', name: "Hare's Ear" },
    ],
  },
  {
    id: 'archive-streamer',
    title: 'Streamer de conejo',
    description: 'Montaje de streamer con tiras de conejo y flash para aguas teñidas.',
    videoUrl: VIDEO_A,
    isLive: false,
    recordedAt: '2026-07-28T17:30:00.000Z',
    flies: [{ id: 'archive-streamer-rabbit', name: 'Streamer de conejo' }],
  },
  {
    id: 'archive-dries',
    title: 'Sesión de secas',
    description: 'Adams clásica y una CDC para superficie.',
    videoUrl: VIDEO_B,
    isLive: false,
    recordedAt: '2026-06-15T19:00:00.000Z',
    flies: [
      { id: 'archive-adams', name: 'Seca Adams' },
      { id: 'archive-cdc-dry', name: 'Seca CDC' },
    ],
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
  materialsByFly: StreamMaterial[][],
): LiveStream[] {
  let flyIndex = 0;

  return liveStreamTemplates.map((template) => ({
    ...template,
    flies: template.flies.map((fly) => {
      const materials = materialsByFly[flyIndex] ?? fallbackMaterials;
      flyIndex += 1;
      return { ...fly, materials };
    }),
  }));
}

/** Número total de moscas en las plantillas (para repartir materiales). */
export function countTemplateFlies(): number {
  return liveStreamTemplates.reduce((total, stream) => total + stream.flies.length, 0);
}
