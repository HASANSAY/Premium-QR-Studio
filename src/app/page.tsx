import QRCodeGenerator from '@/components/QRCodeGenerator';
import ParticleBackground from '@/components/ParticleBackground';
import { Container, Box, Typography } from '@mui/material';

export default function Home() {
  return (
    <Box
      component="main"
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        py: { xs: 6, md: 8 },
        px: 2,
        position: 'relative',
        overflow: 'hidden',
        bgcolor: '#050505',
      }}
    >
      {/* Background Gradient Orbs */}
      <Box
        sx={{
          position: 'absolute',
          top: '-20%',
          left: '-10%',
          width: { xs: '80vw', md: '50vw' },
          height: { xs: '80vw', md: '50vw' },
          background: 'radial-gradient(circle, rgba(124, 58, 237, 0.25) 0%, transparent 70%)',
          borderRadius: '50%',
          filter: 'blur(100px)',
          animation: 'pulse 4s ease-in-out infinite',
          pointerEvents: 'none',
        }}
      />

      <Box
        sx={{
          position: 'absolute',
          bottom: '-20%',
          right: '-10%',
          width: { xs: '80vw', md: '50vw' },
          height: { xs: '80vw', md: '50vw' },
          background: 'radial-gradient(circle, rgba(192, 38, 211, 0.15) 0%, transparent 70%)',
          borderRadius: '50%',
          filter: 'blur(100px)',
          pointerEvents: 'none',
        }}
      />

      {/* Animated Particles */}
      <ParticleBackground />

      <Box sx={{ position: 'relative', zIndex: 1, width: '100%', display: 'flex', justifyContent: 'center' }}>
        <QRCodeGenerator />
      </Box>

      <Typography
        component="footer"
        variant="caption"
        sx={{
          position: 'absolute',
          bottom: 24,
          color: 'rgba(255, 255, 255, 0.2)',
          fontWeight: 600,
          letterSpacing: '0.15em',
          textTransform: 'uppercase',
          fontSize: '0.7rem',
        }}
      >
        Edesis Premium QR Studio
      </Typography>
    </Box>
  );
}
