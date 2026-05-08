/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, AnimatePresence, useInView, useMotionValue, useSpring, useMotionValueEvent } from 'motion/react';
import { 
  Building, Briefcase, FileText, Printer, CheckCircle, 
  Award, Users, Phone, Mail, MapPin, Menu, X, ArrowRight,
  TrendingUp, Shield, Zap, ChevronUp, ChevronRight
} from 'lucide-react';

// --- Helper for Framer Motion WAAPI offsets ---
function getClampedKeyframes(
  inputRange: [number, number, number],
  outputRange: [number, number, number]
) {
  const [x1, x2, x3] = inputRange;
  const [y1, y2, y3] = outputRange;

  const getInterpolated = (x: number) => {
    if (x <= x1) return y1;
    if (x >= x3) return y3;
    if (x <= x2) {
      const progress = (x - x1) / (x2 - x1);
      return y1 + progress * (y2 - y1);
    } else {
      const progress = (x - x2) / (x3 - x2);
      return y2 + progress * (y3 - y2);
    }
  };

  const newInputs = [0];
  const newOutputs = [getInterpolated(0)];

  if (x1 > 0 && x1 < 1) {
    newInputs.push(x1);
    newOutputs.push(getInterpolated(x1));
  }
  if (x2 > 0 && x2 < 1) {
    newInputs.push(x2);
    newOutputs.push(getInterpolated(x2));
  }
  if (x3 > 0 && x3 < 1) {
    newInputs.push(x3);
    newOutputs.push(getInterpolated(x3));
  }

  newInputs.push(1);
  newOutputs.push(getInterpolated(1));

  const finalInputs = [newInputs[0]];
  const finalOutputs = [newOutputs[0]];
  
  for (let i = 1; i < newInputs.length; i++) {
    if (newInputs[i] > finalInputs[finalInputs.length - 1] + 0.0001) {
      finalInputs.push(newInputs[i]);
      finalOutputs.push(newOutputs[i]);
    }
  }

  return { inputs: finalInputs, outputs: finalOutputs };
}

// --- Logo Component ---
const Logo = ({ className = "h-8", showFallbackText = true }: { className?: string, showFallbackText?: boolean }) => {
  const [hasError, setHasError] = useState(false);

  if (hasError && showFallbackText) {
    return (
      <div className={`font-heading text-2xl font-bold tracking-wider text-white flex items-center ${className}`}>
        KARESMA<span className="text-brand-gold">.</span>
      </div>
    );
  }

  return (
    <img 
      src="/logo.png" 
      alt="Karesma Logistics" 
      className={`object-contain ${className} ${hasError ? 'hidden' : 'block'}`}
      onError={() => setHasError(true)}
    />
  );
};

