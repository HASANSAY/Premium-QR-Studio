'use client';

import React, { useState } from 'react';
import QRCode from 'qrcode';
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
} from '@mui/material';
import {
  QrCode2,
  Link as LinkIcon,
  Image as ImageIcon,
  PhotoLibrary,
  CheckCircle,
} from '@mui/icons-material';

export default function QRCodeGenerator() {
  const [url, setUrl] = useState('');
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // URL Validation
  const isValidUrl = (urlString: string): boolean => {
    try {
      const urlObj = new URL(urlString);
      return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
    } catch {
      return false;
    }
  };

  const generateQR = async () => {
    if (!url.trim()) {
      setError('Lütfen bir bağlantı girin');
      return;
    }

    if (!isValidUrl(url)) {
      setError('Lütfen geçerli bir URL girin (örn: https://example.com)');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const dataUrl = await QRCode.toDataURL(url, {
        width: 800,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#ffffff',
        },
      });
      setQrDataUrl(dataUrl);
      setSuccess(true);
    } catch (err) {
      console.error('QR Code generation error:', err);
      setError('QR Kod oluşturulurken bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setLoading(false);
    }
  };

  const downloadQR = async (format: 'png' | 'jpeg') => {
    if (!qrDataUrl) return;

    try {
      let dataUrl = qrDataUrl;

      // Generate JPEG version if requested
      if (format === 'jpeg') {
        dataUrl = await QRCode.toDataURL(url, {
          width: 800,
          margin: 2,
          type: 'image/jpeg',
          color: { dark: '#000000', light: '#ffffff' },
        });
      }

      // Convert data URL to Blob
      const response = await fetch(dataUrl);
      const blob = await response.blob();

      // Create object URL from blob
      const blobUrl = URL.createObjectURL(blob);

      // Create download link with proper filename
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = `qrcode-${Date.now()}.${format === 'jpeg' ? 'jpg' : 'png'}`;
      link.setAttribute('aria-label', `QR kodu ${format.toUpperCase()} olarak indir`);

      // Trigger download
      document.body.appendChild(link);
      link.click();

      // Cleanup
      setTimeout(() => {
        document.body.removeChild(link);
        URL.revokeObjectURL(blobUrl);
      }, 100);
    } catch (error) {
      console.error('Download error:', error);
      setError('İndirme sırasında bir hata oluştu. Lütfen tekrar deneyin.');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !loading && url) {
      generateQR();
    }
  };

  return (
    <Fade in timeout={800}>
      <Card
        component="section"
        aria-labelledby="qr-generator-title"
        sx={{
          width: '100%',
          maxWidth: 600,
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
          '@keyframes gradient': {
            '0%, 100%': { backgroundPosition: '0% 50%' },
            '50%': { backgroundPosition: '100% 50%' },
          },
        }}
      >
        <CardContent sx={{ p: 4 }}>
          <Stack spacing={4} alignItems="center">
            {/* Header */}
            <Box textAlign="center">
              <Grow in timeout={1000}>
                <Box
                  sx={{
                    display: 'inline-flex',
                    p: 2,
                    borderRadius: '50%',
                    bgcolor: 'rgba(124, 58, 237, 0.1)',
                    mb: 2,
                  }}
                  role="img"
                  aria-label="QR kod simgesi"
                >
                  <QrCode2 sx={{ fontSize: 48, color: 'primary.main' }} aria-hidden="true" />
                </Box>
              </Grow>
              <Typography
                id="qr-generator-title"
                variant="h1"
                component="h1"
                sx={{ mb: 1, fontSize: { xs: '2rem', md: '2.5rem' } }}
              >
                QR Oluşturucu
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Bağlantınızı saniyeler içinde QR koda dönüştürün
              </Typography>
            </Box>

            {/* Error Alert */}
            {error && (
              <Fade in>
                <Alert
                  severity="error"
                  onClose={() => setError(null)}
                  sx={{ width: '100%' }}
                  role="alert"
                >
                  {error}
                </Alert>
              </Fade>
            )}

            {/* Success Alert */}
            {success && !error && (
              <Fade in>
                <Alert
                  severity="success"
                  icon={<CheckCircle />}
                  sx={{ width: '100%' }}
                  role="status"
                >
                  QR Kod başarıyla oluşturuldu!
                </Alert>
              </Fade>
            )}

            {/* Input Section */}
            <Stack spacing={3} width="100%" component="form" onSubmit={(e) => { e.preventDefault(); generateQR(); }}>
              <TextField
                fullWidth
                variant="outlined"
                placeholder="https://web-siteniz.com"
                value={url}
                onChange={(e) => {
                  setUrl(e.target.value);
                  setError(null);
                  setSuccess(false);
                }}
                onKeyPress={handleKeyPress}
                error={!!error}
                disabled={loading}
                inputProps={{
                  'aria-label': 'Web sitesi bağlantısı',
                  'aria-describedby': 'url-helper-text',
                  type: 'url',
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LinkIcon sx={{ color: error ? 'error.main' : 'primary.main' }} aria-hidden="true" />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    fontSize: '1rem',
                    py: 0.5,
                  },
                }}
              />
              <Typography
                id="url-helper-text"
                variant="caption"
                color="text.secondary"
                sx={{ mt: -2, display: 'block', textAlign: 'left' }}
              >
                Örnek: https://www.google.com
              </Typography>

              <Button
                type="submit"
                variant="contained"
                size="large"
                fullWidth
                onClick={generateQR}
                disabled={loading || !url}
                startIcon={loading ? null : <QrCode2 />}
                aria-label={loading ? 'QR kod oluşturuluyor' : 'QR kod oluştur'}
                sx={{
                  py: 1.5,
                  fontSize: '1.1rem',
                }}
              >
                {loading ? 'Oluşturuluyor...' : 'QR Kod Oluştur'}
              </Button>
            </Stack>

            {/* QR Code Display */}
            {qrDataUrl && (
              <Fade in timeout={600}>
                <Stack spacing={3} width="100%" alignItems="center" sx={{ pt: 2 }} role="region" aria-label="Oluşturulan QR kod">
                  <Box
                    sx={{
                      borderTop: '1px solid',
                      borderColor: 'rgba(255, 255, 255, 0.1)',
                      width: '100%',
                      mb: 2,
                    }}
                  />

                  <Grow in timeout={800}>
                    <Paper
                      elevation={0}
                      sx={{
                        p: 3,
                        bgcolor: '#ffffff',
                        borderRadius: 3,
                        position: 'relative',
                        overflow: 'hidden',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          transform: 'scale(1.02)',
                          boxShadow: '0 0 40px rgba(124, 58, 237, 0.3)',
                        },
                        '&::before': {
                          content: '""',
                          position: 'absolute',
                          inset: 0,
                          background:
                            'linear-gradient(135deg, rgba(124, 58, 237, 0.1) 0%, rgba(192, 38, 211, 0.1) 100%)',
                          opacity: 0,
                          transition: 'opacity 0.3s ease',
                        },
                        '&:hover::before': {
                          opacity: 1,
                        },
                      }}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={qrDataUrl}
                        alt={`${url} için QR kodu`}
                        style={{
                          width: '100%',
                          maxWidth: '280px',
                          height: 'auto',
                          display: 'block',
                          position: 'relative',
                          zIndex: 1,
                        }}
                      />
                    </Paper>
                  </Grow>

                  {/* Download Buttons */}
                  <Stack direction="row" spacing={2} width="100%" role="group" aria-label="İndirme seçenekleri">
                    <Button
                      variant="outlined"
                      fullWidth
                      startIcon={<ImageIcon aria-hidden="true" />}
                      onClick={() => downloadQR('png')}
                      aria-label="QR kodu PNG formatında indir"
                      sx={{
                        py: 1.5,
                        borderColor: 'primary.main',
                        color: 'primary.light',
                        '&:hover': {
                          borderColor: 'primary.light',
                          bgcolor: 'rgba(124, 58, 237, 0.1)',
                        },
                      }}
                    >
                      PNG İndir
                    </Button>

                    <Button
                      variant="outlined"
                      fullWidth
                      startIcon={<PhotoLibrary aria-hidden="true" />}
                      onClick={() => downloadQR('jpeg')}
                      aria-label="QR kodu JPEG formatında indir"
                      sx={{
                        py: 1.5,
                        borderColor: 'secondary.main',
                        color: 'secondary.light',
                        '&:hover': {
                          borderColor: 'secondary.light',
                          bgcolor: 'rgba(192, 38, 211, 0.1)',
                        },
                      }}
                    >
                      JPEG İndir
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
