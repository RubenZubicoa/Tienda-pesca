import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

type NewsletterIssue = {
  title: string;
  description: string;
  fileUrl: string;
  fileName: string;
};

@Component({
  selector: 'app-newsletters',
  imports: [RouterLink],
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
      fileUrl: encodeURI('documents/Boletin pesca 1..pdf'),
      fileName: 'Boletin-pesca-1.pdf',
    },
  ];
}
