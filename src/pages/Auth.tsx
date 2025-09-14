import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, Waves, Mail, Lock, Github } from 'lucide-react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

const Auth: React.FC = () => {
  const navigate = useNavigate();
  const { user, signIn, signUp } = useAuth();
  
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
    
    <div className="absolute inset-0 bg-glow-gradient opacity-20" />
    <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-ocean-primary/10 rounded-full blur-3xl" />
    <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-ocean-secondary/10 rounded-full blur-3xl" />
    
    <Button
      variant="ghost"
      onClick={() => navigate('/')}
      className="absolute top-6 left-6 z-10"
    >
      <ArrowLeft className="mr-2 h-4 w-4" />
      Back to Home
    </Button>

    <Card className="w-full max-w-md mx-4 card-shadow border-ocean-primary/20 relative z-10 animate-scale-in">
      <CardHeader className="text-center space-y-4">
        <div className="flex items-center justify-center gap-2">
          <div className="p-2 bg-ocean-gradient rounded-full">
            <Waves className="h-6 w-6 text-primary-foreground" />
          </div>
          <span className="text-2xl font-bold">FloatChat</span>
        </div>
        
        <CardTitle className="text-2xl">{isSignUp ? 'Create an Account' : 'Welcome Back'}</CardTitle>
        <CardDescription>
          {isSignUp ? 'Enter your details to start your journey' : 'Sign in to access your ocean data dashboard'}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        <form onSubmit={handleAuthAction} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10 border-ocean-primary/20 focus:border-ocean-primary"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10 border-ocean-primary/20 focus:border-ocean-primary"
                required
              />
            </div>
          </div>

          <Button 
            type="submit" 
            variant="ocean" 
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                Processing...
              </div>
            ) : (
              isSignUp ? 'Sign Up' : 'Sign In'
            )}
          </Button>
        </form>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <Separator className="w-full" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              {isSignUp ? 'Already have an account?' : "Don't have an account?"}
            </span>
          </div>
        </div>
        
        <Button
          variant="outline"
          className="w-full"
          onClick={() => setIsSignUp(!isSignUp)}
        >
          {isSignUp ? 'Sign In Instead' : 'Create a New Account'}
        </Button>
      </CardContent>
    </Card>
  </div>
 );
};

export default Auth;
