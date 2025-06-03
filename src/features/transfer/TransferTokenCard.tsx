import { Card } from '../../components/layout/Card';
import { TransferTokenForm } from './TransferTokenForm';

export function TransferTokenCard() {
  return (
    <Card className="w-full max-w-4xl mx-aut">
      <TransferTokenForm />
    </Card>
  );
}
