# 📱 Anything to QR Code

A clean, free QR code generator built with **React** and **Tailwind CSS**. Convert URLs, text, or contact info into scannable QR codes — fast and privacy-friendly.

## ✨ Features

- 🔗 Supports URL, text, and contact (vCard) inputs
- 🌐 Multilingual (English + Spanish)
- 📥 Download or copy your QR code
- 🛡️ No data stored
- 📱 Responsive design
- 🎨 Modern UI with gradient backgrounds

## 🚀 Getting Started

```bash
# Clone the repository
git clone https://github.com/your-username/any-2-qr.git
cd any-2-qr

# Install dependencies
npm install

# Start development server
npm start
```

Visit `http://localhost:3000` in your browser.

## 🧰 Tech Stack

- **React 18 + TypeScript** - Modern React with full type safety
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Beautiful icon library
- **QRious** - Primary QR code generation (with Google Charts + QRServer fallbacks)
- **Custom Hooks** - Reusable logic for QR generation and translations
- **Modular Architecture** - Small, focused components and utilities

## 📂 Project Structure

```
src/
├── components/
│   ├── QRCodeGenerator.tsx    # Main QR generator component
│   ├── TabNavigation.tsx      # Tab switching component
│   ├── URLInput.tsx           # URL input form
│   ├── TextInput.tsx          # Text input form
│   ├── ContactInput.tsx       # Contact form
│   ├── QRCodeDisplay.tsx      # QR code display area
│   ├── ActionButtons.tsx      # Download/copy buttons
│   └── index.ts               # Component exports
├── hooks/
│   ├── useTranslation.ts      # Translation hook
│   ├── useQRCode.ts           # QR code generation hook
│   └── index.ts               # Hook exports
├── utils/
│   ├── qrUtils.ts             # QR generation utilities
│   └── index.ts               # Utility exports
├── constants/
│   ├── translations.ts        # Translation constants
│   └── index.ts               # Constants exports
├── types/
│   └── index.ts               # TypeScript type definitions
├── App.tsx                    # Root app component
├── index.tsx                  # Entry point
└── index.css                  # Tailwind imports
```
