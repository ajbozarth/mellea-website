'use client';

import { useEffect } from 'react';
import { siteConfig } from '@/config/site';

function formatStarCount(count: number): string {
  if (count >= 1000) {
    const value = count / 1000;
    return `${value % 1 === 0 ? value.toFixed(0) : value.toFixed(1)}k`;
  }
  return String(count);
}

/** Loads GitHub star count in the header on every page. */
export default function GitHubStarsInit() {
  useEffect(() => {
    const starsEl = document.querySelector('[data-github-stars]');
    const button = document.querySelector('.github-btn');
    if (!starsEl || !button) return;

    fetch(`https://api.github.com/repos/${siteConfig.githubRepo}`)
      .then((response) => {
        if (!response.ok) throw new Error(`GitHub API ${response.status}`);
        return response.json();
      })
      .then((data: { stargazers_count: number }) => {
        starsEl.textContent = formatStarCount(data.stargazers_count);
        starsEl.removeAttribute('aria-hidden');
        button.setAttribute(
          'aria-label',
          `Mellea on GitHub, ${data.stargazers_count} stars`,
        );
      })
      .catch(() => {
        starsEl.textContent = '';
        starsEl.setAttribute('aria-hidden', 'true');
        button.setAttribute('aria-label', 'Mellea on GitHub');
      });
  }, []);

  return null;
}
