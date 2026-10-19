import Image from "next/image";
import { Quote, Star } from "lucide-react";

import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";

type Testimonial = {
  quote: string;
  name: string;
  location: string;
  avatar: string;
  rating: number;
};

const testimonials: Testimonial[] = [
  {
    quote:
      "The heavyweight tee is the first one I have owned that still looks new after a month of daily wear. The shape holds up no matter how I sit.",
    name: "Sample customer 01",
    location: "Dhanmondi, Dhaka",
    avatar: "/images/avatars/avatar-1.jpg",
    rating: 5,
  },
  {
    quote:
      "Ordered the cargo pants in 32 and they fit exactly like the size guide said. Exchange was not even needed, which never happens.",
    name: "Sample customer 02",
    location: "Agrabad, Chattogram",
    avatar: "/images/avatars/avatar-2.jpg",
    rating: 5,
  },
  {
    quote:
      "I am usually between sizes on shirts. The relaxed fit gave me room without looking sloppy, so I kept both colours.",
    name: "Sample customer 03",
    location: "Zindabazar, Sylhet",
    avatar: "/images/avatars/avatar-3.jpg",
    rating: 4,
  },
  {
    quote:
      "The jersey arrived in two days and the mesh actually breathes. It works for playing and for just going out, which is rare.",
    name: "Sample customer 04",
    location: "Uttara, Dhaka",
    avatar: "/images/avatars/avatar-4.jpg",
    rating: 5,
  },
];

export function TestimonialSection() {
  return (
    <section aria-labelledby="reviews-heading" className="border-t border-line bg-paper">
      <div className="mx-auto max-w-[1600px] px-4 py-16 sm:px-6 sm:py-20 lg:px-10 lg:py-24">
        <Reveal>
          <SectionHeading
            eyebrow="From the community"
            title="What people are saying"
            description="A sample of feedback written for this demonstration. Reviews here are illustrative content, not verified customer records."
            align="center"
          />
        </Reveal>

        <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {testimonials.map((testimonial, index) => (
            <Reveal as="li" key={testimonial.name} delay={index * 0.07}>
              <figure className="flex h-full flex-col border border-line bg-paper p-6 transition-colors duration-300 hover:border-line-strong">
                <Quote
                  className="h-5 w-5 text-lime-deep"
                  strokeWidth={1.5}
                  aria-hidden="true"
                />
                <blockquote className="mt-4 flex-1 text-sm leading-relaxed text-ink-2">
                  “{testimonial.quote}”
                </blockquote>
                <div
                  className="mt-5 flex items-center gap-1"
                  aria-label={`${testimonial.rating} out of 5 stars`}
                >
                  {Array.from({ length: 5 }).map((_, starIndex) => (
                    <Star
                      key={starIndex}
                      className={`h-3 w-3 ${
                        starIndex < testimonial.rating
                          ? "fill-lime-deep text-lime-deep"
                          : "text-clay"
                      }`}
                      aria-hidden="true"
                    />
                  ))}
                </div>
                <figcaption className="mt-4 flex items-center gap-3 border-t border-line pt-4">
                  <span className="media-frame relative h-10 w-10 shrink-0 overflow-hidden rounded-full">
                    <Image
                      src={testimonial.avatar}
                      alt=""
                      fill
                      sizes="40px"
                      className="object-cover"
                    />
                  </span>
                  <span>
                    <span className="block text-[0.78rem] font-medium text-ink">
                      {testimonial.name}
                    </span>
                    <span className="block text-[0.68rem] text-muted">{testimonial.location}</span>
                  </span>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </ul>

        <p className="mx-auto mt-8 max-w-2xl text-center text-xs leading-relaxed text-muted-2">
          FORME STUDIO is a fictional brand. The testimonials above are sample content
          written for this demonstration and are not real customer reviews.
        </p>
      </div>
    </section>
  );
}
