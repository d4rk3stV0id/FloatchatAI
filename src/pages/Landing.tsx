import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Globe3D from '@/components/Globe3D';
import ThemeToggle from '@/components/ThemeToggle';
import { ArrowRight, Waves, Database, BarChart3, MapPin, Mail, Phone, Globe as GlobeIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Spline from '@splinetool/react-spline';

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
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm border-b border-border/50">
        <div className="container mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <Waves className="h-6 w-6 text-ocean-primary" />
            <span className="text-xl font-bold">FloatChat</span>
          </div>
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
            <a onClick={() => scrollToSection('features')} className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer">Features</a>
            <a onClick={() => scrollToSection('mission')} className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer">Mission</a>
            <a onClick={() => scrollToSection('contact')} className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer">Contact</a>
          </nav>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Button onClick={() => navigate('/auth')} variant="default" className="hidden sm:flex">
              Launch App
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>
      
      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center pt-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-glow-gradient opacity-30" />
        
        <div className={`container mx-auto px-6 text-center relative z-10 transition-all duration-1000 ${
          isVisible ? 'animate-fade-in-up' : 'opacity-0'
        }`}>
          <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
            
            {/* Left Content */}
            <div className="lg:w-1/2 lg:text-left space-y-8">
              <div className="space-y-4">
                <h1 className="text-5xl lg:text-7xl font-bold tracking-tighter bg-gradient-to-r from-ocean-primary to-ocean-secondary bg-clip-text text-transparent">
                  FloatChat
                </h1>
                <p className="text-2xl lg:text-3xl text-muted-foreground font-light">
                  AI-Powered ARGO Ocean Data Intelligence
                </p>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto lg:mx-0">
                  Unlock the secrets of our oceans through advanced AI conversation. 
                  Interact with real-time ARGO float data like never before.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Button 
                  variant="default" 
                  size="xl"
                  onClick={() => navigate('/auth')}
                  className="group"
                >
                  Launch Application
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
            </div>

            {/* Right Content - Globe */}
            <div className="lg:w-1/2 flex justify-center">
              <Spline scene="https://prod.spline.design/FP7uygAMV9h6Hopl/scene.splinecode" className="flex justify-center"/>
              {/*<div className="relative">
                <Globe3D className="animate-scale-in" />
                <div className="absolute -inset-4 bg-ocean-primary/20 blur-xl rounded-full animate-ocean-pulse" />
              </div>*/}
            </div>
          </div>
        </div>

      </section>

      {/* Features Section */}
      <section id="features" className="py-24 px-6">
        <div className="container mx-auto">
          <div className="text-center mb-16 animate-fade-in-up">
            <h2 className="text-4xl font-bold tracking-tighter mb-6">Ocean Intelligence Platform</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Revolutionizing oceanographic research through conversational AI and real-time data visualization.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="p-8 text-center hover:shadow-glow transition-all duration-300 border-ocean-primary/20 card-shadow">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-ocean-gradient rounded-full mb-6">
                <Database className="h-8 w-8 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Real-time ARGO Data</h3>
              <p className="text-muted-foreground">
                Access live data from thousands of ARGO floats worldwide, 
                providing unprecedented ocean insights.
              </p>
            </Card>

            <Card className="p-8 text-center hover:shadow-glow transition-all duration-300 border-ocean-primary/20 card-shadow">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-ocean-gradient rounded-full mb-6">
                <BarChart3 className="h-8 w-8 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-4">AI Visualizations</h3>
              <p className="text-muted-foreground">
                Generate complex data visualizations through natural language queries 
                and intelligent analysis.
              </p>
            </Card>

            <Card className="p-8 text-center hover:shadow-glow transition-all duration-300 border-ocean-primary/20 card-shadow">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-ocean-gradient rounded-full mb-6">
                <MapPin className="h-8 w-8 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Interactive Mapping</h3>
              <p className="text-muted-foreground">
                Explore ocean data through intuitive interactive maps 
                focused on critical research regions.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section id="mission" className="py-24 px-6 bg-card/50">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="animate-fade-in-up">
              <h2 className="text-4xl font-bold tracking-tighter mb-6">Our Mission</h2>
              <p className="text-lg text-muted-foreground mb-6">
                FloatChat bridges the gap between complex oceanographic data and intuitive understanding. 
                Our AI-powered platform makes ARGO float data accessible to researchers, students, and 
                ocean enthusiasts worldwide.
              </p>
              <p className="text-lg text-muted-foreground mb-8">
                By leveraging advanced machine learning and conversational AI, we're democratizing 
                ocean science and accelerating marine research discoveries.
              </p>
            </div>

            <div className="relative">
              <Card className="p-8 card-shadow border-ocean-primary/20">
                <h3 className="text-2xl font-semibold mb-4">The ARGO Network</h3>
                <p className="text-muted-foreground mb-6">
                  The global ARGO network consists of over 4,000 autonomous floats 
                  that continuously monitor ocean temperature, salinity, and currents 
                  down to 2000m depth.
                </p>
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-3xl font-bold text-ocean-primary">4000+</div>
                    <div className="text-sm text-muted-foreground">Active Floats</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-ocean-primary">2000m</div>
                    <div className="text-sm text-muted-foreground">Max Depth</div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-24 px-6">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold tracking-tighter mb-6">Get in Touch</h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                We're excited to hear from you. Reach out with any questions or collaboration ideas.
              </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <Card className="p-6 text-center card-shadow border-ocean-primary/20">
              <Mail className="h-8 w-8 text-ocean-primary mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Email</h3>
              <a href="mailto:contact@floatchat.com" className="text-muted-foreground hover:text-ocean-primary">contact@floatchat.com</a>
            </Card>

            <Card className="p-6 text-center card-shadow border-ocean-primary/20">
              <Phone className="h-8 w-8 text-ocean-primary mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Phone</h3>
              <p className="text-muted-foreground">+91 80 1234 5678</p>
            </Card>

            <Card className="p-6 text-center card-shadow border-ocean-primary/20">
              <GlobeIcon className="h-8 w-8 text-ocean-primary mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Website</h3>
              <p className="text-muted-foreground">www.floatchat.com</p>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-border/50 bg-card/20">
        <div className="container mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Waves className="h-6 w-6 text-ocean-primary" />
            <span className="text-xl font-bold">FloatChat</span>
          </div>
          <p className="text-muted-foreground">
            © 2025 FloatChat. Revolutionizing ocean data through AI.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;

