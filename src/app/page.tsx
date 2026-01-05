"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Zap,
  Shield,
  Users,
  Building2,
  FileText,
  Coins,
  Layers,
  ExternalLink,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ASSET_TYPES } from "@/lib/utils";

const fadeInUp = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const features = [
  {
    icon: Sparkles,
    title: "No-Code Asset Creation",
    description: "Create tokenized assets with our intuitive wizard. No Solidity knowledge required.",
  },
  {
    icon: Zap,
    title: "One-Click Deployment",
    description: "Deploy your RWA token to Mantle with a single click. Fast, secure, and gas-efficient.",
  },
  {
    icon: Shield,
    title: "Audited Templates",
    description: "Built on battle-tested OpenZeppelin contracts with compliance features built-in.",
  },
  {
    icon: Users,
    title: "Community Showcase",
    description: "Share your assets, discover others, and build reputation in the RWA ecosystem.",
  },
];

const assetTemplates = [
  {
    ...ASSET_TYPES.REAL_ESTATE,
    Icon: Building2,
  },
  {
    ...ASSET_TYPES.BOND,
    Icon: Coins,
  },
  {
    ...ASSET_TYPES.INVOICE,
    Icon: FileText,
  },
  {
    ...ASSET_TYPES.CUSTOM,
    Icon: Layers,
  },
];

const stats = [
  { value: "0", label: "Assets Created", suffix: "" },
  { value: "<1", label: "Avg. Deploy Time", suffix: "min" },
  { value: "Low", label: "Gas Costs", suffix: "" },
  { value: "24/7", label: "Network Uptime", suffix: "" },
];

const steps = [
  { step: 1, title: "Connect Wallet", description: "Link your MetaMask or WalletConnect wallet" },
  { step: 2, title: "Choose Template", description: "Select from Real Estate, Bond, Invoice, or Custom" },
  { step: 3, title: "Configure Asset", description: "Set tokenomics, compliance, and metadata" },
  { step: 4, title: "Deploy to Mantle", description: "One-click deployment to Mantle blockchain" },
];

