import '../style../styles/globals.css';


export const metadata = {
  title: 'Монгол цаг агаар',
  description: 'Монгол улсын аймаг, дүүргийн 7 хоног/цаг тутмын цаг агаар'
};

export default function RootLayout({ children }) {
  return (
    <html lang="mn">
      <body className="bg-gradient-to-b from-sky-50 to-white text-slate-900">
        <div className="min-h-screen">
          <header className="max-w-7xl mx-auto p-6">
            <h1 className="text-3xl font-extrabold">Монгол цаг агаар <span className="text-sky-600">— 7 хоног / цаг</span></h1>
          </header>
          <main className="max-w-7xl mx-auto p-6">{children}</main>
        </div>
      </body>
    </html>
  );
}
