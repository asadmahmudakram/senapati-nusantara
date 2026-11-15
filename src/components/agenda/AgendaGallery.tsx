"use client";

import { useCallback, useRef, useState } from "react";

type Gambar = { src: string; alt: string };

function Chevron({ dir }: { dir: "left" | "right" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="20"
      height="20"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d={dir === "left" ? "m15 6-6 6 6 6" : "m9 6 6 6-6 6"} />
    </svg>
  );
}

export default function AgendaGallery({ images }: { images: Gambar[] }) {
  const trackRef = useRef<HTMLUListElement>(null);
  const [index, setIndex] = useState(0);
  const total = images.length;

  const goTo = useCallback(
    (i: number) => {
      const el = trackRef.current;
      if (!el) return;
      const next = Math.max(0, Math.min(total - 1, i));
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      el.scrollTo({ left: next * el.clientWidth, behavior: reduce ? "auto" : "smooth" });
    },
    [total],
  );

  function onScroll() {
    const el = trackRef.current;
    if (!el || el.clientWidth === 0) return;
    setIndex(Math.round(el.scrollLeft / el.clientWidth));
  }

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      goTo(index - 1);
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      goTo(index + 1);
    }
  }

  const multiple = total > 1;

  return (
    <div
      className="agenda-gallery"
      role="region"
      aria-roledescription="carousel"
      aria-label={multiple ? `Galeri gambar, ${total} gambar` : "Gambar agenda"}
    >
      <ul
        ref={trackRef}
        className="agenda-gallery__track"
        onScroll={onScroll}
        onKeyDown={multiple ? onKeyDown : undefined}
        tabIndex={multiple ? 0 : undefined}
      >
        {images.map((img, i) => (
          <li
            key={img.src}
            className="agenda-gallery__slide"
            aria-roledescription="slide"
            aria-label={`${i + 1} dari ${total}`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={img.src} alt={img.alt} loading={i === 0 ? "eager" : "lazy"} draggable={false} />
          </li>
        ))}
      </ul>

      {multiple && (
        <>
          <button
            type="button"
            className="agenda-gallery__btn agenda-gallery__btn--prev"
            onClick={() => goTo(index - 1)}
            disabled={index === 0}
            aria-label="Gambar sebelumnya"
          >
            <Chevron dir="left" />
          </button>
          <button
            type="button"
            className="agenda-gallery__btn agenda-gallery__btn--next"
            onClick={() => goTo(index + 1)}
            disabled={index === total - 1}
            aria-label="Gambar berikutnya"
          >
            <Chevron dir="right" />
          </button>

          <div className="agenda-gallery__dots">
            {images.map((img, i) => (
              <button
                key={img.src}
                type="button"
                className={`agenda-gallery__dot${i === index ? " is-active" : ""}`}
                onClick={() => goTo(i)}
                aria-label={`Gambar ${i + 1} dari ${total}`}
                aria-current={i === index ? "true" : undefined}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}