'use client';

import React, { useState, useRef } from 'react';
import QRCodeStyling, { Options as QROptions } from 'qr-code-styling';
import {
    Card,
    CardContent,
    TextField,
    Button,
    Box,
    Typography,
    Stack,
    Fade,
    Grow,
    Alert,
    Tabs,
    Tab,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Checkbox,
    FormControlLabel,
    Chip,
    Paper,
    Divider,
} from '@mui/material';
import {
    QrCode2,
    Link as LinkIcon,
    Wifi,
    ContactMail,
    Email as EmailIcon,
    Phone as PhoneIcon,
    Sms,
    CheckCircle,
    ExpandMore,
    Palette,
    Image as ImageIcon,
    Style,
    Download,
    PhotoLibrary,
} from '@mui/icons-material';
import {
    QRType,
    WiFiData,
    VCardData,
    EmailData,
    SMSData,
    getQRData,
} from '@/utils/qrHelpers';

export default function AdvancedQRGenerator() {
    const [qrType, setQrType] = useState<QRType>('url');
    const [url, setUrl] = useState('');

    const [wifiData, setWifiData] = useState<WiFiData>({
        ssid: '',
        password: '',
        security: 'WPA',
        hidden: false,
    });

    const [vcardData, setVCardData] = useState<VCardData>({
        firstName: '',
        lastName: '',
        phone: '',
        email: '',
        company: '',
        jobTitle: '',
        website: '',
        address: '',
    });

    const [emailData, setEmailData] = useState<EmailData>({
        email: '',
        subject: '',
        body: '',
    });

    const [phoneData, setPhoneData] = useState('');

    const [smsData, setSMSData] = useState<SMSData>({
        phone: '',
        message: '',
    });

    const [qrColor, setQrColor] = useState('#7c3aed');
    const [bgColor, setBgColor] = useState('#ffffff');
    const [dotStyle, setDotStyle] = useState<'rounded' | 'dots' | 'classy' | 'square'>('rounded');
    const [cornerStyle, setCornerStyle] = useState<'square' | 'dot' | 'extra-rounded'>('extra-rounded');
    const [logoUrl, setLogoUrl] = useState<string>('');

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const [qrGenerated, setQrGenerated] = useState(false);

    const qrRef = useRef<HTMLDivElement>(null);
    const qrCodeRef = useRef<QRCodeStyling | null>(null);

    const generateQR = async () => {
        setLoading(true);
        setError(null);
        setSuccess(false);

        try {
            let qrData = '';

            switch (qrType) {
                case 'url':
                    if (!url) throw new Error('Lütfen bir URL girin');
                    qrData = url;
                    break;
                case 'wifi':
                    if (!wifiData.ssid) throw new Error('Lütfen WiFi adı (SSID) girin');
                    qrData = getQRData('wifi', wifiData);
                    break;
                case 'vcard':
                    if (!vcardData.firstName || !vcardData.lastName)
                        throw new Error('Lütfen en az ad ve soyad girin');
                    qrData = getQRData('vcard', vcardData);
                    break;
                case 'email':
                    if (!emailData.email) throw new Error('Lütfen email adresi girin');
                    qrData = getQRData('email', emailData);
                    break;
                case 'phone':
                    if (!phoneData) throw new Error('Lütfen telefon numarası girin');
                    qrData = getQRData('phone', phoneData);
                    break;
                case 'sms':
                    if (!smsData.phone) throw new Error('Lütfen telefon numarası girin');
                    qrData = getQRData('sms', smsData);
                    break;
            }

            const options: QROptions = {
                width: 300,
                height: 300,
                data: qrData,
                margin: 10,
                qrOptions: { errorCorrectionLevel: 'M' },
                dotsOptions: { color: qrColor, type: dotStyle },
                backgroundOptions: { color: bgColor },
                cornersSquareOptions: { type: cornerStyle, color: qrColor },
                cornersDotOptions: { type: 'dot', color: qrColor },
            };

            if (logoUrl) {
                options.image = logoUrl;
                options.imageOptions = {
                    hideBackgroundDots: true,
                    imageSize: 0.4,
                    margin: 0,
                };
            }

            if (!qrCodeRef.current) {
                qrCodeRef.current = new QRCodeStyling(options);
                if (qrRef.current) {
                    qrRef.current.innerHTML = '';
                    qrCodeRef.current.append(qrRef.current);
                }
            } else {
                qrCodeRef.current.update(options);
            }

            setQrGenerated(true);
            setSuccess(true);
        } catch (err: any) {
            setError(err.message || 'QR kod oluşturulurken bir hata oluştu');
        } finally {
            setLoading(false);
        }
    };

    const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => setLogoUrl(e.target?.result as string);
            reader.readAsDataURL(file);
        }
    };

    const downloadQR = async (extension: 'png' | 'jpeg' | 'svg') => {
        if (!qrCodeRef.current) return;

        try {
            if (extension === 'svg') {
                await qrCodeRef.current.download({
                    name: `qrcode-${Date.now()}`,
                    extension: 'svg'
                });
            } else {
                const canvas = qrRef.current?.querySelector('canvas');
                if (!canvas) {
                    setError('QR kod bulunamadı');
                    return;
                }

                canvas.toBlob(
                    (blob) => {
                        if (!blob) {
                            setError('İndirme başarısız');
                            return;
                        }

                        const url = URL.createObjectURL(blob);
                        const link = document.createElement('a');
                        link.href = url;
                        link.download = `qrcode-${Date.now()}.${extension}`;

                        document.body.appendChild(link);
                        link.click();

                        setTimeout(() => {
                            document.body.removeChild(link);
                            URL.revokeObjectURL(url);
                        }, 100);
                    },
                    extension === 'jpeg' ? 'image/jpeg' : 'image/png',
                    1.0
                );
            }
        } catch (error) {
            console.error('Download error:', error);
            setError('İndirme sırasında bir hata oluştu');
        }
    };

    const renderForm = () => {
        switch (qrType) {
            case 'url':
                return (
                    <TextField
                        fullWidth
                        label="Website URL"
                        placeholder="https://example.com"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                    />
                );

            case 'wifi':
                return (
                    <Stack spacing={2}>
                        <TextField
                            fullWidth
                            label="WiFi Adı (SSID)"
                            value={wifiData.ssid}
                            onChange={(e) => setWifiData({ ...wifiData, ssid: e.target.value })}
                        />
                        <TextField
                            fullWidth
                            label="Şifre"
                            type="password"
                            value={wifiData.password}
                            onChange={(e) => setWifiData({ ...wifiData, password: e.target.value })}
                        />
                        <FormControl fullWidth>
                            <InputLabel>Güvenlik Tipi</InputLabel>
                            <Select
                                value={wifiData.security}
                                onChange={(e) => setWifiData({ ...wifiData, security: e.target.value as any })}
                            >
                                <MenuItem value="WPA">WPA/WPA2</MenuItem>
                                <MenuItem value="WEP">WEP</MenuItem>
                                <MenuItem value="nopass">Şifresiz</MenuItem>
                            </Select>
                        </FormControl>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={wifiData.hidden}
                                    onChange={(e) => setWifiData({ ...wifiData, hidden: e.target.checked })}
                                />
                            }
                            label="Gizli ağ"
                        />
                    </Stack>
                );

            case 'vcard':
                return (
                    <Stack spacing={2}>
                        <Stack direction="row" spacing={2}>
                            <TextField
                                fullWidth
                                label="Ad"
                                value={vcardData.firstName}
                                onChange={(e) => setVCardData({ ...vcardData, firstName: e.target.value })}
                            />
                            <TextField
                                fullWidth
                                label="Soyad"
                                value={vcardData.lastName}
                                onChange={(e) => setVCardData({ ...vcardData, lastName: e.target.value })}
                            />
                        </Stack>
                        <TextField
                            fullWidth
                            label="Telefon"
                            value={vcardData.phone}
                            onChange={(e) => setVCardData({ ...vcardData, phone: e.target.value })}
                        />
                        <TextField
                            fullWidth
                            label="Email"
                            value={vcardData.email}
                            onChange={(e) => setVCardData({ ...vcardData, email: e.target.value })}
                        />
                        <Stack direction="row" spacing={2}>
                            <TextField
                                fullWidth
                                label="Şirket (Opsiyonel)"
                                value={vcardData.company}
                                onChange={(e) => setVCardData({ ...vcardData, company: e.target.value })}
                            />
                            <TextField
                                fullWidth
                                label="Ünvan (Opsiyonel)"
                                value={vcardData.jobTitle}
                                onChange={(e) => setVCardData({ ...vcardData, jobTitle: e.target.value })}
                            />
                        </Stack>
                    </Stack>
                );

            case 'email':
                return (
                    <Stack spacing={2}>
                        <TextField
                            fullWidth
                            label="Email Adresi"
                            value={emailData.email}
                            onChange={(e) => setEmailData({ ...emailData, email: e.target.value })}
                        />
                        <TextField
                            fullWidth
                            label="Konu (Opsiyonel)"
                            value={emailData.subject}
                            onChange={(e) => setEmailData({ ...emailData, subject: e.target.value })}
                        />
                        <TextField
                            fullWidth
                            multiline
                            rows={3}
                            label="Mesaj (Opsiyonel)"
                            value={emailData.body}
                            onChange={(e) => setEmailData({ ...emailData, body: e.target.value })}
                        />
                    </Stack>
                );

            case 'phone':
                return (
                    <TextField
                        fullWidth
                        label="Telefon Numarası"
                        placeholder="+90 555 123 45 67"
                        value={phoneData}
                        onChange={(e) => setPhoneData(e.target.value)}
                    />
                );

            case 'sms':
                return (
                    <Stack spacing={2}>
                        <TextField
                            fullWidth
                            label="Telefon Numarası"
                            value={smsData.phone}
                            onChange={(e) => setSMSData({ ...smsData, phone: e.target.value })}
                        />
                        <TextField
                            fullWidth
                            multiline
                            rows={3}
                            label="Mesaj (Opsiyonel)"
                            value={smsData.message}
                            onChange={(e) => setSMSData({ ...smsData, message: e.target.value })}
                        />
                    </Stack>
                );
        }
    };

    return (
        <Fade in timeout={800}>
            <Card sx={{ width: '100%', maxWidth: 900 }}>
                <CardContent sx={{ p: 4 }}>
                    <Stack spacing={4}>
                        <Box textAlign="center">
                            <Grow in timeout={1000}>
                                <Box sx={{ display: 'inline-flex', p: 2, borderRadius: '50%', bgcolor: 'rgba(124, 58, 237, 0.1)', mb: 2 }}>
                                    <QrCode2 sx={{ fontSize: 48, color: 'primary.main' }} />
                                </Box>
                            </Grow>
                            <Typography variant="h1" sx={{ mb: 1, fontSize: { xs: '2rem', md: '2.5rem' } }}>
                                Gelişmiş QR Oluşturucu
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Özelleştirilmiş QR kodlar - WiFi, Kartvizit ve daha fazlası
                            </Typography>
                        </Box>

                        {error && <Alert severity="error" onClose={() => setError(null)}>{error}</Alert>}
                        {success && <Alert severity="success" icon={<CheckCircle />}>QR Kod oluşturuldu!</Alert>}

                        <Tabs value={qrType} onChange={(_, v) => setQrType(v)} variant="scrollable" scrollButtons="auto">
                            <Tab icon={<LinkIcon />} iconPosition="start" label="URL" value="url" />
                            <Tab icon={<Wifi />} iconPosition="start" label="WiFi" value="wifi" />
                            <Tab icon={<ContactMail />} iconPosition="start" label="Kartvizit" value="vcard" />
                            <Tab icon={<EmailIcon />} iconPosition="start" label="Email" value="email" />
                            <Tab icon={<PhoneIcon />} iconPosition="start" label="Telefon" value="phone" />
                            <Tab icon={<Sms />} iconPosition="start" label="SMS" value="sms" />
                        </Tabs>

                        {renderForm()}

                        <Accordion>
                            <AccordionSummary expandIcon={<ExpandMore />}>
                                <Stack direction="row" spacing={1} alignItems="center">
                                    <Palette />
                                    <Typography>Özelleştirme Seçenekleri</Typography>
                                </Stack>
                            </AccordionSummary>
                            <AccordionDetails>
                                <Stack spacing={3}>
                                    <Stack direction="row" spacing={2}>
                                        <Box sx={{ flex: 1 }}>
                                            <Typography variant="caption" gutterBottom>QR Rengi</Typography>
                                            <TextField
                                                fullWidth
                                                type="color"
                                                value={qrColor}
                                                onChange={(e) => setQrColor(e.target.value)}
                                            />
                                        </Box>
                                        <Box sx={{ flex: 1 }}>
                                            <Typography variant="caption" gutterBottom>Arka Plan</Typography>
                                            <TextField
                                                fullWidth
                                                type="color"
                                                value={bgColor}
                                                onChange={(e) => setBgColor(e.target.value)}
                                            />
                                        </Box>
                                    </Stack>

                                    <FormControl fullWidth>
                                        <InputLabel>Nokta Stili</InputLabel>
                                        <Select value={dotStyle} onChange={(e) => setDotStyle(e.target.value as any)}>
                                            <MenuItem value="rounded">Yuvarlak</MenuItem>
                                            <MenuItem value="dots">Noktalar</MenuItem>
                                            <MenuItem value="classy">Şık</MenuItem>
                                            <MenuItem value="square">Kare</MenuItem>
                                        </Select>
                                    </FormControl>

                                    <FormControl fullWidth>
                                        <InputLabel>Köşe Stili</InputLabel>
                                        <Select value={cornerStyle} onChange={(e) => setCornerStyle(e.target.value as any)}>
                                            <MenuItem value="square">Kare</MenuItem>
                                            <MenuItem value="dot">Nokta</MenuItem>
                                            <MenuItem value="extra-rounded">Ekstra Yuvarlak</MenuItem>
                                        </Select>
                                    </FormControl>

                                    <Box>
                                        <Button variant="outlined" component="label" startIcon={<ImageIcon />} fullWidth>
                                            Logo Yükle
                                            <input type="file" hidden accept="image/*" onChange={handleLogoUpload} />
                                        </Button>
                                        {logoUrl && <Chip label="Logo yüklendi" color="success" size="small" sx={{ mt: 1 }} />}
                                    </Box>
                                </Stack>
                            </AccordionDetails>
                        </Accordion>

                        <Button
                            variant="contained"
                            size="large"
                            fullWidth
                            onClick={generateQR}
                            disabled={loading}
                            startIcon={<QrCode2 />}
                        >
                            {loading ? 'Oluşturuluyor...' : 'QR Kod Oluştur'}
                        </Button>

                        {qrGenerated && (
                            <Fade in>
                                <Stack spacing={3} alignItems="center">
                                    <Divider sx={{ width: '100%' }} />
                                    <Paper elevation={3} sx={{ p: 3, bgcolor: 'white', borderRadius: 3 }}>
                                        <div ref={qrRef} />
                                    </Paper>
                                    <Stack direction="row" spacing={2}>
                                        <Button variant="outlined" onClick={() => downloadQR('png')} startIcon={<Download />}>
                                            PNG
                                        </Button>
                                        <Button variant="outlined" onClick={() => downloadQR('jpeg')} startIcon={<PhotoLibrary />}>
                                            JPEG
                                        </Button>
                                        <Button variant="outlined" onClick={() => downloadQR('svg')} startIcon={<Style />}>
                                            SVG
                                        </Button>
                                    </Stack>
                                </Stack>
                            </Fade>
                        )}
                    </Stack>
                </CardContent>
            </Card>
        </Fade>
    );
}
