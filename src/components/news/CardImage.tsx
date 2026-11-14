"use client";

import { useEffect, useRef, useState } from "react";

type CardImageProps = {
  src?: string;
  label?: string;
  priority?: boolean;
};

export default function CardImage({ src, label, priority = false }: CardImageProps) {
  const [failed, setFailed] = useState(false);
  const ref = useRef<HTMLImageElement>(null);

  // Gambar yang sudah gagal sebelum hydration tidak memicu onError, jadi dicek manual
  useEffect(() => {
    const el = ref.current;
    if (el && el.complete && el.naturalWidth === 0) setFailed(true);
  }, [src]);

  if (!src || failed) {
    return (
      <div className="story__placeholder" aria-hidden="true">
        {label && <span>{label}</span>}
      </div>
    );
  }

  return (
    <img
      ref={ref}
      src={src}
      alt=""
      loading={priority ? "eager" : "lazy"}
      referrerPolicy="no-referrer"
      onError={() => setFailed(true)}
    />
  );
}