'use client';

import Script from 'next/script';
import { assetUrl } from '@/lib/assetUrl';

export default function LandingScripts() {
  return (
    <Script src={assetUrl('/js/main.js')} type="module" strategy="afterInteractive" />
  );
}
