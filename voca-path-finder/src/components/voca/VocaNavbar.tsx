// src/components/voca/VocaNavbar.tsx
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

interface VocaNavbarProps {
  variant?: "public" | "authenticated";
}

function getInitials(name: string | null): string {
  if (!name) return "U";
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function VocaNavbar({ variant = "public" }: VocaNavbarProps) {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const isAuth = variant === "authenticated" || !!user;

  return (
    <nav className="fixed top-0 w-full nav-bg border-b border-white/[0.07] z-50">
      <div className="flex justify-between items-center h-16 px-6 md:px-12 max-w-[1440px] mx-auto w-full">
        <Link
          to={isAuth ? "/dashboard" : "/"}
          className="text-[24px] font-headline font-semibold text-[#e8e9ec] tracking-tight"
        >
          VOCA
        </Link>

        {isAuth && user ? (
          <div className="flex items-center gap-4">
            <Link
              to="/dashboard"
              className="text-[#8b95a7] font-body text-sm hover:text-[#e1e2e8] transition-colors hidden md:block"
            >
              Dashboard
            </Link>
            <Link
              to="/results"
              className="text-[#8b95a7] font-body text-sm hover:text-[#e1e2e8] transition-colors hidden md:block"
            >
              Results
            </Link>
            <button
              onClick={handleSignOut}
              className="text-[#8b95a7] font-body text-sm hover:text-[#e1e2e8] transition-colors min-h-[44px] flex items-center"
            >
              Sign out
            </button>
            <div className="w-10 h-10 rounded-full bg-[#171c24] border border-white/[0.08] flex items-center justify-center text-white font-headline font-semibold text-sm">
              {getInitials(user.displayName)}
            </div>
          </div>
        ) : (
          <div className="flex gap-6 items-center">
            <div className="hidden md:flex gap-10 items-center">
              <a href="#product" className="font-body text-[14px] text-[#7e8494] hover:text-[#e1e2e8] transition-colors">
                Product
              </a>
              <a href="#why" className="font-body text-[14px] text-[#7e8494] hover:text-[#e1e2e8] transition-colors">
                Why VOCA
              </a>
              <a href="#privacy" className="font-body text-[14px] text-[#7e8494] hover:text-[#e1e2e8] transition-colors">
                Privacy
              </a>
            </div>
            <Link
              to="/auth"
              className="text-[#7e8494] hover:text-[#e1e2e8] transition-colors font-body text-[14px]"
            >
              Sign in
            </Link>
            <Link
              to="/auth"
              className="primary-cta px-6 py-2.5 rounded-full font-body text-[14px] font-semibold hover:opacity-90 active:scale-95 transition-all"
            >
              Get started
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
