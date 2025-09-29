# Portfolio2CV Frontend 🚀

A modern web application that transforms your portfolio website into a professional, ATS-friendly CV using AI technology. Built with Next.js, TypeScript, and Tailwind CSS.

## ✨ Features

- **AI-Powered Portfolio Analysis**: Automatically scrapes and analyzes portfolio websites
- **Interactive CV Editor**: Edit and customize all CV sections in real-time
- **PDF Generation**: Generate professional PDF CVs with custom templates
- **Live Preview**: See your CV updates in real-time before downloading
- **Modern UI/UX**: Clean, responsive design with smooth animations
- **ATS-Friendly**: Generates CVs optimized for Applicant Tracking Systems

## 🛠️ Tech Stack

- **Framework**: Next.js 14+ with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: React Hooks
- **Image Optimization**: Next.js Image component
- **PDF Viewing**: HTML iframe integration

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (version 18.17 or later)
- **npm**, **yarn**, **pnpm**, or **bun**
- **Git** for cloning the repository

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/kavi17498/portfoliotocv-frontend.git
cd portfoliotocv-frontend
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
# or
pnpm install
```

### 3. Environment Setup

The application requires a backend API for portfolio scraping and PDF generation. Make sure you have the backend running on `http://127.0.0.1:8000` or update the API endpoints in the code.

### 4. Run the Development Server

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

### 5. Open Your Browser

Visit [http://localhost:3000](http://localhost:3000) to see the application running.

## 🔧 Configuration

### API Endpoints

The application connects to these backend endpoints:
- **Portfolio Scraping**: `http://127.0.0.1:8000/scrape/`
- **PDF Generation**: `http://127.0.0.1:8000/generate-pdf`

To change these endpoints, update the URLs in `src/app/page.tsx`:

```typescript
const url = `http://127.0.0.1:8000/scrape/${encodeURIComponent(input.trim())}?format=json`;
const response = await fetch('http://127.0.0.1:8000/generate-pdf', {
```

## 📱 How to Use

1. **Enter Portfolio URL**: Input your portfolio website URL in the text area
2. **Generate CV Data**: Click "Generate CV" to analyze your portfolio
3. **Edit Information**: Customize the extracted information using the interactive editor
4. **Add/Remove Sections**: Use the + and ✕ buttons to manage CV sections
5. **Generate PDF**: Click "Generate PDF CV" to create your professional CV
6. **Download**: Use the download button to save your CV as PDF

## 🎨 Customization

### Styling
The application uses Tailwind CSS. You can customize colors and styles in:
- `src/app/globals.css` - Global styles
- Component classes in `src/app/page.tsx`

### Logo
Replace `public/logo.png` with your own logo (recommended size: 120x120px)

## 📁 Project Structure

```
portfoliotocv/
├── public/
│   ├── logo.png          # Application logo
│   └── ...               # Other static assets
├── src/
│   └── app/
│       ├── globals.css   # Global styles
│       ├── layout.tsx    # Root layout
│       └── page.tsx      # Main application page
├── package.json          # Dependencies and scripts
├── tailwind.config.ts    # Tailwind configuration
├── tsconfig.json         # TypeScript configuration
└── README.md            # This file
```

## 🔧 Development Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
```

## 🌐 Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repository to [Vercel](https://vercel.com)
3. Deploy with automatic CI/CD

### Other Platforms
```bash
npm run build        # Build the application
npm run start        # Start the production server
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 🐛 Troubleshooting

### Common Issues

1. **API Connection Error**
   - Ensure the backend server is running on port 8000
   - Check CORS settings on the backend

2. **Build Errors**
   - Clear node_modules and reinstall: `rm -rf node_modules && npm install`
   - Check Node.js version compatibility

3. **PDF Generation Issues**
   - Verify the backend PDF generation endpoint is working
   - Check browser console for detailed error messages

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👨‍💻 Author

**Kcodz**
- GitHub: [@kavi17498](https://github.com/kavi17498)

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)
- Icons and emojis for enhanced UX

---

**Made with ❤️ for the developer community**
