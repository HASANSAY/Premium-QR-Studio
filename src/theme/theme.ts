'use client';

import { createTheme } from '@mui/material/styles';

// Modern Purple Theme
export const theme = createTheme({
    palette: {
        mode: 'dark',
        primary: {
            main: '#7c3aed', // Violet 600
            light: '#8b5cf6', // Violet 500
            dark: '#6d28d9', // Violet 700
            contrastText: '#ffffff',
        },
        secondary: {
            main: '#c026d3', // Fuchsia 600
            light: '#d946ef', // Fuchsia 500
            dark: '#a21caf', // Fuchsia 700
            contrastText: '#ffffff',
        },
        background: {
            default: '#050505',
            paper: 'rgba(20, 20, 30, 0.6)',
        },
        text: {
            primary: '#ffffff',
            secondary: 'rgba(255, 255, 255, 0.7)',
        },
    },
    typography: {
        fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
        h1: {
            fontWeight: 700,
            fontSize: '2.5rem',
            background: 'linear-gradient(135deg, #8b5cf6 0%, #d946ef 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
        },
        h4: {
            fontWeight: 600,
            fontSize: '1.75rem',
        },
        button: {
            fontWeight: 600,
            textTransform: 'none',
        },
    },
    shape: {
        borderRadius: 12,
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: '12px',
                    padding: '12px 32px',
                    fontSize: '1rem',
                    fontWeight: 600,
                    boxShadow: '0 0 30px rgba(139, 92, 246, 0.3)',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    '&:hover': {
                        transform: 'translateY(-2px) scale(1.02)',
                        boxShadow: '0 0 40px rgba(139, 92, 246, 0.5)',
                    },
                },
                contained: {
                    background: 'linear-gradient(135deg, #7c3aed 0%, #c026d3 100%)',
                    '&:hover': {
                        background: 'linear-gradient(135deg, #6d28d9 0%, #a21caf 100%)',
                    },
                },
            },
        },
        MuiTextField: {
            styleOverrides: {
                root: {
                    '& .MuiOutlinedInput-root': {
                        backgroundColor: 'rgba(0, 0, 0, 0.3)',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                            backgroundColor: 'rgba(0, 0, 0, 0.4)',
                        },
                        '&.Mui-focused': {
                            backgroundColor: 'rgba(0, 0, 0, 0.5)',
                            '& .MuiOutlinedInput-notchedOutline': {
                                borderColor: '#7c3aed',
                                borderWidth: '2px',
                                boxShadow: '0 0 0 3px rgba(124, 58, 237, 0.2)',
                            },
                        },
                    },
                },
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    background: 'rgba(20, 20, 30, 0.6)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(139, 92, 246, 0.2)',
                    borderRadius: '24px',
                    boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
                },
            },
        },
        MuiIconButton: {
            styleOverrides: {
                root: {
                    transition: 'all 0.3s ease',
                    '&:hover': {
                        transform: 'scale(1.1)',
                        backgroundColor: 'rgba(124, 58, 237, 0.1)',
                    },
                },
            },
        },
    },
});
