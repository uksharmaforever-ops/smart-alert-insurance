import { Customer, insuranceTypeLabels, motorTypeLabels } from '@/types/customer';
import { format, parseISO } from 'date-fns';

export const getDaysUntilExpiry = (expiryDate: string): number => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const expiry = parseISO(expiryDate);
  expiry.setHours(0, 0, 0, 0);
  const diffTime = expiry.getTime() - today.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

export const generateWhatsAppMessage = (customer: Customer, language: 'en' | 'hi'): string => {
  const expiryDate = format(parseISO(customer.expiryDate), 'dd/MM/yyyy');
  const startDate = format(parseISO(customer.startDate), 'dd/MM/yyyy');
  const insuranceLabel = insuranceTypeLabels[customer.insuranceType][language];
  const daysLeft = getDaysUntilExpiry(customer.expiryDate);
  
  if (language === 'hi') {
    let message = '';
    const daysLabel = daysLeft === 1 ? 'दिन' : 'दिनों';
    
    if (daysLeft <= 0) {
      message = `🚨 *बीमा पॉलिसी समाप्त*\n\n`;
      message += `नमस्ते ${customer.name} जी,\n\n`;
      message += `आपकी *${insuranceLabel}* पॉलिसी समाप्त हो गई है।\n\n`;
    } else if (daysLeft <= 2) {
      message = `⚠️ *बीमा नवीनीकरण - ${daysLeft} ${daysLabel} शेष*\n\n`;
      message += `नमस्ते ${customer.name} जी,\n\n`;
      message += `आपकी *${insuranceLabel}* पॉलिसी *${daysLeft} ${daysLabel}* में समाप्त हो रही है।\n\n`;
    } else if (daysLeft <= 7) {
      message = `🔔 *बीमा नवीनीकरण - ${daysLeft} ${daysLabel} शेष*\n\n`;
      message += `नमस्ते ${customer.name} जी,\n\n`;
      message += `आपकी *${insuranceLabel}* पॉलिसी *${daysLeft} ${daysLabel}* में समाप्त हो रही है।\n\n`;
    } else {
      message = `📋 *बीमा नवीनीकरण - ${daysLeft} ${daysLabel} शेष*\n\n`;
      message += `नमस्ते ${customer.name} जी,\n\n`;
      message += `आपकी *${insuranceLabel}* पॉलिसी *${daysLeft} ${daysLabel}* में समाप्त हो रही है।\n\n`;
    }
    
    message += `📋 *पॉलिसी विवरण:*\n`;
    
    if (customer.insuranceType === 'motor') {
      const motorLabel = customer.motorType ? motorTypeLabels[customer.motorType].hi : '';
      message += `• वाहन प्रकार: ${motorLabel}\n`;
      message += `• वाहन नंबर: ${customer.vehicleNumber}\n`;
    } else {
      message += `• पॉलिसी नंबर: ${customer.policyNumber}\n`;
    }
    
    message += `• शुरुआत तिथि: ${startDate}\n`;
    message += `• समाप्ति तिथि: *${expiryDate}*\n\n`;
    
    if (customer.insuranceType === 'motor') {
      message += `💰 *2000₹ - 10000₹ तक के चालान से बचें*\n\n`;
    }
    if (daysLeft <= 0) {
      message += `कृपया जल्द से जल्द अपनी पॉलिसी का नवीनीकरण करें।\n\n`;
    } else {
      message += `कृपया समय पर अपनी पॉलिसी का नवीनीकरण करें।\n\n`;
    }
    message += `धन्यवाद! 🙏`;
    
    return message;
  } else {
    let message = '';
    const dayWord = daysLeft === 1 ? 'Day' : 'Days';
    
    if (daysLeft <= 0) {
      message = `🚨 *Insurance Policy Expired*\n\n`;
      message += `Dear ${customer.name},\n\n`;
      message += `Your *${insuranceLabel}* policy has expired.\n\n`;
    } else if (daysLeft <= 2) {
      message = `⚠️ *Insurance Renewal - ${daysLeft} ${dayWord} Left*\n\n`;
      message += `Dear ${customer.name},\n\n`;
      message += `Your *${insuranceLabel}* policy expires in *${daysLeft} day(s)*.\n\n`;
    } else if (daysLeft <= 7) {
      message = `🔔 *Insurance Renewal - ${daysLeft} ${dayWord} Left*\n\n`;
      message += `Dear ${customer.name},\n\n`;
      message += `Your *${insuranceLabel}* policy expires in *${daysLeft} days*.\n\n`;
    } else {
      message = `📋 *Insurance Renewal - ${daysLeft} ${dayWord} Left*\n\n`;
      message += `Dear ${customer.name},\n\n`;
      message += `Your *${insuranceLabel}* policy expires in *${daysLeft} days*.\n\n`;
    }
    
    message += `📋 *Policy Details:*\n`;
    
    if (customer.insuranceType === 'motor') {
      const motorLabel = customer.motorType ? motorTypeLabels[customer.motorType].en : '';
      message += `• Vehicle Type: ${motorLabel}\n`;
      message += `• Vehicle Number: ${customer.vehicleNumber}\n`;
    } else {
      message += `• Policy Number: ${customer.policyNumber}\n`;
    }
    
    message += `• Start Date: ${startDate}\n`;
    message += `• Expiry Date: *${expiryDate}*\n\n`;
    
    if (customer.insuranceType === 'motor') {
      message += `💰 *Avoid fines from ₹2000 - ₹10000*\n\n`;
    }
    if (daysLeft <= 0) {
      message += `Please renew your policy as soon as possible.\n\n`;
    } else {
      message += `Please renew your policy on time.\n\n`;
    }
    message += `Thank you! 🙏`;
    
    return message;
  }
};

export const shareOnWhatsApp = (customer: Customer, language: 'en' | 'hi') => {
  const message = generateWhatsAppMessage(customer, language);
  const encodedMessage = encodeURIComponent(message);
  // Clean number and ensure it has India country code
  let whatsappNumber = customer.whatsappNumber.replace(/[^0-9]/g, '');
  // If number is 10 digits, add India country code
  if (whatsappNumber.length === 10) {
    whatsappNumber = '91' + whatsappNumber;
  }
  const url = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
  window.open(url, '_blank');
};

export const makeCall = (mobileNumber: string) => {
  let cleanNumber = mobileNumber.replace(/[^0-9]/g, '');
  // If number is 10 digits, add India country code
  if (cleanNumber.length === 10) {
    cleanNumber = '+91' + cleanNumber;
  }
  window.open(`tel:${cleanNumber}`, '_self');
};
