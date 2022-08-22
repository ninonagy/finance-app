import type { ReactNode } from "react";

export default function Container({ children }: { children: ReactNode }) {
  return <div className="mb-16 px-6 py-4 lg:py-12">{children}</div>;
}
