"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { AlertCircle, CheckCircle, UploadCloud } from "lucide-react";
import { UploadDropzone } from "@/lib/uploadthing";
import { useAction } from "next-safe-action/hooks";
import { applyAsFacilitator } from "@/app/actions/public-apply";

export default function FacilitatorApplyPage() {
  const [sessionPlanUrl, setSessionPlanUrl] = useState("");
  const [success, setSuccess] = useState(false);
  const [formError, setFormError] = useState("");

  const { execute, status } = useAction(applyAsFacilitator, {
    onSuccess: () => {
      setSuccess(true);
      setFormError("");
    },
    onError: (err) => {
      setFormError(err.error?.serverError || "Failed to submit application");
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormError("");
    
    const formData = new FormData(e.currentTarget);
    const data = {
      fullName: formData.get("fullName") as string,
      email: formData.get("email") as string,
      nationality: formData.get("nationality") as string,
      experience: formData.get("experience") as string,
      sessionTitle: formData.get("sessionTitle") as string,
      sessionCategory: formData.get("sessionCategory") as string,
      sessionObjectives: formData.get("sessionObjectives") as string,
      duration: parseInt(formData.get("duration") as string, 10),
      interactiveMethods: formData.get("interactiveMethods") as string,
      materialsNeeded: formData.get("materialsNeeded") as string,
      motivation: formData.get("motivation") as string,
      sessionPlanUrl: sessionPlanUrl || undefined,
    };

    execute(data);
  };

  if (success) {
    return (
      <div className="min-h-screen bg-bg flex flex-col items-center justify-center pt-24 pb-16">
        <div className="section-container max-w-2xl px-4 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card p-8 md:p-12 border border-accent-purple/30 bg-gradient-to-br from-accent-purple/5 to-transparent shadow-glow-purple"
          >
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-accent-purple/10 mb-6">
              <CheckCircle className="text-accent-purple" size={48} />
            </div>

            <Badge variant="purple" className="mb-4">
              Application Received
            </Badge>

            <h1 className="font-display text-3xl font-bold md:text-4xl text-text-primary">
              Thank You for Applying!
            </h1>
            
            <p className="mt-4 text-sm text-text-secondary leading-relaxed">
              Your session proposal has been submitted to the Beyond Borders OC for review. We will evaluate your session plan and contact you shortly.
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
        title="Facilitator Application"
        description="Pitch your session, upload your session plan, and join our global speaker lineup."
      />

      <div className="section-container max-w-3xl px-4 mt-8">
        <Card className="shadow-card border border-white/10 p-6 sm:p-10 relative overflow-hidden">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {formError && (
              <div className="p-4 rounded-xl border border-red-500/30 bg-red-500/10 flex items-start gap-3">
                <AlertCircle className="text-red-400 shrink-0 mt-0.5" size={20} />
                <p className="text-xs text-red-300 leading-normal">{formError}</p>
              </div>
            )}

            <div className="space-y-4">
              <h2 className="font-display text-xl font-semibold border-b border-white/10 pb-2">
                Personal Information
              </h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs text-text-secondary font-medium">Full Name</label>
                  <input name="fullName" type="text" required placeholder="John Doe" className="glass-card px-4 py-3 text-sm text-text-primary bg-white/5 outline-none border border-white/10 focus:border-accent-purple/60 rounded-xl" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs text-text-secondary font-medium">Email</label>
                  <input name="email" type="email" required placeholder="john@example.com" className="glass-card px-4 py-3 text-sm text-text-primary bg-white/5 outline-none border border-white/10 focus:border-accent-purple/60 rounded-xl" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs text-text-secondary font-medium">Nationality</label>
                  <input name="nationality" type="text" required placeholder="Tunisian" className="glass-card px-4 py-3 text-sm text-text-primary bg-white/5 outline-none border border-white/10 focus:border-accent-purple/60 rounded-xl" />
                </div>
              </div>
            </div>

            <div className="space-y-4 pt-4 border-t border-white/10">
              <h2 className="font-display text-xl font-semibold border-b border-white/10 pb-2">
                Session Details
              </h2>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-text-secondary font-medium">Session Title</label>
                <input name="sessionTitle" type="text" required placeholder="e.g. Leadership in the Digital Age" className="glass-card px-4 py-3 text-sm text-text-primary bg-white/5 outline-none border border-white/10 focus:border-accent-purple/60 rounded-xl" />
              </div>
              
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs text-text-secondary font-medium">Session Category</label>
                  <select name="sessionCategory" required className="glass-card px-4 py-3 text-sm text-text-primary bg-surface-2 outline-none border border-white/10 focus:border-accent-purple/60 rounded-xl cursor-pointer">
                    <option value="LEADERSHIP">Leadership</option>
                    <option value="CULTURAL_EXCHANGE">Cultural Exchange</option>
                    <option value="PERSONAL_DEVELOPMENT">Personal Development</option>
                    <option value="WORKSHOP">Workshop</option>
                    <option value="ACTIVITY">Activity</option>
                  </select>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs text-text-secondary font-medium">Duration (minutes)</label>
                  <input name="duration" type="number" required placeholder="45" min="10" className="glass-card px-4 py-3 text-sm text-text-primary bg-white/5 outline-none border border-white/10 focus:border-accent-purple/60 rounded-xl" />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-text-secondary font-medium">Session Objectives</label>
                <textarea name="sessionObjectives" required rows={3} placeholder="What will participants learn?" className="glass-card px-4 py-3 text-sm text-text-primary bg-white/5 outline-none border border-white/10 focus:border-accent-purple/60 rounded-xl resize-none" />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-text-secondary font-medium">Interactive Methods</label>
                <textarea name="interactiveMethods" required rows={2} placeholder="How will you engage the audience?" className="glass-card px-4 py-3 text-sm text-text-primary bg-white/5 outline-none border border-white/10 focus:border-accent-purple/60 rounded-xl resize-none" />
              </div>
            </div>

            <div className="space-y-4 pt-4 border-t border-white/10">
              <h2 className="font-display text-xl font-semibold border-b border-white/10 pb-2">
                Experience & Logistics
              </h2>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-text-secondary font-medium">Your Facilitation Experience</label>
                <textarea name="experience" required rows={3} placeholder="Describe your past speaking or facilitation roles..." className="glass-card px-4 py-3 text-sm text-text-primary bg-white/5 outline-none border border-white/10 focus:border-accent-purple/60 rounded-xl resize-none" />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-text-secondary font-medium">Motivation</label>
                <textarea name="motivation" required rows={3} placeholder="Why do you want to facilitate at Beyond Borders?" className="glass-card px-4 py-3 text-sm text-text-primary bg-white/5 outline-none border border-white/10 focus:border-accent-purple/60 rounded-xl resize-none" />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-text-secondary font-medium">Materials Needed (Optional)</label>
                <input name="materialsNeeded" type="text" placeholder="e.g. Flipcharts, markers, projector..." className="glass-card px-4 py-3 text-sm text-text-primary bg-white/5 outline-none border border-white/10 focus:border-accent-purple/60 rounded-xl" />
              </div>
            </div>

            <div className="space-y-4 pt-4 border-t border-white/10">
              <h2 className="font-display text-xl font-semibold border-b border-white/10 pb-2 flex items-center justify-between">
                <span>Session Plan Upload</span>
                <Badge variant="purple">PDF Only</Badge>
              </h2>
              
              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-text-secondary font-medium mb-1">Upload your detailed session outline/plan (Optional but highly recommended)</label>
                {sessionPlanUrl ? (
                  <div className="flex items-center justify-between p-4 glass-card bg-accent-purple/10 border border-accent-purple/30 rounded-xl">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="text-accent-purple" size={20} />
                      <span className="text-sm text-accent-purple font-medium">Session Plan Uploaded Successfully</span>
                    </div>
                    <Button type="button" variant="glass" size="sm" onClick={() => setSessionPlanUrl("")}>
                      Remove
                    </Button>
                  </div>
                ) : (
                  <UploadDropzone
                    endpoint="sessionPlan"
                    onClientUploadComplete={(res) => {
                      if (res && res[0]) {
                        setSessionPlanUrl(res[0].url);
                      }
                    }}
                    onUploadError={(error: Error) => {
                      setFormError(`Upload failed: ${error.message}`);
                    }}
                    className="ut-label:text-text-primary ut-button:bg-accent-purple hover:ut-button:bg-accent-purple/90 border border-white/10 glass-card p-4 rounded-xl"
                  />
                )}
              </div>
            </div>

            <div className="pt-6 border-t border-white/10 flex justify-end">
              <Button type="submit" size="lg" disabled={status === "executing"}>
                {status === "executing" ? "Submitting Application..." : "Submit Application"}
              </Button>
            </div>

          </form>
        </Card>
      </div>
    </div>
  );
}
