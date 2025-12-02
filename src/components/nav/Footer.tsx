import { DiscordIcon, GithubIcon, HyperlaneLogo, TwitterIcon } from '@hyperlane-xyz/widgets';
import Image from 'next/image';
import Link from 'next/link';
import { ReactNode } from 'react';
import { links } from '../../consts/links';
import ProtofireLogo from '../../images/icons/protofire.svg';
import { Color } from '../../styles/Color';

type FooterLink = {
  title: string;
  url: string;
  external: boolean;
  icon?: ReactNode;
};

const footerLinks: FooterLink[] = [
  { title: 'Docs', url: links.docs, external: true },
  { title: 'Terms', url: links.tos, external: true },
  { title: 'Twitter', url: links.twitter, external: true, icon: <TwitterIcon color="#fff" /> },
  { title: 'Homepage', url: links.home, external: true },
  { title: 'Privacy', url: links.privacyPolicy, external: true },
  { title: 'Discord', url: links.discord, external: true, icon: <DiscordIcon color="#fff" /> },
  { title: 'Explorer', url: links.explorer, external: true },
  { title: 'Bounty', url: links.bounty, external: true },
  { title: 'Github', url: links.github, external: true, icon: <GithubIcon color="#fff" /> },
];

const footerLinks1 = footerLinks.slice(0, 4);
const footerLinks3 = footerLinks.slice(4);

export function Footer() {
  return (
    <footer className="text-white relative">
      {/* <div className="relative w-full">
        <Image className="z-0 w-full" src={FooterBg} alt="" />
      </div> */}
      <div className="relative z-10 px-8 pb-5 pt-2 sm:pt-0 bg-black">
        <div className="flex flex-col sm:flex-row gap-8 sm:gap-10 items-center justify-between">
          <div className="flex items-center justify-center">
            <div className="ml-2 w-12 sm:w-16 h-12 sm:h-16">
              <HyperlaneLogo fill={Color.white} />
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
                <a href="https://www.protofire.io/" target="_blank" rel="noopener noreferrer">
                  <Image src={ProtofireLogo} alt="Protofire" width={120} height={30} />
                </a>
              </div>
            </div>
          </div>
          <nav className="flex text-md font-medium">
            <ul className={`${styles.linkCol} mr-14`}>
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
            <ul className={`${styles.linkCol}`}>
              {footerLinks3.map((item) => (
                <li key={item.title}>
                  <Link
                    className={styles.linkItem}
                    target={item.external ? '_blank' : '_self'}
                    href={item.url}
                  >
                    {item?.icon && <div className="mr-4 w-6">{item?.icon}</div>}
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
