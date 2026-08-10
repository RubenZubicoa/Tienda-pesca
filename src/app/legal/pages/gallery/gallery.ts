import { Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

type GalleryPhoto = {
  src: string;
  alt: string;
};

type GalleryVideo = {
  src: string;
  type: string;
};

@Component({
  selector: 'app-gallery',
  imports: [RouterLink],
  templateUrl: './gallery.html',
  styleUrl: './gallery.scss',
})
export class Gallery {
  protected readonly photos: GalleryPhoto[] = [
    {
      src: 'galeria/galeria-01.png',
      alt: 'Pescador mostrando una gran trucha ante un paisaje rocoso',
    },
    {
      src: 'galeria/galeria-02.png',
      alt: 'Pescadora con una gran trucha en un lago de montaña',
    },
    {
      src: 'galeria/galeria-03.png',
      alt: 'Primer plano de la cabeza de una trucha con la boca abierta',
    },
    {
      src: 'galeria/galeria-04.png',
      alt: 'Trucha arcoíris junto a una caña y carrete azul en la orilla',
    },
  ];

  protected readonly videos: GalleryVideo[] = [
    {
      src: encodeURI('videos/10000000_560301428005601_404081440818666394_n.mp4'),
      type: 'video/mp4',
    },
    {
      src: encodeURI('videos/joined_video_ad444e0893154a5084a12bb85e0262eb.mp4'),
      type: 'video/mp4',
    },
  ];

  protected readonly activePhoto = signal<GalleryPhoto | null>(null);

  protected openPhoto(photo: GalleryPhoto): void {
    this.activePhoto.set(photo);
  }

  protected closePhoto(): void {
    this.activePhoto.set(null);
  }
}
