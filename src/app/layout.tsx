import './globals.css';

export const metadata = {
  title: 'S3 Video Gallery',
  description: 'Browse and play videos from an S3 bucket',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
