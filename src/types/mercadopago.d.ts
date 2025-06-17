declare namespace MercadoPago {
  interface CardTokenParams {
    cardNumber: string;
    cardholderName: string;
    cardExpirationMonth: string;
    cardExpirationYear: string;
    securityCode: string;
    identificationType: string;
    identificationNumber: string;
  }

  interface CardToken {
    id: string;
    [key: string]: any;
  }

  interface MercadoPagoInstance {
    configure: (options: { access_token: string }) => void;
    createCardToken: (params: CardTokenParams) => Promise<CardToken>;
  }
}
// Este archivo define los tipos globales para MercadoPago
declare global {
  interface Window {
    MercadoPago: any
  }
}

export {}


