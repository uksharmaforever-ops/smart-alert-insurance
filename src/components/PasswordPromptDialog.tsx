import React, { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Lock, Shield } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface PasswordPromptDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  title?: string;
  description?: string;
}

const PasswordPromptDialog: React.FC<PasswordPromptDialogProps> = ({
  open,
  onClose,
  onSuccess,
  title,
  description,
}) => {
  const { language } = useLanguage();
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const storedPassword = localStorage.getItem('exportPassword');
    
    if (!storedPassword) {
      toast({
        title: language === 'hi' ? 'पासवर्ड सेट नहीं है' : 'Password not set',
        description: language === 'hi' 
          ? 'कृपया पहले प्रोफ़ाइल में एक्सपोर्ट पासवर्ड सेट करें।' 
          : 'Please set an export password in your profile first.',
        variant: 'destructive',
      });
      onClose();
      return;
    }
    
    if (password === storedPassword) {
      setPassword('');
      onSuccess();
      onClose();
    } else {
      toast({
        title: language === 'hi' ? 'गलत पासवर्ड' : 'Wrong password',
        description: language === 'hi' 
          ? 'कृपया सही पासवर्ड दर्ज करें।' 
          : 'Please enter the correct password.',
        variant: 'destructive',
      });
    }
  };

  const handleClose = () => {
    setPassword('');
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-primary" />
            {title || (language === 'hi' ? 'पासवर्ड दर्ज करें' : 'Enter Password')}
          </DialogTitle>
          <DialogDescription>
            {description || (language === 'hi' 
              ? 'डेटा सुरक्षा के लिए कृपया अपना एक्सपोर्ट पासवर्ड दर्ज करें।' 
              : 'Please enter your export password to protect your data.')}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="exportPassword" className="flex items-center gap-2">
              <Lock className="w-4 h-4" />
              {language === 'hi' ? 'पासवर्ड' : 'Password'}
            </Label>
            <Input
              id="exportPassword"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={language === 'hi' ? 'पासवर्ड दर्ज करें' : 'Enter password'}
              required
              autoFocus
            />
          </div>

          <div className="flex gap-2">
            <Button type="button" variant="outline" onClick={handleClose} className="flex-1">
              {language === 'hi' ? 'रद्द करें' : 'Cancel'}
            </Button>
            <Button type="submit" className="flex-1">
              {language === 'hi' ? 'पुष्टि करें' : 'Confirm'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default PasswordPromptDialog;
