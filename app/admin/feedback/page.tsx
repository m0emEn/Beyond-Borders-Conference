import { prisma } from "@/lib/prisma";
import { MessageSquare, Star } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

export const dynamic = "force-dynamic";

function avg(arr: number[]): string {
  if (arr.length === 0) return "—";
  return (arr.reduce((a, b) => a + b, 0) / arr.length).toFixed(1);
}

export default async function FeedbackSurveyPage() {
  const surveys = await prisma.feedbackSurvey.findMany({
    orderBy: { createdAt: "desc" },
  });

  const scores = {
    overall: avg(surveys.map((s) => s.overallScore)),
    session: avg(surveys.map((s) => s.sessionRating)),
    logistics: avg(surveys.map((s) => s.logisticsRating)),
    satisfaction: avg(surveys.map((s) => s.delegateSatisfaction)),
  };

  const withComments = surveys.filter((s) => s.comments && s.comments.trim().length > 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/5 pb-4">
        <div>
          <Badge variant="purple" className="mb-2">Operations Feedback</Badge>
          <h1 className="font-display text-2xl font-bold tracking-tight text-white">
            EP Feedback & Surveys
          </h1>
          <p className="text-sm text-text-secondary mt-1">
            Delegate satisfaction scores and testimonials from post-conference surveys.
          </p>
        </div>
        <div className="glass-card bg-surface-2/40 px-4 py-2 border border-white/10 rounded-xl text-right">
          <span className="text-[10px] text-text-muted uppercase block font-semibold tracking-widest">Responses</span>
          <span className="font-mono text-lg font-bold text-accent-purple">{surveys.length}</span>
        </div>
      </div>

      {surveys.length === 0 ? (
        <Card className="glass-card border border-white/10 p-12 bg-surface-1/25 flex flex-col items-center justify-center text-center space-y-3">
          <MessageSquare className="text-text-muted" size={36} />
          <p className="text-text-secondary text-sm">No survey responses yet.</p>
          <p className="text-text-muted text-xs">Feedback will appear here once delegates submit post-conference surveys.</p>
        </Card>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-4">
            {[
              { label: "Overall Conference", score: scores.overall, color: "text-accent-purple" },
              { label: "Workshop Rating", score: scores.session, color: "text-accent-teal" },
              { label: "Logistics Transport", score: scores.logistics, color: "text-accent-amber" },
              { label: "Delegate Satisfaction", score: scores.satisfaction, color: "text-accent-pink" },
            ].map((s) => (
              <Card key={s.label} className="glass-card p-6 border border-white/10 bg-surface-1/30 text-center space-y-3">
                <span className="text-3xs uppercase tracking-wider text-text-muted font-bold block">{s.label}</span>
                <h3 className={`text-3xl font-black font-display tracking-tight ${s.color}`}>
                  {s.score} <span className="text-xs text-text-muted">/ 5</span>
                </h3>
                <div className="flex justify-between items-center text-4xs text-text-muted pt-2 border-t border-white/5">
                  <span>From {surveys.length} responses</span>
                </div>
              </Card>
            ))}
          </div>

          {withComments.length > 0 && (
            <Card className="glass-card border border-white/10 p-6 bg-surface-1/25 space-y-4">
              <div className="border-b border-white/5 pb-3">
                <h3 className="font-display font-semibold text-text-primary text-base">Delegate Comments</h3>
                <p className="text-xs text-text-muted">Written feedback from survey submissions.</p>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                {withComments.slice(0, 6).map((r) => (
                  <div key={r.id} className="p-4 bg-surface-2/30 border border-white/5 rounded-2xl space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-semibold text-text-primary">
                        Anonymous Delegate
                      </span>
                      <div className="flex items-center gap-0.5 text-accent-amber">
                        {Array.from({ length: r.overallScore }).map((_, i) => (
                          <Star key={i} size={12} fill="currentColor" />
                        ))}
                      </div>
                    </div>
                    <p className="text-xs text-text-secondary leading-relaxed italic">
                      &quot;{r.comments}&quot;
                    </p>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </>
      )}
    </div>
  );
}
