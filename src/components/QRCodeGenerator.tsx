'use client';

import React, { useState, useRef, useEffect } from 'react';
import { QRCode } from 'react-qrcode-logo';
import QRCodeLib from 'qrcode';
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
  Paper,
  Alert,
  InputAdornment,
  Tabs,
  Tab,
  MenuItem,
} from '@mui/material';
import {
  QrCode2,
  Link as LinkIcon,
  Image as ImageIcon,
  PhotoLibrary,
  CheckCircle,
  Style,
  Wifi,
  ContactPhone,
  Email,
  Sms,
  Phone,
  TextSnippet,
} from '@mui/icons-material';
import {
  QRType,
  WiFiData,
  VCardData,
  EmailData,
  SMSData,
  getQRData
} from '@/utils/qrHelpers';

export default function QRCodeGenerator() {
  const [tabValue, setTabValue] = useState<QRType>('url');
  const [qrValue, setQrValue] = useState('');
  const [qrData, setQrData] = useState<any>('');
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [urlGenerated, setUrlGenerated] = useState(false); // New state

  // Form States
  const [wifiData, setWifiData] = useState<WiFiData>({ ssid: '', password: '', security: 'WPA', hidden: false });
  const [vCardData, setVCardData] = useState<VCardData>({ firstName: '', lastName: '', phone: '', email: '' });
  const [emailData, setEmailData] = useState<EmailData>({ email: '', subject: '', body: '' });
  const [smsData, setSmsData] = useState<SMSData>({ phone: '', message: '' });
  const [phoneData, setPhoneData] = useState('');
  const [textData, setTextData] = useState('');

  // Customization States
  const [fgColor, setFgColor] = useState('#000000');
  const [bgColor, setBgColor] = useState('#ffffff');
  const [logoBase64, setLogoBase64] = useState<string | null>(null);
  const [logoOpacity, setLogoOpacity] = useState(1);
  const [logoSize, setLogoSize] = useState(60);

  const qrRef = useRef<any>(null);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoBase64(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // URL Validation
  const isValidUrl = (urlString: string): boolean => {
    try {
      const urlObj = new URL(urlString);
      return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
    } catch {
      return false;
    }
  };

  const updateQRValue = () => {
    if (tabValue === 'url') return; // Don't update automatically for URL

    let data = '';
    switch (tabValue) {
      case 'wifi': data = getQRData('wifi', wifiData); break;
      case 'vcard': data = getQRData('vcard', vCardData); break;
      case 'email': data = getQRData('email', emailData); break;
      case 'phone': data = getQRData('phone', phoneData); break;
      case 'sms': data = getQRData('sms', smsData); break;
    }
    setQrData(data);
  };

  useEffect(() => {
    updateQRValue();
  }, [tabValue, wifiData, vCardData, emailData, smsData, phoneData, textData]);

  // History State
  const [history, setHistory] = useState<any[]>([]);

  useEffect(() => {
    const savedHistory = localStorage.getItem('qr_history');
    if (savedHistory) setHistory(JSON.parse(savedHistory));
  }, []);

  const addToHistory = (type: QRType, data: string) => {
    const newItem = { id: Date.now(), type, data, timestamp: new Date().toISOString() };
    const updatedHistory = [newItem, ...history.filter(item => item.data !== data)].slice(0, 5);
    setHistory(updatedHistory);
    localStorage.setItem('qr_history', JSON.stringify(updatedHistory));
  };

  const generateQR = async () => {
    if (tabValue === 'url' && !qrValue.trim()) {
      setError('Lütfen bir bağlantı girin');
      return;
    }

    if (tabValue === 'url' && !isValidUrl(qrValue)) {
      setError('Lütfen geçerli bir URL girin (örn: https://example.com)');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      await new Promise(resolve => setTimeout(resolve, 600));

      const finalData = tabValue === 'url' ? qrValue : qrData;
      if (tabValue === 'url') {
        setQrData(qrValue);
        setUrlGenerated(true);
      }

      addToHistory(tabValue, finalData);
      setSuccess(true);
    } catch (err) {
      console.error('QR Code generation error:', err);
      setError('QR Kod oluşturulurken bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  const downloadQR = async (format: 'png' | 'jpg' | 'svg') => {
    if (!qrRef.current) return;

    try {
      if (format === 'svg') {
        const svgString = await QRCodeLib.toString(qrData, {
          type: 'svg',
          width: 800,
          margin: 2,
          color: { dark: fgColor, light: bgColor }, // Use custom colors even in SVG
        });
        const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `qrcode-${Date.now()}.svg`;
        link.click();
        URL.revokeObjectURL(url);
      } else {
        // react-qrcode-logo uses 'png' or 'jpg'
        qrRef.current.download(format, `qrcode-${Date.now()}`);
      }
    } catch (error) {
      console.error('Download error:', error);
      setError('İndirme sırasında bir hata oluştu.');
    }
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: QRType) => {
    setTabValue(newValue);
    setError(null);
    setSuccess(false);
    if (newValue === 'url') setUrlGenerated(false); // Reset for URL tab
  };

  return (
    <Fade in timeout={800}>
      <Card
        component="section"
        sx={{
          width: '100%',
          maxWidth: 800,
          position: 'relative',
          overflow: 'visible',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '4px',
            background: 'linear-gradient(90deg, #7c3aed 0%, #c026d3 50%, #7c3aed 100%)',
            backgroundSize: '200% 100%',
            animation: 'gradient 3s ease infinite',
          },
        }}
      >
        <CardContent sx={{ p: { xs: 2, md: 4 } }}>
          <Stack spacing={4}>
            {/* Header */}
            <Box textAlign="center">
              <Typography variant="h4" component="h1" gutterBottom fontWeight="800" sx={{ color: 'white' }}>
                Premium QR Studio
              </Typography>
              <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.6)' }}>
                Tüm ihtiyaçlarınız için profesyonel QR kodları oluşturun
              </Typography>
            </Box>

            {/* Type Selection Tabs */}
            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              variant="scrollable"
              scrollButtons="auto"
              sx={{
                borderBottom: 1,
                borderColor: 'divider',
                '& .MuiTabs-indicator': { height: 3, borderRadius: '3px 3px 0 0' }
              }}
            >
              <Tab icon={<LinkIcon />} label="URL" value="url" />
              <Tab icon={<Wifi />} label="WiFi" value="wifi" />
              <Tab icon={<ContactPhone />} label="VCard" value="vcard" />
              <Tab icon={<Email />} label="Email" value="email" />
              <Tab icon={<Phone />} label="Telefon" value="phone" />
              <Tab icon={<Sms />} label="SMS" value="sms" />
            </Tabs>

            {/* Form and Customization Section */}
            <Stack spacing={6} alignItems="center">
              {/* Main Input Area - Centered and Larger */}
              <Box sx={{ width: '100%', maxWidth: 650 }}>
                {error && (
                  <Alert severity="error" onClose={() => setError(null)} sx={{ mb: 3 }}>
                    {error}
                  </Alert>
                )}

                {success && (
                  <Alert severity="success" sx={{ mb: 3 }}>
                    QR Kodunuz hazır! Aşağıdan ince ayarlayıp indirebilirsiniz.
                  </Alert>
                )}

                {/* Dynamic Form Content */}
                <Stack spacing={4}>
                  {tabValue === 'url' && (
                    <TextField
                      fullWidth
                      label="Web Sitesi Adresi"
                      placeholder="https://example.com"
                      value={qrValue}
                      onChange={(e) => setQrValue(e.target.value)}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          fontSize: '1.2rem',
                          p: 1.5,
                          borderRadius: 3,
                          bgcolor: 'rgba(255,255,255,0.03)',
                        }
                      }}
                      InputProps={{
                        startAdornment: <InputAdornment position="start"><LinkIcon color="primary" sx={{ fontSize: 28 }} /></InputAdornment>,
                      }}
                    />
                  )}

                  {tabValue === 'wifi' && (
                    <Stack spacing={2} sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}>
                      <TextField
                        fullWidth
                        label="Ağ Adı (SSID)"
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
                      <TextField
                        select
                        fullWidth
                        label="Güvenlik Tipi"
                        value={wifiData.security}
                        onChange={(e) => setWifiData({ ...wifiData, security: e.target.value as any })}
                      >
                        <MenuItem value="WPA">WPA/WPA2</MenuItem>
                        <MenuItem value="WEP">WEP</MenuItem>
                        <MenuItem value="nopass">Şifresiz</MenuItem>
                      </TextField>
                    </Stack>
                  )}

                  {/* ... other tabs remain same but with consistent styling ... */}
                  {tabValue === 'vcard' && (
                    <Stack spacing={2} sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}>
                      <Stack direction="row" spacing={2}>
                        <TextField fullWidth label="Ad" value={vCardData.firstName} onChange={(e) => setVCardData({ ...vCardData, firstName: e.target.value })} />
                        <TextField fullWidth label="Soyad" value={vCardData.lastName} onChange={(e) => setVCardData({ ...vCardData, lastName: e.target.value })} />
                      </Stack>
                      <TextField fullWidth label="Telefon" value={vCardData.phone} onChange={(e) => setVCardData({ ...vCardData, phone: e.target.value })} />
                      <TextField fullWidth label="E-posta" value={vCardData.email} onChange={(e) => setVCardData({ ...vCardData, email: e.target.value })} />
                    </Stack>
                  )}

                  {tabValue === 'email' && (
                    <Stack spacing={2} sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}>
                      <TextField fullWidth label="Alıcı E-posta" value={emailData.email} onChange={(e) => setEmailData({ ...emailData, email: e.target.value })} />
                      <TextField fullWidth label="Konu" value={emailData.subject} onChange={(e) => setEmailData({ ...emailData, subject: e.target.value })} />
                      <TextField fullWidth multiline rows={3} label="Mesaj" value={emailData.body} onChange={(e) => setEmailData({ ...emailData, body: e.target.value })} />
                    </Stack>
                  )}

                  {tabValue === 'phone' && (
                    <TextField
                      fullWidth
                      label="Telefon Numarası"
                      value={phoneData}
                      onChange={(e) => setPhoneData(e.target.value)}
                      sx={{ '& .MuiOutlinedInput-root': { fontSize: '1.2rem', p: 1.5, borderRadius: 3 } }}
                      InputProps={{
                        startAdornment: <InputAdornment position="start"><Phone color="primary" sx={{ fontSize: 28 }} /></InputAdornment>,
                      }}
                    />
                  )}

                  {tabValue === 'sms' && (
                    <Stack spacing={2} sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}>
                      <TextField fullWidth label="Telefon Numarası" value={smsData.phone} onChange={(e) => setSmsData({ ...smsData, phone: e.target.value })} />
                      <TextField fullWidth multiline rows={2} label="Mesaj" value={smsData.message} onChange={(e) => setSmsData({ ...smsData, message: e.target.value })} />
                    </Stack>
                  )}

                  <Button
                    variant="contained"
                    size="large"
                    fullWidth
                    onClick={generateQR}
                    disabled={loading}
                    sx={{
                      py: 2,
                      fontSize: '1.2rem',
                      borderRadius: 4,
                      textTransform: 'none',
                      boxShadow: '0 10px 20px rgba(124, 58, 237, 0.3)',
                      transition: '0.3s',
                      '&:hover': { transform: 'translateY(-2px)', boxShadow: '0 15px 30px rgba(124, 58, 237, 0.5)' }
                    }}
                  >
                    {loading ? 'İşleniyor...' : (tabValue === 'url' ? 'QR Oluştur' : 'Önizlemeyi Güncelle')}
                  </Button>
                </Stack>
              </Box>

              {/* Customization Section (Horizontal on Desktop) */}
              <Box sx={{ width: '100%', pt: 4, borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                <Typography variant="subtitle1" gutterBottom fontWeight="700" textAlign="center" sx={{ mb: 3 }}>
                  Tasarımı Özelleştir
                </Typography>
                <Stack direction={{ xs: 'column', md: 'row' }} spacing={4} justifyContent="center" alignItems="center">
                  <Box sx={{ display: 'flex', gap: 3 }}>
                    <Box textAlign="center">
                      <Typography variant="caption" color="text.secondary">QR Rengi</Typography>
                      <Box sx={{ mt: 1, p: 0.5, borderRadius: '50%', border: '2px solid rgba(255,255,255,0.1)', display: 'flex' }}>
                        <input type="color" value={fgColor} onChange={(e) => setFgColor(e.target.value)} style={{ width: 40, height: 40, border: 'none', borderRadius: '50%', cursor: 'pointer', background: 'none' }} />
                      </Box>
                    </Box>
                    <Box textAlign="center">
                      <Typography variant="caption" color="text.secondary">Arkaplan</Typography>
                      <Box sx={{ mt: 1, p: 0.5, borderRadius: '50%', border: '2px solid rgba(255,255,255,0.1)', display: 'flex' }}>
                        <input type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)} style={{ width: 40, height: 40, border: 'none', borderRadius: '50%', cursor: 'pointer', background: 'none' }} />
                      </Box>
                    </Box>
                  </Box>

                  <Box>
                    <Button
                      variant="outlined"
                      component="label"
                      startIcon={<PhotoLibrary />}
                      sx={{ borderRadius: 3, px: 4, py: 1.2, borderStyle: 'dashed' }}
                    >
                      Logo Yükle
                      <input type="file" hidden accept="image/*" onChange={handleLogoUpload} />
                    </Button>
                    {logoBase64 && (
                      <Typography
                        variant="caption"
                        onClick={() => setLogoBase64(null)}
                        sx={{ display: 'block', textAlign: 'center', mt: 1, color: 'error.main', cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}
                      >
                        Logoyu Kaldır
                      </Typography>
                    )}
                  </Box>
                </Stack>
              </Box>
            </Stack>

            {/* Display Section: Hidden for URL until created */}
            {(tabValue !== 'url' || urlGenerated) && (
              <Fade in>
                <Stack spacing={4} alignItems="center" sx={{ mt: 6, pt: 6, borderTop: '2px solid rgba(124, 58, 237, 0.2)' }}>
                  {/* Download Buttons */}
                  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} width="100%" sx={{ maxWidth: 600 }}>
                    <Button
                      fullWidth
                      variant="contained"
                      color="primary"
                      startIcon={<ImageIcon />}
                      onClick={() => downloadQR('png')}
                      sx={{ py: 1.5, borderRadius: 3 }}
                    >
                      PNG İndir
                    </Button>
                    <Button
                      fullWidth
                      variant="contained"
                      color="secondary"
                      startIcon={<PhotoLibrary />}
                      onClick={() => downloadQR('jpg')}
                      sx={{ py: 1.5, borderRadius: 3 }}
                    >
                      JPG İndir
                    </Button>
                    <Button
                      fullWidth
                      variant="contained"
                      color="success"
                      startIcon={<Style />}
                      onClick={() => downloadQR('svg')}
                      sx={{ py: 1.5, borderRadius: 3 }}
                    >
                      SVG İndir
                    </Button>
                  </Stack>

                  {/* QR Image */}
                  <Paper
                    elevation={0}
                    sx={{
                      p: 4,
                      bgcolor: bgColor,
                      borderRadius: 6,
                      boxShadow: '0 30px 60px rgba(0,0,0,0.5)',
                      transition: '0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                      '&:hover': { transform: 'scale(1.05) rotate(1deg)' }
                    }}
                  >
                    <QRCode
                      ref={qrRef}
                      value={qrData || 'Premium QR Studio'}
                      size={300}
                      quietZone={10}
                      qrStyle="squares"
                      eyeRadius={12}
                      fgColor={fgColor}
                      bgColor={bgColor}
                      logoImage={logoBase64 || undefined}
                      logoWidth={logoSize}
                      logoOpacity={logoOpacity}
                      removeQrCodeBehindLogo={true}
                    />
                  </Paper>
                </Stack>
              </Fade>
            )}

            {/* History Section */}
            {history.length > 0 && (
              <Box sx={{ mt: 4, pt: 4, borderTop: '1px dotted rgba(255,255,255,0.1)' }}>
                <Typography variant="overline" color="text.secondary" sx={{ mb: 2, display: 'block' }}>
                  Son Oluşturulanlar
                </Typography>
                <Stack spacing={1}>
                  {history.map((item) => (
                    <Paper
                      key={item.id}
                      onClick={() => {
                        setTabValue(item.type);
                        setQrData(item.data);
                        setSuccess(true);
                      }}
                      sx={{
                        p: 1.5,
                        bgcolor: 'rgba(255,255,255,0.03)',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        transition: '0.2s',
                        '&:hover': { bgcolor: 'rgba(255,255,255,0.08)' }
                      }}
                    >
                      <Stack direction="row" spacing={2} alignItems="center">
                        <Box sx={{ p: 1, borderRadius: 1, bgcolor: 'rgba(124, 58, 237, 0.2)' }}>
                          <QrCode2 sx={{ fontSize: 20, color: 'primary.light' }} />
                        </Box>
                        <Box>
                          <Typography variant="body2" fontWeight="600">{item.type.toUpperCase()}</Typography>
                          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {item.data}
                          </Typography>
                        </Box>
                      </Stack>
                      <Typography variant="caption" color="text.secondary">
                        {new Date(item.timestamp).toLocaleTimeString()}
                      </Typography>
                    </Paper>
                  ))}
                </Stack>
              </Box>
            )}
          </Stack>
        </CardContent>
      </Card>
    </Fade>
  );
}
