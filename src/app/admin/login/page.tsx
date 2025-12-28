export const dynamic = 'force-dynamic';

import { Suspense } from 'react';
import LoginCLient from './LoginClient';

function LoginLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-sm text-gray-500">Loading login…</div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<LoginLoading />}>
      <LoginCLient />
    </Suspense>
  );
}
