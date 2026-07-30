import type { NextPage } from 'next';
import { DeprecationCard } from '../components/banner/DeprecationCard';
import { FloatingButtonStrip } from '../components/nav/FloatingButtonStrip';
import { TipCard } from '../components/tip/TipCard';
import { config } from '../consts/config';
import { TransferTokenCard } from '../features/transfer/TransferTokenCard';

const Home: NextPage = () => {
  // With the form hidden the notice is the whole page, centered by AppLayout's main element.
  if (!config.showTransferForm) return config.showDeprecationNotice ? <DeprecationCard /> : null;

  return (
    <div className="space-y-3 pt-4">
      <TipCard />
      {config.showDeprecationNotice && <DeprecationCard />}
      <div className="relative">
        <TransferTokenCard />
        {/* MERGETODO */}
        <FloatingButtonStrip />
      </div>
    </div>
  );
};

export default Home;
