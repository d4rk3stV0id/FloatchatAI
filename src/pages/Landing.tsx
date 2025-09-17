import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { motion, useScroll, useTransform } from 'framer-motion';

import CausticAnimation from '@/components/CausticAnimation';
import InteractiveCursor from '@/components/InteractiveCursor';
import FloatingParticles from '@/components/FloatingParticles';
import ScrollReveal from '@/components/ScrollReveal';
import { ArrowRight, Waves, Database, BarChart3, MapPin, Mail, Phone, Globe as GlobeIcon, Sparkles, Zap, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ThemeToggle from '@/components/ThemeToggle';


const Landing: React.FC = () => {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);
  const { scrollYProgress } = useScroll();
  const headerOpacity = useTransform(scrollYProgress, [0, 0.1], [1, 0.95]);
  const heroY = useTransform(scrollYProgress, [0, 1], [0, -100]);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
  <div className="min-h-screen text-foreground relative overflow-hidden">
      <InteractiveCursor />
      <FloatingParticles />
      
      {/* Header */}
  <motion.header 
        className="glass-navbar bg-background/80 backdrop-blur-xl fixed top-0 left-0 right-0 z-50 border-b border-border/20"
        style={{ opacity: headerOpacity }}
      >
        <div className="container mx-auto px-6 h-20 flex items-center justify-between">
          <motion.div 
            className="flex items-center gap-2 cursor-pointer interactive" 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            >
              <Waves className="h-6 w-6 text-ocean-primary" />
            </motion.div>
            <span className="text-xl font-bold bg-gradient-to-r from-ocean-primary to-ocean-secondary bg-clip-text text-transparent">
              FloatChat
            </span>
          </motion.div>
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
            {[
              { label: 'How It Works', section: 'how' },
              { label: 'Features', section: 'features' },
              { label: 'Innovation', section: 'innovation' },
              { label: 'Mission', section: 'mission' },
              { label: 'Contact', section: 'contact' }
            ].map((item, index) => (
              <motion.a
                key={item.section}
                onClick={() => scrollToSection(item.section)} 
                className="text-muted-foreground hover:text-ocean-primary transition-colors cursor-pointer interactive relative"
                whileHover={{ y: -2 }}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                {item.label}
                <motion.div
                  className="absolute -bottom-1 left-0 w-0 h-0.5 bg-ocean-primary"
                  whileHover={{ width: "100%" }}
                  transition={{ duration: 0.3 }}
                />
              </motion.a>
            ))}
          </nav>
          <div className="flex items-center gap-4">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button 
                onClick={() => navigate('/auth')} 
                variant="default" 
                className="hidden sm:flex interactive ocean-button border-ocean-primary/30 hover:border-ocean-primary hover:shadow-glow"
              >
                Launch App
                <motion.div
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <ArrowRight className="ml-2 h-4 w-4" />
                </motion.div>
              </Button>
            </motion.div>
            <ThemeToggle />
          </div>
        </div>
      </motion.header>
      <div className="min-h-screen absolute inset-0 w-full h-0 z-full pointer-events-none">
          <CausticAnimation />
      </div>
  {/* Hero Section */}
  <section className="min-h-screen flex items-center justify-center pt-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-glow-gradient opacity-30" />
        <motion.div 
          className="container mx-auto px-6 text-center relative z-10"
          style={{ y: heroY }}
        >
          <div className="max-w-3xl mx-auto space-y-8">
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, type: "spring", bounce: 0.3 }}
              className="relative"
            >
              <motion.h1 
                className="text-9xl font-bold tracking-tighter bg-gradient-to-r from-blue-900 via-blue-600 to-cyan-400 bg-clip-text text-transparent"
                animate={{ 
                  backgroundPosition: ["0%", "100%", "0%"] 
                }}
                transition={{ 
                  duration: 5, 
                  repeat: Infinity, 
                  ease: "linear" 
                }}
              >
                FloatChat
              </motion.h1>
              <motion.div
                className="absolute inset-0 bg-glow-gradient opacity-20 blur-3xl"
                animate={{ 
                  scale: [1, 1.1, 1],
                  opacity: [0.2, 0.4, 0.2]
                }}
                transition={{ 
                  duration: 4, 
                  repeat: Infinity, 
                  ease: "easeInOut" 
                }}
              />
            </motion.div>
            
            <motion.p 
              className="text-2xl lg:text-3xl font-semibold bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
            >
              Turning complex ocean science into clear, actionable intelligence for everyone.
            </motion.p>
            
            <motion.p 
              className="text-lg text-muted-foreground leading-relaxed"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
            >
              The foundation of ocean science is data—ARGO floats, satellites, and models. But this data is locked away in technical formats, out of reach for most. FloatChat is your universal translator: it cleans, fuses, and simplifies raw data, letting you chat with the ocean and get answers instantly. No expertise required—just curiosity.
            </motion.p>
            
            <motion.div 
              className="flex flex-col sm:flex-row gap-4 justify-center mt-6"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.8 }}
            >
              <motion.div
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.95 }}
                className="relative group"
              >
                <Button 
                  variant="default" 
                  size="xl"
                  onClick={() => navigate('/auth')}
                  className="interactive ocean-button relative overflow-hidden group"
                >
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                    initial={{ x: "-100%" }}
                    whileHover={{ x: "100%" }}
                    transition={{ duration: 0.6 }}
                  />
                  <span className="relative z-10 flex items-center">
                    Try FloatChat
                    <motion.div
                      animate={{ x: [0, 5, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </motion.div>
                  </span>
                </Button>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* How It Works Section */}
  <section id="how" className="flex items-center justify-center py-24 px-6 animate-fade-in-up">
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto text-center mb-16 animate-fade-in-up">
            <h2 className="section-heading">How It Works</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              FloatChat solves the “first-mile” problem of ocean data: making raw, complex files readable and useful before any prediction or visualization. Here’s how:
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="p-8 text-center card-shadow border-ocean-primary/20 glass-navbar">
              <h3 className="text-xl font-semibold mb-4">1. Data Collection</h3>
              <p className="text-muted-foreground">We fetch the latest ARGO float, satellite, and model data—no matter the format or source.</p>
            </Card>
            <Card className="p-8 text-center card-shadow border-ocean-primary/20 glass-navbar">
              <h3 className="text-xl font-semibold mb-4">2. Smart Processing</h3>
              <p className="text-muted-foreground">Automated scripts clean, structure, and fuse raw data into a unified, easy-to-use format (JSON feeds).</p>
            </Card>
            <Card className="p-8 text-center card-shadow border-ocean-primary/20 glass-navbar">
              <h3 className="text-xl font-semibold mb-4">3. Conversational AI</h3>
              <p className="text-muted-foreground">Our AI lets you ask questions in plain language and get instant, actionable answers—plus visualizations and predictions.</p>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Section */}
  <section id="features" className="flex items-center justify-center py-24 px-6 animate-fade-in-up">
        <div className="container mx-auto">
          <div className="text-center mb-16 animate-fade-in-up">
            <h2 className="section-heading">Why FloatChat?</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              We make ocean data accessible, understandable, and useful—no matter your background.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="p-8 text-center hover:lift smooth-transition border-ocean-primary/20 card-shadow card-animated-border glass-navbar">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-6">
                <Database className="h-8 w-8 text-ocean-primary dark:text-ocean-light" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Universal Data Translator</h3>
              <p className="text-muted-foreground">
                Our pipeline cleans and fuses raw ARGO, satellite, and model data—turning complex files into a single, easy-to-use source of truth.
              </p>
            </Card>
            <Card className="p-8 text-center hover:lift smooth-transition border-ocean-primary/20 card-shadow card-animated-border glass-navbar">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-6">
                <BarChart3 className="h-8 w-8 text-ocean-primary dark:text-ocean-light" />
              </div>
              <h3 className="text-xl font-semibold mb-4">AI-Powered Insights</h3>
              <p className="text-muted-foreground">
                Ask questions in plain language. Our AI finds answers, visualizes trends, and even predicts disasters—no technical skills needed.
              </p>
            </Card>
            <Card className="p-8 text-center hover:lift smooth-transition border-ocean-primary/20 card-shadow card-animated-border glass-navbar">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-6">
                <MapPin className="h-8 w-8 text-ocean-primary dark:text-ocean-light" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Actionable & Inclusive</h3>
              <p className="text-muted-foreground">
                From students to disaster officials, anyone can access life-saving intelligence and climate knowledge—instantly.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Innovation Highlights Section */}
  <section id="innovation" className="flex items-center justify-center py-24 px-6 animate-fade-in-up">
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto text-center mb-16 animate-fade-in-up">
            <h2 className="section-heading">Innovation Highlights</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              What makes FloatChat unique? We go beyond data access—delivering intelligence, prediction, and inclusivity at scale.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="p-8 text-center hover:lift smooth-transition border-ocean-primary/20 card-shadow card-animated-border glass-navbar">
              <h3 className="text-xl font-semibold mb-4">Data Simplification at Scale</h3>
              <p className="text-muted-foreground">We process and unify scientific data from many sources, making it simple and reliable for any user.</p>
            </Card>
            <Card className="p-8 text-center hover:lift smooth-transition border-ocean-primary/20 card-shadow card-animated-border glass-navbar">
              <h3 className="text-xl font-semibold mb-4">Predictive Calamity Monitoring</h3>
              <p className="text-muted-foreground">By correlating ARGO and atmospheric data, our AI can spot early signs of cyclones and disasters—days in advance.</p>
            </Card>
            <Card className="p-8 text-center hover:lift smooth-transition border-ocean-primary/20 card-shadow card-animated-border glass-navbar">
              <h3 className="text-xl font-semibold mb-4">AI as a Smart Router</h3>
              <p className="text-muted-foreground">Gemini 1.5 powers a dynamic UI, calling the right predictive tools for each user’s question—making the experience seamless and powerful.</p>
            </Card>
          </div>
        </div>
      </section>

      {/* Mission Section */}
  <section id="mission" className="flex items-center justify-center py-24 px-6 animate-fade-in-up">
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto animate-fade-in-up text-center space-y-8">
            <h2 className="section-heading">Bridging the Gap</h2>
            <p className="text-lg text-muted-foreground">
              With oceans covering 70% of our planet, FloatChat puts the Indian Ocean at the center—connecting students, scientists, policymakers, and citizens to understand and protect our blue world. Our vision: empower people with the intelligence and warnings they need to stay safe, prepared, and informed.
            </p>
            <div className="grid md:grid-cols-3 gap-8 mt-8">
              <Card className="p-6 card-shadow border-ocean-primary/20 animate-scale-in card-animated-border glass-navbar">
                <h3 className="font-semibold mb-2">Government & Disaster Agencies</h3>
                <p className="text-muted-foreground">Early warnings to save lives and resources.</p>
              </Card>
              <Card className="p-6 card-shadow border-ocean-primary/20 animate-scale-in card-animated-border glass-navbar">
                <h3 className="font-semibold mb-2">Researchers & Students</h3>
                <p className="text-muted-foreground">Accelerate climate studies and make oceanography engaging.</p>
              </Card>
              <Card className="p-6 card-shadow border-ocean-primary/20 animate-scale-in card-animated-border glass-navbar">
                <h3 className="font-semibold mb-2">Industries & NGOs</h3>
                <p className="text-muted-foreground">Safer fisheries, shipping, and accessible insights for conservation.</p>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Challenges & Solutions Section */}
  <section id="challenges" className="flex items-center justify-center py-24 px-6 animate-fade-in-up">
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto text-center mb-16 animate-fade-in-up">
            <h2 className="section-heading">Challenges & Solutions</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Building FloatChat isn’t easy. Here’s how we tackle the toughest problems in ocean data:
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="p-8 text-center card-shadow border-ocean-primary/20 animate-scale-in card-animated-border glass-navbar">
              <h3 className="text-xl font-semibold mb-4">Data Complexity</h3>
              <p className="text-muted-foreground">Automated jobs fetch and preprocess ARGO data, updating simplified feeds for easy access.</p>
            </Card>
            <Card className="p-8 text-center card-shadow border-ocean-primary/20 animate-scale-in card-animated-border glass-navbar">
              <h3 className="text-xl font-semibold mb-4">API Rate Limits</h3>
              <p className="text-muted-foreground">A backend cache (Redis/Postgres) stores responses, so repeated requests don’t overload APIs.</p>
            </Card>
            <Card className="p-8 text-center card-shadow border-ocean-primary/20 animate-scale-in card-animated-border glass-navbar">
              <h3 className="text-xl font-semibold mb-4">UI/Map Performance</h3>
              <p className="text-muted-foreground">We use clustering (supercluster) to group floats, keeping the map fast and smooth—even with thousands of points.</p>
            </Card>
          </div>
        </div>
      </section>

      {/* Contact Section */}
  <section id="contact" className="min-h-screen flex items-center justify-center py-24 px-6 animate-fade-in-up">
    <div className="container mx-auto">
        <div className="text-center mb-16">
            <h2 className="text-4xl font-bold tracking-tighter mb-6">Meet the Team</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Our team is committed to making ocean data accessible. Say hello to the faces behind FloatChat.
            </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {/* Card 1: Placeholder Team Member */}
            <Card className="p-6 text-center card-shadow border-ocean-primary/20 animate-scale-in card-animated-border glass-navbar">
                <div className="w-24 h-24 rounded-full bg-gray-300 dark:bg-gray-700 mx-auto mb-4 overflow-hidden">
                    <img src="/floatlogo.png" alt="Profile Picture" className="w-full h-full object-cover" />
                </div>
                <h3 className="font-semibold mb-1">Dhanush P</h3>
                <p className="text-sm text-muted-foreground mb-4">Lead Developer</p>
                <div className="flex justify-center gap-2">
                    <a href="#" className="text-muted-foreground hover:text-ocean-primary smooth-transition" aria-label="GitHub Profile"><GlobeIcon size={20} /></a>
                    <a href="mailto:jane.doe@example.com" className="text-muted-foreground hover:text-ocean-primary smooth-transition" aria-label="Email"><Mail size={20} /></a>
                    <a href="tel:+1234567890" className="text-muted-foreground hover:text-ocean-primary smooth-transition" aria-label="Phone"><Phone size={20} /></a>
                </div>
            </Card>

            {/* Card 2: Placeholder Team Member */}
            <Card className="p-6 text-center card-shadow border-ocean-primary/20 animate-scale-in card-animated-border glass-navbar">
                <div className="w-24 h-24 rounded-full bg-gray-300 dark:bg-gray-700 mx-auto mb-4 overflow-hidden">
                    <img src="/floatlogo.png" alt="Profile Picture" className="w-full h-full object-cover" />
                </div>
                <h3 className="font-semibold mb-1">Lakshay Sharma</h3>
                <p className="text-sm text-muted-foreground mb-4">Data Scientist</p>
                <div className="flex justify-center gap-2">
                    <a href="#" className="text-muted-foreground hover:text-ocean-primary smooth-transition" aria-label="GitHub Profile"><GlobeIcon size={20} /></a>
                    <a href="mailto:john.smith@example.com" className="text-muted-foreground hover:text-ocean-primary smooth-transition" aria-label="Email"><Mail size={20} /></a>
                    <a href="tel:+1234567891" className="text-muted-foreground hover:text-ocean-primary smooth-transition" aria-label="Phone"><Phone size={20} /></a>
                </div>
            </Card>

            {/* Card 3: Placeholder Team Member */}
            <Card className="p-6 text-center card-shadow border-ocean-primary/20 animate-scale-in card-animated-border glass-navbar">
                <div className="w-24 h-24 rounded-full bg-gray-300 dark:bg-gray-700 mx-auto mb-4 overflow-hidden">
                    <img src="/floatlogo.png" alt="Profile Picture" className="w-full h-full object-cover" />
                </div>
                <h3 className="font-semibold mb-1">Lochan</h3>
                <p className="text-sm text-muted-foreground mb-4">UI/UX Designer</p>
                <div className="flex justify-center gap-2">
                    <a href="#" className="text-muted-foreground hover:text-ocean-primary smooth-transition" aria-label="GitHub Profile"><GlobeIcon size={20} /></a>
                    <a href="mailto:emily.chen@example.com" className="text-muted-foreground hover:text-ocean-primary smooth-transition" aria-label="Email"><Mail size={20} /></a>
                    <a href="tel:+1234567892" className="text-muted-foreground hover:text-ocean-primary smooth-transition" aria-label="Phone"><Phone size={20} /></a>
                </div>
            </Card>

            {/* Card 4: Placeholder Team Member */}
            <Card className="p-6 text-center card-shadow border-ocean-primary/20 animate-scale-in card-animated-border glass-navbar">
                <div className="w-24 h-24 rounded-full bg-gray-300 dark:bg-gray-700 mx-auto mb-4 overflow-hidden">
                    <img src="/floatlogo.png" alt="Profile Picture" className="w-full h-full object-cover" />
                </div>
                <h3 className="font-semibold mb-1">Swaraj S</h3>
                <p className="text-sm text-muted-foreground mb-4">Project Manager</p>
                <div className="flex justify-center gap-2">
                    <a href="#" className="text-muted-foreground hover:text-ocean-primary smooth-transition" aria-label="GitHub Profile"><GlobeIcon size={20} /></a>
                    <a href="mailto:michael.rodriguez@example.com" className="text-muted-foreground hover:text-ocean-primary smooth-transition" aria-label="Email"><Mail size={20} /></a>
                    <a href="tel:+1234567893" className="text-muted-foreground hover:text-ocean-primary smooth-transition" aria-label="Phone"><Phone size={20} /></a>
                </div>
            </Card>

            {/* Card 5: Placeholder Team Member */}
            <Card className="p-6 text-center card-shadow border-ocean-primary/20 animate-scale-in card-animated-border glass-navbar">
                <div className="w-24 h-24 rounded-full bg-gray-300 dark:bg-gray-700 mx-auto mb-4 overflow-hidden">
                    <img src="/floatlogo.png" alt="Profile Picture" className="w-full h-full object-cover" />
                </div>
                <h3 className="font-semibold mb-1">Mohammed Faizaan</h3>
                <p className="text-sm text-muted-foreground mb-4">DevOps Engineer</p>
                <div className="flex justify-center gap-2">
                    <a href="#" className="text-muted-foreground hover:text-ocean-primary smooth-transition" aria-label="GitHub Profile"><GlobeIcon size={20} /></a>
                    <a href="mailto:sarah.lee@example.com" className="text-muted-foreground hover:text-ocean-primary smooth-transition" aria-label="Email"><Mail size={20} /></a>
                    <a href="tel:+1234567894" className="text-muted-foreground hover:text-ocean-primary smooth-transition" aria-label="Phone"><Phone size={20} /></a>
                </div>
            </Card>

            {/* Card 6: Placeholder Team Member */}
            <Card className="p-6 text-center card-shadow border-ocean-primary/20 animate-scale-in card-animated-border glass-navbar">
                <div className="w-24 h-24 rounded-full bg-gray-300 dark:bg-gray-700 mx-auto mb-4 overflow-hidden">
                    <img src="/floatlogo.png" alt="Profile Picture" className="w-full h-full object-cover" />
                </div>
                <h3 className="font-semibold mb-1">Roshni Ghosh</h3>
                <p className="text-sm text-muted-foreground mb-4">Marketing & Outreach</p>
                <div className="flex justify-center gap-2">
                    <a href="#" className="text-muted-foreground hover:text-ocean-primary smooth-transition" aria-label="GitHub Profile"><GlobeIcon size={20} /></a>
                    <a href="mailto:david.wilson@example.com" className="text-muted-foreground hover:text-ocean-primary smooth-transition" aria-label="Email"><Mail size={20} /></a>
                    <a href="tel:+1234567895" className="text-muted-foreground hover:text-ocean-primary smooth-transition" aria-label="Phone"><Phone size={20} /></a>
                </div>
            </Card>
        </div>
    </div>
