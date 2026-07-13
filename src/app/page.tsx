import type { Metadata } from 'next';
import { siteConfig } from '@/config/site';
import { getAllBlogs } from '@/lib/blogs';
import SiteHeader from '@/components/SiteHeader';
import HeroSection from '@/components/HeroSection';
import HowMelleaSection from '@/components/HowMelleaSection';
import FutureSoftwareSection from '@/components/FutureSoftwareSection';
import GraniteSection from '@/components/GraniteSection';
import BlogSection from '@/components/BlogSection';
import SiteFooter from '@/components/SiteFooter';
import CursorToggle from '@/components/CursorToggle';
import LandingScripts from '@/components/LandingScripts';

export const metadata: Metadata = {
  title: 'Mellea - Control LLMs with code',
  description: siteConfig.description,
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    siteName: siteConfig.name,
    title: 'Mellea - Control LLMs with code',
    description: siteConfig.description,
    url: siteConfig.url,
    images: [{ url: siteConfig.ogImage }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Mellea - Control LLMs with code',
    description: siteConfig.description,
    images: [siteConfig.ogImage],
  },
};

export default function HomePage() {
  const recent = getAllBlogs().slice(0, 3);

  return (
    <>
      <div id="cursor-sprite" className="cursor-sprite" aria-hidden="true" />
      <SiteHeader />
      <HeroSection />
      <HowMelleaSection />
      <FutureSoftwareSection />
      <GraniteSection />
      <BlogSection blogs={recent} />
      <SiteFooter showCta />
      <CursorToggle />
      <LandingScripts />
    </>
  );
}
