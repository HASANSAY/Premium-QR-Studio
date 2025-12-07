// QR Code Type Helpers

export type QRType = 'url' | 'wifi' | 'vcard' | 'email' | 'phone' | 'sms';

// WiFi QR Code Format
export interface WiFiData {
    ssid: string;
    password: string;
    security: 'WPA' | 'WEP' | 'nopass';
    hidden: boolean;
}

export function generateWiFiString(data: WiFiData): string {
    const { ssid, password, security, hidden } = data;
    return `WIFI:T:${security};S:${ssid};P:${password};H:${hidden ? 'true' : 'false'};;`;
}

// vCard QR Code Format
export interface VCardData {
    firstName: string;
    lastName: string;
    phone: string;
    email: string;
    company?: string;
    jobTitle?: string;
    website?: string;
    address?: string;
}

export function generateVCardString(data: VCardData): string {
    const { firstName, lastName, phone, email, company, jobTitle, website, address } = data;

    let vcard = 'BEGIN:VCARD\n';
    vcard += 'VERSION:3.0\n';
    vcard += `FN:${firstName} ${lastName}\n`;
    vcard += `N:${lastName};${firstName};;;\n`;
    if (phone) vcard += `TEL;TYPE=CELL:${phone}\n`;
    if (email) vcard += `EMAIL:${email}\n`;
    if (company) vcard += `ORG:${company}\n`;
    if (jobTitle) vcard += `TITLE:${jobTitle}\n`;
    if (website) vcard += `URL:${website}\n`;
    if (address) vcard += `ADR:;;${address};;;;\n`;
    vcard += 'END:VCARD';

    return vcard;
}

// Email QR Code Format
export interface EmailData {
    email: string;
    subject?: string;
    body?: string;
}

export function generateEmailString(data: EmailData): string {
    const { email, subject, body } = data;
    let mailtoString = `mailto:${email}`;

    const params: string[] = [];
    if (subject) params.push(`subject=${encodeURIComponent(subject)}`);
    if (body) params.push(`body=${encodeURIComponent(body)}`);

    if (params.length > 0) {
        mailtoString += '?' + params.join('&');
    }

    return mailtoString;
}

// Phone QR Code Format
export function generatePhoneString(phone: string): string {
    return `tel:${phone}`;
}

// SMS QR Code Format
export interface SMSData {
    phone: string;
    message?: string;
}

export function generateSMSString(data: SMSData): string {
    const { phone, message } = data;
    let smsString = `sms:${phone}`;

    if (message) {
        smsString += `?body=${encodeURIComponent(message)}`;
    }

    return smsString;
}

// Get QR data based on type
export function getQRData(type: QRType, data: any): string {
    switch (type) {
        case 'url':
            return data as string;
        case 'wifi':
            return generateWiFiString(data as WiFiData);
        case 'vcard':
            return generateVCardString(data as VCardData);
        case 'email':
            return generateEmailString(data as EmailData);
        case 'phone':
            return generatePhoneString(data as string);
        case 'sms':
            return generateSMSString(data as SMSData);
        default:
            return data as string;
    }
}
