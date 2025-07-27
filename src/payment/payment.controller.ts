import { Controller,Post, Param, ParseUUIDPipe, Req, Res, Headers, HttpStatus, HttpException } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { Request, Response } from 'express';

@Controller('payment')
export class PaymentController {

  constructor(private readonly paymentService: PaymentService) {}

  @Post ('create-checkout-session/:idUser')
  createCheckouSession(@Param('idUser', ParseUUIDPipe) idUser: string){
    return this.paymentService.createSession(idUser)
  }

  @Post('cancel-suscription/:idUser')
  cancelSuscription(@Param('idUser', ParseUUIDPipe) idUser: string){
    return this.paymentService.cancelSuscription(idUser)
  }

  @Post('webhook')
  async handleStripeWebhook(
    @Req() request: Request,
    @Res() response: Response,
    @Headers('stripe-signature') signature: string
  ) {
    try {
       const rawBody = request.body
      await this.paymentService.webhookPayment(rawBody, signature);
      response.status(HttpStatus.OK).send('Webhook handled');
    } catch (err) {

        if(err instanceof HttpException){
          throw err
        }

         response.status(HttpStatus.INTERNAL_SERVER_ERROR)

    }
  }

  
}
