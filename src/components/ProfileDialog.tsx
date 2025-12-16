import React, { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { toast } from '@/hooks/use-toast';
import { User, Lock, Phone, Globe, Shield } from 'lucide-react';

interface ProfileDialogProps {
  open: boolean;
  onClose: () => void;
}

const ProfileDialog: React.FC<ProfileDialogProps> = ({ open, onClose }) => {
  const { t, language, setLanguage } = useLanguage();
  const { user, changePassword } = useAuth();
  
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // Export password state
  const [showExportPassword, setShowExportPassword] = useState(false);
  const [exportPassword, setExportPassword] = useState('');
  const [confirmExportPassword, setConfirmExportPassword] = useState('');
  const [hasExportPassword, setHasExportPassword] = useState(() => !!localStorage.getItem('exportPassword'));

  const handleSetExportPassword = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (exportPassword.length < 4) {
      toast({
        title: language === 'hi' ? 'त्रुटि' : 'Error',
        description: language === 'hi' ? 'पासवर्ड कम से कम 4 अक्षर का होना चाहिए।' : 'Password must be at least 4 characters.',
        variant: 'destructive',
      });
      return;
    }
    
    if (exportPassword !== confirmExportPassword) {
      toast({
        title: language === 'hi' ? 'त्रुटि' : 'Error',
        description: language === 'hi' ? 'पासवर्ड मेल नहीं खाते।' : 'Passwords do not match.',
        variant: 'destructive',
      });
      return;
    }
    
    localStorage.setItem('exportPassword', exportPassword);
    setHasExportPassword(true);
    setShowExportPassword(false);
    setExportPassword('');
    setConfirmExportPassword('');
    toast({
      title: language === 'hi' ? 'एक्सपोर्ट पासवर्ड सेट हो गया!' : 'Export password set!',
    });
  };

  const handleRemoveExportPassword = () => {
    localStorage.removeItem('exportPassword');
    setHasExportPassword(false);
    toast({
      title: language === 'hi' ? 'एक्सपोर्ट पासवर्ड हटा दिया गया।' : 'Export password removed.',
    });
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      toast({
        title: 'Error',
        description: 'New passwords do not match',
        variant: 'destructive',
      });
      return;
    }

    const success = changePassword(oldPassword, newPassword);
    if (success) {
      toast({ title: t('passwordChanged') });
      setShowChangePassword(false);
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } else {
      toast({
        title: 'Error',
        description: 'Old password is incorrect',
        variant: 'destructive',
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            {t('profile')}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* User Info */}
          <div className="p-4 bg-muted rounded-lg">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full gradient-primary flex items-center justify-center">
                <User className="w-6 h-6 text-primary-foreground" />
          </div>

          {/* Export Password Section */}
          <div className="p-4 border rounded-lg space-y-3">
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-muted-foreground" />
              <span className="font-medium">
                {language === 'hi' ? 'एक्सपोर्ट पासवर्ड' : 'Export Password'}
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              {language === 'hi' 
                ? 'डेटा एक्सपोर्ट या WhatsApp शेयर करने से पहले यह पासवर्ड मांगा जाएगा।' 
                : 'This password will be required before exporting or sharing data via WhatsApp.'}
            </p>
            
            {!showExportPassword ? (
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowExportPassword(true)}
                  className="flex-1"
                >
                  <Lock className="w-4 h-4 mr-2" />
                  {hasExportPassword 
                    ? (language === 'hi' ? 'पासवर्ड बदलें' : 'Change Password') 
                    : (language === 'hi' ? 'पासवर्ड सेट करें' : 'Set Password')}
                </Button>
                {hasExportPassword && (
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={handleRemoveExportPassword}
                  >
                    {language === 'hi' ? 'हटाएं' : 'Remove'}
                  </Button>
                )}
              </div>
            ) : (
              <form onSubmit={handleSetExportPassword} className="space-y-3">
                <div className="space-y-2">
                  <Label htmlFor="exportPwd">
                    {language === 'hi' ? 'नया पासवर्ड' : 'New Password'}
                  </Label>
                  <Input
                    id="exportPwd"
                    type="password"
                    value={exportPassword}
                    onChange={(e) => setExportPassword(e.target.value)}
                    placeholder={language === 'hi' ? 'कम से कम 4 अक्षर' : 'At least 4 characters'}
                    required
                    minLength={4}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmExportPwd">
                    {language === 'hi' ? 'पासवर्ड की पुष्टि करें' : 'Confirm Password'}
                  </Label>
                  <Input
                    id="confirmExportPwd"
                    type="password"
                    value={confirmExportPassword}
                    onChange={(e) => setConfirmExportPassword(e.target.value)}
                    placeholder={language === 'hi' ? 'दोबारा दर्ज करें' : 'Enter again'}
                    required
                    minLength={4}
                  />
                </div>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setShowExportPassword(false);
                      setExportPassword('');
                      setConfirmExportPassword('');
                    }}
                    className="flex-1"
                  >
                    {t('cancel')}
                  </Button>
                  <Button type="submit" size="sm" className="flex-1">
                    {t('save')}
                  </Button>
                </div>
              </form>
            )}
          </div>
              <div>
                <p className="font-medium flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  {user?.mobileNumber || (language === 'hi' ? 'बिना लॉगिन (केवल लोकल डेटा)' : 'No login (local data only)')}
                </p>
                <p className="text-sm text-muted-foreground">
                  {user
                    ? 'Registered User'
                    : language === 'hi'
                      ? 'यह ऐप केवल आपके मोबाइल में लोकल डेटा सेव करता है।'
                      : 'This app stores data only on this device (no account).'}
                </p>
              </div>
            </div>
          </div>

          {/* Language Toggle */}
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center gap-2">
              <Globe className="w-5 h-5 text-muted-foreground" />
              <span>{t('language')}</span>
            </div>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant={language === 'en' ? 'default' : 'outline'}
                onClick={() => setLanguage('en')}
              >
                {t('english')}
              </Button>
              <Button
                size="sm"
                variant={language === 'hi' ? 'default' : 'outline'}
                onClick={() => setLanguage('hi')}
              >
                {t('hindi')}
              </Button>
            </div>
          </div>

          {/* Change Password */}
          {user && (
            !showChangePassword ? (
              <Button
                variant="outline"
                className="w-full"
                onClick={() => setShowChangePassword(true)}
              >
                <Lock className="w-4 h-4 mr-2" />
                {t('changePassword')}
              </Button>
            ) : (
              <form onSubmit={handleChangePassword} className="space-y-4 p-4 border rounded-lg">
                <div className="space-y-2">
                  <Label htmlFor="oldPassword">{t('oldPassword')}</Label>
                  <Input
                    id="oldPassword"
                    type="password"
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="newPassword">{t('newPassword')}</Label>
                  <Input
                    id="newPassword"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    minLength={6}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmNewPassword">{t('confirmPassword')}</Label>
                  <Input
                    id="confirmNewPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    minLength={6}
                  />
                </div>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setShowChangePassword(false);
                      setOldPassword('');
                      setNewPassword('');
                      setConfirmPassword('');
                    }}
                    className="flex-1"
                  >
                    {t('cancel')}
                  </Button>
                  <Button type="submit" className="flex-1">
                    {t('save')}
                  </Button>
                </div>
              </form>
            )
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProfileDialog;
