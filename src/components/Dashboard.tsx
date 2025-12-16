import React, { useState, useRef } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { useCustomers } from '@/hooks/useCustomers';
import { useNotifications } from '@/hooks/useNotifications';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import StatsCard from './StatsCard';
import CustomerList from './CustomerList';
import CustomerForm from './CustomerForm';
import ProfileDialog from './ProfileDialog';
import PasswordPromptDialog from './PasswordPromptDialog';
import { Customer } from '@/types/customer';
import { exportToCSV, exportToExcel, importFromCSV, importFromExcel } from '@/utils/exportImport';
import { toast } from '@/hooks/use-toast';
import * as XLSX from 'xlsx';
import {
  UserPlus, Download, Upload, Bell, Search, LogOut, User, Globe,
  Users, AlertTriangle, Clock, XCircle, FileSpreadsheet, MessageCircle
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';

const Dashboard: React.FC = () => {
  const { t, language, setLanguage } = useLanguage();
  const { user, logout } = useAuth();
  const {
    customers,
    addCustomer,
    updateCustomer,
    deleteCustomer,
    getDaysUntilExpiry,
    getExpiringIn15Days,
    getExpiringIn7Days,
    getExpiringIn2Days,
    getExpired,
    importCustomers,
  } = useCustomers();
  const { requestPermission } = useNotifications(customers, language);
  
  const [showForm, setShowForm] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showProfile, setShowProfile] = useState(false);
  const [activeFilter, setActiveFilter] = useState<'all' | '15' | '7' | '2' | 'expired'>('all');
  
  // Password prompt state
  const [showPasswordPrompt, setShowPasswordPrompt] = useState(false);
  const [pendingAction, setPendingAction] = useState<(() => void) | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const requirePasswordThen = (action: () => void) => {
    const hasPassword = !!localStorage.getItem('exportPassword');
    if (hasPassword) {
      setPendingAction(() => action);
      setShowPasswordPrompt(true);
    } else {
      // No password set, proceed directly
      action();
    }
  };

  const handlePasswordSuccess = () => {
    if (pendingAction) {
      pendingAction();
      setPendingAction(null);
    }
  };

  const handleAddCustomer = (customerData: Omit<Customer, 'id' | 'createdAt'>) => {
    addCustomer(customerData);
    setShowForm(false);
    toast({ title: t('customerAdded') });
  };

  const handleUpdateCustomer = (customerData: Omit<Customer, 'id' | 'createdAt'>) => {
    if (editingCustomer) {
      updateCustomer(editingCustomer.id, customerData);
      setEditingCustomer(null);
      toast({ title: t('customerUpdated') });
    }
  };

  const handleDeleteCustomer = (id: string) => {
    deleteCustomer(id);
    toast({ title: t('customerDeleted') });
  };

  const handleEnableNotifications = async () => {
    const granted = await requestPermission();
    if (granted) {
      toast({ title: t('notificationEnabled') });
    } else {
      toast({ title: t('notificationDenied'), variant: 'destructive' });
    }
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      let imported: Customer[];
      if (file.name.endsWith('.csv')) {
        imported = await importFromCSV(file);
      } else {
        imported = await importFromExcel(file);
      }
      importCustomers(imported);
      toast({ title: `${imported.length} customers imported!` });
    } catch (error) {
      toast({ title: 'Import failed', variant: 'destructive' });
    }
    
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleBackup = () => {};

  const handleShareData = async (format: 'csv' | 'excel') => {
    const shareCustomers = customers;

    if (!shareCustomers.length) {
      toast({ title: t('noCustomers') });
      return;
    }

    if (!navigator.share || !navigator.canShare) {
      toast({
        title: language === 'hi' ? 'आपका ब्राउज़र शेयरिंग सपोर्ट नहीं करता' : 'Sharing not supported',
        description:
          language === 'hi'
            ? 'कृपया पहले डेटा को एक्सपोर्ट करके मैन्युअली व्हाट्सएप पर भेजें।'
            : 'Please export the file first and then send it via WhatsApp manually.',
        variant: 'destructive',
      });
      return;
    }

    try {
      let file: File;

      if (format === 'csv') {
        const headers = [
          'ID',
          'Name',
          'Mobile Number',
          'WhatsApp Number',
          'Address',
          'Insurance Type',
          'Policy Number',
          'Motor Type',
          'Vehicle Number',
          'Start Date',
          'Expiry Date',
          'Created At',
        ];

        const rows = shareCustomers.map((c) => [
          c.id,
          c.name,
          c.mobileNumber,
          c.whatsappNumber,
          c.address,
          c.insuranceType,
          c.policyNumber || '',
          c.motorType || '',
          c.vehicleNumber || '',
          c.startDate,
          c.expiryDate,
          c.createdAt,
        ]);

        const csvContent = [
          headers.join(','),
          ...rows.map((row) => row.map((cell) => `"${cell}"`).join(',')),
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        file = new File([blob], 'customers.csv', { type: 'text/csv' });
      } else {
        const data = shareCustomers.map((c) => ({
          ID: c.id,
          Name: c.name,
          'Mobile Number': c.mobileNumber,
          'WhatsApp Number': c.whatsappNumber,
          Address: c.address,
          'Insurance Type': c.insuranceType,
          'Policy Number': c.policyNumber || '',
          'Motor Type': c.motorType || '',
          'Vehicle Number': c.vehicleNumber || '',
          'Start Date': c.startDate,
          'Expiry Date': c.expiryDate,
          'Created At': c.createdAt,
        }));

        const worksheet = XLSX.utils.json_to_sheet(data);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Customers');
        const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
        const blob = new Blob([excelBuffer], {
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        });
        file = new File([blob], 'customers.xlsx', {
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        });
      }

      const shareData = {
        files: [file],
        title: 'Insurance Reminder Data',
        text:
          language === 'hi'
            ? 'Insurance Reminder ऐप से निर्यात किया गया ग्राहक डेटा।'
            : 'Customer data exported from Insurance Reminder app.',
      } as any;

      if (navigator.canShare && navigator.canShare(shareData)) {
        await navigator.share(shareData);
      } else {
        toast({
          title: language === 'hi' ? 'शेयरिंग सपोर्ट नहीं है' : 'Sharing not supported',
          description:
            language === 'hi'
              ? 'कृपया पहले डेटा को एक्सपोर्ट करके मैन्युअली व्हाट्सएप पर भेजें।'
              : 'Please export the data first and then send it via WhatsApp manually.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: language === 'hi' ? 'शेयरिंग विफल' : 'Sharing failed',
        variant: 'destructive',
      });
    }
  };

  const getFilteredCustomers = () => {
    let filtered = customers;
    
    switch (activeFilter) {
      case '15':
        filtered = getExpiringIn15Days();
        break;
      case '7':
        filtered = getExpiringIn7Days();
        break;
      case '2':
        filtered = getExpiringIn2Days();
        break;
      case 'expired':
        filtered = getExpired();
        break;
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(c =>
        c.name.toLowerCase().includes(query) ||
        c.mobileNumber.includes(query) ||
        c.whatsappNumber.includes(query) ||
        c.address.toLowerCase().includes(query)
      );
    }

    return filtered;
  };

  const stats = [
    { 
      key: 'all' as const, 
      label: t('totalCustomers'), 
      value: customers.length, 
      icon: Users, 
      color: 'info' as const 
    },
    { 
      key: '15' as const, 
      label: t('expiringIn15Days'), 
      value: getExpiringIn15Days().length, 
      icon: Clock, 
      color: 'success' as const 
    },
    { 
      key: '7' as const, 
      label: t('expiringIn7Days'), 
      value: getExpiringIn7Days().length, 
      icon: AlertTriangle, 
      color: 'warning' as const 
    },
    { 
      key: '2' as const, 
      label: t('expiringIn2Days'), 
      value: getExpiringIn2Days().length, 
      icon: AlertTriangle, 
      color: 'orange' as const 
    },
    { 
      key: 'expired' as const, 
      label: t('expired'), 
      value: getExpired().length, 
      icon: XCircle, 
      color: 'destructive' as const 
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="gradient-hero sticky top-0 z-50 shadow-lg">
        <div className="container py-4">
          <div className="flex items-center justify-between gap-4">
            <h1 className="text-xl md:text-2xl font-bold text-primary-foreground">
              {t('dashboard')}
            </h1>
            
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}
                className="text-primary-foreground hover:bg-primary-foreground/10"
              >
                <Globe className="w-5 h-5" />
              </Button>
              
              <Button
                variant="ghost"
                size="icon"
                onClick={handleEnableNotifications}
                className="text-primary-foreground hover:bg-primary-foreground/10"
              >
                <Bell className="w-5 h-5" />
              </Button>
              
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowProfile(true)}
                className="text-primary-foreground hover:bg-primary-foreground/10"
              >
                <User className="w-5 h-5" />
              </Button>
              
              <Button
                variant="ghost"
                size="icon"
                onClick={logout}
                className="text-primary-foreground hover:bg-primary-foreground/10"
              >
                <LogOut className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container py-6 space-y-6">
        {/* Action Buttons - Export/Import/WhatsApp Share */}
        <div className="flex flex-wrap justify-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="center" className="bg-popover">
              <DropdownMenuItem onClick={() => requirePasswordThen(() => exportToExcel(getFilteredCustomers()))}>
                <FileSpreadsheet className="w-4 h-4 mr-2" />
                {t('exportExcel')}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => requirePasswordThen(() => exportToCSV(getFilteredCustomers()))}>
                <FileSpreadsheet className="w-4 h-4 mr-2" />
                {t('exportCSV')}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Upload className="w-4 h-4 mr-2" />
                Import
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="center" className="bg-popover">
              <DropdownMenuItem onClick={() => {
                if (fileInputRef.current) {
                  fileInputRef.current.accept = '.xlsx,.xls';
                  fileInputRef.current.click();
                }
              }}>
                <FileSpreadsheet className="w-4 h-4 mr-2" />
                {t('importExcel')}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => {
                if (fileInputRef.current) {
                  fileInputRef.current.accept = '.csv';
                  fileInputRef.current.click();
                }
              }}>
                <FileSpreadsheet className="w-4 h-4 mr-2" />
                {t('importCSV')}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <MessageCircle className="w-4 h-4 mr-2" />
                {t('shareWhatsapp')}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="center" className="bg-popover">
              <DropdownMenuItem onClick={() => requirePasswordThen(() => handleShareData('excel'))}>
                <FileSpreadsheet className="w-4 h-4 mr-2" />
                Excel
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => requirePasswordThen(() => handleShareData('csv'))}>
                <FileSpreadsheet className="w-4 h-4 mr-2" />
                CSV
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            onChange={handleImport}
          />
        </div>

        {/* Add Customer Button - Centered */}
        <div className="flex justify-center">
          <Button
            onClick={() => setShowForm(true)}
            size="lg"
            className="shadow-glow animate-pulse-slow"
          >
            <UserPlus className="w-5 h-5 mr-2" />
            {t('addCustomer')}
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4">
          {stats.map((stat) => (
            <StatsCard
              key={stat.key}
              label={stat.label}
              value={stat.value}
              icon={stat.icon}
              color={stat.color}
              active={activeFilter === stat.key}
              onClick={() => setActiveFilter(stat.key)}
            />
          ))}
        </div>

        {/* Search */}
        <Card className="shadow-card">
          <CardContent className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder={t('search')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Customer List */}
        <CustomerList
          customers={getFilteredCustomers()}
          onEdit={(customer) => setEditingCustomer(customer)}
          onDelete={handleDeleteCustomer}
          getDaysUntilExpiry={getDaysUntilExpiry}
        />
      </main>

      {/* Customer Form Modal */}
      {(showForm || editingCustomer) && (
        <CustomerForm
          customer={editingCustomer}
          onSubmit={editingCustomer ? handleUpdateCustomer : handleAddCustomer}
          onClose={() => {
            setShowForm(false);
            setEditingCustomer(null);
          }}
        />
      )}

      {/* Profile Dialog */}
      <ProfileDialog
        open={showProfile}
        onClose={() => setShowProfile(false)}
      />

      {/* Password Prompt Dialog */}
      <PasswordPromptDialog
        open={showPasswordPrompt}
        onClose={() => {
          setShowPasswordPrompt(false);
          setPendingAction(null);
        }}
        onSuccess={handlePasswordSuccess}
      />
    </div>
  );
};

export default Dashboard;
