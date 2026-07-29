import { WarningIcon } from '@hyperlane-xyz/widgets';
import { config } from '../../consts/config';
import { links } from '../../consts/links';

export function DeprecationBanner() {
  if (!config.showDeprecationNotice) return null;
  return (
    <div className="flex w-full flex-col items-center justify-center gap-x-4 gap-y-1.5 bg-amber-400 px-4 py-2 text-center text-sm text-black sm:flex-row">
      <div className="flex items-center gap-2">
        <WarningIcon width={20} height={20} className="shrink-0" />
        <p>
          <strong>Bridging to Vana has moved.</strong> This bridge has been retired — use the
          canonical route instead.
        </p>
      </div>
      <a
        href={links.vanaBridgingGuide}
        target="_blank"
        rel="noopener noreferrer"
        className="shrink-0 rounded-full bg-white/30 px-2.5 py-1 transition-all hover:bg-white/50 active:bg-white/60"
      >
        Vana bridging guide →
      </a>
    </div>
  );
}
