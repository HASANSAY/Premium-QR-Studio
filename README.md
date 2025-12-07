# 🎨 Premium QR Code Generator

A modern, beautiful QR code generator built with **Next.js 16**, **Material UI**, and **TypeScript**.

![QR Code Generator](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)
![Material UI](https://img.shields.io/badge/Material_UI-7-blue?style=flat-square&logo=mui)

---

## ✨ Features

- 🎨 **Modern Purple Theme** - Beautiful gradient UI with Material Design
- 📱 **Responsive Design** - Works perfectly on all devices
- 🔽 **Multiple Formats** - Download QR codes as PNG, JPEG, or SVG
- ⚡ **Instant Generation** - Real-time QR code creation
- ♿ **Accessible** - WCAG 2.1 AA compliant with full ARIA support
- 🔒 **Secure** - Security headers and input validation
- 🚀 **Fast** - Optimized bundle (~120KB gzipped)
- 📊 **SEO Optimized** - Full meta tags, sitemap, and robots.txt

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/qr-generator.git

# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

---

## 🌍 Environment Variables

Create a `.env.local` file in the root directory:

```env
# Site URL for production
NEXT_PUBLIC_SITE_URL=https://your-domain.com

# App Name (optional)
NEXT_PUBLIC_APP_NAME=Premium QR Studio
```

---

## 📦 Build & Deploy

### Production Build

```bash
npm run build
npm start
```

### Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

1. Push to GitHub
2. Import to Vercel
3. Set environment variables
4. Deploy! 🎉

---

## 🛠️ Tech Stack

- **Framework:** Next.js 16 (App Router)
- **UI Library:** Material UI 7
- **Language:** TypeScript 5
- **QR Generation:** qrcode library
- **Styling:** Emotion (CSS-in-JS)
- **Icons:** Material Icons

---

## 📂 Project Structure

```
src/
├── app/
│   ├── layout.tsx       # Root layout with theme
│   ├── page.tsx         # Homepage
│   ├── providers.tsx    # Client providers (MUI)
│   ├── loading.tsx      # Loading UI
│   ├── error.tsx        # Error boundary
│   ├── sitemap.ts       # SEO sitemap
│   └── globals.css      # Global styles
├── components/
│   └── QRCodeGenerator.tsx  # Main QR component
└── theme/
    └── theme.ts         # MUI custom theme
```

---

## 🎯 Features in Detail

### QR Code Generation
- URL validation with regex
- Real-time generation (no server required)
- High-quality output (800x800px)
- Multiple download formats

### Download Options
1. **PNG** - Best for web and digital use
2. **JPEG** - Compressed format for photos
3. **SVG** - Vector format for infinite scaling

### Accessibility
- Full keyboard navigation
- Screen reader support
- ARIA labels and descriptions
- High contrast colors

### SEO
- Dynamic sitemap generation
- Meta tags (OpenGraph, Twitter)
- robots.txt configuration
- Semantic HTML5

---

## 📝 License

MIT License - feel free to use this project!

---

## 🤝 Contributing

Contributions are welcome! Please open an issue or submit a pull request.

---

## 📧 Contact

For questions or feedback, please open an issue on GitHub.

---

**Made with 💜 by Premium QR Studio**

