import { Component, computed, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CurrentUserService } from '../../../auth/services/current-user-service';
import { TokenService } from '../../../auth/services/token-service';
import { Newsletter } from '../../../core/models/Newsletter';
import { NewsletterService } from '../../../core/services/newsletter';
import { NewsletterSubscriptionService } from '../../../core/services/newsletter-subscription';

type NewsletterIssue = {
  id: string;
  title: string;
  thumbnailUrl: string;
  thumbnailAlt: string;
  fileUrl: string;
  fileName: string;
};

@Component({
  selector: 'app-newsletters',
  imports: [ReactiveFormsModule],
  templateUrl: './newsletters.html',
  styleUrl: './newsletters.scss',
})
export class Newsletters implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly destroyRef = inject(DestroyRef);
  private readonly tokenService = inject(TokenService);
  private readonly currentUser = inject(CurrentUserService);
  private readonly newsletterService = inject(NewsletterService);
  private readonly newsletterSubscriptionService = inject(NewsletterSubscriptionService);

  protected readonly showModal = signal(false);
  protected readonly isSubmitting = signal(false);
  protected readonly errorMessage = signal('');
  protected readonly successMessage = signal('');
  protected readonly remoteIssues = signal<NewsletterIssue[]>([]);
  protected readonly loadingIssues = signal(true);

  private readonly hardcodedIssues: NewsletterIssue[] = [
    {
      id: 'local-boletin-1',
      title: 'Boletín de pesca nº 1',
      thumbnailUrl: 'documents/boletin-pesca-1.png',
      thumbnailAlt: 'Miniatura de la primera página del boletín de pesca nº 1',
      fileUrl: encodeURI('documents/Boletin pesca 1..pdf'),
      fileName: 'Boletin-pesca-1.pdf',
    },
  ];

  protected readonly issues = computed(() => [...this.hardcodedIssues, ...this.remoteIssues()]);

  protected readonly form = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
  });

  ngOnInit(): void {
    this.newsletterService
      .getNewsletters()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (newsletters) => {
          this.remoteIssues.set(newsletters.map((item) => this.mapToIssue(item)));
          this.loadingIssues.set(false);
        },
        error: () => {
          this.remoteIssues.set([]);
          this.loadingIssues.set(false);
        },
      });
  }

  protected onSubscribeClick() {
    this.errorMessage.set('');
    this.successMessage.set('');

    const loggedInEmail = this.getLoggedInEmail();
    if (loggedInEmail) {
      this.subscribe(loggedInEmail);
      return;
    }

    this.form.reset({ email: '' });
    this.showModal.set(true);
  }

  protected closeModal() {
    if (this.isSubmitting()) return;
    this.showModal.set(false);
    this.errorMessage.set('');
  }

  protected submitModal() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.errorMessage.set('Introduce un correo electrónico válido.');
      return;
    }

    const { email } = this.form.getRawValue();
    this.subscribe(email, true);
  }

  private mapToIssue(newsletter: Newsletter): NewsletterIssue {
    return {
      id: newsletter.uuid,
      title: newsletter.title,
      thumbnailUrl: newsletter.thumbnailUrl,
      thumbnailAlt: newsletter.thumbnailAlt,
      fileUrl: newsletter.fileUrl,
      fileName: newsletter.fileName,
    };
  }

  private getLoggedInEmail(): string | null {
    if (!this.tokenService.isAuthenticated()) return null;
    const email = this.currentUser.user()?.email?.trim();
    return email || null;
  }

  private subscribe(email: string, fromModal = false) {
    this.isSubmitting.set(true);
    this.errorMessage.set('');
    this.successMessage.set('');

    this.newsletterSubscriptionService
      .subscribe(email)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.isSubmitting.set(false);
          this.successMessage.set('Te has suscrito correctamente al boletín.');
          if (fromModal) {
            this.showModal.set(false);
            this.form.reset({ email: '' });
          }
        },
        error: (error) => {
          this.isSubmitting.set(false);
          const message =
            error?.error?.message ||
            'No se ha podido completar la suscripción. Inténtalo de nuevo.';
          this.errorMessage.set(message);
        },
      });
  }
}
