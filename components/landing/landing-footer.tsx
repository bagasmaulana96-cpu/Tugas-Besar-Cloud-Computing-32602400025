import Link from "next/link";

export default function LandingFooter() {
  return (
    <footer className="border-t border-bg-border px-4 md:px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-3">
      <p className="text-text-muted text-xs font-mono text-center sm:text-left">
        © 2024 LEVEL UP PROJECT. ALL SYSTEMS OPERATIONAL.
      </p>
      <div className="flex items-center gap-6">
        <Link
          href="#"
          className="text-text-muted text-xs uppercase tracking-wide hover:text-text-secondary transition-colors duration-150"
        >
          Privacy
        </Link>
        <Link
          href="#"
          className="text-text-muted text-xs uppercase tracking-wide hover:text-text-secondary transition-colors duration-150"
        >
          Terms
        </Link>
        <Link
          href="#"
          className="text-text-muted text-xs uppercase tracking-wide hover:text-text-secondary transition-colors duration-150"
        >
          Contact
        </Link>
      </div>
    </footer>
  );
}