// --- Loader Component ---
const Loader = ({ onComplete }: { onComplete: () => void }) => {
  useEffect(() => {
    const timer = setTimeout(onComplete, 2500);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-brand-dark"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.8, ease: "easeInOut" } }}
    >
      <div className="text-center">
        <motion.div
          animate={{ 
            scale: [1, 1.1, 1.2, 1.1, 1],
            rotate: [0, 90, 180, 270, 360]
          }}
          transition={{ 
            duration: 2,
            ease: "easeInOut",
            repeat: Infinity,
            times: [0, 0.25, 0.5, 0.75, 1]
          }}
          className="w-16 h-16 border-t-2 border-brand-gold rounded-full mx-auto mb-6"
        />
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="flex justify-center"
        >
          <Logo className="h-12" />
        </motion.div>
      </div>
    </motion.div>
  );
};

// --- Navbar Component ---
const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'À Propos', href: '#about' },
    { name: 'Services', href: '#services' },
    { name: 'Avantages', href: '#advantages' },
    { name: 'Contact', href: '#contact' }
  ];

  return (
    <header className={`fixed top-0 w-full z-40 transition-all duration-300 ${isScrolled ? 'glass-nav py-4' : 'bg-transparent py-6'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Logo className="h-10" />
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link, i) => (
            <motion.a
              key={link.name}
              href={link.href}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * i }}
              className="text-sm font-medium text-gray-300 hover:text-brand-gold transition-colors tracking-wide uppercase"
            >
              {link.name}
            </motion.a>
          ))}
          <motion.a
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
            href="#contact"
            className="px-6 py-2.5 rounded-full bg-brand-gold text-brand-dark font-semibold text-sm hover:bg-white transition-all transform hover:-translate-y-0.5"
          >
            Nous contacter
          </motion.a>
        </nav>

        {/* Mobile menu button */}
        <button 
          className="md:hidden text-white hover:text-brand-gold transition-colors"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden glass-nav border-t border-brand-gold/10 overflow-hidden"
          >
            <div className="px-4 py-6 flex flex-col gap-4">
              {navLinks.map(link => (
                <a 
                  key={link.name} 
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-white text-lg font-medium p-2"
                >
                  {link.name}
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

// --- Hero Section ---
const Hero = () => {
  const { scrollY } = useScroll();
  const y = useMotionValue(0);
  const opacity = useMotionValue(1);

  useMotionValueEvent(scrollY, "change", (latest) => {
    // [0, 1000] -> [0, 300]
    y.set(latest < 0 ? 0 : latest > 1000 ? 300 : (latest / 1000) * 300);
    // [0, 500] -> [1, 0]
    opacity.set(latest < 0 ? 1 : latest > 500 ? 0 : 1 - (latest / 500));
  });

  return (
    <section className="relative h-screen flex border-b border-brand-gold/10 overflow-hidden bg-brand-blue flex-col justify-center">
      {/* Background with Parallax */}
      <motion.div 
        style={{ y, opacity }}
        className="absolute inset-0 z-0"
      >
        <div className="absolute inset-0 bg-brand-dark/80 mix-blend-multiply z-10" />
        <img 
          src="/hero.png" 
          alt="Premium Office" 
          className="w-full h-full object-cover scale-105"
        />
      </motion.div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full mt-20">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="max-w-3xl"
        >
          <div className="inline-block px-4 py-1.5 rounded-full border border-brand-gold/30 bg-brand-gold/10 backdrop-blur-md mb-6">
            <span className="text-brand-gold font-medium tracking-wider text-xs uppercase">Business Center Premium</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold font-heading text-white leading-tight mb-6">
            L'excellence au service <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-gold to-[#F9E596]">de votre réussite</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-300 mb-10 max-w-2xl font-light leading-relaxed">
            Un business center moderne conçu pour accompagner la structuration, 
            la croissance et la performance de votre entreprise.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <a href="#services" className="px-8 py-4 rounded-full bg-brand-gold text-brand-dark font-semibold hover:bg-white transition-all transform hover:-translate-y-1 text-center flex items-center justify-center gap-2">
              Créer mon entreprise <ArrowRight size={18} />
            </a>
            <a href="#contact" className="px-8 py-4 rounded-full border border-gray-500 text-white hover:border-brand-gold hover:text-brand-gold transition-all text-center">
              Nous contacter
            </a>
          </div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div 
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2"
      >
        <span className="text-xs tracking-widest text-gray-400 uppercase">Scroll</span>
        <div className="w-[1px] h-12 bg-gradient-to-b from-brand-gold to-transparent" />
      </motion.div>
    </section>
  );
};

// --- About Section ---
const About = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="about" className="py-32 bg-brand-blue relative" ref={ref}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-brand-gold font-medium tracking-widest uppercase text-sm mb-4">À Propos de nous</h2>
            <h3 className="text-3xl md:text-4xl font-heading font-bold text-white mb-6 leading-tight">
              Votre partenaire de croissance stratégique
            </h3>
            <p className="text-gray-300 text-lg leading-relaxed mb-6 font-light">
              KARESMA LOGISTICS accompagne les entrepreneurs et entreprises dans 
              leur structuration, leur performance et leur croissance. Nous offrons 
              bien plus qu'un espace physique : nous sommes le catalyseur de votre succès.
            </p>
            <p className="text-gray-400 text-base leading-relaxed mb-8">
              En combinant des infrastructures de pointe avec des services d'accompagnement 
              sur-mesure, nous permettons aux dirigeants de se concentrer sur l'essentiel : 
              le développement de leur activité.
            </p>
            <div className="flex gap-4 items-center border-l-2 border-brand-gold pl-4 py-2">
              <div className="text-white font-medium">Une vision globale, une action locale.</div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="aspect-[4/5] rounded-2xl overflow-hidden relative">
              <div className="absolute inset-0 bg-brand-blue/20 mix-blend-overlay z-10" />
              <img 
                src="/about.png" 
                alt="Business Meeting" 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-8 -left-8 glass-card p-6 rounded-xl border border-brand-gold/30 max-w-[200px] z-20">
              <div className="text-2xl font-bold font-heading text-brand-gold mb-2 uppercase">Innovation</div>
              <div className="text-sm text-gray-300">L'excellence au service de votre réussite</div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

// --- Service Card Component with 3D Tilt ---
const ServiceCard = ({ service, index, forceVisible = false }: { service: any, index: number, forceVisible?: boolean }) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  const mouseXSpring = useSpring(x, { stiffness: 300, damping: 30 });
  const mouseYSpring = useSpring(y, { stiffness: 300, damping: 30 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["15deg", "-15deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-15deg", "15deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      initial={forceVisible ? false : { opacity: 0, y: 30 }}
      animate={forceVisible ? { opacity: 1, y: 0 } : undefined}
      transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
      style={{ perspective: "1000px" }}
      className="h-full block w-full"
    >
      <motion.div
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
        }}
        className="glass-card p-10 rounded-2xl glow-hover relative overflow-hidden h-full group flex flex-col justify-center"
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-brand-gold/5 rounded-bl-full -mr-16 -mt-16 transition-transform group-hover:scale-110" style={{ transform: "translateZ(20px)" }} />
        
        <div className="w-16 h-16 rounded-xl bg-brand-blue border border-brand-gold/20 flex items-center justify-center mb-8 relative z-10" style={{ transform: "translateZ(50px)" }}>
          {service.icon}
        </div>
        <h4 className="text-2xl font-heading font-semibold text-white mb-6 relative z-10" style={{ transform: "translateZ(40px)" }}>
          {service.title}
        </h4>
        <ul className="space-y-4 relative z-10" style={{ transform: "translateZ(30px)" }}>
          {service.features.map((feature: string) => (
            <li key={feature} className="flex items-start gap-3">
              <CheckCircle size={20} className="text-brand-gold shrink-0 mt-0.5" />
              <span className="text-gray-300 font-light">{feature}</span>
            </li>
          ))}
        </ul>
      </motion.div>
    </motion.div>
  );
};

// --- Horizontal 3D Slide Component ---
const ServiceSlide = ({ service, index, scrollYProgress, total }: { service: any, index: number, scrollYProgress: any, total: number }) => {
  // Center point for this slide (from 0 to 1)
  const centerProgress = index / (total - 1);
  
  // Parallax rotation and scaling based on distance from center
  const rotKfs = getClampedKeyframes([centerProgress - 0.3, centerProgress, centerProgress + 0.3], [35, 0, -35]);
  const rotateY = useTransform(scrollYProgress, rotKfs.inputs, rotKfs.outputs);
  
  const scaleKfs = getClampedKeyframes([centerProgress - 0.3, centerProgress, centerProgress + 0.3], [0.75, 1, 0.75]);
  const scale = useTransform(scrollYProgress, scaleKfs.inputs, scaleKfs.outputs);
  
  const opKfs = getClampedKeyframes([centerProgress - 0.3, centerProgress, centerProgress + 0.3], [0.2, 1, 0.2]);
  const opacity = useTransform(scrollYProgress, opKfs.inputs, opKfs.outputs);

  return (
    <motion.div 
      style={{ rotateY, scale, opacity, transformStyle: "preserve-3d" }}
      className="w-full h-full flex items-center justify-center"
    >
      <ServiceCard service={service} index={index} forceVisible={true} />
    </motion.div>
  );
};

// --- Services Horizontal Scroll Section ---
const Services = () => {
  const containerRef = useRef(null);
  
  // Create a scroll trigger for the container
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  // Calculate the horizontal translation. We have 4 items. 
  // We want to move left so the last item is in center at progress 1.
  const x = useTransform(scrollYProgress, [0, 1], ["0%", "-75%"]);

  const services = [
    {
      icon: <Briefcase size={32} className="text-brand-gold" />,
      title: "Conseil",
      features: ["Conseil stratégique", "Optimisation fiscale", "Coaching de performance"]
    },
    {
      icon: <Building size={32} className="text-brand-gold" />,
      title: "Domiciliation",
      features: ["Adresse commerciale prestigieuse", "Gestion du courrier", "Bureau virtuel"]
    },
    {
      icon: <FileText size={32} className="text-brand-gold" />,
      title: "Création d'entreprise",
      features: ["Business plan", "RCCM / NIU (procédures CFCE)", "Conseil juridique"]
    },
    {
      icon: <Printer size={32} className="text-brand-gold" />,
      title: "Secrétariat HD",
      features: ["Impression rapide", "Numérisation", "Support administratif"]
    }
  ];

  return (
    <section id="services" ref={containerRef} className="h-[400vh] relative bg-brand-dark border-t border-white/5">
      <div className="sticky top-0 h-screen flex flex-col justify-center overflow-hidden">
        
        {/* Header stays pinned */}
        <div className="absolute top-20 left-0 right-0 px-4 sm:px-6 lg:px-8 z-10 pointer-events-none">
          <div className="max-w-7xl mx-auto text-center">
            <h2 className="text-brand-gold font-medium tracking-widest uppercase text-sm mb-4">
              Nos Services
            </h2>
            <h3 className="text-3xl md:text-5xl font-heading font-bold text-white drop-shadow-md">
              Solutions pour votre croissance
            </h3>
          </div>
        </div>

        {/* 3D Track */}
        <div className="relative w-full h-[60vh] mt-20" style={{ perspective: "1500px" }}>
          <motion.div 
            style={{ x }} 
            className="flex h-full w-[400vw] items-center"
          >
            {services.map((service, index) => (
              <div key={service.title} className="w-[100vw] shrink-0 h-full flex items-center justify-center px-4 sm:px-12 md:px-32 lg:px-64">
                <ServiceSlide 
                  service={service} 
                  index={index} 
                  scrollYProgress={scrollYProgress} 
                  total={services.length} 
                />
              </div>
            ))}
          </motion.div>
        </div>
        
        {/* Custom Progress Indicator for Slider */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-3 z-10">
          {services.map((_, i) => {
            const opKfs = getClampedKeyframes(
              [
                (i - 0.5) / (services.length - 1),
                i / (services.length - 1),
                (i + 0.5) / (services.length - 1)
              ],
              [0, 1, 0]
            );
            return (
              <div key={i} className="w-2 h-2 rounded-full bg-white/20">
                <motion.div 
                  className="w-full h-full rounded-full bg-brand-gold"
                  style={{
                    opacity: useTransform(
                      scrollYProgress,
                      opKfs.inputs,
                      opKfs.outputs
                    )
                  }}
                />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

// --- Pinned Section (Sticky text replacement) ---
const PinnedSection = () => {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const words = ["Structurer", "Optimiser", "Accélérer"];
  
  // Mapping scroll progress to array index
  const index = useTransform(scrollYProgress, [0, 0.33, 0.66, 1], [0, 1, 2, 2]);

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    return index.onChange((latest) => setCurrentIndex(Math.floor(latest)));
  }, [index]);

  return (
    <div ref={containerRef} className="h-[250vh] relative bg-brand-blue">
      <div className="sticky top-0 h-screen flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 mix-blend-overlay opacity-10 bg-cover bg-center" 
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80')" }}
        />
        <div className="text-center z-10 px-4">
          <p className="text-brand-gold uppercase tracking-[0.3em] text-sm md:text-base font-semibold mb-6">
            Plus qu'un service, un partenaire stratégique
          </p>
          <div className="h-24 sm:h-32 flex items-center justify-center overflow-hidden">
            <AnimatePresence mode="popLayout">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -50 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="text-6xl md:text-8xl font-heading font-bold text-white"
              >
                {words[currentIndex]}
              </motion.div>
            </AnimatePresence>
          </div>
          <p className="text-xl text-gray-400 mt-6 font-light max-w-lg mx-auto">
            Nous mettons en place les fondations solides pour propulser votre activité vers les sommets.
          </p>
        </div>
      </div>
    </div>
  );
};

// --- Advantages Section ---
const Advantages = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const benefits = [
    { icon: <Zap size={28} />, title: "Rapidité", desc: "Traitement réactif de vos dossiers." },
    { icon: <Award size={28} />, title: "Expertise", desc: "Des professionnels qualifiés." },
    { icon: <Shield size={28} />, title: "Fiabilité", desc: "Confidentialité et rigueur." },
    { icon: <Users size={28} />, title: "Personnalisé", desc: "Un accompagnement sur-mesure." }
  ];

  return (
    <section id="advantages" className="py-24 bg-brand-dark" ref={ref}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {benefits.map((benefit, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="text-center p-6"
            >
              <div className="w-16 h-16 mx-auto rounded-full bg-brand-blue border border-brand-gold/30 flex items-center justify-center text-brand-gold mb-6 relative">
                 <div className="absolute inset-0 rounded-full bg-brand-gold/10 animate-ping opacity-20" />
                 {benefit.icon}
              </div>
              <h4 className="text-xl font-heading font-semibold text-white mb-3">{benefit.title}</h4>
              <p className="text-gray-400 font-light text-sm">{benefit.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// --- CTA Section ---
const CTA = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="py-24 relative overflow-hidden bg-brand-blue" ref={ref}>
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.05, 0.1, 0.05],
            rotate: [0, 90, 0]
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          className="absolute -top-[20%] -right-[10%] w-[60%] aspect-square rounded-full bg-brand-gold blur-[120px]" 
        />
        <motion.div 
          animate={{ 
            scale: [1.2, 1, 1.2],
            opacity: [0.05, 0.1, 0.05],
            rotate: [0, -90, 0]
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
          className="absolute -bottom-[20%] -left-[10%] w-[50%] aspect-square rounded-full bg-brand-dark blur-[100px]" 
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="glass-card p-12 md:p-20 rounded-[2rem] border border-brand-gold/20 text-center relative overflow-hidden"
        >
          {/* Internal Glow */}
          <div className="absolute inset-0 bg-gradient-to-br from-brand-gold/5 via-transparent to-transparent pointer-events-none" />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <h2 className="text-4xl md:text-6xl font-heading font-bold text-white mb-8 leading-tight">
              Prêt à propulser <br />
              <span className="text-brand-gold">votre entreprise</span> au sommet ?
            </h2>
            <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto font-light">
              Rejoignez les leaders qui nous font confiance pour leur structuration et leur croissance stratégique.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <a 
                href="#contact" 
                className="px-10 py-5 rounded-full bg-brand-gold text-brand-dark font-bold text-lg hover:bg-white hover:scale-105 transition-all transform flex items-center justify-center gap-3 shadow-[0_0_30px_rgba(212,175,55,0.3)]"
              >
                Commencer mon projet <ArrowRight size={22} />
              </a>
              <a 
                href="tel:+237680508070" 
                className="px-10 py-5 rounded-full border border-white/20 text-white font-semibold text-lg hover:border-brand-gold hover:text-brand-gold transition-all flex items-center justify-center gap-3"
              >
                <Phone size={20} /> Parler à un expert
              </a>
            </div>
          </motion.div>

          {/* Abstract background logo */}
          <div className="absolute -bottom-10 -right-10 opacity-5 -rotate-12">
             <Logo className="h-64" />
          </div>
        </motion.div>
      </div>
    </section>
  );
};

// --- Contact Section ---
const Contact = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="contact" className="py-32 bg-brand-dark relative" ref={ref}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <motion.div
             initial={{ opacity: 0, x: -30 }}
             animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }}
             transition={{ duration: 0.6 }}
          >
            <h2 className="text-brand-gold font-medium tracking-widest uppercase text-sm mb-4">Contact</h2>
            <h3 className="text-3xl md:text-5xl font-heading font-bold text-white mb-8">
              Prêt à propulser votre entreprise ?
            </h3>
            <p className="text-gray-400 mb-10 text-lg font-light">
              Contactez-nous dès aujourd'hui pour discuter de vos besoins et découvrir comment nous pouvons vous accompagner vers le succès.
            </p>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-brand-blue border border-brand-gold/20 flex items-center justify-center shrink-0">
                  <MapPin className="text-brand-gold" size={20} />
                </div>
                <div>
                  <h4 className="text-white font-medium mb-1">Adresse</h4>
                  <p className="text-gray-400 font-light">Nkoabang, Entrée Ministre<br />BP : 15302 Yaoundé</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-brand-blue border border-brand-gold/20 flex items-center justify-center shrink-0">
                  <Phone className="text-brand-gold" size={20} />
                </div>
                <div>
                  <h4 className="text-white font-medium mb-1">Téléphone</h4>
                  <p className="text-gray-400 font-light">+237 680 50 80 70</p>
                </div>
              </div>
            </div>

            <div className="mt-12 flex flex-wrap gap-4">
              <a href="tel:+237680508070" className="px-6 py-3 rounded-full bg-brand-gold text-brand-dark font-semibold hover:bg-white transition-all flex items-center gap-2">
                <Phone size={18} /> Appeler
              </a>
              <a href="https://wa.me/237680508070" target="_blank" rel="noreferrer" className="px-6 py-3 rounded-full bg-[#25D366]/20 text-[#25D366] border border-[#25D366]/50 hover:bg-[#25D366] hover:text-white transition-all flex items-center gap-2">
                 WhatsApp
              </a>
            </div>
          </motion.div>

          <motion.div
             initial={{ opacity: 0, y: 30 }}
             animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
             transition={{ duration: 0.6, delay: 0.2 }}
          >
            <form className="glass-card p-8 rounded-2xl flex flex-col gap-6" onSubmit={(e) => e.preventDefault()}>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Nom complet</label>
                <input 
                  type="text" 
                  className="w-full bg-brand-dark/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-brand-gold transition-colors"
                  placeholder="Jean Dupont"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
                <input 
                  type="email" 
                  className="w-full bg-brand-dark/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-brand-gold transition-colors"
                  placeholder="jean@exemple.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Message</label>
                <textarea 
                  rows={4}
                  className="w-full bg-brand-dark/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-brand-gold transition-colors resize-none"
                  placeholder="Comment pouvons-nous vous aider ?"
                />
              </div>
              <button 
                className="w-full py-4 rounded-lg bg-brand-gold text-brand-dark font-semibold hover:bg-white transition-colors mt-2"
              >
                Envoyer le message
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

// --- Footer ---
const Footer = () => {
  return (
    <footer className="bg-[#030914] pt-20 pb-10 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16">
          <div className="md:col-span-1">
             <Logo className="h-14 mb-6" />
            <p className="text-gray-500 font-light text-sm max-w-sm mb-6">
              KARESMA LOGISTICS Sarl. L'excellence au service de votre réussite. Votre partenaire business pour une croissance durable.
            </p>
          </div>
          
          <div>
            <h5 className="font-medium text-white mb-6 uppercase tracking-wider text-sm">Liens Rapides</h5>
            <ul className="space-y-3">
              {['À Propos', 'Services', 'Avantages', 'Contact'].map(link => (
                <li key={link}>
                  <a href={`#${link.toLowerCase().replace('à ', '')}`} className="text-gray-500 hover:text-brand-gold text-sm font-light transition-colors flex items-center gap-2">
                    <ChevronRight size={14} /> {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h5 className="font-medium text-white mb-6 uppercase tracking-wider text-sm">Informations Légales</h5>
            <ul className="space-y-3">
              {['Mentions Légales', 'Politique de Confidentialité', 'CGV'].map(link => (
                <li key={link}>
                  <a href="#" className="text-gray-500 hover:text-brand-gold text-sm font-light transition-colors flex items-center gap-2">
                     <ChevronRight size={14} /> {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-gray-600 text-sm font-light">
            © {new Date().getFullYear()} KARESMA LOGISTICS Sarl. Tous droits réservés.
          </div>
        </div>
      </div>
    </footer>
  );
};

// --- Scroll Progress Bar ---
const ScrollProgress = () => {
  const { scrollYProgress } = useScroll();
  
  return (
    <motion.div 
      className="fixed top-0 left-0 right-0 h-1 bg-brand-gold origin-left z-50 rounded-r-full"
      style={{ scaleX: scrollYProgress }}
    />
  );
};

// --- Scroll To Top Button ---
const ScrollToTop = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 500);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0 }}
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-8 right-8 w-12 h-12 rounded-full bg-brand-gold text-brand-dark flex items-center justify-center shadow-lg z-50 hover:bg-white transition-all"
        >
          <ChevronUp size={24} />
        </motion.button>
      )}
    </AnimatePresence>
  );
};

// --- Main App Component ---
export default function App() {
  const [loading, setLoading] = useState(true);

  return (
    <>
      <AnimatePresence>
        {loading && <Loader onComplete={() => setLoading(false)} />}
      </AnimatePresence>

      <ScrollProgress />

      <main className={`relative bg-brand-blue min-h-screen font-sans ${loading ? 'h-screen overflow-hidden' : ''}`}>
        <Navbar />
        <Hero />
        <About />
        <Services />
        <PinnedSection />
        <Advantages />
        <CTA />
        <Contact />
        <Footer />
        <ScrollToTop />
      </main>
    </>
  );
}

