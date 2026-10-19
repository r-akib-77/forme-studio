import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { CatalogView } from "@/components/catalog/CatalogView";
import { getCollection } from "@/lib/data/collections";
import { getCollectionProducts } from "@/lib/filters";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const { collections } = await import("@/lib/data/collections");
  return collections.map((collection) => ({ slug: collection.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const collection = getCollection(slug);
  if (!collection) {
    return { title: "Collection not found" };
  }
  return {
    title: collection.title,
    description: collection.description,
    openGraph: {
      title: `${collection.title} | FORME STUDIO`,
      description: collection.description,
      images: [{ url: collection.image }],
    },
  };
}

export default async function CollectionPage({ params }: PageProps) {
  const { slug } = await params;
  const collection = getCollection(slug);
  if (!collection) notFound();

  const products = getCollectionProducts(collection);

  return (
    <CatalogView
      products={products}
      title={collection.title}
      eyebrow={collection.eyebrow}
      description={collection.description}
    />
  );
}
