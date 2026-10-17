"use client";

import dynamic from "next/dynamic";

const DeliveryMap = dynamic(() => import("./DeliveryMap"), {
  ssr: false,
  loading: () => (
    <div
      className="flex h-[360px] w-full items-center justify-center rounded-2xl border border-[#dce5d9] bg-[#f5f7f1] text-sm text-[#203b2d]"
      role="status"
    >
      Loading delivery map…
    </div>
  ),
});

export default function DeliveryMapLoader(props) {
  return <DeliveryMap {...props} />;
}
