import Image from 'next/image';
import Link from 'next/link';
import { ReactNode } from 'react';

import { links } from '../../consts/links';
import { Discord } from '../icons/Discord';
import { Github } from '../icons/Github';
import { HyperlaneLogo } from '../icons/HyperlaneLogo';
import { Twitter } from '../icons/Twitter';

import ProtofireLogo from '../../images/icons/protofire.svg';

type FooterLink = {
  title: string;
  url: string;
  external: boolean;
  icon?: ReactNode;
};

const footerLinks: FooterLink[] = [
  { title: 'Docs', url: links.docs, external: true },
  { title: 'Terms', url: links.tos, external: true },
  { title: 'Twitter', url: links.twitter, external: true, icon: <Twitter fill='#D4D4D4' /> },
  { title: 'Homepage', url: links.home, external: true },
  { title: 'Privacy', url: links.privacyPolicy, external: true },
  { title: 'Discord', url: links.discord, external: true, icon: <Discord fill='#D4D4D4' /> },
  { title: 'Explorer', url: links.explorer, external: true },
  { title: 'Bounty', url: links.bounty, external: true },
  { title: 'Github', url: links.github, external: true, icon: <Github fill='#D4D4D4' /> },
];

export function Footer() {
  return (
    <footer className="relative text-white">
      <div className="relative z-10 bg-gradient-to-b from-transparent to-black/40 px-8 pb-5 pt-2 sm:pt-0">
        <div className="flex flex-col items-center justify-between gap-8 sm:flex-row sm:gap-10">
          <FooterLogo />
          <FooterNav />
        </div>
      </div>
    </footer>
  );
}

function FooterLogo() {
  return (
    <div className="flex items-center justify-center">
      <div className="ml-2 w-12 sm:w-16 h-12 sm:h-16">
        <HyperlaneLogo fill='#D4D4D4' />
      </div>
      <div className="text-sm sm:text-base font-medium ml-6 space-y-1">
        <a
          href="https://hyperlane.xyz/"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:underline"
        >
          Built with Hyperlane
        </a>
        <div className="flex items-center">
          <span className="mr-2">by</span>
          <a
            href="https://www.protofire.io/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              src={ProtofireLogo}
              alt="Protofire"
              width={120}
              height={30}
            />
          </a>
        </div>
      </div>
    </div>
  );
}

function FooterNav() {
  return (
    <nav className="flex text-md font-medium">
      <ul className={`${styles.linkGrid}`}>
        {footerLinks.map((item) => (
          <li key={item.title}>
            <Link
              className={styles.linkItem}
              target={item.external ? '_blank' : '_self'}
              href={item.url}
            >
              {item?.icon && <div className="mr-4 w-5">{item?.icon}</div>}
              <div className="">{item.title}</div>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

const styles = {
  linkGrid: 'grid grid-cols-3 gap-x-6 gap-y-1.5',
  linkItem: 'flex items-center capitalize text-decoration-none hover:underline underline-offset-2',
};
