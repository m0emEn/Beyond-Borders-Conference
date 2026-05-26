"use client";

import { useState } from "react";
import Link from "next/link";
import { Printer, ChevronLeft, Search } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Registration } from "@prisma/client";

export default function EmergencyClient({ initialDelegates }: { initialDelegates: Registration[] }) {
  const [search, setSearch] = useState("");

  const filtered = initialDelegates.filter((d) => {
    const s = search.toLowerCase();
    return (
      d.fullName.toLowerCase().includes(s) ||
      d.delegateId.toLowerCase().includes(s) ||
      d.emergencyName?.toLowerCase().includes(s)
    );
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/5 pb-4 print:hidden">
        <div>
          <Badge variant="pink" className="mb-2">Emergency Hub</Badge>
          <div className="flex items-center gap-3">
            <Link href="/admin/delegates" className="text-text-muted hover:text-white transition">
              <ChevronLeft size={20} />
            </Link>
            <h1 className="font-display text-2xl font-bold tracking-tight text-white">
              Emergency Contacts List
            </h1>
          </div>
          <p className="text-sm text-text-secondary mt-1 ml-8">
            Printable view of emergency contacts for day-of operations.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button onClick={() => window.print()} size="sm" className="flex items-center gap-1.5">
            <Printer size={14} />
            Print List
          </Button>
        </div>
      </div>

      <div className="relative max-w-sm print:hidden">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search delegates or contacts..."
          className="w-full glass-card bg-surface-2 outline-none border border-white/10 focus:border-accent-purple/60 px-4 py-2 pl-10 rounded-xl text-xs"
        />
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" size={14} />
      </div>

      {/* Print Header (Only visible when printing) */}
      <div className="hidden print:block text-black mb-6">
        <h1 className="text-2xl font-bold text-black border-b border-black pb-2">Beyond Borders 2026 - Emergency Contacts</h1>
        <p className="text-sm mt-1">Generated on: {new Date().toLocaleDateString()}</p>
      </div>

      <Card className="glass-card border border-white/10 bg-surface-1/30 overflow-hidden print:border-black print:bg-white print:shadow-none">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse print:text-black">
            <thead>
              <tr className="border-b border-white/10 bg-surface-2/40 text-text-muted font-semibold print:bg-gray-100 print:text-black print:border-black">
                <th className="p-4">Delegate ID</th>
                <th className="p-4">Delegate Name</th>
                <th className="p-4">Allergies/Diet</th>
                <th className="p-4">Emergency Contact</th>
                <th className="p-4">Emergency Phone</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 print:divide-black/20">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-text-muted text-sm">
                    No emergency contacts found.
                  </td>
                </tr>
              ) : (
                filtered.map((d) => (
                  <tr key={d.id} className="hover:bg-white/5 transition print:hover:bg-transparent">
                    <td className="p-4 font-mono font-bold text-accent-pink print:text-black">{d.delegateId}</td>
                    <td className="p-4 font-semibold text-text-primary print:text-black">{d.fullName}</td>
                    <td className="p-4 text-text-secondary print:text-black">
                      {d.dietaryPrefs && d.dietaryPrefs.length > 0 ? d.dietaryPrefs.join(", ") : "None"}
                    </td>
                    <td className="p-4 font-medium text-text-primary print:text-black">{d.emergencyName}</td>
                    <td className="p-4 text-text-secondary font-mono print:text-black">{d.emergencyPhone}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
