import Image from 'next/image';
import { links } from '../../consts/links';
import LinkIcon from '../../images/icons/external-link-icon.svg';
import { Card } from '../layout/Card';

// Rendered only when config.showDeprecationNotice is set; the page gates it.
export function DeprecationCard() {
  return (
    <Card className="w-100 space-y-3 sm:w-[31rem]">
      <h2 className="text-primary-500">Bridging to Vana has moved</h2>
      <p className="text-xs">
        This bridge has been retired. To move assets to or from Vana, use the canonical route below.
      </p>
      <a
        href={links.vanaBridgingGuide}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center gap-1.5 rounded-lg bg-primary-500 px-3 py-2 text-sm text-white transition-all hover:bg-primary-600 active:bg-primary-700"
      >
        <span>Go to the Vana bridging guide</span>
        <Image src={LinkIcon} width={12} height={12} alt="" className="invert" />
      </a>
      <p className="text-xs">
        Running into issues? Contact{' '}
        <a
          href={`mailto:${links.vanaSupportEmail}`}
          className="text-primary-500 underline underline-offset-2 hover:text-primary-600"
        >
          Vana support
        </a>
        .
      </p>
    </Card>
  );
}
