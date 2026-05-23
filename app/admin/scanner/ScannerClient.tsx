"use client";

import { useState } from "react";
import { QrReader } from "react-qr-reader";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { QrCode, CheckCircle2, AlertCircle, ScanLine } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import { checkInDelegate } from "@/app/actions/scanner";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

export default function ScannerClient() {
  const [active, setActive] = useState(false);
  const [scanResult, setScanResult] = useState<{
    status: "idle" | "success" | "error";
    message: string;
    delegateName?: string;
  }>({ status: "idle", message: "" });

  const { execute, status } = useAction(checkInDelegate, {
    onSuccess: ({ data }) => {
      setScanResult({
        status: "success",
        message: "Successfully checked in!",
        delegateName: data?.delegate.fullName,
      });
      toast.success(`Checked in ${data?.delegate.fullName}`);
      setTimeout(() => {
        setScanResult({ status: "idle", message: "" });
      }, 3000);
    },
    onError: (err) => {
      setScanResult({
        status: "error",
        message: err.error?.serverError || "Invalid QR Code",
      });
      toast.error(err.error?.serverError || "Scan failed");
      setTimeout(() => {
        setScanResult({ status: "idle", message: "" });
      }, 3000);
    },
  });

  const handleResult = (result: any, error: any) => {
    if (result && scanResult.status === "idle" && status !== "executing") {
      const qrToken = result?.text;
      if (qrToken) {
        execute({ qrToken });
      }
    }
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      {/* SECTION HEADER */}
      <div className="flex flex-col items-center text-center gap-2 border-b border-white/5 pb-6">
        <Badge variant="teal" className="mb-2">
          Live Command Center
        </Badge>
        <h1 className="font-display text-3xl font-bold tracking-tight text-white flex items-center gap-3">
          <QrCode size={28} className="text-accent-teal" />
          QR Access Scanner
        </h1>
        <p className="text-sm text-text-secondary max-w-md">
          Scan delegate QR codes for immediate validation, payment checks, and automated check-in logging.
        </p>
      </div>

      <Card className="glass-card border border-white/10 p-6 bg-surface-1/30 relative overflow-hidden flex flex-col items-center">
        {!active ? (
          <div className="py-20 flex flex-col items-center justify-center space-y-6">
            <div className="h-24 w-24 rounded-full bg-accent-teal/10 border border-accent-teal/20 flex items-center justify-center text-accent-teal animate-pulse">
              <ScanLine size={48} />
            </div>
            <div className="text-center space-y-2">
              <h3 className="font-display font-semibold text-xl text-white">Camera Offline</h3>
              <p className="text-sm text-text-muted">Start the scanner to activate the camera.</p>
            </div>
            <Button onClick={() => setActive(true)} size="lg" className="mt-4 gap-2 px-8">
              <ScanLine size={18} />
              Start Scanner
            </Button>
          </div>
        ) : (
          <div className="w-full max-w-md aspect-square relative rounded-2xl overflow-hidden border-2 border-accent-teal/30">
            <QrReader
              onResult={handleResult}
              constraints={{ facingMode: "environment" }}
              className="w-full h-full object-cover"
            />
            {/* Overlay Grid */}
            <div className="absolute inset-0 border-4 border-transparent pointer-events-none">
              <div className="absolute top-0 left-0 w-12 h-12 border-t-4 border-l-4 border-accent-teal rounded-tl-xl" />
              <div className="absolute top-0 right-0 w-12 h-12 border-t-4 border-r-4 border-accent-teal rounded-tr-xl" />
              <div className="absolute bottom-0 left-0 w-12 h-12 border-b-4 border-l-4 border-accent-teal rounded-bl-xl" />
              <div className="absolute bottom-0 right-0 w-12 h-12 border-b-4 border-r-4 border-accent-teal rounded-br-xl" />
            </div>
            
            {status === "executing" && (
              <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-10">
                <div className="h-10 w-10 border-4 border-accent-teal border-t-transparent rounded-full animate-spin" />
              </div>
            )}
          </div>
        )}

        {active && (
          <Button variant="outline" onClick={() => setActive(false)} className="mt-6 border-white/10 text-text-muted">
            Stop Scanner
          </Button>
        )}

        <AnimatePresence>
          {scanResult.status !== "idle" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className={`absolute bottom-6 left-6 right-6 p-4 rounded-xl border flex items-center gap-3 shadow-2xl z-20 ${
                scanResult.status === "success" 
                  ? "bg-accent-teal/10 border-accent-teal/30 text-accent-teal" 
                  : "bg-red-500/10 border-red-500/30 text-red-400"
              }`}
            >
              {scanResult.status === "success" ? <CheckCircle2 size={24} /> : <AlertCircle size={24} />}
              <div>
                <h4 className="font-bold text-sm">
                  {scanResult.status === "success" ? "Access Granted" : "Access Denied"}
                </h4>
                <p className="text-xs opacity-90">
                  {scanResult.delegateName ? `${scanResult.delegateName} - ` : ""}{scanResult.message}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
    </div>
  );
}
