// src/components/voca/VocaFooter.tsx
import { Link } from "react-router-dom";

interface VocaFooterProps {
  variant?: "public" | "authenticated";
}

export function VocaFooter({ variant = "public" }: VocaFooterProps) {
  const isAuth = variant === "authenticated";

  const publicLinks = [
    { label: "Privacy", href: "#privacy", isExternal: false },
    { label: "Terms", href: "#terms", isExternal: false },
    { label: "Contact", href: "#contact", isExternal: false },
    { label: "Careers", href: "#careers", isExternal: false },
  ];

  const authLinks = [
    { label: "Dashboard", href: "/dashboard", isExternal: false },
    { label: "Results", href: "/results", isExternal: false },
    { label: "Profile", href: "/profile", isExternal: false },
    { label: "Settings", href: "/settings", isExternal: false },
  ];

  const links = isAuth ? authLinks : publicLinks;

  return (
    <footer
      className="border-t px-6 md:px-12 py-10"
      style={{
        borderColor: "rgba(255,255,255,0.06)",
        backgroundColor: "#0b0e12",
      }}
    >
      <div className="max-w-[1440px] mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Logo and Copyright */}
        <div className="flex items-center gap-4">
          <Link
            to={isAuth ? "/dashboard" : "/"}
            className="text-[20px] font-headline font-semibold tracking-tight"
            style={{ color: "#e8e9ec", textDecoration: "none" }}
          >
            VOCA
          </Link>
          <span
            className="font-body text-xs hidden md:inline"
            style={{ color: "rgba(139, 149, 167, 0.4)" }}
          >
            © {new Date().getFullYear()} VOCA. All rights reserved.
          </span>
        </div>

        {/* Links */}
        <nav className="flex flex-wrap gap-6 justify-center">
          {links.map((link) =>
            link.href.startsWith("#") ? (
              <a
                key={link.label}
                href={link.href}
                onClick={(e) => e.preventDefault()}
                className="font-body text-[13px] transition-colors"
                style={{ color: "#8b95a7" }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.color = "#e1e2e8";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.color = "#8b95a7";
                }}
              >
                {link.label}
              </a>
            ) : (
              <Link
                key={link.label}
                to={link.href}
                className="font-body text-[13px] transition-colors"
                style={{ color: "#8b95a7" }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.color = "#e1e2e8";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.color = "#8b95a7";
                }}
              >
                {link.label}
              </Link>
            )
          )}
        </nav>

        {/* Mobile Copyright */}
        <span
          className="font-body text-[11px] md:hidden"
          style={{ color: "rgba(139, 149, 167, 0.4)" }}
        >
          © {new Date().getFullYear()} VOCA. All rights reserved.
        </span>
      </div>
    </footer>
  );
}
