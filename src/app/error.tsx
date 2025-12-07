'use client';

import { Box, Button, Typography, Container } from '@mui/material';
import { useEffect } from 'react';
import { QrCode2 } from '@mui/icons-material';

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        // Log the error to an error reporting service
        console.error('Application error:', error);
    }, [error]);

    return (
        <Box
            sx={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                bgcolor: '#050505',
                p: 2,
            }}
        >
            <Container maxWidth="sm">
                <Box
                    sx={{
                        textAlign: 'center',
                        p: 4,
                        bgcolor: 'rgba(20, 20, 30, 0.6)',
                        backdropFilter: 'blur(20px)',
                        borderRadius: 3,
                        border: '1px solid rgba(139, 92, 246, 0.2)',
                    }}
                >
                    <QrCode2
                        sx={{
                            fontSize: 64,
                            color: 'error.main',
                            mb: 2,
                        }}
                    />
                    <Typography variant="h4" component="h1" gutterBottom color="error.main">
                        Bir Hata Oluştu
                    </Typography>
                    <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                        Üzgünüz, bir şeyler yanlış gitti. Lütfen tekrar deneyin.
                    </Typography>
                    <Button
                        variant="contained"
                        size="large"
                        onClick={() => reset()}
                        sx={{ mt: 2 }}
                    >
                        Tekrar Dene
                    </Button>
                </Box>
            </Container>
        </Box>
    );
}
