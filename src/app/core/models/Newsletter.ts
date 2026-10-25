export type NewsletterDB = {
  _id: string;
  title: string;
  path: string;
  documentMimeType?: string;
  documentFileName?: string;
  pathImage?: string;
  publishedAt?: number;
  createdAt?: number;
  updatedAt?: number;
  isDeleted?: boolean;
};

export type Newsletter = {
  uuid: string;
  title: string;
  fileUrl: string;
  fileName: string;
  thumbnailUrl: string;
  thumbnailAlt: string;
};

export function mapNewsletterDBToNewsletter(newsletter: NewsletterDB): Newsletter {
  const title = newsletter.title?.trim() || 'Boletín';
  return {
    uuid: newsletter._id,
    title,
    fileUrl: newsletter.path,
    fileName: newsletter.documentFileName?.trim() || `${title}.pdf`,
    thumbnailUrl: newsletter.pathImage?.trim() || 'documents/boletin-pesca-1.png',
    thumbnailAlt: `Miniatura del boletín ${title}`,
  };
}
