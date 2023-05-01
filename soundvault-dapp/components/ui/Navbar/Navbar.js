import Link from 'next/link';

import Logo from '@/components/icons/Logo';
import { ConnectButton } from '@particle-network/connect-react-ui';


import s from './Navbar.module.css';

const Navbar = () => {

  return (
    <nav className={s.root}>
      <a href="#skip" className="sr-only focus:not-sr-only">
        Skip to content
      </a>
      <div className="mx-auto max-w-6xl px-6">
        <div className="flex justify-between align-center flex-row py-4 md:py-6 relative">
          <div className="flex flex-1 items-center">
            <Link href="/" className={s.logo} aria-label="Logo">
              <Logo />
            </Link>
            <nav className="space-x-2 ml-6 hidden lg:block">
              <Link href="/" className={s.link}>
                DashBoard
              </Link>
              <Link href="/test" className={s.link}>
                Test
              </Link>
            </nav>
          </div>

          <div className="flex flex-1 justify-end space-x-8">
            <ConnectButton />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;