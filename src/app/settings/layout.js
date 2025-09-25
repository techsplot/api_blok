import '../../app/globals.css';

export const metadata = {
  title: 'APIblok - AI-Powered API Hub',
  description: 'Instantly find, understand, and integrate APIs with clear explanations and ready-to-use code snippets',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
