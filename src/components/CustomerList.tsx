import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Customer, insuranceTypeLabels, motorTypeLabels } from '@/types/customer';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { shareOnWhatsApp, makeCall } from '@/utils/whatsapp';
import { format, parseISO } from 'date-fns';
import { cn } from '@/lib/utils';
import {
  Edit, Trash2, MessageCircle, Phone, MapPin, Calendar, Car, Bike, FileText, User
} from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

interface CustomerListProps {
  customers: Customer[];
  onEdit: (customer: Customer) => void;
  onDelete: (id: string) => void;
  getDaysUntilExpiry: (expiryDate: string) => number;
}

const CustomerList: React.FC<CustomerListProps> = ({
  customers,
  onEdit,
  onDelete,
  getDaysUntilExpiry,
}) => {
  const { t, language } = useLanguage();

  const getDaysColor = (days: number) => {
    if (days < 0) return 'bg-destructive text-destructive-foreground';
    if (days <= 2) return 'bg-destructive text-destructive-foreground';
    if (days <= 7) return 'bg-warning text-warning-foreground';
    if (days <= 15) return 'bg-warning/80 text-warning-foreground';
    return 'bg-success text-success-foreground';
  };

  const getMotorIcon = (motorType?: string) => {
    switch (motorType) {
      case 'car':
        return <Car className="w-4 h-4" />;
      case 'bike':
      case 'scooter':
        return <Bike className="w-4 h-4" />;
      default:
        return null;
    }
  };

  if (customers.length === 0) {
    return (
      <Card className="shadow-card">
        <CardContent className="py-12 text-center">
          <User className="w-16 h-16 mx-auto text-muted-foreground/30 mb-4" />
          <p className="text-muted-foreground text-lg">{t('noCustomers')}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {customers.map((customer, index) => {
        const daysLeft = getDaysUntilExpiry(customer.expiryDate);
        const insuranceLabel = insuranceTypeLabels[customer.insuranceType][language];
        const motorLabel = customer.motorType ? motorTypeLabels[customer.motorType][language] : '';

        return (
          <Card
            key={customer.id}
            className="shadow-card hover:shadow-lg transition-all duration-200 animate-fade-in overflow-hidden"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <CardContent className="p-4">
              <div className="flex flex-col md:flex-row md:items-center gap-4">
                {/* Customer Info */}
                <div className="flex-1 space-y-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-lg">{customer.name}</h3>
                      <Badge variant="secondary" className="mt-1">
                        {insuranceLabel}
                      </Badge>
                    </div>
                    <Badge className={cn('shrink-0', getDaysColor(daysLeft))}>
                      {daysLeft < 0
                        ? t('expiredText')
                        : `${daysLeft} ${t('daysLeft')}`}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4" />
                      <span>{customer.mobileNumber}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MessageCircle className="w-4 h-4" />
                      <span>{customer.whatsappNumber}</span>
                    </div>
                    <div className="flex items-center gap-2 md:col-span-2">
                      <MapPin className="w-4 h-4 shrink-0" />
                      <span className="truncate">{customer.address}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 text-sm">
                    {customer.insuranceType === 'motor' ? (
                      <>
                        <div className="flex items-center gap-1 bg-muted px-2 py-1 rounded">
                          {getMotorIcon(customer.motorType)}
                          <span>{motorLabel}</span>
                        </div>
                        <div className="flex items-center gap-1 bg-muted px-2 py-1 rounded">
                          <FileText className="w-4 h-4" />
                          <span>{customer.vehicleNumber}</span>
                        </div>
                      </>
                    ) : (
                      <div className="flex items-center gap-1 bg-muted px-2 py-1 rounded">
                        <FileText className="w-4 h-4" />
                        <span>{customer.policyNumber}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-1 bg-muted px-2 py-1 rounded">
                      <Calendar className="w-4 h-4" />
                      <span>
                        {format(parseISO(customer.startDate), 'dd/MM/yyyy')} -{' '}
                        {format(parseISO(customer.expiryDate), 'dd/MM/yyyy')}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-row md:flex-col gap-2 shrink-0">
                  <Button
                    variant="success"
                    size="sm"
                    onClick={() => shareOnWhatsApp(customer, language)}
                    className="flex-1 md:flex-none"
                  >
                    <MessageCircle className="w-4 h-4 md:mr-2" />
                    <span className="hidden md:inline">{t('shareWhatsapp')}</span>
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => makeCall(customer.mobileNumber)}
                    className="flex-1 md:flex-none"
                  >
                    <Phone className="w-4 h-4 md:mr-2" />
                    <span className="hidden md:inline">Call</span>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onEdit(customer)}
                    className="flex-1 md:flex-none"
                  >
                    <Edit className="w-4 h-4 md:mr-2" />
                    <span className="hidden md:inline">{t('edit')}</span>
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="destructive"
                        size="sm"
                        className="flex-1 md:flex-none"
                      >
                        <Trash2 className="w-4 h-4 md:mr-2" />
                        <span className="hidden md:inline">{t('delete')}</span>
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Customer?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete {customer.name}? This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>{t('cancel')}</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => onDelete(customer.id)}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                          {t('delete')}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default CustomerList;
