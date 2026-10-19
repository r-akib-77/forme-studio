export type PolicySlug =
  | "delivery"
  | "exchange-and-returns"
  | "privacy-policy"
  | "terms-and-conditions"
  | "size-guide"
  | "contact";

export type Policy = {
  slug: PolicySlug;
  title: string;
  eyebrow: string;
  intro: string;
  sections: { heading: string; body: string[] }[];
};

export const policies: Policy[] = [
  {
    slug: "delivery",
    title: "Delivery Information",
    eyebrow: "Shipping",
    intro:
      "How orders move from the studio to your door. All figures below are demo configuration for this storefront demonstration.",
    sections: [
      {
        heading: "Delivery charges",
        body: [
          "Inside Dhaka city: ৳60 per order.",
          "Outside Dhaka city: ৳120 per order.",
          "Orders above ৳2,000 qualify for free delivery anywhere in Bangladesh.",
        ],
      },
      {
        heading: "What to expect",
        body: [
          "Orders are packed in recyclable paper and a reusable cotton dust bag.",
          "Tracking details are shared by message as soon as the parcel leaves the studio.",
          "Cash on delivery is available on every district.",
        ],
      },
      {
        heading: "Something worth saying",
        body: [
          "This storefront is a frontend demonstration. No parcels are dispatched, no stock is held and no delivery windows are committed to.",
        ],
      },
    ],
  },
  {
    slug: "exchange-and-returns",
    title: "Exchange & Return Policy",
    eyebrow: "Returns",
    intro:
      "If the fit is not right, here is the exchange route we would operate in a live store. This is demo policy content.",
    sections: [
      {
        heading: "Exchanges",
        body: [
          "Exchanges are accepted within 14 days of delivery.",
          "Items should be unworn, unwashed and returned with the original tags attached.",
          "A different size of the same piece can be exchanged with no extra charge.",
        ],
      },
      {
        heading: "How to start one",
        body: [
          "Bring the item to any FORME STUDIO counter, or send us a message with your order number.",
          "Our team will confirm availability and arrange the exchange.",
        ],
      },
      {
        heading: "Demo notice",
        body: [
          "No real orders exist in this demonstration, so no actual returns can be processed. The text above is placeholder policy content for layout purposes only.",
        ],
      },
    ],
  },
  {
    slug: "privacy-policy",
    title: "Privacy Policy",
    eyebrow: "Legal",
    intro:
      "How FORME STUDIO would handle personal information. This storefront is a demo and does not collect or transmit any data.",
    sections: [
      {
        heading: "What we would collect",
        body: [
          "Contact details you provide when placing an order, such as a name, phone number and delivery address.",
          "The newsletter email address, only if you choose to subscribe.",
        ],
      },
      {
        heading: "What this demo does",
        body: [
          "Everything on this site runs in your browser. The cart is stored locally in your own browser storage.",
          "No personal information is sent to any server, third party or analytics service.",
          "The newsletter form validates your address and then clears it — nothing is stored or sent.",
        ],
      },
    ],
  },
  {
    slug: "terms-and-conditions",
    title: "Terms & Conditions",
    eyebrow: "Legal",
    intro:
      "The ground rules for using this storefront. Written for a demonstration build and clearly labelled as such.",
    sections: [
      {
        heading: "Using this site",
        body: [
          "This is a frontend-only demonstration of a fashion storefront.",
          "Products, prices, imagery, reviews and policies are fictional sample content.",
          "No contract of sale is formed by using this site.",
        ],
      },
      {
        heading: "Payments",
        body: [
          "The checkout shows illustrative payment method choices only.",
          "No payment gateway is integrated, no credentials are collected and no money can be transferred.",
        ],
      },
    ],
  },
  {
    slug: "size-guide",
    title: "Size Guide",
    eyebrow: "Fit",
    intro:
      "Garment measurements for the pieces in this catalogue. Measurements are taken flat in centimetres.",
    sections: [
      {
        heading: "T-Shirts & Oversized Tees",
        body: [
          "S — chest 52 cm, length 68 cm, shoulder 24 cm.",
          "M — chest 55 cm, length 71 cm, shoulder 25 cm.",
          "L — chest 58 cm, length 74 cm, shoulder 26 cm.",
          "XL — chest 61 cm, length 76 cm, shoulder 27 cm.",
          "XXL — chest 64 cm, length 78 cm, shoulder 28 cm.",
        ],
      },
      {
        heading: "Bottoms",
        body: [
          "Waist sizes run from 28 to 38, in inches.",
          "Rise is mid across every fit we make, from the straight-leg denim to the relaxed chinos.",
          "Oversized fits are designed to be taken one size down for a standard fit.",
        ],
      },
      {
        heading: "Not sure?",
        body: [
          "Message us with your usual size in a similar cut and we will point you to the right option in the studio.",
        ],
      },
    ],
  },
  {
    slug: "contact",
    title: "Contact",
    eyebrow: "Support",
    intro:
      "Reach the FORME STUDIO team. Contact details below are placeholders for this demonstration.",
    sections: [
      {
        heading: "Studio hours",
        body: [
          "Saturday to Thursday, 11:00am – 9:00pm.",
          "Friday, 3:00pm – 9:00pm.",
        ],
      },
      {
        heading: "Get in touch",
        body: [
          "Email: hello@forme-studio.example.com",
          "Phone: +880 1XXX-XXXXXX",
          "Studio: Gulshan Avenue, Dhaka 1212, Bangladesh",
        ],
      },
      {
        heading: "Demo notice",
        body: [
          "The email address, phone number and address above are fictional placeholders. This storefront does not send or receive messages.",
        ],
      },
    ],
  },
];

export const policyMap = new Map(policies.map((p) => [p.slug, p]));

export function getPolicy(slug: string): Policy | undefined {
  return policyMap.get(slug as PolicySlug);
}
