export default function AdminLoading() {
  return (
    <div className="flex flex-col items-center justify-center h-[70vh] space-y-4">
      <div className="relative">
        <div className="absolute inset-0 bg-accent-purple/20 blur-xl rounded-full" />
        <div className="h-16 w-16 border-4 border-white/10 border-t-accent-purple rounded-full animate-spin" />
      </div>
      <div className="flex flex-col items-center animate-pulse">
        <span className="font-display font-semibold text-text-primary">Loading Workspace</span>
        <span className="text-xs text-text-muted mt-1">Decrypting secure data...</span>
      </div>
    </div>
  );
}
