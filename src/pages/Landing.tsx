import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Globe3D from '@/components/Globe3D';
import ThemeToggle from '@/components/ThemeToggle';
import { ArrowRight, Waves, Database, BarChart3, MapPin, Mail, Phone, Globe } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Landing: React.FC = () => {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const scrollToBottom = () => {
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-background">
      <ThemeToggle />
      
      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-glow-gradient opacity-30" />
        
        <div className={`container mx-auto px-6 text-center relative z-10 transition-all duration-1000 ${
          isVisible ? 'animate-fade-in-up' : 'opacity-0'
        }`}>
          <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
            
            {/* Left Content */}
            <div className="lg:w-1/2 space-y-8">
              <div className="space-y-4">
                <h1 className="text-6xl lg:text-7xl font-bold bg-gradient-to-r from-ocean-primary to-ocean-secondary bg-clip-text text-transparent">
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
                  variant="hero" 
                  size="xl"
                  onClick={() => navigate('/auth')}
                  className="group"
                >
                  Launch Application
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
                
                <Button 
                  variant="outline" 
                  size="xl"
                  onClick={scrollToBottom}
                  className="border-ocean-primary/30 text-ocean-primary hover:bg-ocean-primary/10"
                >
                  Learn More
                </Button>
              </div>
            </div>

            {/* Right Content - Globe */}
            <div className="lg:w-1/2 flex justify-center">
              <div className="relative">
                <Globe3D className="animate-scale-in" />
                <div className="absolute -inset-4 bg-ocean-primary/20 blur-xl rounded-full animate-ocean-pulse" />
              </div>
            </div>
          </div>
        </div>

        {/* Floating CTA Button */}
        <Button
          variant="ocean"
          size="lg"
          onClick={() => navigate('/auth')}
          className="fixed bottom-8 right-8 z-50 animate-float-gentle shadow-2xl"
        >
          <Waves className="mr-2 h-5 w-5" />
          Launch App
        </Button>
      </section>

      {/* Features Section */}
      <section className="py-24 px-6">
        <div className="container mx-auto">
          <div className="text-center mb-16 animate-fade-in-up">
            <h2 className="text-4xl font-bold mb-6">Ocean Intelligence Platform</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Revolutionizing oceanographic research through conversational AI and real-time data visualization
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

      {/* About Section */}
      <section className="py-24 px-6 bg-card/50">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="animate-fade-in-up">
              <h2 className="text-4xl font-bold mb-6">Our Mission</h2>
              <p className="text-lg text-muted-foreground mb-6">
                FloatChat bridges the gap between complex oceanographic data and intuitive understanding. 
                Our AI-powered platform makes ARGO float data accessible to researchers, students, and 
                ocean enthusiasts worldwide.
              </p>
              <p className="text-lg text-muted-foreground mb-8">
                By leveraging advanced machine learning and conversational AI, we're democratizing 
                ocean science and accelerating marine research discoveries.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-ocean-primary rounded-full" />
                  <span>Advanced AI-powered data analysis</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-ocean-primary rounded-full" />
                  <span>Real-time global ocean monitoring</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-ocean-primary rounded-full" />
                  <span>Intuitive visualization tools</span>
                </div>
              </div>
            </div>

            <div className="relative">
              <Card className="p-8 card-shadow border-ocean-primary/20">
                <h3 className="text-2xl font-semibold mb-4">ARGO Network</h3>
                <p className="text-muted-foreground mb-6">
                  The global ARGO network consists of over 4,000 autonomous floats 
                  that continuously monitor ocean temperature, salinity, and currents 
                  down to 2000m depth.
                </p>
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-ocean-primary">4000+</div>
                    <div className="text-sm text-muted-foreground">Active Floats</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-ocean-primary">2000m</div>
                    <div className="text-sm text-muted-foreground">Max Depth</div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-24 px-6" id="contact">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6">Get in Touch</h2>
            <p className="text-xl text-muted-foreground">
              Ready to explore the depths of ocean data? Contact our team today.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <Card className="p-6 text-center card-shadow border-ocean-primary/20">
              <Mail className="h-8 w-8 text-ocean-primary mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Email</h3>
              <p className="text-muted-foreground">contact@floatchat.com</p>
            </Card>

            <Card className="p-6 text-center card-shadow border-ocean-primary/20">
              <Phone className="h-8 w-8 text-ocean-primary mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Phone</h3>
              <p className="text-muted-foreground">+1 (555) 123-4567</p>
            </Card>

            <Card className="p-6 text-center card-shadow border-ocean-primary/20">
              <Globe className="h-8 w-8 text-ocean-primary mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Website</h3>
              <p className="text-muted-foreground">www.floatchat.com</p>
            </Card>
          </div>

          {/* Final CTA */}
          <div className="text-center mt-16">
            <Button 
              variant="hero" 
              size="xl"
              onClick={() => navigate('/auth')}
              className="group animate-ocean-pulse"
            >
              Start Your Ocean Journey
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-border/50">
        <div className="container mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Waves className="h-6 w-6 text-ocean-primary" />
            <span className="text-xl font-bold">FloatChat</span>
          </div>
          <p className="text-muted-foreground">
            © 2024 FloatChat. Revolutionizing ocean data through AI.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;