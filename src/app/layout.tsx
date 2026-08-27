import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { MobileStickyBar } from "@/components/layout/MobileStickyBar";
import { EnquiryModalProvider } from "@/context/EnquiryModalContext";
import { EnquiryModal } from "@/components/enquiry/EnquiryModal";
import { constructMetadata, getLocalBusinessSchema } from "@/lib/seo";
import { getBrandingSettingsAction } from "@/actions/brandingActions";

export const metadata: Metadata = constructMetadata();

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [jsonLd, branding] = await Promise.all([
    Promise.resolve(getLocalBusinessSchema()),
    getBrandingSettingsAction(),
  ]);

  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="flex flex-col min-h-screen">
        <EnquiryModalProvider>
          <Header logoUrl={branding.logoUrl} />
          <main className="flex-grow">{children}</main>
          <Footer logoUrl={branding.logoUrl} />
          <MobileStickyBar />
          <EnquiryModal />
        </EnquiryModalProvider>
      </body>
    </html>
  );
}