export default function HomePage() {
  return (
    <div className="relative">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center pt-16">
        <div className="relative w-full max-w-5xl mx-auto px-6 lg:px-8 py-24">
          <motion.div
            initial="initial"
            animate="animate"
            variants={staggerContainer}
            className="flex flex-col items-center text-center"
          >
            {/* Badge */}
            <motion.div variants={fadeInUp} className="mb-8">
              <Badge variant="default">
                Built for Mantle Global Hackathon 2025
              </Badge>
            </motion.div>

            {/* Headline */}
            <motion.h1
              variants={fadeInUp}
              className="text-5xl md:text-6xl lg:text-7xl font-semibold text-white mb-6 tracking-tight leading-[1.1]"
            >
              Tokenize Real-World
              <br />
              <span className="text-neutral-400">Assets in Minutes</span>
            </motion.h1>

            {/* Subheadline */}
            <motion.p
              variants={fadeInUp}
              className="text-lg md:text-xl text-neutral-400 max-w-xl mx-auto mb-12 leading-relaxed"
            >
              The no-code platform for creating, deploying, and sharing tokenized assets on Mantle.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              variants={fadeInUp}
              className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20"
            >
              <Link href="/create">
                <Button variant="primary" size="lg" className="group min-w-[180px]">
                  Start Creating
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </Button>
              </Link>
              <Link href="/showcase">
                <Button variant="secondary" size="lg" className="min-w-[180px]">
                  Explore Showcase
                </Button>
              </Link>
            </motion.div>

            {/* Stats */}
            <motion.div
              variants={fadeInUp}
              className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-16 pt-12 border-t border-neutral-800"
            >
              {stats.map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="text-2xl md:text-3xl font-semibold text-white mb-1">
                    {stat.value}
                    {stat.suffix && <span className="text-neutral-500 text-lg ml-1">{stat.suffix}</span>}
                  </div>
                  <div className="text-xs text-neutral-500 uppercase tracking-wide">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 lg:py-32">
        <div className="max-w-5xl mx-auto px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <Badge variant="default" className="mb-6">Features</Badge>
            <h2 className="text-3xl md:text-4xl font-semibold text-white mb-4 tracking-tight">
              Everything you need to tokenize RWA
            </h2>
            <p className="text-neutral-400 max-w-lg mx-auto">
              All the tools necessary to create, deploy, and manage tokenized real-world assets without writing code.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-5">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
              >
                <Card variant="default" hover className="h-full p-7">
                  <CardHeader className="p-0 pb-4">
                    <div className="w-11 h-11 rounded-xl bg-neutral-800 flex items-center justify-center mb-4">
                      <feature.icon className="h-5 w-5 text-neutral-400" />
                    </div>
                    <CardTitle className="text-base">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <CardDescription>{feature.description}</CardDescription>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Asset Templates Section */}
      <section className="py-24 lg:py-32 bg-neutral-900/50">
        <div className="max-w-5xl mx-auto px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <Badge variant="default" className="mb-6">Templates</Badge>
            <h2 className="text-3xl md:text-4xl font-semibold text-white mb-4 tracking-tight">
              Pre-built templates for every asset type
            </h2>
            <p className="text-neutral-400 max-w-lg mx-auto">
              Choose from our library of audited smart contract templates designed for specific real-world asset classes.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {assetTemplates.map((template, index) => (
              <motion.div
                key={template.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
              >
                <Link href={`/create?type=${template.id}`}>
                  <Card variant="default" hover className="h-full group p-6">
                    <CardContent className="p-0">
                      <div className="w-11 h-11 rounded-xl bg-neutral-800 flex items-center justify-center mb-4 group-hover:bg-neutral-700 transition-colors">
                        <template.Icon className="h-5 w-5 text-neutral-400" />
                      </div>
                      <h3 className="text-sm font-medium text-white mb-2">{template.name}</h3>
                      <p className="text-xs text-neutral-500 leading-relaxed">{template.description}</p>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="py-24 lg:py-32">
        <div className="max-w-5xl mx-auto px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <Badge variant="default" className="mb-6">How it Works</Badge>
            <h2 className="text-3xl md:text-4xl font-semibold text-white mb-4 tracking-tight">
              From idea to deployed token in 4 steps
            </h2>
            <p className="text-neutral-400 max-w-lg mx-auto">
              Our streamlined process makes tokenization accessible to everyone.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {steps.map((step, index) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
              >
                <Card variant="default" className="h-full p-6">
                  <CardContent className="p-0">
                    <div className="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center font-semibold text-sm mb-4">
                      {step.step}
                    </div>
                    <h3 className="text-sm font-medium text-white mb-2">{step.title}</h3>
                    <p className="text-xs text-neutral-500 leading-relaxed">{step.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Mantle Integration Section */}
      <section className="py-24 lg:py-32 bg-neutral-900/50">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="bg-neutral-900 rounded-3xl py-16 px-8 text-center">
              <Badge variant="default" className="mb-6">Powered by Mantle</Badge>
              <h2 className="text-2xl md:text-3xl font-semibold text-white mb-4 tracking-tight">
                Built for the Future of Finance
              </h2>
              <p className="text-neutral-400 mb-10 max-w-lg mx-auto">
                Asset Forge leverages Mantle&apos;s high-performance Layer 2 network to provide
                lightning-fast transactions with minimal gas costs.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <a
                  href="https://www.mantle.xyz"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button variant="secondary" size="md">
                    Learn About Mantle
                    <ExternalLink className="h-3.5 w-3.5" />
                  </Button>
                </a>
                <a
                  href="https://www.mantle.xyz/faucet"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button variant="outline" size="md">
                    Get Testnet Tokens
                    <ExternalLink className="h-3.5 w-3.5" />
                  </Button>
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 lg:py-32">
        <div className="max-w-3xl mx-auto px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <h2 className="text-3xl md:text-4xl font-semibold text-white mb-4 tracking-tight">
              Ready to Create Your First Asset?
            </h2>
            <p className="text-neutral-400 max-w-md mx-auto mb-10">
              Join the future of tokenized real-world assets. Start building on Mantle today.
            </p>
            <Link href="/create">
              <Button variant="primary" size="xl" className="group">
                Launch Asset Creator
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
