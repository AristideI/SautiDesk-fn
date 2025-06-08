import type { CSSProperties } from "react";
import { ScaleLoader } from "react-spinners";

const override: CSSProperties = {
  display: "block",
  margin: "0 auto",
  borderColor: "red",
};

export default function LoadingSection() {
  return (
    <section className="flex items-center justify-center h-[80vh] w-full">
      <ScaleLoader color="#2db976" />
    </section>
  );
}

export function LoadingSpinner({
  color,
  size,
}: {
  color: string;
  size?: number;
}) {
  return (
    <ScaleLoader
      color={color}
      loading
      cssOverride={override}
      aria-label="Loading Spinner"
      data-testid="loader"
    />
  );
}
