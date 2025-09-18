import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Train, Mail, Lock, User, Eye, EyeOff } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    rememberMe: false
  });
  
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Store auth state in localStorage for demo
      localStorage.setItem('metrosynapse_auth', JSON.stringify({
        isAuthenticated: true,
        user: {
          name: formData.name || 'User',
          email: formData.email
        }
      }));

      toast({
        title: isLogin ? "Welcome back!" : "Account created!",
        description: isLogin 
          ? "Successfully logged into MetroSynapse." 
          : "Welcome to MetroSynapse! Redirecting to dashboard...",
      });

      // Smooth transition to dashboard
      setTimeout(() => {
        navigate('/dashboard');
      }, 1000);
      
    } catch (error) {
      toast({
        title: "Authentication failed",
        description: "Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setFormData({
      name: '',
      email: '',
      password: '',
      rememberMe: false
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 flex">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-blue-600 to-primary-glow opacity-90"></div>
        
        {/* Animated background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-32 h-32 border border-white rounded-full animate-pulse"></div>
          <div className="absolute bottom-32 right-16 w-24 h-24 border border-white rounded-full animate-pulse delay-700"></div>
          <div className="absolute top-1/2 left-10 w-16 h-16 border border-white rounded-full animate-pulse delay-1000"></div>
        </div>

        <div className="relative z-10 flex flex-col justify-center px-12 py-20 text-white">
          {/* Logo and Title */}
          <div className="flex items-center space-x-4 mb-8">
            <div className="relative">
              <Train className="h-16 w-16 text-white animate-fade-in" />
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full animate-pulse"></div>
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
                🚇 MetroSynapse
              </h1>
              <p className="text-xl font-medium text-blue-100 mt-1">
                AI-Driven Train Induction Planner
              </p>
            </div>
          </div>

          {/* Subtitle */}
          <h2 className="text-2xl font-semibold mb-4 text-blue-50">
            Smarter Train Scheduling for Kochi Metro
          </h2>
          
          <p className="text-lg text-blue-100 mb-8">
            AI + Rule Engine to optimize fitness, maintenance, branding, mileage, and depot layout
          </p>

          {/* Description */}
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <p className="text-blue-50 leading-relaxed">
              Our platform automates Kochi Metro's daily induction planning by combining 6 data sources 
              (fitness, maintenance logs, branding, mileage, cleaning, stabling) into one ranked decision 
              list with explainable insights.
            </p>
          </div>

          {/* Animated train */}
          <div className="mt-12 relative">
            <div className="flex items-center space-x-2 animate-pulse">
              <Train className="h-8 w-8 text-yellow-400" />
              <div className="h-1 w-32 bg-gradient-to-r from-yellow-400 to-transparent rounded-full"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Auth Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Mobile branding */}
          <div className="lg:hidden text-center mb-8">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <Train className="h-12 w-12 text-primary" />
              <h1 className="text-3xl font-bold text-white">MetroSynapse</h1>
            </div>
            <p className="text-blue-200">AI-Driven Train Induction Planner</p>
          </div>

          <Card className="glass-card border-white/20 shadow-2xl">
            <CardHeader className="text-center pb-6">
              <CardTitle className="text-2xl font-bold text-white">
                {isLogin ? 'Welcome Back' : 'Join MetroSynapse'}
              </CardTitle>
              <p className="text-blue-200 mt-2">
                {isLogin 
                  ? 'Sign in to access your dashboard' 
                  : 'Create your account to get started'
                }
              </p>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {!isLogin && (
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-blue-100 font-medium">
                      Full Name
                    </Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-blue-300" />
                      <Input
                        id="name"
                        name="name"
                        type="text"
                        placeholder="Enter your full name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="auth-input pl-10"
                        required={!isLogin}
                      />
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-blue-100 font-medium">
                    Email Address
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-blue-300" />
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="Enter your email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="auth-input pl-10"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-blue-100 font-medium">
                    Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-blue-300" />
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className="auth-input pl-10 pr-10"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-300 hover:text-blue-100 transition-colors"
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>

                {isLogin && (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <input
                        id="rememberMe"
                        name="rememberMe"
                        type="checkbox"
                        checked={formData.rememberMe}
                        onChange={handleInputChange}
                        className="h-4 w-4 rounded border-blue-300 text-primary focus:ring-primary focus:ring-offset-0"
                      />
                      <Label htmlFor="rememberMe" className="text-blue-200 text-sm">
                        Remember me
                      </Label>
                    </div>
                    <button
                      type="button"
                      className="text-sm text-primary hover:text-primary-glow transition-colors"
                    >
                      Forgot password?
                    </button>
                  </div>
                )}

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full auth-button text-lg py-6 font-semibold"
                >
                  {isLoading ? (
                    <div className="flex items-center space-x-2">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span>Processing...</span>
                    </div>
                  ) : (
                    isLogin ? 'Sign In' : 'Create Account'
                  )}
                </Button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-blue-200">
                  {isLogin ? "Don't have an account?" : "Already have an account?"}
                  <button
                    onClick={toggleMode}
                    className="ml-2 text-primary hover:text-primary-glow font-semibold transition-colors"
                  >
                    {isLogin ? 'Sign up' : 'Sign in'}
                  </button>
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Motivational tagline */}
          <div className="text-center mt-8">
            <p className="text-blue-200 font-medium">
              🚆 MetroSynapse – Making every train count, every journey smarter.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}