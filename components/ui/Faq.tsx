"use client";

import { motion as m, type Variants } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

export interface FaqAccordionProps {
  data: FaqItem[];
  title?: string;
  subtitle?: string;
}

// ─── Motion Variants ──────────────────────────────────────────────────────────

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: "easeOut" },
  },
};

const headerVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

// ─── Compose AccordionItem with motion ───────────────────────────────────────
const MotionAccordionItem = m.create(AccordionItem);

// ─── Sub-components ───────────────────────────────────────────────────────────

function FaqHeader({
  title,
  subtitle,
}: Pick<FaqAccordionProps, "title" | "subtitle">) {
  if (!title && !subtitle) return null;

  return (
    <m.div
      variants={headerVariants}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true }}
      className="mb-10 sm:mb-14"
    >
      {subtitle && (
        <p className="text-xs sm:text-sm tracking-[0.3em] text-red-700/70 uppercase font-light mb-3">
          {subtitle}
        </p>
      )}
      {title && (
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-700 mb-3 sm:mb-4">
          {title}
        </h2>
      )}
    </m.div>
  );
}

function FaqList({ data }: Pick<FaqAccordionProps, "data">) {
  return (
    <m.div
      variants={containerVariants}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.1 }}
    >
      <Accordion type="single" collapsible className="w-full">
        {data.map((item) => (
          <MotionAccordionItem
            key={item.id}
            value={item.id}
            variants={itemVariants}
            className="border-x-0 border-t-0 border-b border-b-gray-200 px-1 transition-colors duration-300 hover:border-b-red-300 data-[state=open]:border-b-red-400"
          >
            <AccordionTrigger className="text-left text-sm sm:text-base font-semibold text-gray-700 py-7 hover:text-red-700 hover:no-underline transition-colors duration-200 [&>svg]:text-red-600 [&>svg]:shrink-0">
              {item.question}
            </AccordionTrigger>
            <AccordionContent className="text-gray-500 text-sm sm:text-base leading-relaxed pb-5">
              {item.answer}
            </AccordionContent>
          </MotionAccordionItem>
        ))}
      </Accordion>
    </m.div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function FaqAccordion({
  data,
  title,
  subtitle,
}: FaqAccordionProps) {
  return (
    <section
      aria-label="Frequently Asked Questions"
      className="mx-auto max-w-6xl"
    >
      <FaqHeader title={title} subtitle={subtitle} />
      <FaqList data={data} />
    </section>
  );
}
