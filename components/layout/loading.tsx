import { Spinner } from "@heroui/spinner";

export default function Loading({ className }: { className?: string }) {
  return (
    <div className={`w-full flex justify-center ${className}`}>
      <Spinner label="Loading" variant="dots" />
    </div>
  );
}
