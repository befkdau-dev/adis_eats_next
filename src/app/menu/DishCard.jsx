import Image from "next/image";
import Link from "next/link";

export default function DishCard({ dish, priority = false }) {
  return (
    <article className="overflow-hidden rounded-xl border border-[#e6e5dc] bg-white">
      <Link href={`/menu/${dish.slug}`}>
        <Image
          src={dish.image}
          alt={dish.imageAlt || `${dish.name} — Ethiopian dish`}
          width={800}
          height={600}
          sizes="(max-width: 639px) 100vw, (max-width: 1023px) 50vw, 33vw"
          priority={priority}
          className="h-52 w-full object-cover"
        />
        <div className="p-4">
          <h2 className="font-semibold">{dish.name}</h2>
          <p>{dish.description}</p>
          <p className="mt-2 font-bold">{dish.price} ETB</p>
        </div>
      </Link>
    </article>
  );
}
