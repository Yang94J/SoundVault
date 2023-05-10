import Link from 'next/link';

import Logo from '@/components/icons/Logo';
import GitHub from '@/components/icons/GitHub';

// import s from './Footer.module.css';

export default function Footer() {
  return (
    <footer className="mx-auto max-w-[1920px] px-6 bg-zinc-900">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 border-b border-zinc-600 py-6 text-white transition-colors duration-150 bg-zinc-900">
        <div className="col-span-1 lg:col-span-2">
          <Link
            href="/"
            className="flex flex-initial items-center font-bold md:mr-24"
          >
            <span className="rounded-full border border-zinc-700 mr-2">
              <Logo />
            </span>
            <span>MusicVault</span>
          </Link>
        </div>
        <div className="col-span-3 lg:col-span-8">
            <span>&copy; MusicVault - a revolutionary platform that connects music creators with the power of Web3.</span>
        </div>
        <div className="col-span-1 lg:col-span-2 flex items-start lg:justify-end text-white">
          <div className="flex space-x-6 items-center h-10">
            <a
              aria-label="Github Repository"
              href="https://github.com/Yang94J/SoundVault"
            >
              <GitHub />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}