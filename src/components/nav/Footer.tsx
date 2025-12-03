import { DiscordIcon, GithubIcon, TwitterIcon } from '@hyperlane-xyz/widgets';
import Image from 'next/image';
import Link from 'next/link';
import { ReactNode } from 'react';
import { links } from '../../consts/links';
import FooterBg from '../../images/backgrounds/footer-bg.svg';
import ProtofireLogo from '../../images/icons/protofire.svg';
import { Color } from '../../styles/Color';
import { HyperlaneLogo } from '../icons/HyperlaneLogo';

type FooterLink = {
  title: string;
  url: string;
  external: boolean;
  icon?: ReactNode;
};

const footerLinks: FooterLink[] = [
  { title: 'Docs', url: links.docs, external: true },
  { title: 'Homepage', url: links.home, external: true },
  { title: 'Explorer', url: links.explorer, external: true },
  { title: 'Chains', url: links.chains, external: true },
  { title: 'Twitter', url: links.twitter, external: true, icon: <TwitterIcon color="#fff" /> },
  { title: 'Discord', url: links.discord, external: true, icon: <DiscordIcon color="#fff" /> },
  { title: 'Github', url: links.github, external: true, icon: <GithubIcon color="#fff" /> },
  { title: 'Blog', url: links.blog, external: true },
];

const footerLinks1 = footerLinks.slice(0, 4);
const footerLinks3 = footerLinks.slice(4);

export function Footer() {
  return (
    <footer className="text-white relative">
      <div className="relative w-full">
        <Image className="z-0 w-full" src={FooterBg} alt="" />
      </div>
      <div className="relative z-10 px-4 sm:px-8 pb-5 pt-2 sm:pt-0 bg-black">
        <div className="flex flex-col sm:flex-row gap-6 sm:gap-10 items-center justify-between">
          <div className="flex flex-col sm:flex-row items-center justify-center text-center sm:text-left">
            <div className="w-10 sm:w-12 md:w-16 h-10 sm:h-12 md:h-16">
              <HyperlaneLogo fill={Color.white} />
            </div>
            <div className="text-xs sm:text-sm md:text-base font-medium mt-2 sm:mt-0 sm:ml-6 space-y-1">
              <a
                href="https://hyperlane.xyz/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline block"
              >
                Built with Hyperlane
              </a>
              <div className="flex justify-center sm:items-center">
                <span className="mr-2">by</span>
                <a href="https://www.protofire.io/" target="_blank" rel="noopener noreferrer">
                  <img src={ProtofireLogo.src || ProtofireLogo} alt="Protofire" className="w-20 sm:w-24 h-auto" />
                </a>
              </div>
            </div>
          </div>
          <nav className="flex flex-col sm:flex-row text-sm sm:text-md font-medium w-full sm:w-auto">
            <ul className={`${styles.linkCol} sm:mr-14 items-center sm:items-start`}>
              {footerLinks1.map((item) => (
                <li className="" key={item.title}>
                  <Link
                    className={styles.linkItem}
                    target={item.external ? '_blank' : '_self'}
                    href={item.url}
                  >
                    <div className="">{item.title}</div>
                  </Link>
                </li>
              ))}
            </ul>
            <ul className={`${styles.linkCol} mt-2 sm:mt-0 items-center sm:items-start`}>
              {footerLinks3.map((item) => (
                <li key={item.title}>
                  <Link
                    className={styles.linkItem}
                    target={item.external ? '_blank' : '_self'}
                    href={item.url}
                  >
                    {item?.icon && <div className="mr-4 w-5 sm:w-6">{item?.icon}</div>}
                    <div className="">{item.title}</div>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </footer>
  );
}

const styles = {
  linkCol: 'flex flex-col gap-2',
  linkItem: 'flex items-center hover:text-gray-300 transition-colors',
};
