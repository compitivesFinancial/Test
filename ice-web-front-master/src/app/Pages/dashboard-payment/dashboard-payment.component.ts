import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { SharedService } from 'src/app/Shared/Services/shared.service';
import { environment } from 'src/environments/environment.prod';

@Component({
    selector: 'app-dashboard-payment',
    templateUrl: './dashboard-payment.component.html',
    styleUrls: ['./dashboard-payment.component.css']
})
export class DashboardPaymentComponent implements OnInit {
    subscriptions: Subscription[] = [];
    public requestId: any
    LANG: any = {};
    constructor(public route: ActivatedRoute, private shared: SharedService) {
       
        this.changeLanguage();
    }
    changeLanguage() {
       
        this.shared.getLang().subscribe(lang => {
            if(lang=='ar'){
              this.LANG = environment.arabic_translations;
            }
            else {
              this.LANG = environment.english_translations;
              
            }
          });
    }
    ngOnInit(): void {
        const script = document.createElement('script');
        script.src = 'https://test-anb.mtf.gateway.mastercard.com/api/rest/version/69/merchant/1050/session.js';
        document.head.appendChild(script);
        // <style id="antiClickjack">body{display:none !important;}</style>
        const style = document.createElement('style');
        style.id = 'antiClickjack'
        style.innerHTML = 'body{display:none !important;}'
        document.head.appendChild(style);

        this.requestId = atob(this.route.snapshot.params['id']);
        // console.log(this.requestId, 'id is ere')
        const scriptPaymentSession = document.createElement('script');
        scriptPaymentSession.type = "text/javascript"
        scriptPaymentSession.innerHTML = `
    console.log(${this.requestId})
    if (self === top) {
      var antiClickjack = document.getElementById("antiClickjack");
      antiClickjack.parentNode.removeChild(antiClickjack);
  } else {
      top.location = self.location;
  }
  PaymentSession.configure({
      session: "${this.requestId}",
      fields: {
          // Attach hosted fields to your payment page
              card: {
                  number: "#card-number",
                  securityCode: "#security-code",
                  expiryMonth: "#expiry-month",
                  expiryYear: "#expiry-year",
                  nameOnCard: "#cardholder-name"
              },
              giftCard: {
                      number: "#gift-card-number",
                      pin: "#gift-card-pin"
                    },
              ach: {
                      accountType: "#ach-account-type",
                      bankAccountHolder: "#ach-account-holder",
                      bankAccountNumber: "#ach-account-number",
                      bankAccountNumberConfirmation: "#ach-account-number-confirmation",
                      routingNumber: "#ach-routing-number"
                    },
              directDebitCanada: {
                      accountType: "#account-type",
                      bankAccountHolder: "#bank-account-holder",
                      bankAccountNumber: "#bank-account-number",
                      transitNumber: "#transit-number",
                      financialInstitutionNumber: "#financial-institution-number",
                      bankAccountNumberConfirmation: "#bank-account-number-confirmation"
              }
            },
      frameEmbeddingMitigation: ["javascript"],
      callbacks: {
          initialized: function(response) {
              // HANDLE INITIALIZATION RESPONSE
              if (response.status === "ok") {
                  document.getElementById("visaCheckoutButton").style.display = 'block';
              }
          },
          formSessionUpdate: function(response) {
              // HANDLE RESPONSE FOR UPDATE SESSION
          if (response.status) {
              if ("ok" == response.status) {
                  // console.log("Session updated with data: " + response.session.id);

                  //check if the security code was provided by the user
                  if (response.sourceOfFunds.provided.card.securityCode) {
                      // console.log("Security code was provided.");
                  }

                  //check if the user entered a MasterCard credit card
                  if (response.sourceOfFunds.provided.card.scheme == 'MASTERCARD') {
                      // console.log("The user entered a MasterCard credit card.")
                  }
              } else if ("fields_in_error" == response.status)  {

                  // console.log("Session update failed with field errors.");
                  if (response.errors.cardNumber) {
                      // console.log("Card number invalid or missing.");
                  }
                  if (response.errors.expiryYear) {
                      // console.log("Expiry year invalid or missing.");
                  }
                  if (response.errors.expiryMonth) {
                      // console.log("Expiry month invalid or missing.");
                  }
                  if (response.errors.securityCode) {
                      // console.log("Security code invalid.");
                  }
                  if (response.errors.number) {
                      // console.log("Gift card number invalid or missing.");
                  }
                  if (response.errors.pin) {
                      // console.log("Pin invalid or missing.");
                  }
                  if (response.errors.bankAccountHolder) {
                      // console.log("Bank account holder invalid.");
                  }
                  if (response.errors.bankAccountNumber) {
                      // console.log("Bank account number invalid.");
                  }
                  if (response.errors.routingNumber) {
                      // console.log("Routing number invalid.");
                  }
              } else if ("request_timeout" == response.status)  {
                  // console.log("Session update failed with request timeout: " + response.errors.message);
              } else if ("system_error" == response.status)  {
                  // console.log("Session update failed with system error: " + response.errors.message);
              }
          } else {
              // console.log("Session update failed: " + response);
          }
          }
      },
      interaction: {
          displayControl: {
              formatCard: "EMBOSSED",
              invalidFieldCharacters: "REJECT"
          }
      }
  });
  function pay(paymentType) {
      // UPDATE THE SESSION WITH THE INPUT FROM HOSTED FIELDS
      if (paymentType === 'giftCard') {
          PaymentSession.updateSessionFromForm(paymentType, '<localCardBrand>');
      } else {
          PaymentSession.updateSessionFromForm(paymentType);
      }
  }`
        document.body.appendChild(scriptPaymentSession);


    }


    pay() {

    }



}
