"use client";

import Link from "next/link";
import { Github, Twitter, ExternalLink } from "lucide-react";

const footerLinks = {
  product: [
    { name: "Create Asset", href: "/create" },
    { name: "Dashboard", href: "/dashboard" },
    { name: "Showcase", href: "/showcase" },
  ],
  resources: [
    { name: "Documentation", href: "/docs" },
    { name: "Smart Contracts", href: "https://github.com" },
    { name: "Mantle Network", href: "https://mantle.xyz", external: true },
  ],
  legal: [
    { name: "Terms", href: "/terms" },
    { name: "Privacy", href: "/privacy" },
  ],
};

export function Footer() {
  return (
    <footer className="border-t border-border bg-muted/30">
      <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-12 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12 lg:gap-16">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
                <span className="text-xl font-bold text-white">AF</span>
              </div>
              <span className="text-xl font-bold">Asset Forge</span>
            </Link>
            <p className="text-base text-muted-foreground leading-relaxed mb-6">
              The no-code platform for tokenizing real-world assets on Mantle.
            </p>
            <div className="flex items-center gap-4">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 rounded-xl bg-muted hover:bg-muted/80 transition-colors"
              >
                <Github className="h-5 w-5 text-muted-foreground" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 rounded-xl bg-muted hover:bg-muted/80 transition-colors"
              >
                <Twitter className="h-5 w-5 text-muted-foreground" />
              </a>
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h4 className="text-base font-semibold mb-6">Product</h4>
            <ul className="space-y-4">
              {footerLinks.product.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-base text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources Links */}
          <div>
            <h4 className="text-base font-semibold mb-6">Resources</h4>
            <ul className="space-y-4">
              {footerLinks.resources.map((link) => (
                <li key={link.name}>
                  {link.external ? (
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-base text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link.name}
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  ) : (
                    <Link
                      href={link.href}
                      className="text-base text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link.name}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h4 className="text-base font-semibold mb-6">Legal</h4>
            <ul className="space-y-4">
              {footerLinks.legal.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-base text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-16 pt-10 border-t border-border">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <p className="text-base text-muted-foreground">
              © 2026 Asset Forge. All rights reserved.
            </p>
            <a
              href="https://mantle.xyz"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-base text-muted-foreground hover:text-foreground transition-colors"
            >
              <span>Powered by</span>
              <span className="font-semibold">Mantle</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
