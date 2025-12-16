import React, { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';
import { Shield, User, Lock, Phone } from 'lucide-react';

const AuthPage: React.FC = () => {
  const { t } = useLanguage();
  const { login, register } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [mobileNumber, setMobileNumber] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Clean mobile number - remove +, country code, spaces
    const cleanMobile = mobileNumber.replace(/[^0-9]/g, '').slice(-10);
    
    if (cleanMobile.length !== 10) {
      toast({
        title: 'Error',
        description: 'Please enter a valid 10-digit mobile number',
        variant: 'destructive',
      });
      setLoading(false);
      return;
    }

    if (!isLogin && password !== confirmPassword) {
      toast({
        title: 'Error',
        description: 'Passwords do not match',
        variant: 'destructive',
      });
      setLoading(false);
      return;
    }

    setTimeout(() => {
      if (isLogin) {
        const success = login(cleanMobile, password);
        if (success) {
          toast({ title: t('loginSuccess') });
        } else {
          toast({
            title: 'Error',
            description: 'Invalid credentials',
            variant: 'destructive',
          });
        }
      } else {
        const success = register(cleanMobile, password);
        if (success) {
          toast({ title: t('registerSuccess') });
        } else {
          toast({
            title: 'Error',
            description: 'Mobile number already registered',
            variant: 'destructive',
          });
        }
      }
      setLoading(false);
    }, 500);
  };

  return (
    <div className="min-h-screen gradient-hero flex items-center justify-center p-4">
      <div className="w-full max-w-md animate-slide-up">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full gradient-primary shadow-glow mb-4">
            <Shield className="w-10 h-10 text-primary-foreground" />
          </div>
          <h1 className="text-3xl font-bold text-primary-foreground mb-2">
            Insurance Reminder
          </h1>
          <p className="text-muted-foreground">
            बीमा समाप्ति अनुस्मारक
          </p>
        </div>

        <Card className="shadow-card border-0">
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-2xl text-center">
              {isLogin ? t('login') : t('register')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="mobile" className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  {t('mobileNumber')}
                </Label>
                <Input
                  id="mobile"
                  type="tel"
                  placeholder="Enter 10-digit mobile number"
                  value={mobileNumber}
                  onChange={(e) => setMobileNumber(e.target.value)}
                  required
                  maxLength={10}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="flex items-center gap-2">
                  <Lock className="w-4 h-4" />
                  {t('password')}
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                />
              </div>

              {!isLogin && (
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="flex items-center gap-2">
                    <Lock className="w-4 h-4" />
                    {t('confirmPassword')}
                  </Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="Confirm password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    minLength={6}
                  />
                </div>
              )}

              <Button type="submit" className="w-full" size="lg" disabled={loading}>
                {loading ? '...' : isLogin ? t('login') : t('register')}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <button
                type="button"
                onClick={() => setIsLogin(!isLogin)}
                className="text-primary hover:underline text-sm font-medium"
              >
                {isLogin ? t('register') : t('login')} →
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AuthPage;
