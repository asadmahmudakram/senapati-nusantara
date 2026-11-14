import type { Agenda } from "@/types/agenda";

const tanggal = new Intl.DateTimeFormat("id-ID", {
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "UTC",
});

function rentangTanggal(mulai: string, selesai: string) {
  if (mulai === selesai) return tanggal.format(new Date(mulai));
  const a = new Date(mulai);
  const b = new Date(selesai);
  const samaBulan =
    a.getUTCMonth() === b.getUTCMonth() &&
    a.getUTCFullYear() === b.getUTCFullYear();
  return samaBulan
    ? `${a.getUTCDate()} – ${tanggal.format(b)}`
    : `${tanggal.format(a)} – ${tanggal.format(b)}`;
}

function statusAgenda(mulai: string, selesai: string) {
  const hariIni = new Date().toLocaleDateString("en-CA", {
    timeZone: "Asia/Jakarta",
  });
  if (hariIni < mulai) return { label: "Akan datang", kelas: "is-upcoming" };
  if (hariIni <= selesai) return { label: "Berlangsung", kelas: "is-live" };
  return { label: "Selesai", kelas: "is-done" };
}

export default function AgendaCard({ item }: { item: Agenda }) {
  const status = statusAgenda(item.mulai, item.selesai);

  return (
    <article
      className={`agenda-card${item.gambar ? " agenda-card--with-media" : ""}`}
    >
      {item.gambar && (
        <div className="agenda-card__media">
          <img src={item.gambar.src} alt={item.gambar.alt} loading="lazy" />
        </div>
      )}

      <div className="agenda-card__body">
        <p className="agenda-card__date">
          <span className={`agenda-card__status ${status.kelas}`}>
            {status.label}
          </span>
          <span>{rentangTanggal(item.mulai, item.selesai)}</span>
        </p>

        <h2 className="agenda-card__title">{item.judul}</h2>
        {item.tema && <p className="agenda-card__theme">“{item.tema}”</p>}

        {item.keterangan && <p>{item.keterangan}</p>}
        {item.menampilkan && (
          <p>
            <strong>Menampilkan:</strong> {item.menampilkan}
          </p>
        )}

        <p>
          <strong>Lokasi:</strong>
          <br />
          {item.lokasi.tempat}
          {item.lokasi.alamat && (
            <>
              <br />
              {item.lokasi.alamat}
            </>
          )}
        </p>

        {item.kerjaSama && item.kerjaSama.length > 0 && (
          <div className="agenda-card__partners">
            <strong>Kerja sama:</strong>
            <ul>
              {item.kerjaSama.map((mitra) => (
                <li key={mitra}>{mitra}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </article>
  );
}