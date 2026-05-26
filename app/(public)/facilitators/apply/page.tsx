"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { AlertCircle, CheckCircle, UploadCloud, ChevronRight, ChevronLeft } from "lucide-react";
import { UploadDropzone } from "@/lib/uploadthing";
import { useAction } from "next-safe-action/hooks";
import { applyAsFacilitator } from "@/app/actions/public-apply";

const steps = [
  { id: 1, title: "Personal Info" },
  { id: 2, title: "Session Details" },
  { id: 3, title: "Experience & Upload" },
];

export default function FacilitatorApplyPage() {
  const [step, setStep] = useState(1);
  const [sessionPlanUrl, setSessionPlanUrl] = useState("");
  const [success, setSuccess] = useState(false);
  const [applicationId, setApplicationId] = useState<string | null>(null);
  const [formError, setFormError] = useState("");

  const { execute, status } = useAction(applyAsFacilitator, {
    onSuccess: (res) => {
      setSuccess(true);
      setApplicationId(res.data?.applicationId || "APP-UNKNOWN");
      setFormError("");
    },
    onError: (err) => {
      setFormError(err.error?.serverError || "Failed to submit application");
    },
  });

  const [formData, setFormData] = useState({
    fullName: "", email: "", nationality: "", experience: "", 
    sessionTitle: "", sessionCategory: "LEADERSHIP", sessionObjectives: "", 
    duration: 45, interactiveMethods: "", materialsNeeded: "", motivation: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormError("");
    
    if (step < steps.length) {
      setStep(step + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    const data = {
      ...formData,
      duration: parseInt(formData.duration.toString(), 10),
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

            <div className="mt-6 p-4 bg-surface-2/30 border border-white/10 rounded-xl max-w-sm mx-auto">
              <span className="text-xs text-text-muted uppercase tracking-wider block mb-1">Application ID</span>
              <span className="font-mono text-lg font-bold text-accent-teal">{applicationId}</span>
            </div>

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
        
        {/* Progress Stepper */}
        <div className="mb-8">
          <div className="flex items-center justify-between relative">
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-white/5 rounded-full z-0" />
            <div 
              className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-accent-purple rounded-full z-0 transition-all duration-300"
              style={{ width: `${((step - 1) / (steps.length - 1)) * 100}%` }}
            />
            {steps.map((s) => (
              <div key={s.id} className="relative z-10 flex flex-col items-center gap-2">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${step >= s.id ? "bg-accent-purple text-white shadow-glow-purple" : "bg-surface-2 border border-white/10 text-text-muted"}`}>
                  {step > s.id ? <CheckCircle size={18} /> : s.id}
                </div>
                <span className={`text-[10px] uppercase font-bold tracking-wider hidden sm:block ${step >= s.id ? "text-accent-purple" : "text-text-muted"}`}>
                  {s.title}
                </span>
              </div>
            ))}
          </div>
        </div>

        <Card className="shadow-card border border-white/10 p-6 sm:p-10 relative overflow-hidden bg-surface-1/40">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {formError && (
              <div className="p-4 rounded-xl border border-red-500/30 bg-red-500/10 flex items-start gap-3">
                <AlertCircle className="text-red-400 shrink-0 mt-0.5" size={20} />
                <p className="text-xs text-red-300 leading-normal">{formError}</p>
              </div>
            )}

            <AnimatePresence mode="wait">
              
              {/* STEP 1: PERSONAL INFO */}
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4"
                >
                  <h2 className="font-display text-xl font-semibold border-b border-white/10 pb-2">
                    Personal Information
                  </h2>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs text-text-secondary font-medium">Full Name</label>
                      <input name="fullName" value={formData.fullName} onChange={handleChange} type="text" required placeholder="John Doe" className="glass-card px-4 py-3 text-sm text-text-primary bg-white/5 outline-none border border-white/10 focus:border-accent-purple/60 rounded-xl" />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs text-text-secondary font-medium">Email</label>
                      <input name="email" value={formData.email} onChange={handleChange} type="email" required placeholder="john@example.com" className="glass-card px-4 py-3 text-sm text-text-primary bg-white/5 outline-none border border-white/10 focus:border-accent-purple/60 rounded-xl" />
                    </div>
                    <div className="flex flex-col gap-1.5 sm:col-span-2">
                      <label className="text-xs text-text-secondary font-medium">Nationality</label>
                      <input name="nationality" value={formData.nationality} onChange={handleChange} type="text" required placeholder="Tunisian" className="glass-card px-4 py-3 text-sm text-text-primary bg-white/5 outline-none border border-white/10 focus:border-accent-purple/60 rounded-xl" />
                    </div>
                  </div>
                </motion.div>
              )}

              {/* STEP 2: SESSION DETAILS */}
              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4"
                >
                  <h2 className="font-display text-xl font-semibold border-b border-white/10 pb-2">
                    Session Details
                  </h2>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs text-text-secondary font-medium">Session Title</label>
                    <input name="sessionTitle" value={formData.sessionTitle} onChange={handleChange} type="text" required placeholder="e.g. Leadership in the Digital Age" className="glass-card px-4 py-3 text-sm text-text-primary bg-white/5 outline-none border border-white/10 focus:border-accent-purple/60 rounded-xl" />
                  </div>
                  
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs text-text-secondary font-medium">Session Category</label>
                      <select name="sessionCategory" value={formData.sessionCategory} onChange={handleChange} required className="glass-card px-4 py-3 text-sm text-text-primary bg-surface-2 outline-none border border-white/10 focus:border-accent-purple/60 rounded-xl cursor-pointer">
                        <option value="LEADERSHIP">Leadership</option>
                        <option value="CULTURAL_EXCHANGE">Cultural Exchange</option>
                        <option value="PERSONAL_DEVELOPMENT">Personal Development</option>
                        <option value="WORKSHOP">Workshop</option>
                        <option value="ACTIVITY">Activity</option>
                      </select>
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs text-text-secondary font-medium">Duration (minutes)</label>
                      <input name="duration" value={formData.duration} onChange={handleChange} type="number" required placeholder="45" min="10" className="glass-card px-4 py-3 text-sm text-text-primary bg-white/5 outline-none border border-white/10 focus:border-accent-purple/60 rounded-xl" />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs text-text-secondary font-medium">Session Objectives</label>
                    <textarea name="sessionObjectives" value={formData.sessionObjectives} onChange={handleChange} required rows={3} placeholder="What will participants learn?" className="glass-card px-4 py-3 text-sm text-text-primary bg-white/5 outline-none border border-white/10 focus:border-accent-purple/60 rounded-xl resize-none" />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs text-text-secondary font-medium">Interactive Methods</label>
                    <textarea name="interactiveMethods" value={formData.interactiveMethods} onChange={handleChange} required rows={2} placeholder="How will you engage the audience?" className="glass-card px-4 py-3 text-sm text-text-primary bg-white/5 outline-none border border-white/10 focus:border-accent-purple/60 rounded-xl resize-none" />
                  </div>
                </motion.div>
              )}

              {/* STEP 3: EXPERIENCE & UPLOAD */}
              {step === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4"
                >
                  <h2 className="font-display text-xl font-semibold border-b border-white/10 pb-2">
                    Experience & Logistics
                  </h2>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs text-text-secondary font-medium">Your Facilitation Experience</label>
                    <textarea name="experience" value={formData.experience} onChange={handleChange} required rows={3} placeholder="Describe your past speaking or facilitation roles..." className="glass-card px-4 py-3 text-sm text-text-primary bg-white/5 outline-none border border-white/10 focus:border-accent-purple/60 rounded-xl resize-none" />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs text-text-secondary font-medium">Motivation</label>
                    <textarea name="motivation" value={formData.motivation} onChange={handleChange} required rows={3} placeholder="Why do you want to facilitate at Beyond Borders?" className="glass-card px-4 py-3 text-sm text-text-primary bg-white/5 outline-none border border-white/10 focus:border-accent-purple/60 rounded-xl resize-none" />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs text-text-secondary font-medium">Materials Needed (Optional)</label>
                    <input name="materialsNeeded" value={formData.materialsNeeded} onChange={handleChange} type="text" placeholder="e.g. Flipcharts, markers, projector..." className="glass-card px-4 py-3 text-sm text-text-primary bg-white/5 outline-none border border-white/10 focus:border-accent-purple/60 rounded-xl" />
                  </div>

                  <div className="pt-4 mt-4 border-t border-white/10">
                    <h2 className="font-display text-xl font-semibold pb-2 flex items-center justify-between">
                      <span>Session Plan Upload</span>
                      <Badge variant="purple">PDF Only</Badge>
                    </h2>
                    
                    <div className="flex flex-col gap-1.5 mt-2">
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
                </motion.div>
              )}
            </AnimatePresence>

            <div className="pt-6 mt-6 border-t border-white/10 flex justify-between items-center">
              {step > 1 ? (
                <button 
                  type="button" 
                  onClick={() => setStep(step - 1)}
                  className="flex items-center gap-2 text-sm text-text-secondary hover:text-white transition-colors"
                >
                  <ChevronLeft size={16} /> Back
                </button>
              ) : <div />}
              
              <Button type="submit" size="lg" disabled={status === "executing"}>
                {step < steps.length ? (
                  <>Continue <ChevronRight size={16} className="ml-1" /></>
                ) : (
                  status === "executing" ? "Submitting..." : "Submit Application"
                )}
              </Button>
            </div>

          </form>
        </Card>
      </div>
    </div>
  );
}
