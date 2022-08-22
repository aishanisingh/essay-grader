import Link from 'next/link';

export default function Layout({ children }) {
  return (
    <div className='flex flex-col min-h-screen'>
      <header className='bg-green-400 text-green-100 mb-8 py-4'>
        <div className='container mx-auto flex justify-center'>
          <Link href='/'>
            <a>🏡</a>
          </Link>
          <span className='mx-auto font-bold text-3xl'>Welcome to Harker Essay Grader</span>{' '}
        </div>
      </header>
      <main className='container mx-auto flex-1'>{children}</main>
      <footer className='bg-green-400 text-green-100 mt-8 py-4'>
        <div className='container mx-auto flex justify-center'>
          &copy; 2022 HarkerDev
        </div>
      </footer>
    </div>
  );
}