</section>

      {/* Footer */}
  <footer className="py-12 px-6 border-t border-border/50 bg-white/10 dark:bg-ocean-surface/80 animate-fade-in-up">
        <div className="container mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <img src="/floatlogo.png" alt="FloatChat Logo" className="h-6 w-6 object-contain"/>
            <span className="text-xl font-bold">FloatChat</span>
          </div>
          <p className="text-muted-foreground">
            © 2025 FloatChat. Making ocean intelligence accessible for all.
          </p>
        </div> 
      </footer>
    </div>
  );

  // Animate gradient background on scroll
  useEffect(() => {
    const gradientBg = document.getElementById('gradient-bg');
    if (!gradientBg) return;
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const maxScroll = document.body.scrollHeight - window.innerHeight;
      const percent = Math.min(scrollY / maxScroll, 1);
      // Interpolate between light and dark blue
      const light = [144, 224, 239]; // #234270ff
      const dark = [0, 119, 182];   // #17325aff
      const r = Math.round(light[0] + (dark[0] - light[0]) * percent);
      const g = Math.round(light[1] + (dark[1] - light[1]) * percent);
      const b = Math.round(light[2] + (dark[2] - light[2]) * percent);
      gradientBg.style.background = `linear-gradient(180deg, rgb(${r},${g},${b}) 0%, #0077b6 100%)`;
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
};

export default Landing;

