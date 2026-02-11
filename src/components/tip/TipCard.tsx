import { IconButton, XCircleIcon } from '@hyperlane-xyz/widgets';
import { useState } from 'react';
import { config } from '../../consts/config';
import { Card } from '../layout/Card';

export function TipCard() {
  const [show, setShow] = useState(config.showTipBox);
  if (!show) return null;
  return (
    <Card className="w-full">
      <h2 className="font-semibold text-black text-center sm:text-lg">Auto EVM Bridge</h2>
      <div className="absolute right-3 top-3">
        <IconButton onClick={() => setShow(false)} title="Hide tip" className="hover:rotate-90">
          <XCircleIcon width={16} height={16} />
        </IconButton>
      </div>
    </Card>
  );
}
