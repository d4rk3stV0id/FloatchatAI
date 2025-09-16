import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, Waves, Mail, Lock, Sparkles, Shield } from 'lucide-react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { motion, useScroll, useTransform } from 'framer-motion';
import InteractiveCursor from '@/components/InteractiveCursor';
import FloatingParticles from '@/components/FloatingParticles';
import CausticAnimation from '@/components/CausticAnimation';

const Auth: React.FC = () => {
  const navigate = useNavigate();
  const { user, signIn, signUp } = useAuth();
  const { scrollYProgress } = useScroll();
  const backgroundY = useTransform(scrollYProgress, [0, 1], [0, -50]);
  
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleAuthAction = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (isSignUp) {
      await signUp(email, password);
    } else {
      await signIn(email, password);
    }
    
    setIsLoading(false);
  };

  const handleSocialLogin = (provider: 'google' | 'github') => {
    // This can be implemented later if needed
    console.log(`Signing in with ${provider}`);
  };

 return (
  <div className="min-h-screen bg-background flex items-center justify-center relative overflow-hidden">
    <InteractiveCursor />
    <FloatingParticles />
    
    {/* Background Effects */}
    <motion.div 
      className="absolute inset-0"
      style={{ y: backgroundY }}
    >
      <div className="absolute inset-0 bg-glow-gradient opacity-20" />
      <CausticAnimation />
    </motion.div>
    
    <motion.div
      className="absolute top-1/4 left-1/4 w-96 h-96 bg-ocean-primary/10 rounded-full blur-3xl"
      animate={{ 
        scale: [1, 1.2, 1],
        opacity: [0.1, 0.2, 0.1]
      }}
      transition={{ 
        duration: 8,
        repeat: Infinity,
        ease: "easeInOut"
      }}
    />
    <motion.div
      className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"
      animate={{ 
        scale: [1, 1.3, 1],
        opacity: [0.1, 0.15, 0.1]
      }}
      transition={{ 
        duration: 6,
        repeat: Infinity,
        ease: "easeInOut",
        delay: 2
      }}
    />
    
    <motion.div
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      whileHover={{ scale: 1.05, x: -5 }}
      whileTap={{ scale: 0.95 }}
      className="absolute top-6 left-6 z-20"
    >
      <Button
        variant="ghost"
        onClick={() => navigate('/')}
        className="interactive bg-background/80 backdrop-blur-sm border border-border/20 hover:border-ocean-primary/30 hover:bg-background/90"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Home
      </Button>
    </motion.div>

    <motion.div
      initial={{ opacity: 0, scale: 0.8, y: 50 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ 
        duration: 0.8,
        type: "spring",
        bounce: 0.3
      }}
      className="w-full max-w-md mx-4 relative z-10"
    >
      <Card className="card-shadow border-ocean-primary/20 bg-background/80 backdrop-blur-xl relative overflow-hidden">
        {/* Animated Border */}
        <motion.div
          className="absolute inset-0 rounded-lg"
          style={{
            background: "linear-gradient(45deg, transparent, rgba(180, 180, 180, 0.1), transparent)",
          }}
          animate={{
            rotate: [0, 360],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "linear",
          }}
        />
        
        <CardHeader className="text-center space-y-4 relative z-10">
          <motion.div 
            className="flex items-center justify-center gap-2"
            whileHover={{ scale: 1.1 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <motion.div 
              className="p-3 bg-gradient-to-r from-blue-900 to-cyan-400 rounded-full relative"
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            >
              <Waves className="h-6 w-6 text-white" />
              <motion.div
                className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500/50 to-cyan-300/50"
                animate={{ 
                  scale: [1, 1.2, 1],
                  opacity: [0.5, 0.8, 0.5]
                }}
                transition={{ 
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
            </motion.div>
            <motion.span 
              className="text-2xl font-bold bg-gradient-to-r from-blue-900 via-blue-600 to-cyan-400 bg-clip-text text-transparent"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              FloatChat
            </motion.span>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <CardTitle className="text-2xl flex items-center justify-center gap-2">
              {isSignUp ? (
                <>
                  <Sparkles className="h-5 w-5 text-ocean-primary" />
                  Create an Account
                </>
              ) : (
                <>
                  <Shield className="h-5 w-5 text-ocean-primary" />
                  Welcome Back
                </>
              )}
            </CardTitle>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              <CardDescription className="text-base">
                {isSignUp 
                  ? 'Enter your details to start your journey into ocean intelligence' 
                  : 'Sign in to access your personalized ocean data dashboard'
                }
              </CardDescription>
            </motion.div>
          </motion.div>
        </CardHeader>

        <CardContent className="space-y-6 relative z-10">
          <motion.form 
            onSubmit={handleAuthAction} 
            className="space-y-4"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <motion.div 
              className="space-y-2"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Label htmlFor="email" className="text-sm font-medium">Email Address</Label>
              <div className="relative group">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-ocean-primary transition-colors" />
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 border-border/40 focus:border-ocean-primary focus:ring-2 focus:ring-ocean-primary/20 transition-all duration-300 bg-background/50 backdrop-blur-sm interactive"
                  required
                />
              </div>
            </motion.div>

            <motion.div 
              className="space-y-2"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Label htmlFor="password" className="text-sm font-medium">Password</Label>
              <div className="relative group">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-ocean-primary transition-colors" />
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 border-border/40 focus:border-ocean-primary focus:ring-2 focus:ring-ocean-primary/20 transition-all duration-300 bg-background/50 backdrop-blur-sm interactive"
                  required
                />
              </div>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button 
                type="submit" 
                className="w-full ocean-button relative overflow-hidden group interactive mt-6"
                disabled={isLoading}
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                  initial={{ x: "-100%" }}
                  whileHover={{ x: "100%" }}
                  transition={{ duration: 0.6 }}
                />
                <span className="relative z-10 flex items-center justify-center">
                  {isLoading ? (
                    <motion.div 
                      className="flex items-center gap-2"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      <motion.div 
                        className="w-4 h-4 border-2 border-current border-t-transparent rounded-full"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      />
                      Processing...
                    </motion.div>
                  ) : (
                    <>
                      {isSignUp ? (
                        <>
                          <Sparkles className="mr-2 h-4 w-4" />
                          Create Account
                        </>
                      ) : (
                        <>
                          <Shield className="mr-2 h-4 w-4" />
                          Sign In
                        </>
                      )}
                    </>
                  )}
                </span>
              </Button>
            </motion.div>
          </motion.form>

          <motion.div 
            className="relative"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
          >
            <div className="absolute inset-0 flex items-center">
              <Separator className="w-full bg-gradient-to-r from-transparent via-border to-transparent" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-4 py-1 text-muted-foreground rounded-full border border-border/30">
                {isSignUp ? 'Already have an account?' : "Don't have an account?"}
              </span>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Button
              variant="outline"
              className="w-full interactive border-border/40 hover:border-ocean-primary/50 hover:bg-ocean-primary/5 transition-all duration-300"
              onClick={() => setIsSignUp(!isSignUp)}
            >
              {isSignUp ? (
                <>
                  <Shield className="mr-2 h-4 w-4" />
                  Sign In Instead
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Create a New Account
                </>
              )}
            </Button>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  </div>
 );
};

export default Auth;
