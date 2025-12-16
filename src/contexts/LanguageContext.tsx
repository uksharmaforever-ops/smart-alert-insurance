import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'en' | 'hi';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  en: {
    // Auth
    'login': 'Login',
    'register': 'Register',
    'mobileNumber': 'Mobile Number',
    'password': 'Password',
    'confirmPassword': 'Confirm Password',
    'loginSuccess': 'Login successful!',
    'registerSuccess': 'Registration successful!',
    'logout': 'Logout',
    'profile': 'Profile',
    'changePassword': 'Change Password',
    'oldPassword': 'Old Password',
    'newPassword': 'New Password',
    'passwordChanged': 'Password changed successfully!',
    
    // Dashboard
    'dashboard': 'Dashboard',
    'addCustomer': 'Add Customer',
    'totalCustomers': 'Total Customers',
    'expiringIn15Days': '15 Days',
    'expiringIn7Days': '7 Days',
    'expiringIn2Days': '2 Days',
    'expired': 'Expired',
    
    // Customer Form
    'customerName': 'Customer Name',
    'whatsappNumber': 'WhatsApp Number',
    'address': 'Address',
    'insuranceType': 'Insurance Type',
    'policyNumber': 'Policy Number',
    'motorType': 'Motor Type',
    'vehicleNumber': 'Vehicle Number',
    'startDate': 'Start Date',
    'expiryDate': 'Expiry Date',
    'save': 'Save',
    'cancel': 'Cancel',
    'edit': 'Edit',
    'delete': 'Delete',
    'customerAdded': 'Customer added successfully!',
    'customerUpdated': 'Customer updated successfully!',
    'customerDeleted': 'Customer deleted successfully!',
    
    // Insurance Types
    'health': 'Health Insurance',
    'life': 'Life Insurance',
    'home': 'Home Insurance',
    'travel': 'Travel Insurance',
    'business': 'Business Insurance',
    'motor': 'Motor Insurance',
    'machine': 'Machine Insurance',
    'property': 'Property Insurance',
    
    // Motor Types
    'car': 'Car',
    'bike': 'Bike',
    'scooter': 'Scooter',
    'truck': 'Truck',
    'bus': 'Bus',
    
    // Actions
    'shareWhatsapp': 'Share on WhatsApp',
    'exportExcel': 'Export Excel',
    'exportCSV': 'Export CSV',
    'importExcel': 'Import Excel',
    'importCSV': 'Import CSV',
    'backup': 'Backup',
    'restore': 'Restore',
    'backupSuccess': 'Backup saved successfully!',
    'restoreSuccess': 'Data restored successfully!',
    'restoreFailed': 'Restore failed',
    'search': 'Search customers...',
    'noCustomers': 'No customers found',
    'daysLeft': 'days left',
    'expiredText': 'Expired',
    
    // Notifications
    'notificationEnabled': 'Notifications enabled!',
    'notificationDenied': 'Notification permission denied',
    'enableNotifications': 'Enable Notifications',
    
    // Misc
    'language': 'Language',
    'english': 'English',
    'hindi': 'Hindi',
    'selectOption': 'Select option',
    'customers': 'Customers',
    'allCustomers': 'All Customers',
  },
  hi: {
    // Auth
    'login': 'लॉगिन',
    'register': 'रजिस्टर',
    'mobileNumber': 'मोबाइल नंबर',
    'password': 'पासवर्ड',
    'confirmPassword': 'पासवर्ड की पुष्टि करें',
    'loginSuccess': 'लॉगिन सफल!',
    'registerSuccess': 'रजिस्ट्रेशन सफल!',
    'logout': 'लॉगआउट',
    'profile': 'प्रोफ़ाइल',
    'changePassword': 'पासवर्ड बदलें',
    'oldPassword': 'पुराना पासवर्ड',
    'newPassword': 'नया पासवर्ड',
    'passwordChanged': 'पासवर्ड सफलतापूर्वक बदला गया!',
    
    // Dashboard
    'dashboard': 'डैशबोर्ड',
    'addCustomer': 'ग्राहक जोड़ें',
    'totalCustomers': 'कुल ग्राहक',
    'expiringIn15Days': '15 दिन',
    'expiringIn7Days': '7 दिन',
    'expiringIn2Days': '2 दिन',
    'expired': 'समाप्त',
    
    // Customer Form
    'customerName': 'ग्राहक का नाम',
    'whatsappNumber': 'व्हाट्सएप नंबर',
    'address': 'पता',
    'insuranceType': 'बीमा प्रकार',
    'policyNumber': 'पॉलिसी नंबर',
    'motorType': 'वाहन प्रकार',
    'vehicleNumber': 'वाहन नंबर',
    'startDate': 'शुरुआत तिथि',
    'expiryDate': 'समाप्ति तिथि',
    'save': 'सेव करें',
    'cancel': 'रद्द करें',
    'edit': 'संपादित करें',
    'delete': 'हटाएं',
    'customerAdded': 'ग्राहक सफलतापूर्वक जोड़ा गया!',
    'customerUpdated': 'ग्राहक सफलतापूर्वक अपडेट किया गया!',
    'customerDeleted': 'ग्राहक सफलतापूर्वक हटाया गया!',
    
    // Insurance Types
    'health': 'स्वास्थ्य बीमा',
    'life': 'जीवन बीमा',
    'home': 'गृह बीमा',
    'travel': 'यात्रा बीमा',
    'business': 'व्यापार बीमा',
    'motor': 'वाहन बीमा',
    'machine': 'मशीन बीमा',
    'property': 'संपत्ति बीमा',
    
    // Motor Types
    'car': 'कार',
    'bike': 'बाइक',
    'scooter': 'स्कूटर',
    'truck': 'ट्रक',
    'bus': 'बस',
    
    // Actions
    'shareWhatsapp': 'व्हाट्सएप पर शेयर करें',
    'exportExcel': 'एक्सेल निर्यात',
    'exportCSV': 'CSV निर्यात',
    'importExcel': 'एक्सेल आयात',
    'importCSV': 'CSV आयात',
    'backup': 'बैकअप',
    'restore': 'रिस्टोर',
    'backupSuccess': 'बैकअप सफलतापूर्वक सेव हुआ!',
    'restoreSuccess': 'डेटा सफलतापूर्वक रिस्टोर हुआ!',
    'restoreFailed': 'रिस्टोर विफल',
    'search': 'ग्राहक खोजें...',
    'noCustomers': 'कोई ग्राहक नहीं मिला',
    'daysLeft': 'दिन बाकी',
    'expiredText': 'समाप्त',
    
    // Notifications
    'notificationEnabled': 'सूचनाएं सक्षम!',
    'notificationDenied': 'सूचना अनुमति अस्वीकृत',
    'enableNotifications': 'सूचनाएं सक्षम करें',
    
    // Misc
    'language': 'भाषा',
    'english': 'अंग्रेज़ी',
    'hindi': 'हिंदी',
    'selectOption': 'विकल्प चुनें',
    'customers': 'ग्राहक',
    'allCustomers': 'सभी ग्राहक',
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>('hi');

  useEffect(() => {
    const savedLang = localStorage.getItem('language') as Language;
    if (savedLang) {
      setLanguageState(savedLang);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('language', lang);
  };

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
