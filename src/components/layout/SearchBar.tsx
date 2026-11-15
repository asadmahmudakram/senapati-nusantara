type Props = {
  variant?: "header" | "menu" | "page";
  defaultValue?: string;
};

export default function SearchBar({ variant = "header", defaultValue }: Props) {
  const id = `q-${variant}`;

  return (
    <form action="/cari" method="get" role="search" className={`search-bar search-bar--${variant}`}>
      <label htmlFor={id} className="sr-only">
        Cari berita
      </label>
      <input
        id={id}
        name="q"
        type="search"
        placeholder="Cari berita"
        autoComplete="off"
        defaultValue={defaultValue}
      />
      <button type="submit">Cari</button>
    </form>
  );
}