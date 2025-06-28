import { useState } from "react";
import { Link } from "wouter";
import { Feather as FeatherIcon, Menu as MenuIcon, X as CloseIcon } from "lucide-react";
import { Container } from "@/components/ui/container";
import { useAuth } from "@/hooks/use-auth";

export function Header() {
  const { user, logoutMutation } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);

  return (
    <header className="fixed top-0 inset-x-0 z-50 bg-black bg-opacity-50 backdrop-blur-md">
      <Container className="flex items-center justify-between py-4">
        <Link href="/" className="flex items-center">
          <FeatherIcon className="h-8 w-8 text-accent" />
          <span className="sr-only">Featherweight AI</span>
        </Link>
        <nav className="hidden md:flex space-x-8">
          <Link href="/features" className="text-offwhite hover:text-accent transition">
            Features
          </Link>
          <Link href="/pricing" className="text-offwhite hover:text-accent transition">
            Pricing
          </Link>
          <Link href="/about" className="text-offwhite hover:text-accent transition">
            About
          </Link>
        </nav>
        <div className="hidden md:flex items-center space-x-4">
          {user ? (
            <>
              <Link href="/journal" className="text-offwhite hover:text-accent transition">
                Journal
              </Link>
              <button
                onClick={() => logoutMutation.mutate()}
                className="px-4 py-2 bg-accent text-black rounded-lg hover:bg-opacity-80 transition"
              >
                Sign Out
              </button>
            </>
          ) : (
            <>
              <Link href="/auth/login" className="text-offwhite hover:text-accent transition">
                Sign In
              </Link>
              <Link
                href="/auth/signup"
                className="px-4 py-2 bg-accent text-black rounded-lg hover:bg-opacity-80 transition"
              >
                Get Started
              </Link>
            </>
          )}
        </div>
        <button
          className="md:hidden text-offwhite hover:text-accent transition"
          onClick={toggleMobileMenu}
          aria-label="Toggle navigation"
        >
          {mobileMenuOpen ? <CloseIcon className="h-6 w-6" /> : <MenuIcon className="h-6 w-6" />}
        </button>
      </Container>
      {mobileMenuOpen && (
        <div className="md:hidden bg-black bg-opacity-90 backdrop-blur-md">
          <Container className="py-4 flex flex-col space-y-4">
            <Link href="/features" className="text-offwhite hover:text-accent transition">
              Features
            </Link>
            <Link href="/pricing" className="text-offwhite hover:text-accent transition">
              Pricing
            </Link>
            <Link href="/about" className="text-offwhite hover:text-accent transition">
              About
            </Link>
            {user ? (
              <>
                <Link href="/journal" className="text-offwhite hover:text-accent transition">
                  Journal
                </Link>
                <button
                  onClick={() => logoutMutation.mutate()}
                  className="px-4 py-2 bg-accent text-black rounded-lg hover:bg-opacity-80 transition"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link href="/auth/login" className="text-offwhite hover:text-accent transition">
                  Sign In
                </Link>
                <Link
                  href="/auth/signup"
                  className="px-4 py-2 bg-accent text-black rounded-lg hover:bg-opacity-80 transition"
                >
                  Get Started
                </Link>
              </>
            )}
          </Container>
        </div>
      )}
    </header>
  );
}