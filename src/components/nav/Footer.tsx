import { DiscordIcon, GithubIcon, TwitterIcon } from '@hyperlane-xyz/widgets';
import Link from 'next/link';
import { ReactNode } from 'react';
import { links } from '../../consts/links';
//import { Color } from '../../styles/Color';

type FooterLink = {
  title: string;
  url: string;
  external: boolean;
  icon?: ReactNode;
};

const footerLinks: FooterLink[] = [
  { title: 'Home', url: links.home, external: true },
  { title: 'Terms', url: links.tos, external: true },
  { title: 'Twitter', url: links.twitter, external: true, icon: <TwitterIcon color="#D4D4D4" /> },
  { title: 'Docs', url: links.docs, external: true },
  { title: 'Privacy', url: links.privacyPolicy, external: true },
  { title: 'Discord', url: links.discord, external: true, icon: <DiscordIcon color="#D4D4D4" /> },
  { title: 'Explorer', url: links.explorer, external: true },
  { title: 'Datahub', url: links.dataHub, external: true },
  { title: 'Github', url: links.github, external: true, icon: <GithubIcon color="#D4D4D4" /> },
];

export function Footer() {
  return (
    <footer className="relative text-white">
      <div className="relative bg-gradient-to-b from-transparent to-black/40 px-8 pb-5 pt-2 sm:pt-0">
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
      {/* <div className="ml-2 w-12 sm:w-16 h-12 sm:h-16">
        <HyperlaneLogo color='#D4D4D4' />
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
      </div> */}
    </div>
  );
}

function FooterNav() {
  return (
    <nav className="text-md font-medium">
      <ul style={{ gridTemplateColumns: 'auto auto auto' }} className="grid gap-x-7 gap-y-1.5">
        {footerLinks.map((item) => (
          <li key={item.title}>
            <Link
              className="flex items-center capitalize underline-offset-2 hover:underline"
              target={item.external ? '_blank' : '_self'}
              href={item.url}
            >
              {item?.icon && <div className="mr-3 mt-1 w-4">{item?.icon}</div>}
              {!item?.icon && <div>{item.title}</div>}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
