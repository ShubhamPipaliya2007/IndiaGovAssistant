import React, { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import {
  Search,
  Globe,
  Menu,
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";

const Header: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="flex items-center">
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/5/55/Emblem_of_India.svg"
              alt="Emblem of India"
              className="h-12 w-auto"
            />
            <div className="ml-3 border-l-2 border-border pl-3">
              <h1 className="font-['Poppins'] font-bold text-xl md:text-2xl text-primary">
                E-Governance
              </h1>
              <p className="text-xs text-muted-foreground">Government of India</p>
            </div>
          </div>
        </div>

        <div className="hidden md:flex items-center space-x-6">
          <Link href="/">
            <a className="font-['Poppins'] text-sm font-medium hover:text-primary transition-colors">
              Home
            </a>
          </Link>
          <Link href="/services">
            <a className="font-['Poppins'] text-sm font-medium hover:text-primary transition-colors">
              Services
            </a>
          </Link>
          <Link href="/initiatives">
            <a className="font-['Poppins'] text-sm font-medium hover:text-primary transition-colors">
              Initiatives
            </a>
          </Link>
          <Link href="/contact">
            <a className="font-['Poppins'] text-sm font-medium hover:text-primary transition-colors">
              Contact
            </a>
          </Link>
        </div>

        <div className="flex items-center">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <nav className="flex flex-col gap-4 mt-8">
                <Link href="/">
                  <a className="font-['Poppins'] text-sm font-medium hover:text-primary transition-colors">
                    Home
                  </a>
                </Link>
                <Link href="/services">
                  <a className="font-['Poppins'] text-sm font-medium hover:text-primary transition-colors">
                    Services
                  </a>
                </Link>
                <Link href="/initiatives">
                  <a className="font-['Poppins'] text-sm font-medium hover:text-primary transition-colors">
                    Initiatives
                  </a>
                </Link>
                <Link href="/contact">
                  <a className="font-['Poppins'] text-sm font-medium hover:text-primary transition-colors">
                    Contact
                  </a>
                </Link>
                <div className="border-t border-border pt-4 mt-2">
                  <Button className="w-full border border-primary text-primary bg-background hover:bg-primary hover:text-primary-foreground">
                    Login
                  </Button>
                </div>
              </nav>
            </SheetContent>
          </Sheet>

          <div className="hidden md:flex items-center space-x-2">
            <Button
              className="border border-primary text-primary bg-background hover:bg-primary hover:text-primary-foreground font-['Poppins'] text-sm font-medium"
            >
              Login
            </Button>
            <div className="w-px h-6 bg-border"></div>
            <div className="flex space-x-2">
              <Button variant="ghost" size="icon" className="text-foreground hover:text-primary">
                <Search className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="text-foreground hover:text-primary">
                <Globe className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Tricolor strip */}
      <div className="flex h-1">
        <div className="w-1/3 bg-[#FF9933]"></div>
        <div className="w-1/3 bg-background"></div>
        <div className="w-1/3 bg-[#138808]"></div>
      </div>
    </header>
  );
};

export default Header;