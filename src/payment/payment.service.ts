import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Stripe } from 'stripe';
import { ConfigService } from '@nestjs/config';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class PaymentService {

  private stripe: Stripe;
  private api_key;
  private id_product;
  private url_webhook;
  private stripe_webhook_secret;

  constructor(
    private configService: ConfigService,
    private readonly userService: UsersService

  ) {

    this.api_key = this.configService.get<string>('STRIPE_API_KEY');
    this.id_product = this.configService.get<string>('ID_SUBSCRIPTION_PRODUCT');
    this.url_webhook = this.configService.get<string>('URL_WEBHOOK');
    this.stripe_webhook_secret = this.configService.get<string>('STRIPE_WEBHOOK_SECRET')

    if (!this.api_key || !this.id_product || !this.url_webhook || !this.stripe_webhook_secret) {

      throw new HttpException(
        'Failed to load enviroment',
        HttpStatus.INTERNAL_SERVER_ERROR
      )
    }

    this.stripe = new Stripe(this.api_key);
  }

  async createSession(id_user: string): Promise<{ url: string | null }> {
    try {

      const user = await this.userService.findOne(id_user)
      if (!user) {
        throw new HttpException(
          'User not found ',
          HttpStatus.NOT_FOUND
        )
      }

      if (user.rol === 'Estudiante') {
        throw new HttpException(
          'Only Propietarios can perform this action',
          HttpStatus.FORBIDDEN
        )
      }

      const price = await this.stripe.prices.retrieve(this.id_product);
      const product = await this.stripe.products.retrieve(price.product as string)

      const session = await this.stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        mode: 'subscription',
        line_items: [
          {
            price: this.id_product,
            quantity: 1
          }
        ],
        success_url: `${this.url_webhook}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${this.url_webhook}/payment/cancel`,
        metadata: {
          id_user
        }
      });

      return {
        url: session.url
      }

    } catch (error) {



      if (error instanceof HttpException) {
        throw error
      }

      throw new HttpException(
        'Failed to proccess payment. please more afther ',
        HttpStatus.INTERNAL_SERVER_ERROR
      );

    }
  }

  async cancelSuscription(id_user: string) {
    try {

      const user = await this.userService.findOne(id_user)
      if (!user) {
        throw new HttpException(
          'User not found ',
          HttpStatus.NOT_FOUND
        )
      }

      if (!user.id_suscription) {
        throw new HttpException(
          'User does not have an active subscription',
          HttpStatus.FORBIDDEN
        )
      }


      await this.stripe.subscriptions.update(user.id_suscription, {
        cancel_at_period_end: true
      });

    } catch (error) {

      if (error instanceof HttpException) {
        throw error
      }

      throw new HttpException(
        "Failed to cancel suscription",
        HttpStatus.INTERNAL_SERVER_ERROR
      )

    }
  }


  async webhookPayment(rawBody: Buffer, signature: string) {
    let event;

    try {
     
      event = this.stripe.webhooks.constructEvent(
        rawBody,
        signature,
        this.stripe_webhook_secret
      )

      switch (event.type) {
        case 'checkout.session.completed':
          const session = event.data.object;
          const subscriptionId = session.subscription;

          const metadata = session.metadata;
          if (metadata === null || !metadata.id_user || !subscriptionId) {
            throw new HttpException(
              'Error: user_id is missing or metadata is null or subscriptionId is null.',
              HttpStatus.BAD_REQUEST
            )
          }

          const id = metadata.id_user;

          await this.updatePlanStatus({ id_user: id, status: 'Premium', id_suscription: subscriptionId.toString() });
          break;

        case 'checkout.session.expired':
          const expiredSession = event.data.object;
          console.log(`Checkout session expired for session ID: ${expiredSession.id}`);
          break;

        case 'payment_intent.payment_failed':
          const failedPaymentIntent = event.data.object;
          console.log(`PaymentIntent failed for payment intent ID: ${failedPaymentIntent.id}`);
          break;


        case 'customer.subscription.deleted':
          console.log('Subscription deleted event received');
          const subscriptionDeleted = event.data.object;
          const userId = subscriptionDeleted.metadata.id_user;

          if (!userId) {
            console.error('user_id is missing in subscription deleted event.');
           throw new HttpException(
              "Error: user_id is missing in subscription deleted event.",
              HttpStatus.BAD_REQUEST
            )
          }

          await this.updatePlanStatus({ id_user: userId, status: 'Basico', id_suscription: "" });

          console.log(`User with ID ${userId} subscription was canceled, status set to "Basico"`);
          break;

        default:
          console.log(`Unhandled event type: ${event.type}`);
      }



    } catch (error) {
      console.log(error)
      if (error instanceof HttpException) {
        throw error
      }

      throw new HttpException(
        'Uknown error verifying webhook',
        HttpStatus.INTERNAL_SERVER_ERROR
      )
    }
  }



  async updatePlanStatus(
    { id_user, status, id_suscription = "" }:
      { id_user: string, status: 'Premium' | 'Basico', id_suscription?: string }
  ) {
    try {
      let updateData: any = { tipo_suscription: status };

      if (id_suscription) {
        updateData.id_suscription = id_suscription;
      }

      console.log(updateData)

      const updateStatus = await this.userService.update(
        id_user,
        updateData
      );

      if (updateStatus?.tipo_suscription === 'Premium') {
        console.log(`User with ID ${id_user} updated to ${status} subscription.`);
      } else {
        console.log(`No user found with ID ${id_user} or status already ${status}.`);
      }

    } catch (error) {

      if(error instanceof HttpException){
        throw error
      }

     throw new HttpException(
        `Error updating user subscription`,
        HttpStatus.INTERNAL_SERVER_ERROR
      )
    }

  }
}
