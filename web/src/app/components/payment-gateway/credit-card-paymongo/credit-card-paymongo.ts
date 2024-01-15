import { Component, HostListener, Input, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { AttachPaymentIntentData, PaymentIntentData, PaymentIntentResource } from 'paymongoo/dist/payment-intents';
import { Subscription } from 'rxjs';
import { Utils } from 'src/app/app.utils';
import { BraintreePayment } from 'src/app/classes/braintree-payment';
import { CreditCard } from 'src/app/classes/credit-card';
import { GCashPayment } from 'src/app/classes/gcash-payment';
import { PaymentDetails } from 'src/app/classes/payment-details';
import { Address, AttachPaymentIntent, Billing, CreditCardAttributes, CreditCardDetails, PaymentMethod, PaymentResource } from 'src/app/classes/paymongo';
import { PaymongoBankPayment } from 'src/app/classes/paymongo-bank-payment';
import { DataService } from 'src/app/services/data.service';
import { NavigationService } from 'src/app/services/navigation.service';
import { PaymentService } from 'src/app/services/payment.service';
import { PaymongoService } from 'src/app/services/paymongo.service';
import { ToasterService } from 'src/app/services/toaster.service';
import { environment } from 'src/environments/environment';
import { isNullOrUndefined } from 'util';


// https://developers.paymongo.com/docs/pipm-workflow
@Component({
  selector: 'app-credit-card-paymongo',
  templateUrl: './credit-card-paymongo.html',
  styleUrls: ['./credit-card-paymongo.scss']
})
export class CreditCardPaymongoComponent implements OnInit, OnDestroy {

  checkoutUrl: string;
  paymentIntentResource: PaymentResource;
  paymentMethod: PaymentMethod;
  paymentIntentAttach: AttachPaymentIntent;
  paymentCreditCard = new CreditCardDetails();
  payment: BraintreePayment;
  paymentType: any;

  selectedOrder: Subscription;
  paymongoBankPayment: PaymongoBankPayment;
  isLoading: boolean;

  paymentIntentclientKey: string;
  paymentMethodId: string;
  paymentIntentId: string;

  constructor(private paymongoService: PaymongoService,
              private dataService: DataService,
              private paymentService: PaymentService,
              private SpinnerService: NgxSpinnerService,
              public toasterService: ToasterService,
              public navigationService: NavigationService,
              private renderer: Renderer2) {
    this.payment = new BraintreePayment();
    this.selectedOrder = new Subscription();
    this.paymentIntentResource = new PaymentResource();
    this.paymongoBankPayment = new PaymongoBankPayment();
    this.paymentCreditCard = new CreditCardDetails();
    this.payment = new BraintreePayment();
    this.paymentIntentAttach = new AttachPaymentIntent();
    this.paymentType = Utils.PAYMENT_TYPE;
  }

  ngOnInit() {
    this.selectedOrder = this.dataService.selectedBraintreePayment$.subscribe((payment) => {
      if (payment.hasOwnProperty('paymentType')) {
        this.isLoading = true;
        this.payment = payment;
      }
    });
  }

  ngOnDestroy() {
    this.selectedOrder.unsubscribe();
  }

  proceedPayment(creditCardDetail: CreditCardDetails) {
    this.paymentCreditCard = creditCardDetail;
    this.constructPaymentEntites()
    this.payPaymongoCreditCard()
    
  }

  constructPaymentEntites() {
    this.createPaymentIntentSourceEntity()
    this.createPaymentMethodEntity();
  }

  payPaymongoCreditCard() {
    if (isNullOrUndefined(this.paymentIntentId) || this.paymentIntentId == '') 
    {
        this.paymongoService.creatPaymentIntent(this.paymentIntentResource).then((response: any) => {
          if(response.data) {
            this.paymentIntentId = response.data.id;
            this.paymentIntentclientKey = response.data.attributes.client_key;
            this.createPaymentMethod();
          } else {
            this.toasterService.alert('error', response.errors[0].detail);
            this.isLoading = false;
          }
           
        }).catch((error: any) => {
          error.errors[0].detail;
          this.isLoading = false;
        });
    } else {
      this.createPaymentMethod();
    }
   
  }

  createPaymentMethod() {
    this.paymongoService.createPaymentMethod(this.paymentMethod).then((response: any) => {
      if(response.data) {
        this.paymentMethodId = response.data.id;
        this.createAttachToPaymentIntent()
      } else {
        this.toasterService.alert('error', response.errors[0].detail);
        this.isLoading = false;
      }

    }).catch((error: any) => {
      this.toasterService.alert('error', error.errors[0].detail);
    });
  }

  createAttachToPaymentIntent() {
    this.attachToPaymentIntentEntity(this.paymentMethodId)
    this.paymongoService.attachToPaymentIntent(this.paymentIntentId, this.paymentIntentAttach).then((response: any) => {
      if(response.data) {
        var paymentIntentStatus = response.data.attributes.status;
        if (paymentIntentStatus === 'awaiting_next_action') {
          localStorage.setItem(Utils.LS_PAYMONGO_CREDITCARD_3DS, JSON.stringify({
            paymentIntentId: this.paymentIntentId,
            paymentMethodId: this.paymentMethodId
          }))
          this.setupMessageListener(response.data.attributes.next_action.redirect.url)
          // render then add
          // Render your modal for 3D Secure Authentication since next_action has a value. You can access the next action via paymentIntent.attributes.next_action.
        } else if (paymentIntentStatus === 'succeeded') {
          localStorage.removeItem(Utils.LS_PAYMONGO_CREDITCARD_3DS)
          // You already received your customer's payment. You can show a success message from this condition.
        } else if(paymentIntentStatus === 'awaiting_payment_method') {
          // The PaymentIntent encountered a processing error. You can refer to paymentIntent.attributes.last_payment_error to check the error and render the appropriate error message.
        }  else if (paymentIntentStatus === 'processing'){
          // You need to requery the PaymentIntent after a second or two. This is a transitory status and should resolve to `succeeded` or `awaiting_payment_method` quickly.
        }
      } else {
        this.toasterService.alert('error', response.errors[0].detail);
        this.isLoading = false;
      }
      
    })
  }

  private setupMessageListener(url: string) {
    var treedsWindow = window.open(url);
    if (treedsWindow) {
      this.renderer.listen(treedsWindow, 'message', (ev: MessageEvent) => {
        if (ev.data === '3DS-authentication-complete') {
          this.createAttachToPaymentIntent();
        }
      });
    }
  }

  saveToDatabase() {
    let parent = this;
    // * Post Payment to database * //
    const paymentDetails = new PaymentDetails();
    parent.SpinnerService.show();
    if (parent.payment.paymentType == parent.paymentType.order) {
      parent.paymentService.completePayment(paymentDetails).then((result) => {
        parent.SpinnerService.hide();
        parent.navigationService.toOrderComplete(parent.payment.orderId);
      }).catch(() => {
        parent.SpinnerService.hide();
        parent.toasterService.alert('error', 'Error while processing your payment. Please try again later');
      });
    } else if (parent.payment.paymentType == parent.paymentType.preOrder) {
      paymentDetails.preOrderTransactionFee = parent.payment.preOrderTransactionFee;
      parent.paymentService.paymentPreOrderSchedule(paymentDetails).then(() => {
        parent.SpinnerService.hide();
        parent.navigationService.toPaymentComplete(parent.payment.orderId);
      }).catch(() => {
        parent.SpinnerService.hide();
        parent.toasterService.alert('error', 'Error while processing your payment. Please try again later');
      });
    } else {
      paymentDetails.layawayTransactionFee = parent.payment.layawayTransactionFee;
      parent.paymentService.paymentLayawaySchedule(paymentDetails).then(() => {
        parent.SpinnerService.hide();
        parent.navigationService.toPaymentComplete(parent.payment.orderId);
      }).catch(() => {
        parent.SpinnerService.hide();
        parent.toasterService.alert('error', 'Error while processing your payment. Please try again later');
      });
    }
  }

  // Docs https://developers.paymongo.com/recipes/creating-a-payment-intent-recipe
  createPaymentIntentSourceEntity() {
    this.paymentIntentResource.attributes.capture_type = 'automatic';
    this.paymentIntentResource.attributes.amount = Utils.fullAmount(this.payment.amount);
    this.paymentIntentResource.attributes.currency = 'PHP';
    this.paymentIntentResource.attributes.statement_descriptor = 'Shop Byzmo';
    this.paymentIntentResource.attributes.created_at = 1586097138;
    this.paymentIntentResource.attributes.payment_method_allowed = ['card']
    this.paymentIntentResource.attributes.payment_method_options = {
      card: {
        request_three_d_secure: 'any'
      }
    }
  }

  // Link https://developers.paymongo.com/recipes/create-a-payment-method-recipe
  createPaymentMethodEntity() {
    let refid = 0;
    
    // Details //
    const attributes = new CreditCardAttributes();
    
  
    // Billing Address//
    const address = new Address();
    address.city = this.payment.Order.shippingDetails.city;
    address.country = 'PH';
    address.line1 = this.payment.Order.shippingDetails.address;
    address.line2 = 'N/A';
    address.postal_code = this.payment.Order.shippingDetails.postalCode;
    address.state = this.payment.Order.shippingDetails.states;


    // Billing //
    const billing = new Billing();
    billing.email = this.payment.Order.shippingDetails.email;
    billing.name = this.payment.Order.shippingDetails.completeName;
    billing.phone = this.payment.Order.shippingDetails.mobileNumber;
    billing.address = address;

    attributes.details = this.paymentCreditCard;
    attributes.billing = billing;

    // Payment Method //

    this.paymentMethod = new PaymentMethod(); 
    this.paymentMethod.attributes = attributes;
    this.paymentMethod.attributes.type = "card";
    this.paymentMethod.attributes.livemode = environment.production;

    if (this.payment.isTotal) {
      refid = 0
    }
    else if (this.payment.paymentType == 'order') {
          refid = this.payment.orderId
    }
        else if (this.payment.paymentType == 'layaway') {
          refid = this.payment.layAwayId
    }
        else if (this.payment.paymentType == 'pre-order') {
          refid = this.payment.preOrderId
    }

  }


  attachToPaymentIntentEntity(paymentMethodId) {
    this.paymentIntentAttach = new AttachPaymentIntent()
    this.paymentIntentAttach.attributes = {
      payment_method: paymentMethodId,
      client_key: this.paymentIntentclientKey
    }
  }

  

 
}
