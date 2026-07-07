import React from "react";
import { motion } from "motion/react";
import { Monitor, Cpu, HardDrive, Keyboard, Mic, Layers } from "lucide-react";
import { SpecItem, TranslationDict } from "../types";

interface CS2SpecsSectionProps {
  translations: TranslationDict;
  specs: SpecItem[];
}

export default function CS2SpecsSection({ translations, specs }: CS2SpecsSectionProps) {
  
  const getSpecIcon = (category: string) => {
    const lowercaseCat = category.toLowerCase();
    if (lowercaseCat.includes("cpu") || lowercaseCat.includes("işlemci")) {
      return <Cpu className="h-5 w-5 text-purple-400" />;
    }
    if (lowercaseCat.includes("gpu") || lowercaseCat.includes("kartı")) {
      return <HardDrive className="h-5 w-5 text-pink-400" />;
    }
    if (lowercaseCat.includes("monitor") || lowercaseCat.includes("monitör")) {
      return <Monitor className="h-5 w-5 text-cyan-400" />;
    }
    if (lowercaseCat.includes("keyboard") || lowercaseCat.includes("mouse") || lowercaseCat.includes("pad") || lowercaseCat.includes("klavye") || lowercaseCat.includes("fare")) {
      return <Keyboard className="h-5 w-5 text-yellow-400" />;
    }
    if (lowercaseCat.includes("microphone") || lowercaseCat.includes("headset") || lowercaseCat.includes("kulaklık") || lowercaseCat.includes("mikrofon")) {
      return <Mic className="h-5 w-5 text-emerald-400" />;
    }
    return <Layers className="h-5 w-5 text-blue-400" />;
  };

  return (
    <section id="system" className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 relative">
      <div className="absolute top-10 right-20 w-[200px] h-[200px] rounded-full cyan-glow pointer-events-none -z-10 opacity-30" />

      {/* Title */}
      <div className="mb-8" id="specs-header-container">
        <span className="font-mono text-xs text-cyan-400 font-semibold tracking-widest block mb-1">
          // {translations.systemTitle}
        </span>
        <h2 className="font-display text-3xl font-bold tracking-tight text-white">
          {translations.systemSub}
        </h2>
      </div>

      {/* Hardware list grid layout */}
      <div 
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
        id="specs-list-grid"
      >
        {specs.map((spec, idx) => (
          <motion.div
            key={spec.category}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.05, duration: 0.35 }}
            className="flex items-center space-x-4 p-4 rounded-2xl border border-white/5 bg-[#10111a]/90 hover:border-purple-500/20 hover:bg-[#131521] transition duration-200 group"
            id={`spec-item-${idx}`}
          >
            {/* Spec category icon container */}
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/5 border border-white/5 transition group-hover:scale-105 group-hover:bg-white/10">
              {getSpecIcon(spec.category)}
            </div>

            {/* Spec details */}
            <div className="flex-1 min-w-0">
              <span className="text-[10px] font-mono text-gray-500 font-bold block uppercase tracking-wider mb-0.5">
                {spec.category}
              </span>
              <p className="text-sm font-bold text-white group-hover:text-purple-300 transition duration-200 truncate">
                {spec.name}
              </p>
              <p className="text-xs text-gray-400 truncate mt-0.5 font-medium">
                {spec.value}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
