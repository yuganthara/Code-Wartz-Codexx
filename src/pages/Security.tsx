
import { AuthenticatedLayout } from '@/components/layout/AuthenticatedLayout';
import { SecurityCenter } from '@/components/crypto/SecurityCenter';

const Security = () => {
  return (
    <AuthenticatedLayout>
      <SecurityCenter />
    </AuthenticatedLayout>
  );
};

export default Security;
