"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { AlertCircle, CheckCircle, Star } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import { submitFeedback } from "@/app/actions/feedback";

const categories = [
  { id: "overallScore", label: "Overall Experience", description: "How would you rate the Beyond Borders conference as a whole?" },
  { id: "delegateSatisfaction", label: "Delegate Satisfaction", description: "How satisfied were you with the opportunities and networking?" },
  { id: "sessionRating", label: "Session Quality", description: "How relevant and engaging were the sessions?" },
  { id: "facilitatorRating", label: "Facilitator Quality", description: "How knowledgeable and effective were the speakers?" },
  { id: "logisticsRating", label: "Logistics & Organization", description: "How well-organized was the event (venue, food, schedule)?" },
];

export default function FeedbackPage() {
  const [ratings, setRatings] = useState<Record<string, number>>({
    overallScore: 0, delegateSatisfaction: 0, sessionRating: 0, facilitatorRating: 0, logisticsRating: 0
  });
  const [comments, setComments] = useState("");
  const [success, setSuccess] = useState(false);
  const [formError, setFormError] = useState("");

  const { execute, status } = useAction(submitFeedback, {
    onSuccess: () => {
      setSuccess(true);
      setFormError("");
    },
    onError: (err) => {
      setFormError(err.error?.serverError || "Failed to submit feedback. Please try again.");
    },
  });

  const handleRating = (categoryId: string, rating: number) => {
    setRatings(prev => ({ ...prev, [categoryId]: rating }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    // Validate that all ratings are > 0
    for (const cat of categories) {
      if (ratings[cat.id] === 0) {
        setFormError(`Please provide a rating for ${cat.label}.`);
        return;
      }
    }

    execute({
      overallScore: ratings.overallScore,
      delegateSatisfaction: ratings.delegateSatisfaction,
      sessionRating: ratings.sessionRating,
      facilitatorRating: ratings.facilitatorRating,
      logisticsRating: ratings.logisticsRating,
      comments: comments || undefined
    });
  };

  if (success) {
    return (
      <div className="min-h-screen bg-bg flex flex-col items-center justify-center pt-24 pb-16">
        <div className="section-container max-w-2xl px-4 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card p-8 md:p-12 border border-accent-teal/30 bg-gradient-to-br from-accent-teal/5 to-transparent shadow-glow-teal"
          >
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-accent-teal/10 mb-6">
              <CheckCircle className="text-accent-teal" size={48} />
            </div>

            <Badge variant="teal" className="mb-4">
              Feedback Received
            </Badge>

            <h1 className="font-display text-3xl font-bold md:text-4xl text-text-primary">
              Thank You!
            </h1>
            
            <p className="mt-4 text-sm text-text-secondary leading-relaxed">
              Your feedback is incredibly valuable to us. It helps us improve and create even better experiences for future Beyond Borders conferences.
            </p>

            <Button href="/" className="mt-10" variant="glass">
              Back to Home
            </Button>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg pb-24">
      <PageHeader
        title="Conference Feedback"
        description="We want to hear from you! Help us make the next Beyond Borders even better."
      />

      <div className="section-container max-w-3xl px-4 mt-8">
        <Card className="shadow-card border border-white/10 p-6 sm:p-10 relative overflow-hidden bg-surface-1/40">
          <form onSubmit={handleSubmit} className="space-y-8">
            
            {formError && (
              <div className="p-4 rounded-xl border border-red-500/30 bg-red-500/10 flex items-start gap-3">
                <AlertCircle className="text-red-400 shrink-0 mt-0.5" size={20} />
                <p className="text-xs text-red-300 leading-normal">{formError}</p>
              </div>
            )}

            <div className="space-y-8">
              {categories.map((cat) => (
                <div key={cat.id} className="p-5 glass-card rounded-2xl border border-white/5 bg-white/5 hover:bg-white/10 transition-colors">
                  <div className="mb-4">
                    <h3 className="font-display text-lg font-semibold text-text-primary">{cat.label}</h3>
                    <p className="text-xs text-text-secondary mt-1">{cat.description}</p>
                  </div>
                  
                  <div className="flex items-center gap-2 sm:gap-4">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => handleRating(cat.id, star)}
                        onMouseEnter={(e) => {
                          const siblings = e.currentTarget.parentElement?.children;
                          if (siblings) {
                            for (let i = 0; i < siblings.length; i++) {
                              if (i < star) {
                                siblings[i].classList.add("text-accent-teal");
                                siblings[i].classList.remove("text-white/20");
                              } else {
                                siblings[i].classList.remove("text-accent-teal");
                                siblings[i].classList.add("text-white/20");
                              }
                            }
                          }
                        }}
                        onMouseLeave={(e) => {
                          const siblings = e.currentTarget.parentElement?.children;
                          if (siblings) {
                            for (let i = 0; i < siblings.length; i++) {
                              if (i < ratings[cat.id]) {
                                siblings[i].classList.add("text-accent-teal");
                                siblings[i].classList.remove("text-white/20");
                              } else {
                                siblings[i].classList.remove("text-accent-teal");
                                siblings[i].classList.add("text-white/20");
                              }
                            }
                          }
                        }}
                        className={`transition-colors p-2 ${ratings[cat.id] >= star ? "text-accent-teal" : "text-white/20"}`}
                      >
                        <Star size={32} fill={ratings[cat.id] >= star ? "currentColor" : "none"} strokeWidth={1.5} />
                      </button>
                    ))}
                    <span className="ml-4 text-xs font-bold text-accent-teal uppercase tracking-wider">
                      {ratings[cat.id] === 1 && "Poor"}
                      {ratings[cat.id] === 2 && "Fair"}
                      {ratings[cat.id] === 3 && "Good"}
                      {ratings[cat.id] === 4 && "Very Good"}
                      {ratings[cat.id] === 5 && "Excellent"}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-3 pt-4 border-t border-white/10">
              <h3 className="font-display text-lg font-semibold text-text-primary">Additional Comments</h3>
              <p className="text-xs text-text-secondary">What did you love? What could be improved?</p>
              <textarea
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                rows={5}
                placeholder="Share your thoughts here..."
                className="glass-card w-full px-4 py-3 text-sm text-text-primary bg-white/5 outline-none border border-white/10 focus:border-accent-teal/60 rounded-xl resize-none"
              />
            </div>

            <div className="pt-6 border-t border-white/10 flex justify-end">
              <Button type="submit" size="lg" disabled={status === "executing"}>
                {status === "executing" ? "Submitting..." : "Submit Feedback"}
              </Button>
            </div>

          </form>
        </Card>
      </div>
    </div>
  );
}
