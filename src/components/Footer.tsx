import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <span className="footer-brand">© {new Date().getFullYear()} Mellea — Apache 2.0</span>
        <nav className="footer-links">
          <Link href="/blogs">Blog</Link>
          <Link href="https://github.com/generative-computing/mellea" target="_blank" rel="noopener noreferrer">GitHub</Link>
          {/* <Link href="https://discord.com" target="_blank" rel="noopener noreferrer">Discord</Link>
          <Link href="https://twitter.com" target="_blank" rel="noopener noreferrer">Twitter</Link> */}
        </nav>
      </div>
    </footer>
  );
}
