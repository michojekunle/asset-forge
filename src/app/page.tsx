"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Sparkles,
  Zap,
  Shield,
  Users,
  Building2,
  FileText,
  Coins,
  Layers,
  CheckCircle2,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ASSET_TYPES } from "@/lib/utils";

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
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
    color: "text-indigo-400",
    bgColor: "bg-indigo-500/10",
  },
  {
    icon: Zap,
    title: "One-Click Deployment",
    description: "Deploy your RWA token to Mantle with a single click. Fast, secure, and gas-efficient.",
    color: "text-purple-400",
    bgColor: "bg-purple-500/10",
  },
  {
    icon: Shield,
    title: "Audited Templates",
    description: "Built on battle-tested OpenZeppelin contracts with compliance features built-in.",
    color: "text-cyan-400",
    bgColor: "bg-cyan-500/10",
  },
  {
    icon: Users,
    title: "Community Showcase",
    description: "Share your assets, discover others, and build reputation in the RWA ecosystem.",
    color: "text-green-400",
    bgColor: "bg-green-500/10",
  },
];

const assetTemplates = [
  {
    ...ASSET_TYPES.REAL_ESTATE,
    gradient: "from-indigo-500 to-purple-500",
    Icon: Building2,
  },
  {
    ...ASSET_TYPES.BOND,
    gradient: "from-purple-500 to-pink-500",
    Icon: Coins,
  },
  {
    ...ASSET_TYPES.INVOICE,
    gradient: "from-cyan-500 to-blue-500",
    Icon: FileText,
  },
  {
    ...ASSET_TYPES.CUSTOM,
    gradient: "from-green-500 to-emerald-500",
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
      <section className="relative overflow-hidden min-h-[85vh] flex items-center">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 left-1/4 w-[400px] h-[400px] bg-indigo-500/10 rounded-full blur-[140px] animate-pulse" />
          <div className="absolute bottom-20 right-1/4 w-[350px] h-[350px] bg-purple-500/10 rounded-full blur-[140px] animate-pulse" style={{ animationDelay: "1s" }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-500/5 rounded-full blur-[160px]" />
        </div>

        <div className="relative w-full max-w-7xl mx-auto px-6 sm:px-8 lg:px-16 py-24 lg:py-32">
          <motion.div
            initial="initial"
            animate="animate"
            variants={staggerContainer}
            className="flex flex-col items-center text-center"
          >
            {/* Badge */}
            <motion.div variants={fadeInUp} className="mb-8">
              <Badge variant="default" className="px-5 py-2 text-sm">
                <Sparkles className="h-4 w-4 mr-2" />
                Built for Mantle Global Hackathon 2025
              </Badge>
            </motion.div>

            {/* Headline */}
            <motion.h1
              variants={fadeInUp}
              className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-10 leading-[1.15]"
            >
              Tokenize{" "}
              <span className="gradient-text-animated">Real-World Assets</span>
              <br />
              in Minutes
            </motion.h1>

            {/* Subheadline */}
            <motion.p
              variants={fadeInUp}
              className="text-lg sm:text-xl text-muted-foreground/90 max-w-2xl mx-auto mb-16 leading-relaxed"
            >
              The no-code platform for creating, deploying, and sharing tokenized assets on Mantle.
              From real estate to invoices — bring any asset on-chain.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              variants={fadeInUp}
              className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-20"
            >
              <Link href="/create">
                <Button variant="primary" size="xl" className="group text-lg px-10 py-4 h-auto">
                  Start Creating
                  <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              <Link href="/showcase">
                <Button variant="secondary" size="xl" className="text-lg px-10 py-4 h-auto">
                  Explore Showcase
                </Button>
              </Link>
            </motion.div>

            {/* Stats */}
            <motion.div
              variants={fadeInUp}
              className="grid grid-cols-2 sm:grid-cols-4 gap-10 lg:gap-20 pt-16 border-t border-border/30"
            >
              {stats.map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="text-3xl sm:text-4xl font-bold text-foreground mb-2">
                    {stat.value}
                    <span className="text-muted-foreground text-xl ml-1">{stat.suffix}</span>
                  </div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-32 lg:py-48 bg-muted/30">
        <div className="max-w-5xl mx-auto px-6 sm:px-8 lg:px-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-24"
          >
            <Badge variant="secondary" className="mb-8">Features</Badge>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-8">
              Everything you need to tokenize RWA
            </h2>
            <p className="text-lg text-muted-foreground/90 max-w-2xl mx-auto leading-relaxed">
              Our platform provides all the tools necessary to create, deploy, and manage
              tokenized real-world assets without writing a single line of code.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 gap-10">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card variant="glass" hover className="h-full p-8">
                  <CardHeader className="p-0 pb-6">
                    <div className={`w-16 h-16 rounded-2xl ${feature.bgColor} flex items-center justify-center mb-6`}>
                      <feature.icon className={`h-8 w-8 ${feature.color}`} />
                    </div>
                    <CardTitle className="text-xl mb-3">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <CardDescription className="text-base leading-relaxed">{feature.description}</CardDescription>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Asset Templates Section */}
      <section className="py-32 lg:py-48">
        <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-24"
          >
            <Badge variant="secondary" className="mb-8">Templates</Badge>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-8">
              Pre-built templates for every asset type
            </h2>
            <p className="text-lg text-muted-foreground/90 max-w-2xl mx-auto leading-relaxed">
              Choose from our library of audited smart contract templates designed for
              specific real-world asset classes.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {assetTemplates.map((template, index) => (
              <motion.div
                key={template.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Link href={`/create?type=${template.id}`}>
                  <Card variant="glass" hover className="h-full group p-6">
                    <CardContent className="p-0">
                      <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${template.gradient} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                        <template.Icon className="h-8 w-8 text-white" />
                      </div>
                      <h3 className="text-lg font-semibold mb-3">{template.name}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">{template.description}</p>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="py-32 lg:py-48 bg-muted/30">
        <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-24"
          >
            <Badge variant="secondary" className="mb-8">How it Works</Badge>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-8">
              From idea to deployed token in 4 steps
            </h2>
            <p className="text-lg text-muted-foreground/90 max-w-2xl mx-auto leading-relaxed">
              Our streamlined process makes tokenization accessible to everyone,
              regardless of technical background.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10">
            {steps.map((step, index) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="relative"
              >
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-10 left-full w-full h-0.5 bg-gradient-to-r from-border to-transparent -ml-4" />
                )}
                <Card variant="default" className="h-full p-8">
                  <CardContent className="p-0">
                    <div className="flex items-center gap-5 mb-6">
                      <div className="w-14 h-14 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-xl flex-shrink-0">
                        {step.step}
                      </div>
                      <CheckCircle2 className="h-6 w-6 text-success ml-auto opacity-0" />
                    </div>
                    <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{step.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Mantle Integration Section */}
      <section className="py-32 lg:py-48">
        <div className="max-w-5xl mx-auto px-6 sm:px-8 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            <Card variant="glow" className="overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-cyan-500/10" />
              <CardContent className="relative py-20 lg:py-24 px-8 lg:px-16">
                <div className="max-w-3xl mx-auto text-center">
                  <Badge variant="accent" className="mb-8">Powered by Mantle</Badge>
                  <h2 className="text-4xl sm:text-5xl font-bold mb-8">
                    Built for the Future of Finance
                  </h2>
                  <p className="text-xl text-muted-foreground mb-12 leading-relaxed">
                    Asset Forge leverages Mantle&apos;s high-performance Layer 2 network to provide
                    lightning-fast transactions with minimal gas costs. The perfect infrastructure
                    for tokenized real-world assets.
                  </p>
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
                    <a
                      href="https://www.mantle.xyz"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Button variant="secondary" size="lg" className="text-base px-8">
                        Learn About Mantle
                        <ExternalLink className="h-4 w-4 ml-2" />
                      </Button>
                    </a>
                    <a
                      href="https://www.mantle.xyz/faucet"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Button variant="outline" size="lg" className="text-base px-8">
                        Get Testnet Tokens
                        <ExternalLink className="h-4 w-4 ml-2" />
                      </Button>
                    </a>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 lg:py-48 bg-muted/30">
        <div className="max-w-4xl mx-auto px-6 sm:px-8 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-8">
              Ready to Create Your First Asset?
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-12 leading-relaxed">
              Join the future of tokenized real-world assets. Start building on Mantle today
              with Asset Forge.
            </p>
            <Link href="/create">
              <Button variant="primary" size="xl" className="group text-lg px-12 py-5 h-auto">
                Launch Asset Creator
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
