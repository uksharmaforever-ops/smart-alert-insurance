import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Customer, InsuranceType, MotorType } from '@/types/customer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { X } from 'lucide-react';

interface CustomerFormProps {
  customer?: Customer | null;
  onSubmit: (customer: Omit<Customer, 'id' | 'createdAt'>) => void;
  onClose: () => void;
}

const CustomerForm: React.FC<CustomerFormProps> = ({ customer, onSubmit, onClose }) => {
  const { t } = useLanguage();
  
  const [formData, setFormData] = useState({
    name: '',
    mobileNumber: '',
    whatsappNumber: '',
    address: '',
    insuranceType: '' as InsuranceType | '',
    policyNumber: '',
    motorType: '' as MotorType | '',
    vehicleNumber: '',
    startDate: '',
    expiryDate: '',
  });

  useEffect(() => {
    if (customer) {
      setFormData({
        name: customer.name,
        mobileNumber: customer.mobileNumber,
        whatsappNumber: customer.whatsappNumber,
        address: customer.address,
        insuranceType: customer.insuranceType,
        policyNumber: customer.policyNumber || '',
        motorType: customer.motorType || '',
        vehicleNumber: customer.vehicleNumber || '',
        startDate: customer.startDate,
        expiryDate: customer.expiryDate,
      });
    }
  }, [customer]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Clean phone numbers - remove +, country code, spaces
    const cleanMobile = formData.mobileNumber.replace(/[^0-9]/g, '').slice(-10);
    const cleanWhatsapp = formData.whatsappNumber.replace(/[^0-9]/g, '').slice(-10);
    
    onSubmit({
      name: formData.name,
      mobileNumber: cleanMobile,
      whatsappNumber: cleanWhatsapp,
      address: formData.address,
      insuranceType: formData.insuranceType as InsuranceType,
      policyNumber: formData.insuranceType !== 'motor' ? formData.policyNumber : undefined,
      motorType: formData.insuranceType === 'motor' ? formData.motorType as MotorType : undefined,
      vehicleNumber: formData.insuranceType === 'motor' ? formData.vehicleNumber : undefined,
      startDate: formData.startDate,
      expiryDate: formData.expiryDate,
    });
  };

  const isMotor = formData.insuranceType === 'motor';

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {customer ? t('edit') : t('addCustomer')}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">{t('customerName')} *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              placeholder="Enter customer name"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="mobile">{t('mobileNumber')} *</Label>
              <Input
                id="mobile"
                type="tel"
                value={formData.mobileNumber}
                onChange={(e) => setFormData({ ...formData, mobileNumber: e.target.value })}
                required
                placeholder="10-digit number"
                maxLength={10}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="whatsapp">{t('whatsappNumber')} *</Label>
              <Input
                id="whatsapp"
                type="tel"
                value={formData.whatsappNumber}
                onChange={(e) => setFormData({ ...formData, whatsappNumber: e.target.value })}
                required
                placeholder="10-digit number"
                maxLength={10}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">{t('address')} *</Label>
            <Textarea
              id="address"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              required
              placeholder="Enter full address"
              rows={2}
            />
          </div>

          <div className="space-y-2">
            <Label>{t('insuranceType')} *</Label>
            <Select
              value={formData.insuranceType}
              onValueChange={(value: InsuranceType) => 
                setFormData({ ...formData, insuranceType: value, policyNumber: '', motorType: '', vehicleNumber: '' })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder={t('selectOption')} />
              </SelectTrigger>
              <SelectContent className="bg-popover">
                <SelectItem value="health">{t('health')}</SelectItem>
                <SelectItem value="life">{t('life')}</SelectItem>
                <SelectItem value="home">{t('home')}</SelectItem>
                <SelectItem value="travel">{t('travel')}</SelectItem>
                <SelectItem value="business">{t('business')}</SelectItem>
                <SelectItem value="machine">{t('machine')}</SelectItem>
                <SelectItem value="property">{t('property')}</SelectItem>
                <SelectItem value="motor">{t('motor')}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {formData.insuranceType && !isMotor && (
            <div className="space-y-2 animate-fade-in">
              <Label htmlFor="policyNumber">{t('policyNumber')} *</Label>
              <Input
                id="policyNumber"
                value={formData.policyNumber}
                onChange={(e) => setFormData({ ...formData, policyNumber: e.target.value })}
                required
                placeholder="Enter policy number"
              />
            </div>
          )}

          {isMotor && (
            <>
              <div className="space-y-2 animate-fade-in">
                <Label>{t('motorType')} *</Label>
                <Select
                  value={formData.motorType}
                  onValueChange={(value: MotorType) => setFormData({ ...formData, motorType: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t('selectOption')} />
                  </SelectTrigger>
                  <SelectContent className="bg-popover">
                    <SelectItem value="car">{t('car')}</SelectItem>
                    <SelectItem value="bike">{t('bike')}</SelectItem>
                    <SelectItem value="scooter">{t('scooter')}</SelectItem>
                    <SelectItem value="truck">{t('truck')}</SelectItem>
                    <SelectItem value="bus">{t('bus')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2 animate-fade-in">
                <Label htmlFor="vehicleNumber">{t('vehicleNumber')} *</Label>
                <Input
                  id="vehicleNumber"
                  value={formData.vehicleNumber}
                  onChange={(e) => setFormData({ ...formData, vehicleNumber: e.target.value.toUpperCase() })}
                  required
                  placeholder="e.g., MH12AB1234"
                />
              </div>
            </>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startDate">{t('startDate')} *</Label>
              <Input
                id="startDate"
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="expiryDate">{t('expiryDate')} *</Label>
              <Input
                id="expiryDate"
                type="date"
                value={formData.expiryDate}
                onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              {t('cancel')}
            </Button>
            <Button type="submit" className="flex-1">
              {t('save')}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CustomerForm;
