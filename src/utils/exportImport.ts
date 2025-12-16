import { Customer } from '@/types/customer';
import * as XLSX from 'xlsx';

export const exportToCSV = (customers: Customer[], filename: string = 'customers') => {
  const headers = [
    'ID', 'Name', 'Mobile Number', 'WhatsApp Number', 'Address',
    'Insurance Type', 'Policy Number', 'Motor Type', 'Vehicle Number',
    'Start Date', 'Expiry Date', 'Created At'
  ];

  const rows = customers.map(c => [
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
    c.createdAt
  ]);

  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `${filename}.csv`;
  link.click();
};

export const exportToExcel = (customers: Customer[], filename: string = 'customers') => {
  const data = customers.map(c => ({
    'ID': c.id,
    'Name': c.name,
    'Mobile Number': c.mobileNumber,
    'WhatsApp Number': c.whatsappNumber,
    'Address': c.address,
    'Insurance Type': c.insuranceType,
    'Policy Number': c.policyNumber || '',
    'Motor Type': c.motorType || '',
    'Vehicle Number': c.vehicleNumber || '',
    'Start Date': c.startDate,
    'Expiry Date': c.expiryDate,
    'Created At': c.createdAt
  }));

  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Customers');
  XLSX.writeFile(workbook, `${filename}.xlsx`);
};

export const importFromCSV = (file: File): Promise<Customer[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        const lines = text.split('\n');
        const headers = lines[0].split(',').map(h => h.replace(/"/g, '').trim());
        
        const customers: Customer[] = [];
        for (let i = 1; i < lines.length; i++) {
          if (!lines[i].trim()) continue;
          
          const values = lines[i].match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g) || [];
          const cleanValues = values.map(v => v.replace(/"/g, '').trim());
          
          if (cleanValues.length >= 11) {
            customers.push({
              id: cleanValues[0] || crypto.randomUUID(),
              name: cleanValues[1],
              mobileNumber: cleanValues[2],
              whatsappNumber: cleanValues[3],
              address: cleanValues[4],
              insuranceType: cleanValues[5] as any,
              policyNumber: cleanValues[6] || undefined,
              motorType: cleanValues[7] as any || undefined,
              vehicleNumber: cleanValues[8] || undefined,
              startDate: cleanValues[9],
              expiryDate: cleanValues[10],
              createdAt: cleanValues[11] || new Date().toISOString()
            });
          }
        }
        resolve(customers);
      } catch (error) {
        reject(error);
      }
    };
    reader.onerror = reject;
    reader.readAsText(file);
  });
};

export const importFromExcel = (file: File): Promise<Customer[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);
        
        const customers: Customer[] = jsonData.map((row: any) => ({
          id: row['ID'] || crypto.randomUUID(),
          name: row['Name'],
          mobileNumber: row['Mobile Number'],
          whatsappNumber: row['WhatsApp Number'],
          address: row['Address'],
          insuranceType: row['Insurance Type'],
          policyNumber: row['Policy Number'] || undefined,
          motorType: row['Motor Type'] || undefined,
          vehicleNumber: row['Vehicle Number'] || undefined,
          startDate: row['Start Date'],
          expiryDate: row['Expiry Date'],
          createdAt: row['Created At'] || new Date().toISOString()
        }));
        
        resolve(customers);
      } catch (error) {
        reject(error);
      }
    };
    reader.onerror = reject;
    reader.readAsArrayBuffer(file);
  });
};

// Local Backup Functions
export const backupToLocal = (customers: Customer[]) => {
  const backupData = {
    version: '1.0',
    timestamp: new Date().toISOString(),
    customers: customers
  };
  
  const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `insurance_backup_${new Date().toISOString().split('T')[0]}.json`;
  link.click();
};

export const restoreFromLocal = (file: File): Promise<Customer[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        const data = JSON.parse(text);
        
        // Handle both direct array and wrapped format
        const customers = data.customers || data;
        
        if (!Array.isArray(customers)) {
          throw new Error('Invalid backup format');
        }
        
        resolve(customers);
      } catch (error) {
        reject(error);
      }
    };
    reader.onerror = reject;
    reader.readAsText(file);
  });
};
