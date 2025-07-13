
import { AuthenticatedLayout } from '@/components/layout/AuthenticatedLayout';
import { PriceAlerts } from '@/components/crypto/PriceAlerts';
import { NewsAlerts } from '@/components/crypto/NewsAlerts';

const Alerts = () => {
  return (
    <AuthenticatedLayout>
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <PriceAlerts />
        <NewsAlerts />
      </div>
    </AuthenticatedLayout>
  );
};

export default Alerts;
