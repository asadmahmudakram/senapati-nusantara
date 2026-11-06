"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import type { NewsItem } from "@/types/news";
import { siteConfig } from "@/data/site";
import ExternalLink from "@/components/news/ExternalLink";
import NewsMeta from "@/components/news/NewsMeta";

type Props = { items: NewsItem[]; interval?: number };

export default function HeroSlider({ items, interval = 6000 }: Props) {
  const [index, setIndex] = useState(0);
  const [hovering, setHovering] = useState(false);
  const [userPaused, setUserPaused] = useState(false);

  const count = items.length;
  const running = count > 1 && !hovering && !userPaused;

  useEffect(() => {
    if (!running) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setInterval(() => setIndex((i) => (i + 1) % count), interval);
    return () => window.clearInterval(id);
  }, [running, count, interval]);

  if (count === 0) return null;

  const go = (n: number) => setIndex((n + count) % count);

  return (
    <section
      className="hero"
      aria-roledescription="carousel"
      aria-label="Headline utama"
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
      onFocus={() => setHovering(true)}
      onBlur={() => setHovering(false)}
    >
      <div className="hero__viewport" aria-live={running ? "off" : "polite"}>
        {items.map((item, i) => {
          const active = i === index;
          return (
            <article
              key={item.id}
              className={`hero__slide${active ? " is-active" : ""}`}
              role="group"
              aria-roledescription="slide"
              aria-label={`${i + 1} dari ${count}`}
              inert={!active}
            >
              <Image
                className="hero__image"
                src={item.image ?? siteConfig.placeholderImage}
                alt=""
                fill
                sizes="100vw"
                priority={i === 0}
                unoptimized
              />
              <div className="hero__scrim" />
              <div className="container hero__body">
                <NewsMeta item={item} tone="light" />
                <h2 className="hero__title">
                  <ExternalLink href={item.url}>{item.title}</ExternalLink>
                </h2>
              </div>
            </article>
          );
        })}
      </div>

      {count > 1 && (
        <div className="container hero__controls">
          <div className="hero__dots" role="group" aria-label="Pilih slide">
            {items.map((item, i) => (
              <button
                key={item.id}
                type="button"
                className="hero__dot"
                aria-label={`Slide ${i + 1}`}
                aria-current={i === index ? "true" : undefined}
                onClick={() => go(i)}
              />
            ))}
          </div>
          <div className="hero__buttons">
            <button type="button" onClick={() => setUserPaused((p) => !p)}>
              {userPaused ? "Putar" : "Jeda"}
            </button>
            <button type="button" onClick={() => go(index - 1)}>
              Sebelumnya
            </button>
            <button type="button" onClick={() => go(index + 1)}>
              Berikutnya
            </button>
          </div>
        </div>
      )}
    </section>
  );
}