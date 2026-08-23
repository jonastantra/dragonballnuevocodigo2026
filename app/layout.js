import { Inter } from "next/font/google";
import "./globals.css";
import Script from "next/script";
import { generateOrganizationSchema, generateWebSiteSchema, siteUrl } from "@/lib/site";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Ver Dragon Ball Online en Español Latino HD - Todas las Sagas Completas",
    template: "%s | Dragon Ball HD Sin Limites",
  },
  description:
    "Ver todos los capítulos de Dragon Ball, Dragon Ball Z, Dragon Ball Super, GT, Kai y películas completas online en audio latino y calidad HD en Dragon Ball HD Sin Límites.",
  keywords: [
    "Dragon Ball",
    "Dragon Ball Z",
    "Dragon Ball Super",
    "Dragon Ball GT",
    "Dragon Ball Kai",
    "Dragon Ball Latino",
    "ver Dragon Ball online",
    "capitulos completos Dragon Ball",
    "anime online HD",
    "Dragon Ball sin censura",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "es_MX",
    url: siteUrl,
    siteName: "Dragon Ball HD Sin Limites",
    title: "Dragon Ball HD Sin Limites - Ver todos los episodios",
    description:
      "Todos los episodios de Dragon Ball en una experiencia estatica, veloz y lista para moviles.",
    images: [
      {
        url: `${siteUrl}/og-image.webp`,
        width: 1200,
        height: 630,
        alt: "Dragon Ball HD Sin Límites - Ver Capítulos Completos Online en Audio Latino HD",
        type: "image/webp",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Dragon Ball HD Sin Limites - Ver todos los episodios",
    description: "Todos los capitulos de Dragon Ball online en modo streaming.",
    images: [`${siteUrl}/og-image.webp`],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

export const viewport = {
  themeColor: "#080808",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }) {
  // Global Structured Data (JSON-LD): "@type": "WebSite", "@type": "Organization", "SearchAction"
  const websiteSchema = generateWebSiteSchema();
  const organizationSchema = generateOrganizationSchema();

  return (
    <html lang="es" className={inter.variable}>
      <head>
        <link rel="preconnect" href="https://pagead2.googlesyndication.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://www.googletagmanager.com" />
      </head>
      <body className={inter.className}>
        <Script id="gtm" strategy="afterInteractive">
          {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-TSPLMFD');`}
        </Script>
        <Script
          id="adsense"
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4380860154184351"
          crossOrigin="anonymous"
          strategy="lazyOnload"
        />
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-TSPLMFD"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
            title="Google Tag Manager"
          />
        </noscript>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        {children}
      </body>
    </html>
  );
}
