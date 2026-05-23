import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import QRCode from "qrcode";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

export default async function TicketPage({ params }: { params: { token: string } }) {
  const delegate = await prisma.registration.findUnique({
    where: { qrToken: params.token },
  });

  if (!delegate) {
    notFound();
  }

  // Generate QR code as data URI
  const qrDataUrl = await QRCode.toDataURL(delegate.qrToken, {
    color: {
      dark: "#070814",
      light: "#FFFFFF",
    },
    width: 256,
    margin: 2,
  });

  return (
    <div className="min-h-screen bg-bg flex flex-col items-center justify-center pt-24 pb-16 px-4 relative overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] rounded-full bg-accent-purple/10 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full bg-accent-teal/10 blur-[100px] pointer-events-none" />

      <Card className="glass-card max-w-md w-full border border-white/10 relative overflow-hidden shadow-2xl">
        <div className="h-32 bg-gradient-cta relative">
          <div className="absolute inset-0 opacity-20 bg-[url('/noise.png')] mix-blend-overlay" />
          <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-20 h-20 bg-bg rounded-full border-4 border-accent-purple flex items-center justify-center">
            <span className="font-display font-bold text-2xl text-white">
              {delegate.fullName.charAt(0)}
            </span>
          </div>
        </div>

        <div className="pt-14 pb-8 px-8 text-center space-y-6">
          <div>
            <h1 className="font-display text-2xl font-bold text-white tracking-tight">{delegate.fullName}</h1>
            <p className="text-text-muted text-sm mt-1">{delegate.universityOccupation}</p>
          </div>

          <div className="flex justify-center gap-3">
            <Badge variant={delegate.status === "APPROVED" ? "teal" : "amber"}>
              {delegate.status}
            </Badge>
            <Badge variant="purple" className="font-mono">
              {delegate.delegateId}
            </Badge>
          </div>

          <div className="bg-white p-4 rounded-2xl mx-auto w-fit shadow-inner">
            <img src={qrDataUrl} alt="QR Code" className="w-48 h-48" />
          </div>

          <p className="text-xs text-text-secondary">
            Present this secure QR code at the check-in desk for conference access.
          </p>

          <div className="grid grid-cols-2 gap-4 pt-6 border-t border-white/10 text-left">
            <div>
              <span className="text-[10px] text-text-muted uppercase font-bold tracking-wider">Nationality</span>
              <p className="text-sm font-medium text-white">{delegate.nationality}</p>
            </div>
            <div>
              <span className="text-[10px] text-text-muted uppercase font-bold tracking-wider">Payment Status</span>
              <p className="text-sm font-medium text-white">{delegate.paymentStatus}</p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
