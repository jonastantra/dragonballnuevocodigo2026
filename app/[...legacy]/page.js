import CategoryView from "@/components/CategoryView";
import UtilityPage from "@/components/UtilityPage";
import {
  categoryAliases,
  categoryPages,
  findCategoryByPath,
  findLegacyPageByPath,
  findUtilityByPath,
  getCategoryBreadcrumbSchema,
  getCategoryCapitulos,
  getCategoryDescription,
  getCategoryFaqSchema,
  getCategoryTitle,
  getCollectionPageSchema,
  getUtilityBreadcrumbSchema,
  pathToSegments,
  siteUrl,
  utilityPages,
} from "@/lib/site";
import { notFound } from "next/navigation";

export const dynamic = "force-static";
export const dynamicParams = false;

function paramsToPath(params) {
  return `/${(params.legacy || []).join("/")}/`;
}

export function generateStaticParams() {
  const paths = new Set();

  for (const category of categoryPages) {
    if (category.path) {
      paths.add(category.path);
    }
  }

  for (const alias of categoryAliases) {
    if (alias.path) {
      paths.add(alias.path);
    }
  }

  for (const page of utilityPages) {
    if (page.path) {
      paths.add(page.path);
    }
  }

  return [...paths]
    .filter((path) => path && path !== "/" && !path.startsWith("/buscar") && !path.startsWith("/capitulo/"))
    .map((path) => ({ legacy: pathToSegments(path) }));
}

export async function generateMetadata({ params }) {
  const path = paramsToPath(await params);

  const category = findCategoryByPath(path);
  if (category) {
    const canonicalPath = category.canonical || category.canonicalPath || category.path;
    const fullCanonicalUrl = `${siteUrl}${canonicalPath}`;
    const title = getCategoryTitle(category);
    const description = getCategoryDescription(category);
    return {
      title,
      description,
      alternates: {
        canonical: canonicalPath,
      },
      openGraph: {
        type: "website",
        url: fullCanonicalUrl,
        title,
        description,
        siteName: "Dragon Ball HD Sin Limites",
        images: [`${siteUrl}/og-image.webp`],
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
        images: [`${siteUrl}/og-image.webp`],
      },
    };
  }

  const utility = findUtilityByPath(path);
  if (utility) {
    const canonicalPath = utility.canonical || utility.path;
    const fullCanonicalUrl = `${siteUrl}${canonicalPath}`;
    return {
      title: utility.title,
      description: utility.description || undefined,
      alternates: {
        canonical: canonicalPath,
      },
      openGraph: {
        type: "website",
        url: fullCanonicalUrl,
        title: utility.title,
        description: utility.description || undefined,
        siteName: "Dragon Ball HD Sin Limites",
      },
      robots: utility.path === "/blog/" ? { index: true, follow: true } : { index: false, follow: true },
    };
  }

  const legacyPage = findLegacyPageByPath(path);
  if (legacyPage) {
    const canonicalPath = legacyPage.canonical || legacyPage.path;
    const fullCanonicalUrl = `${siteUrl}${canonicalPath}`;
    return {
      title: legacyPage.title,
      description: legacyPage.description,
      alternates: {
        canonical: canonicalPath,
      },
      openGraph: {
        type: "website",
        url: fullCanonicalUrl,
        title: legacyPage.title,
        description: legacyPage.description,
        siteName: "Dragon Ball HD Sin Limites",
      },
    };
  }

  return {
    title: "Pagina no encontrada",
    robots: { index: false, follow: false },
  };
}

export default async function LegacyPage({ params }) {
  const path = paramsToPath(await params);

  const category = findCategoryByPath(path);
  if (category) {
    const categoryCapitulos = getCategoryCapitulos(category);
    const breadcrumbSchema = getCategoryBreadcrumbSchema(category);
    const collectionSchema = getCollectionPageSchema(category, categoryCapitulos);
    const faqSchema = getCategoryFaqSchema(category);

    return (
      <>
        {breadcrumbSchema && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
          />
        )}
        {collectionSchema && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }}
          />
        )}
        {faqSchema && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
          />
        )}
        <CategoryView category={category} capitulos={categoryCapitulos} />
      </>
    );
  }

  const utility = findUtilityByPath(path);
  if (utility) {
    const breadcrumbSchema = getUtilityBreadcrumbSchema(utility);
    return (
      <>
        {breadcrumbSchema && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
          />
        )}
        <UtilityPage page={utility} />
      </>
    );
  }

  const legacyPage = findLegacyPageByPath(path);
  if (legacyPage) {
    const breadcrumbSchema = getUtilityBreadcrumbSchema(legacyPage);
    return (
      <>
        {breadcrumbSchema && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
          />
        )}
        <UtilityPage page={legacyPage} />
      </>
    );
  }

  notFound();
}
