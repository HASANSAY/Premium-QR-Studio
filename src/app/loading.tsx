import { Box, CircularProgress, Typography } from '@mui/material';

export default function Loading() {
    return (
        <Box
            sx={{
                minHeight: '100vh',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 3,
                bgcolor: '#050505',
            }}
        >
            <CircularProgress
                size={60}
                thickness={4}
                sx={{
                    color: 'primary.main',
                    '& .MuiCircularProgress-circle': {
                        strokeLinecap: 'round',
                    },
                }}
            />
            <Typography variant="body1" color="text.secondary">
                Yükleniyor...
            </Typography>
        </Box>
    );
}
