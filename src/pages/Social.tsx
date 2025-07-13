
import { AuthenticatedLayout } from '@/components/layout/AuthenticatedLayout';
import { SocialTrading } from '@/components/crypto/SocialTrading';

const Social = () => {
  return (
    <AuthenticatedLayout>
      <SocialTrading />
    </AuthenticatedLayout>
  );
};

export default Social;
