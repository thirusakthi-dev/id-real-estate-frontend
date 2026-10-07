import { Phone, UserRound } from "lucide-react";

type PropertyContactProps = {
  owner: {
    id: number;
    name: string;
    phone: string | null;
  };
};

export default function PropertyContact({ owner }: PropertyContactProps) {
  return (
    <section
      aria-labelledby="property-contact-title"
      className="mt-4 rounded-2xl border border-border bg-surface p-6"
    >
      <div className="flex items-center gap-3">
        <div
          className="flex size-11 shrink-0 items-center justify-center rounded-full bg-surface-hover"
          aria-hidden="true"
        >
          <UserRound className="size-5 text-muted-foreground" />
        </div>

        <div className="min-w-0">
          <h2
            id="property-contact-title"
            className="text-base font-semibold text-foreground"
          >
            Property Owner
          </h2>

          <p className="mt-0.5 truncate text-sm text-muted-foreground">
            {owner.name}
          </p>
        </div>
      </div>

      {owner.phone ? (
        <a
          href={`tel:${owner.phone}`}
          className="mt-5 flex items-center gap-3 rounded-xl border border-border px-4 py-3 text-sm text-foreground transition-colors hover:bg-surface-hover"
        >
          <Phone className="size-4 text-muted-foreground" aria-hidden="true" />

          <span>{owner.phone}</span>
        </a>
      ) : (
        <p className="mt-5 text-sm text-muted-foreground">
          Contact details are not available.
        </p>
      )}
    </section>
  );
}
