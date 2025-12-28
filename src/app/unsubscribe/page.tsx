import { Suspense } from "react";
import UnsubscribeComponent from "./unsubscribe";


function UnsubscribeLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-sm text-gray-500">Loading unsubscribe page…</div>
    </div>
  );
}

export default function UnsubscribePage() {

  return (
    <Suspense fallback={<UnsubscribeLoading />}>
      <UnsubscribeComponent />
    </Suspense>
  );
}
