"use client";

import { User, CheckCircle, Clock, Award, Users } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { type OCMemberPerformance } from "@/app/actions/oc";

type Props = { members: OCMemberPerformance[] };

export default function OCPerformanceClient({ members }: Props) {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/5 pb-4">
        <div>
          <Badge variant="purple" className="mb-2">
            OC Performance
          </Badge>
          <h1 className="font-display text-2xl font-bold tracking-tight text-white">
            Organizing Committee Contribution
          </h1>
          <p className="text-sm text-text-secondary mt-1">
            Audit team efficiency quotients, manage department task throughputs, and check benchmarks.
          </p>
        </div>
      </div>

      {members.length === 0 ? (
        <Card className="glass-card border border-white/10 p-12 bg-surface-1/25 flex flex-col items-center justify-center text-center space-y-3">
          <Users className="text-text-muted" size={36} />
          <p className="text-text-secondary text-sm">No OC members found.</p>
          <p className="text-text-muted text-xs">Seed the database with OC member accounts to see performance data.</p>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {members.map((member) => (
            <Card
              key={member.id}
              className="glass-card border border-white/10 p-6 bg-surface-1/25 space-y-4"
            >
              <div className="flex items-center gap-3 border-b border-white/5 pb-3">
                <div className="h-10 w-10 rounded-full bg-accent-purple/20 border border-accent-purple/30 flex items-center justify-center font-display font-bold text-accent-purple text-sm">
                  {member.name
                    .split(" ")
                    .map((w) => w[0])
                    .join("")}
                </div>
                <div>
                  <h4 className="font-display font-semibold text-text-primary text-sm">
                    {member.name}
                  </h4>
                  <span className="text-[10px] text-text-muted mt-0.5">
                    {member.role.replace(/_/g, " ")} ({member.department})
                  </span>
                </div>
              </div>

              <div className="grid gap-3 grid-cols-3 text-xs">
                <div className="p-3 bg-surface-2/20 border border-white/5 rounded-xl text-center">
                  <CheckCircle className="text-accent-teal mx-auto mb-1" size={16} />
                  <span className="text-[9px] text-text-muted uppercase block">Completed</span>
                  <span className="font-mono font-bold text-text-primary mt-0.5 block">
                    {member.tasksCompleted} Tasks
                  </span>
                </div>
                <div className="p-3 bg-surface-2/20 border border-white/5 rounded-xl text-center">
                  <Clock className="text-accent-amber mx-auto mb-1 animate-pulse" size={16} />
                  <span className="text-[9px] text-text-muted uppercase block">Pending</span>
                  <span className="font-mono font-bold text-text-primary mt-0.5 block">
                    {member.tasksPending} Tasks
                  </span>
                </div>
                <div className="p-3 bg-surface-2/20 border border-white/5 rounded-xl text-center">
                  <Award className="text-accent-purple mx-auto mb-1" size={16} />
                  <span className="text-[9px] text-text-muted uppercase block">Efficiency</span>
                  <span className="font-mono font-bold text-text-primary mt-0.5 block">
                    {member.efficiency}%
                  </span>
                </div>
              </div>

              <div className="space-y-1.5 pt-1">
                <div className="flex justify-between items-center text-4xs font-mono text-text-muted">
                  <span>Task Throughput</span>
                  <span className="text-text-secondary font-semibold">
                    {member.efficiency}% Goal Completion
                  </span>
                </div>
                <div className="w-full bg-white/5 rounded-full h-1.5 overflow-hidden">
                  <div
                    className="bg-accent-purple h-1.5 rounded-full"
                    style={{ width: `${member.efficiency}%` }}
                  />
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
