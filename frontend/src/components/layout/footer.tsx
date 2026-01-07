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
    <footer className="border-t border-neutral-800">
      <div className="max-w-6xl mx-auto px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 lg:gap-16">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2.5 mb-5">
              <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center">
                <span className="text-xs font-bold text-black">AF</span>
              </div>
              <span className="text-sm font-semibold text-white tracking-tight">Asset Forge</span>
            </Link>
            <p className="text-sm text-neutral-500 mb-6 leading-relaxed">
              The no-code platform for tokenizing real-world assets on Mantle.
            </p>
            <div className="flex items-center gap-2">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 transition-colors"
              >
                <Github className="h-4 w-4 text-neutral-400" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 transition-colors"
              >
                <Twitter className="h-4 w-4 text-neutral-400" />
              </a>
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h4 className="text-xs font-medium text-neutral-400 uppercase tracking-wide mb-4">Product</h4>
            <ul className="space-y-3">
              {footerLinks.product.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-neutral-500 hover:text-white transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources Links */}
          <div>
            <h4 className="text-xs font-medium text-neutral-400 uppercase tracking-wide mb-4">Resources</h4>
            <ul className="space-y-3">
              {footerLinks.resources.map((link) => (
                <li key={link.name}>
                  {link.external ? (
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-sm text-neutral-500 hover:text-white transition-colors"
                    >
                      {link.name}
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  ) : (
                    <Link
                      href={link.href}
                      className="text-sm text-neutral-500 hover:text-white transition-colors"
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
            <h4 className="text-xs font-medium text-neutral-400 uppercase tracking-wide mb-4">Legal</h4>
            <ul className="space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-neutral-500 hover:text-white transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-12 pt-8 border-t border-neutral-800">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-neutral-500">
              © 2026 Asset Forge. All rights reserved.
            </p>
            <a
              href="https://mantle.xyz"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs text-neutral-500 hover:text-white transition-colors"
            >
              <span>Powered by</span>
              <span className="font-medium">Mantle</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
