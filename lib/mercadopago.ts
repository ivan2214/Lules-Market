import { MercadoPagoConfig, Payment, Preference } from "mercadopago";

if (!process.env.MP_ACCESS_TOKEN) {
  throw new Error("MP_ACCESS_TOKEN is not defined");
}

export const mercadopago = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN,
});

export const preferenceClient = new Preference(mercadopago);

export const paymentClient = new Payment(mercadopago);
