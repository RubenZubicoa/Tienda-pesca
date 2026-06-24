import {
  Component,
  DestroyRef,
  effect,
  inject,
  input,
  signal,
  ViewChild,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  injectStripe,
  NgxStripeModule,
  StripeElementsDirective,
  StripePaymentElementComponent,
} from 'ngx-stripe';
import { StripeElementsOptions, StripePaymentElementOptions } from '@stripe/stripe-js';
import { PaymentService } from '../../services/payment';

@Component({
  selector: 'app-checkout-form-component',
  imports: [StripePaymentElementComponent, StripeElementsDirective, NgxStripeModule],
  templateUrl: './checkout-form-component.html',
  styleUrl: './checkout-form-component.scss',
})
export class CheckoutFormComponent {
  @ViewChild(StripePaymentElementComponent)
  paymentElement!: StripePaymentElementComponent;

  /** Importe total en céntimos (ej. 25,99 € → 2599). */
  readonly amountInCents = input.required<number>();

  private readonly paymentService = inject(PaymentService);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly stripe = injectStripe();
  protected readonly paying = signal(false);
  protected readonly loading = signal(true);
  protected readonly errorMessage = signal('');
  protected readonly elementsOptions = signal<StripeElementsOptions | null>(null);

  protected readonly paymentElementOptions: StripePaymentElementOptions = {
    layout: {
      type: 'tabs',
      defaultCollapsed: false,
      radios: false,
      spacedAccordionItems: false,
    },
  };

  constructor() {
    effect(() => {
      const amount = this.amountInCents();
      if (amount > 0) {
        this.loadPaymentIntent(amount);
      }
    });
  }

  protected pay() {
    if (this.paying() || !this.paymentElement?.elements) return;
    this.paying.set(true);

    this.stripe
      .confirmPayment({
        elements: this.paymentElement.elements,
        confirmParams: {
          return_url: `${window.location.origin}/checkout`,
        },
        redirect: 'if_required',
      })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (result) => {
          this.paying.set(false);
          if (result.error) {
            this.errorMessage.set(result.error.message ?? 'Error al procesar el pago.');
            return;
          }

          if (result.paymentIntent?.status === 'succeeded') {
            this.errorMessage.set('');
            // El checkout padre puede escuchar un evento o redirigir tras el éxito.
          }
        },
        error: () => {
          this.paying.set(false);
          this.errorMessage.set('No se pudo confirmar el pago. Inténtalo de nuevo.');
        },
      });
  }

  private loadPaymentIntent(amountInCents: number) {
    this.loading.set(true);
    this.errorMessage.set('');
    this.elementsOptions.set(null);

    this.paymentService
      .createPaymentIntent(amountInCents)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: ({ clientSecret }) => {
          if (!clientSecret?.includes('_secret_')) {
            this.errorMessage.set(
              'El servidor devolvió un clientSecret inválido. Revisa la integración de Stripe en el backend.',
            );
            this.loading.set(false);
            return;
          }

          this.elementsOptions.set({
            locale: 'es',
            clientSecret,
            appearance: { theme: 'stripe' },
          });
          this.loading.set(false);
        },
        error: () => {
          this.loading.set(false);
          this.errorMessage.set(
            'No se pudo iniciar el pago. El backend debe crear un PaymentIntent y devolver su clientSecret.',
          );
        },
      });
  }
}
