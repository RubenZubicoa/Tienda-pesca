import { Component } from '@angular/core';

type NewsletterIssue = {
  title: string;
  description: string;
  thumbnailUrl: string;
  thumbnailAlt: string;
  fileUrl: string;
  fileName: string;
};

@Component({
  selector: 'app-newsletters',
  templateUrl: './newsletters.html',
  styleUrl: './newsletters.scss',
})
export class Newsletters {
  protected readonly subscribeHref =
    'mailto:tienda@thelakefish.com?subject=' + encodeURIComponent('Suscripción a boletines de pesca');

  protected readonly issues: NewsletterIssue[] = [
    {
      title: 'Boletín de pesca nº 1',
      description: 'Primer boletín disponible para descarga.',
      thumbnailUrl: 'documents/boletin-pesca-1.png',
      thumbnailAlt: 'Miniatura de la primera página del boletín de pesca nº 1',
      fileUrl: encodeURI('documents/Boletin pesca 1..pdf'),
      fileName: 'Boletin-pesca-1.pdf',
    },
  ];
}
