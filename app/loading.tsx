import { Loader2 } from "lucide-react";

export default function GlobalLoading() {
  return (
    <div className="min-h-[50vh] flex flex-col items-center justify-center space-y-4">
      <Loader2 className="animate-spin text-[#c084fc]" size={32} />
      <p className="text-sm font-medium text-gray-400 font-mono animate-pulse uppercase tracking-widest">
        Loading Operations...
      </p>
    </div>
  );
}
