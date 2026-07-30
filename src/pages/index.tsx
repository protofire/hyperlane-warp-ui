import type { NextPage } from 'next';
import { DeprecationCard } from '../components/banner/DeprecationCard';
import { FloatingButtonStrip } from '../components/nav/FloatingButtonStrip';
import { TipCard } from '../components/tip/TipCard';
import { config } from '../consts/config';
import { TransferTokenCard } from '../features/transfer/TransferTokenCard';

const Home: NextPage = () => {
  // The bridge is retired: show only the notice, centered by AppLayout's main element.
  if (config.showDeprecationNotice) return <DeprecationCard />;

  return (
    <div className="space-y-3 pt-4">
      <TipCard />
      <div className="relative">
        <TransferTokenCard />
        {/* MERGETODO */}
        <FloatingButtonStrip />
      </div>
    </div>
  );
};

export default Home;
