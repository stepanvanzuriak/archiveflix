import { Spinner } from "@heroui/spinner";

export default function Loading() {
  return (
    <div className="w-full h-full flex justify-center">
      <Spinner label="Loading" variant="dots" />
    </div>
  );
}
