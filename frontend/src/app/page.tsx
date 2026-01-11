"use client";

import { useState } from "react";
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
import { useReadContract } from "wagmi";
import { ASSET_FACTORY_ABI } from "@/contracts/abi";
import { CONTRACT_ADDRESSES, mantleSepolia } from "@/config/wagmi";

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

// Interactive letter component for the forge text
function ForgeLetter({ letter }: { letter: string }) {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <motion.span
      className="relative inline-block cursor-pointer text-white text-[6vw] md:text-[7vw] lg:text-[8vw] px-[0.5vw] md:px-[1vw]"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      animate={{
        skewX: isHovered ? -6 : 0,
        scale: isHovered ? 1.08 : 1,
        color: isHovered ? '#10B981' : '#ffffff'
      }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      whileHover={{ 
        textShadow: "0 0 20px rgba(16, 185, 129, 0.4)",
      }}
    >
      {letter}
      {/* Hammer on hover - swings from handle, head strikes down */}
      <motion.span
        className="absolute left-1/2 pointer-events-none z-10"
        style={{ 
          top: "-0.8em",
          fontSize: "0.5em",
          transformOrigin: "bottom center",
          marginLeft: "-0.25em",
        }}
        initial={{ opacity: 0, rotate: -45 }}
        animate={{
          opacity: isHovered ? 1 : 0,
          rotate: isHovered ? [-45, 15, -45] : -45,
        }}
        transition={{ 
          duration: 0.35, 
          repeat: isHovered ? Infinity : 0,
          ease: "easeInOut",
        }}
      >
        🔨
      </motion.span>
      {/* Small spark on hit */}
      {isHovered && (
        <motion.span
          className="absolute left-1/2 -translate-x-1/2 pointer-events-none"
          style={{ top: "-0.2em", fontSize: "0.3em" }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: [0, 1, 0], scale: [0.3, 1, 0], y: [0, -15] }}
          transition={{ duration: 0.3, repeat: Infinity, repeatDelay: 0.15 }}
        >
          ✨
        </motion.span>
      )}
    </motion.span>
  );
}

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

const steps = [
  { step: 1, title: "Connect Wallet", description: "Link your MetaMask or WalletConnect wallet" },
  { step: 2, title: "Choose Template", description: "Select from Real Estate, Bond, Invoice, or Custom" },
  { step: 3, title: "Configure Asset", description: "Set tokenomics, compliance, and metadata" },
  { step: 4, title: "Deploy to Mantle", description: "One-click deployment to Mantle blockchain" },
];

export default function HomePage() {
  // Fetch live asset count from the contract
  const factoryAddress = CONTRACT_ADDRESSES[mantleSepolia.id]?.assetFactory as `0x${string}`;
  
  const { data: assetCount } = useReadContract({
    address: factoryAddress,
    abi: ASSET_FACTORY_ABI,
    functionName: 'getAssetCount',
    query: {
      enabled: !!factoryAddress && factoryAddress !== '0x0000000000000000000000000000000000000000',
    },
  });

  const stats = [
    { value: assetCount !== undefined ? assetCount.toString() : "0", label: "Assets Created", suffix: "" },
    { value: "<1", label: "Avg. Deploy Time", suffix: "min" },
    { value: "Low", label: "Gas Costs", suffix: "" },
    { value: "24/7", label: "Network Uptime", suffix: "" },
  ];

  return (
    <div className="relative">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center pt-16 overflow-hidden">
        {/* Animated Background Orbs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Primary pulsing orb */}
          <motion.div
            className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full bg-gradient-to-br from-emerald-500/10 to-cyan-500/5 blur-3xl"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          />
          {/* Secondary pulsing orb */}
          <motion.div
            className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full bg-gradient-to-br from-cyan-500/10 to-emerald-500/5 blur-3xl"
            animate={{
              scale: [1.2, 1, 1.2],
              opacity: [0.2, 0.4, 0.2],
            }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          />
          {/* Small floating particles */}
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 rounded-full bg-emerald-500/30"
              style={{
                top: `${20 + i * 15}%`,
                left: `${10 + i * 20}%`,
              }}
              animate={{
                y: [-20, 20, -20],
                opacity: [0.3, 0.7, 0.3],
              }}
              transition={{ duration: 3 + i * 0.5, repeat: Infinity, ease: "easeInOut", delay: i * 0.3 }}
            />
          ))}
        </div>

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

          <div className="grid md:grid-cols-2 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                whileHover={{ y: -4, scale: 1.01 }}
                className="group"
              >
                <Card variant="default" className="h-full p-8 border border-white/5 hover:border-emerald-500/30 transition-all duration-300 hover:bg-gradient-to-br hover:from-emerald-500/5 hover:to-transparent">
                  <CardHeader className="p-0 pb-5">
                    <motion.div 
                      className="w-14 h-14 rounded-2xl bg-gradient-to-br from-neutral-800 to-neutral-900 flex items-center justify-center mb-5 group-hover:from-emerald-500/20 group-hover:to-cyan-500/10 transition-all duration-300"
                      whileHover={{ rotate: [0, -10, 10, 0], scale: 1.1 }}
                      transition={{ duration: 0.4 }}
                    >
                      <feature.icon className="h-6 w-6 text-neutral-400 group-hover:text-emerald-400 transition-colors duration-300" />
                    </motion.div>
                    <CardTitle className="text-lg group-hover:text-emerald-50 transition-colors">{feature.title}</CardTitle>
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
                  href="https://faucet.sepolia.mantle.xyz/"
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

      {/* Bold Asset Forge Branding Section */}
      <section className="relative py-32 lg:py-48 overflow-hidden">
        {/* Animated forge/ember background */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Forge glow from bottom */}
          <motion.div
            className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-t from-orange-500/20 via-emerald-500/10 to-transparent blur-3xl"
            animate={{
              opacity: [0.3, 0.6, 0.3],
              scale: [1, 1.1, 1],
            }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          />
          {/* Floating sparks */}
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1.5 h-1.5 rounded-full bg-orange-400"
              style={{
                bottom: '20%',
                left: `${25 + i * 7}%`,
              }}
              animate={{
                y: [0, -100 - i * 30, -200],
                x: [0, (i % 2 === 0 ? 20 : -20), 0],
                opacity: [0, 1, 0],
                scale: [0, 1, 0],
              }}
              transition={{
                duration: 2 + i * 0.3,
                repeat: Infinity,
                ease: "easeOut",
                delay: i * 0.4,
              }}
            />
          ))}
        </div>

        <div className="relative w-full px-4">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            {/* The Bold Asset Forge Text - Interactive */}
            <div className="relative">
              <h2 className="font-black tracking-wider mb-4 select-none flex flex-wrap justify-center">
                <span className="inline-flex">
                  {"ASSET".split("").map((letter, i) => (
                    <ForgeLetter key={`asset-${i}`} letter={letter} />
                  ))}
                </span>
                <span className="mx-[2vw] md:mx-[3vw]" />
                <span className="inline-flex">
                  {"FORGE".split("").map((letter, i) => (
                    <ForgeLetter key={`forge-${i}`} letter={letter} />
                  ))}
                </span>
              </h2>
            </div>

            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="mt-8 text-lg text-neutral-400 max-w-md mx-auto"
            >
              Hover over the letters to forge your assets
            </motion.p>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
