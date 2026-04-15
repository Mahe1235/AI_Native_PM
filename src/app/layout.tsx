import type { Metadata } from "next";
import { DM_Serif_Display, IBM_Plex_Sans, IBM_Plex_Mono } from "next/font/google";
import { getAllModules } from "@/lib/modules";
import { Nav } from "@/components/layout/Nav";
import { Footer } from "@/components/layout/Footer";
import { AnchorScrollFix } from "@/components/layout/AnchorScrollFix";
import "./globals.css";

const dmSerifDisplay = DM_Serif_Display({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal", "italic"],
});

const ibmPlexSans = IBM_Plex_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
});

const ibmPlexMono = IBM_Plex_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export async function generateMetadata(): Promise<Metadata> {
  const modules = getAllModules();
  return {
    title: "The AI-Native PM",
    description:
      "A self-paced curriculum to take product managers from 'I use Claude sometimes' to 'AI is how I work.'",
    openGraph: {
      title: "The AI-Native PM",
      description: `${modules.length} modules. Real workflows. AI as your PM superpower.`,
      type: "website",
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const modules = getAllModules();

  return (
    <html
      lang="en"
      className={`${dmSerifDisplay.variable} ${ibmPlexSans.variable} ${ibmPlexMono.variable}`}
    >
      <body>
        <AnchorScrollFix />
        <Nav modules={modules} />
        <main>{children}</main>
        <Footer moduleCount={modules.length} />
      </body>
    </html>
  );
}
