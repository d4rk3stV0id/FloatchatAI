import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

import CausticAnimation from '@/components/CausticAnimation';
import { ArrowRight, Waves, Database, BarChart3, MapPin, Mail, Phone, Globe as GlobeIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';


const Landing: React.FC = () => {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
  <div className="min-h-screen text-foreground animate-fade-in relative overflow-hidden">
      {/* Header */}
  <header className="glass-navbar bg-background fixed top-0 left-0 right-0 z-50 animate-slide-in">
        <div className="container mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <Waves className="h-6 w-6 text-ocean-primary" />
            <span className="text-xl font-bold">FloatChat</span>
          </div>
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
            <a onClick={() => scrollToSection('how')} className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer">How It Works</a>
            <a onClick={() => scrollToSection('features')} className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer">Features</a>
            <a onClick={() => scrollToSection('innovation')} className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer">Innovation</a>
            <a onClick={() => scrollToSection('mission')} className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer">Mission</a>
            <a onClick={() => scrollToSection('contact')} className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer">Contact</a>
          </nav>
          <div className="flex items-center gap-4">
            <Button onClick={() => navigate('/auth')} variant="default" className="hidden sm:flex">
              Launch App
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>
      <div className="min-h-screen absolute inset-0 w-full h-0 z-full pointer-events-none">
          <CausticAnimation />
      </div>
  {/* Hero Section */}
  <section className="min-h-screen flex items-center justify-center pt-20 relative overflow-hidden animate-fade-in-up">
        <div className="absolute inset-0 bg-glow-gradient opacity-30" />
        <div className={`container mx-auto px-6 text-center relative z-10 transition-all duration-1000 ${
          isVisible ? 'animate-fade-in-up' : 'opacity-0'
        }`}>
          <div className="max-w-3xl mx-auto space-y-8">
            <h1 className="text-9xl font-bold tracking-tighter gradient-text animate-scale-in">
              FloatChat
            </h1>
            <p className="text-2xl lg:text-3xl accent-text font-semibold animate-fade-in">
              Turning complex ocean science into clear, actionable intelligence for everyone.
            </p>
            <p className="text-lg text-muted-foreground">
              The foundation of ocean science is data—ARGO floats, satellites, and models. But this data is locked away in technical formats, out of reach for most. FloatChat is your universal translator: it cleans, fuses, and simplifies raw data, letting you chat with the ocean and get answers instantly. No expertise required—just curiosity.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-6">
              <Button 
                variant="default" 
                size="xl"
                onClick={() => navigate('/auth')}
                className="group hover:pop smooth-transition accent-text"
              >
                Try FloatChat
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          </div>
        </div>
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
                    <img src="https://via.placeholder.com/96" alt="Profile Picture" className="w-full h-full object-cover" />
                </div>
                <h3 className="font-semibold mb-1">Jane Doe</h3>
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
                    <img src="https://via.placeholder.com/96" alt="Profile Picture" className="w-full h-full object-cover" />
                </div>
                <h3 className="font-semibold mb-1">John Smith</h3>
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
                    <img src="https://via.placeholder.com/96" alt="Profile Picture" className="w-full h-full object-cover" />
                </div>
                <h3 className="font-semibold mb-1">Emily Chen</h3>
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
                    <img src="https://via.placeholder.com/96" alt="Profile Picture" className="w-full h-full object-cover" />
                </div>
                <h3 className="font-semibold mb-1">Michael Rodriguez</h3>
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
                    <img src="https://via.placeholder.com/96" alt="Profile Picture" className="w-full h-full object-cover" />
                </div>
                <h3 className="font-semibold mb-1">Sarah Lee</h3>
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
                    <img src="https://via.placeholder.com/96" alt="Profile Picture" className="w-full h-full object-cover" />
                </div>
                <h3 className="font-semibold mb-1">David Wilson</h3>
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
            <Waves className="h-6 w-6 text-ocean-primary" />
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
      const light = [144, 224, 239]; // #90e0ef
      const dark = [0, 119, 182];   // #0077b6
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

