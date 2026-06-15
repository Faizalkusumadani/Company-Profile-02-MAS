"use client";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Star, Quote } from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Testimonial {
  quote: string;
  name: string;
  title: string;
  imageSrc: string;
  rating: number;
}

interface TestimonialCarouselProps {
  testimonials: Testimonial[];
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-1 mb-4" aria-label={`Rating ${rating} dari 5`}>
      {Array.from({ length: 5 }, (_, i) => (
        <Star
          key={i}
          aria-hidden="true"
          className={`w-4 h-4 ${
            i < rating
              ? "fill-yellow-400 text-yellow-400"
              : "fill-gray-200 text-gray-200"
          }`}
        />
      ))}
    </div>
  );
}

function TestimonialItem({ testimonial }: { testimonial: Testimonial }) {
  const initials = testimonial.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <Card className="h-full hover:shadow-xl transition-shadow duration-300 border-gray-200">
      <CardContent className="p-6 flex flex-col h-full">
        <div className="mb-4" aria-hidden="true">
          <Quote className="w-8 h-8 text-red-600/30" />
        </div>

        <StarRating rating={testimonial.rating} />

        <blockquote className="text-gray-700 leading-relaxed mb-6 grow">
          {testimonial.quote}
        </blockquote>

        <div className="flex items-center gap-4 pt-4 border-t border-gray-100">
          <Avatar className="w-12 h-12 relative overflow-hidden rounded-full">
            <Image
              src={testimonial.imageSrc}
              alt={`Foto ${testimonial.name}`}
              fill
              className="object-cover"
              sizes="48px"
              loading="lazy"
            />
            <AvatarFallback className="bg-red-100 text-red-700 font-semibold">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-semibold text-gray-900">{testimonial.name}</p>
            <p className="text-sm text-gray-500">{testimonial.title}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function TestimonialCard({
  testimonials,
}: TestimonialCarouselProps) {
  return (
    <Carousel
      opts={{ align: "start", loop: true }}
      className="w-full"
      aria-label="Testimonial carousel"
    >
      <CarouselContent>
        {testimonials.map((testimonial, index) => (
          <CarouselItem
            key={`${testimonial.name}-${index}`}
            className="md:basis-1/2 lg:basis-1/3"
            role="group"
            aria-roledescription="slide"
            aria-label={`Testimonial ${index + 1} of ${testimonials.length}`}
          >
            <div className="p-2 h-full">
              <TestimonialItem testimonial={testimonial} />
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="sm:flex -left-12" aria-label="Sebelumnya" />
      <CarouselNext className="sm:flex -right-12" aria-label="Selanjutnya" />
    </Carousel>
  );
}
