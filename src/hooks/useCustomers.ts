import { useState, useEffect } from 'react';
import { Customer } from '@/types/customer';
import { differenceInDays, parseISO } from 'date-fns';

export const useCustomers = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);

  useEffect(() => {
    const savedCustomers = localStorage.getItem('customers');
    if (savedCustomers) {
      setCustomers(JSON.parse(savedCustomers));
    }
  }, []);

  const saveCustomers = (newCustomers: Customer[]) => {
    localStorage.setItem('customers', JSON.stringify(newCustomers));
    setCustomers(newCustomers);
  };

  const addCustomer = (customer: Omit<Customer, 'id' | 'createdAt'>) => {
    const newCustomer: Customer = {
      ...customer,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    };
    saveCustomers([...customers, newCustomer]);
    return newCustomer;
  };

  const updateCustomer = (id: string, updates: Partial<Customer>) => {
    const updated = customers.map(c => c.id === id ? { ...c, ...updates } : c);
    saveCustomers(updated);
  };

  const deleteCustomer = (id: string) => {
    const filtered = customers.filter(c => c.id !== id);
    saveCustomers(filtered);
  };

  const getDaysUntilExpiry = (expiryDate: string): number => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const expiry = parseISO(expiryDate);
    return differenceInDays(expiry, today);
  };

  const getExpiringIn15Days = (): Customer[] => {
    return customers.filter(c => {
      const days = getDaysUntilExpiry(c.expiryDate);
      return days === 15;
    });
  };

  const getExpiringIn7Days = (): Customer[] => {
    return customers.filter(c => {
      const days = getDaysUntilExpiry(c.expiryDate);
      return days === 7;
    });
  };

  const getExpiringIn2Days = (): Customer[] => {
    return customers.filter(c => {
      const days = getDaysUntilExpiry(c.expiryDate);
      return days === 2;
    });
  };

  const getExpired = (): Customer[] => {
    return customers.filter(c => getDaysUntilExpiry(c.expiryDate) <= 0);
  };

  const importCustomers = (importedCustomers: Customer[]) => {
    const merged = [...customers];
    importedCustomers.forEach(imported => {
      const existingIndex = merged.findIndex(c => c.id === imported.id);
      if (existingIndex === -1) {
        merged.push({ ...imported, id: crypto.randomUUID() });
      }
    });
    saveCustomers(merged);
  };

  return {
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
  };
};
