"use client";

import { FolderHeart, Star, Smile, Heart, ThumbsUp, Sparkles } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

export default function FeedbackSurveyPage() {
  const reviews = [
    { name: "Alessia Rossi (Italy)", rating: 5, comment: "One Global Night was pure magic! Working with markers and cardboard forced us to connect so deeply. Incredible logistics planning by AIESEC in Bizerte!" },
    { name: "Ahmed Ben Bella (Algeria)", rating: 4, comment: "Negotiation Across Borders workshop by Elena was fantastic. Very useful and highly interactive. Shuttle transport was a bit delayed but overall amazing." },
  ];

  return (
    <div className="space-y-6">
      {/* SECTION HEADER */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/5 pb-4">
        <div>
          <Badge variant="purple" className="mb-2">
            Operations Feedback
          </Badge>
          <h1 className="font-display text-2xl font-bold tracking-tight text-white">
            EP Feedback & Surveys
          </h1>
          <p className="text-sm text-text-secondary mt-1">
            Audit delegate learning satisfaction, logistics readiness ratings, and testimonial logs.
          </p>
        </div>
      </div>

      {/* CORE SURVEY SCORES (RADIAL GAUGES STYLE) */}
      <div className="grid gap-4 sm:grid-cols-4">
        {[
          { label: "Overall Conference", score: "4.8", percent: "96%", color: "text-accent-purple", bg: "bg-accent-purple/10" },
          { label: "Workshop Vetting", score: "4.7", percent: "94%", color: "text-accent-teal", bg: "bg-accent-teal/10" },
          { label: "Logistics Transport", score: "4.2", percent: "84%", color: "text-accent-amber", bg: "bg-accent-amber/10" },
          { label: "One Global Night", score: "4.9", percent: "98%", color: "text-accent-pink", bg: "bg-accent-pink/10" },
        ].map((score, i) => (
          <Card key={i} className="glass-card p-6 border border-white/10 bg-surface-1/30 text-center space-y-3">
            <span className="text-3xs uppercase tracking-wider text-text-muted font-bold block">
              {score.label}
            </span>
            <h3 className={`text-3xl font-black font-display tracking-tight ${score.color}`}>
              {score.score} <span className="text-xs text-text-muted">/ 5</span>
            </h3>
            <div className="flex justify-between items-center text-4xs text-text-muted pt-2 border-t border-white/5">
              <span>Satisfaction</span>
              <span className="font-semibold text-text-secondary">{score.percent}</span>
            </div>
          </Card>
        ))}
      </div>

      {/* TEXT TESTIMONIAL FEEDBACKS */}
      <Card className="glass-card border border-white/10 p-6 bg-surface-1/25 space-y-4">
        <div className="border-b border-white/5 pb-3">
          <h3 className="font-display font-semibold text-text-primary text-base">Delegate Testimonials</h3>
          <p className="text-xs text-text-muted">Direct testimonials submitted during survey runs.</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {reviews.map((r, idx) => (
            <div key={idx} className="p-4 bg-surface-2/30 border border-white/5 rounded-2xl space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-xs font-semibold text-text-primary">{r.name}</span>
                <div className="flex items-center gap-0.5 text-accent-amber">
                  {Array.from({ length: r.rating }).map((_, i) => <Star key={i} size={12} fill="currentColor" />)}
                </div>
              </div>
              <p className="text-xs text-text-secondary leading-relaxed italic">
                &quot;{r.comment}&quot;
              </p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
