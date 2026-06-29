import type { Metadata } from 'next';
import { siteConfig } from '@/config/site';
import { getAllBlogs } from '@/lib/blogs';
import SiteHeader from '@/components/redesign/SiteHeader';
import HeroSection from '@/components/redesign/HeroSection';
import HowMelleaSection from '@/components/redesign/HowMelleaSection';
import FutureSoftwareSection from '@/components/redesign/FutureSoftwareSection';
import GraniteSection from '@/components/redesign/GraniteSection';
import BlogSection from '@/components/redesign/BlogSection';
import SiteFooter from '@/components/redesign/SiteFooter';
import CursorToggle from '@/components/redesign/CursorToggle';
import LandingScripts from '@/components/redesign/LandingScripts';

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
