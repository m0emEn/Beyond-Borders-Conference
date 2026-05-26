import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/Button";
import { prisma } from "@/lib/prisma";
import Image from "next/image";
import { User } from "lucide-react";

export const metadata: Metadata = { title: "Facilitators | Beyond Borders" };

export default async function FacilitatorsPage() {
  const facilitators = await prisma.facilitator.findMany({
    orderBy: { createdAt: "desc" }
  });

  return (
    <>
      <PageHeader
        title="Facilitators"
        description="Meet our session leaders and apply to facilitate your own workshop."
      />
      
      <div className="section-container pb-12 pt-8">
        {facilitators.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {facilitators.map((facilitator) => (
              <div key={facilitator.id} className="glass-card p-6 border border-white/10 hover:border-accent-purple/30 transition-all group">
                <div className="flex items-center gap-4 mb-4">
                  <div className="h-16 w-16 rounded-full overflow-hidden bg-surface-2 border border-white/10 flex items-center justify-center shrink-0 relative">
                    {facilitator.profilePicture ? (
                      <Image 
                        src={facilitator.profilePicture} 
                        alt={facilitator.fullName}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <User size={24} className="text-text-muted" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-display font-semibold text-lg text-text-primary group-hover:text-accent-purple transition-colors">
                      {facilitator.fullName}
                    </h3>
                    <span className="text-xs text-accent-teal tracking-wider uppercase font-medium">
                      {facilitator.nationality}
                    </span>
                  </div>
                </div>
                {facilitator.bio ? (
                  <p className="text-sm text-text-secondary leading-relaxed line-clamp-3">
                    {facilitator.bio}
                  </p>
                ) : (
                  <p className="text-sm text-text-muted italic">No biography provided.</p>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-surface-1/30 rounded-2xl border border-white/5 border-dashed">
            <h3 className="font-display text-xl font-semibold mb-2">No Facilitators Yet</h3>
            <p className="text-text-muted text-sm">
              Approved facilitators will appear here once applications are processed.
            </p>
          </div>
        )}
      </div>

      <div className="section-container pb-20 text-center max-w-2xl mx-auto">
        <h2 className="font-display text-2xl font-bold mb-4">Want to lead a session?</h2>
        <p className="text-text-secondary mb-8">
          We are currently accepting session proposals. Submit your detailed session plan to join the Beyond Borders speakers lineup.
        </p>
        <Button href="/facilitators/apply" size="lg" className="px-8">
          Apply to Facilitate
        </Button>
      </div>
    </>
  );
}
