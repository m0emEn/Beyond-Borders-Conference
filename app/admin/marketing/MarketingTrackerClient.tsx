"use client";

import { TrendingUp, Eye, MousePointer, UserPlus, Instagram, Mail, BarChart2 } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { type CampaignRow } from "@/app/actions/campaigns";

type Props = { campaigns: CampaignRow[] };

export default function MarketingTrackerClient({ campaigns }: Props) {
  const totalReach = campaigns.reduce((s, c) => s + c.reach, 0);
  const totalClicks = campaigns.reduce((s, c) => s + c.clicks, 0);
  const totalConversions = campaigns.reduce((s, c) => s + c.conversions, 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/5 pb-4">
        <div>
          <Badge variant="purple" className="mb-2">
            Marketing & Conversion
          </Badge>
          <h1 className="font-display text-2xl font-bold tracking-tight text-white">
            Campaign Conversion Analytics
          </h1>
          <p className="text-sm text-text-secondary mt-1">
            Track visual outreach channels, clicks, and actual delegate sign-up conversions.
          </p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="glass-card p-6 border border-white/10 bg-surface-1/30 flex justify-between items-center">
          <div className="space-y-1">
            <span className="text-3xs uppercase tracking-wider text-text-muted font-bold block">
              Cumulative Reach
            </span>
            <h3 className="text-2xl font-bold font-mono text-accent-purple tracking-tight">
              {totalReach.toLocaleString()}
            </h3>
          </div>
          <div className="p-3.5 bg-accent-purple/10 rounded-xl border border-accent-purple/20 text-accent-purple">
            <Eye size={20} />
          </div>
        </Card>

        <Card className="glass-card p-6 border border-white/10 bg-surface-1/30 flex justify-between items-center">
          <div className="space-y-1">
            <span className="text-3xs uppercase tracking-wider text-text-muted font-bold block">
              Aggregated Link Clicks
            </span>
            <h3 className="text-2xl font-bold font-mono text-accent-teal tracking-tight">
              {totalClicks.toLocaleString()}
            </h3>
          </div>
          <div className="p-3.5 bg-accent-teal/10 rounded-xl border border-accent-teal/20 text-accent-teal">
            <MousePointer size={20} />
          </div>
        </Card>

        <Card className="glass-card p-6 border border-white/10 bg-surface-1/30 flex justify-between items-center">
          <div className="space-y-1">
            <span className="text-3xs uppercase tracking-wider text-text-muted font-bold block">
              Direct Signups Generated
            </span>
            <h3 className="text-2xl font-bold font-mono text-accent-pink tracking-tight">
              {totalConversions.toLocaleString()}
            </h3>
          </div>
          <div className="p-3.5 bg-accent-pink/10 rounded-xl border border-accent-pink/20 text-accent-pink">
            <UserPlus size={20} />
          </div>
        </Card>
      </div>

      <Card className="glass-card border border-white/10 p-6 bg-surface-1/25 space-y-4">
        <div className="flex justify-between items-center border-b border-white/5 pb-4">
          <div>
            <h3 className="font-display font-semibold text-text-primary text-base">
              Active Content Briefs
            </h3>
            <p className="text-xs text-text-muted">
              Marketing campaigns tracked by platform conversion percentages.
            </p>
          </div>
        </div>

        {campaigns.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 space-y-2 text-center">
            <BarChart2 className="text-text-muted" size={32} />
            <p className="text-text-secondary text-sm">No campaigns created yet.</p>
            <p className="text-text-muted text-xs">Add campaigns to start tracking conversions.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-white/10 bg-surface-2/40 text-text-muted font-semibold">
                  <th className="p-4">Campaign Title</th>
                  <th className="p-4">Platform Channel</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Reach</th>
                  <th className="p-4">Link Clicks</th>
                  <th className="p-4">Signups (Conv)</th>
                  <th className="p-4">Conversion Rate</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {campaigns.map((c) => {
                  const convRate =
                    c.clicks > 0 ? ((c.conversions / c.clicks) * 100).toFixed(1) : "0.0";
                  return (
                    <tr key={c.id} className="hover:bg-white/5 transition">
                      <td className="p-4 font-semibold text-text-primary">{c.title}</td>
                      <td className="p-4">
                        <div className="flex items-center gap-1.5 text-text-secondary font-medium">
                          {c.platform.includes("INSTAGRAM") ? (
                            <Instagram size={14} className="text-accent-pink" />
                          ) : (
                            <Mail size={14} className="text-accent-teal" />
                          )}
                          <span className="text-3xs uppercase tracking-wider">
                            {c.platform.replace(/_/g, " ")}
                          </span>
                        </div>
                      </td>
                      <td className="p-4">
                        <Badge
                          className={`text-4xs uppercase tracking-widest border ${
                            c.status === "PUBLISHED"
                              ? "text-accent-teal bg-accent-teal/10 border-accent-teal/20"
                              : c.status === "SCHEDULED"
                              ? "text-accent-amber bg-accent-amber/10 border-accent-amber/20"
                              : "text-text-muted bg-white/5 border-white/10"
                          }`}
                        >
                          {c.status}
                        </Badge>
                      </td>
                      <td className="p-4 font-mono text-text-secondary">
                        {c.reach.toLocaleString()}
                      </td>
                      <td className="p-4 font-mono text-text-secondary">
                        {c.clicks.toLocaleString()}
                      </td>
                      <td className="p-4 font-mono text-accent-pink font-semibold">
                        {c.conversions} EPs
                      </td>
                      <td className="p-4 font-mono text-accent-teal font-bold">{convRate}%</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
