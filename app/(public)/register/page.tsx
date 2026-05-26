"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Globe2,
  Calendar,
  DollarSign,
  CheckCircle,
  AlertCircle,
  Phone,
  Utensils,
  BookOpen,
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { PageHeader } from "@/components/ui/PageHeader";
import { UploadDropzone } from "@/lib/uploadthing";

const STEPS = [
  { id: 1, label: "Profile", icon: User },
  { id: 2, label: "Expectations", icon: BookOpen },
  { id: 3, label: "Logistics", icon: Calendar },
  { id: 4, label: "Payment", icon: DollarSign },
];

export default function RegisterPage() {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successData, setSuccessData] = useState<{
    delegateId: string;
  } | null>(null);
  
  const [windowState, setWindowState] = useState<"open" | "closed" | "early" | "loading">("loading");

  useEffect(() => {
    const openDateStr = process.env.NEXT_PUBLIC_REGISTRATION_OPEN_DATE;
    const closeDateStr = process.env.NEXT_PUBLIC_REGISTRATION_CLOSE_DATE;
    
    if (openDateStr && closeDateStr) {
      const now = new Date();
      const openDate = new Date(openDateStr);
      const closeDate = new Date(closeDateStr);
      
      if (now < openDate) {
        setWindowState("early");
      } else if (now > closeDate) {
        setWindowState("closed");
      } else {
        setWindowState("open");
      }
    } else {
      setWindowState("open");
    }
  }, []);

  // Form Fields
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [gender, setGender] = useState("");
  const [nationality, setNationality] = useState("");
  const [universityOccupation, setUniversityOccupation] = useState("");
  
  const [motivation, setMotivation] = useState("");
  const [emergencyName, setEmergencyName] = useState("");
  const [emergencyPhone, setEmergencyPhone] = useState("");

  const [dietaryPrefs, setDietaryPrefs] = useState<string[]>([]);
  const [arrivalDate, setArrivalDate] = useState("");
  const [departureDate, setDepartureDate] = useState("");

  const [paymentProof, setPaymentProof] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);

  // Toggle dietary options
  const handleDietaryToggle = (pref: string) => {
    setDietaryPrefs((prev) =>
      prev.includes(pref) ? prev.filter((p) => p !== pref) : [...prev, pref]
    );
  };

  // Form Step Validation
  const validateStep = () => {
    setError(null);
    if (step === 1) {
      if (!fullName.trim() || !email.trim() || !phone.trim() || !gender || !nationality || !universityOccupation.trim()) {
        setError("Please fill in all profile fields.");
        return false;
      }
      if (!email.includes("@")) {
        setError("Please enter a valid email address.");
        return false;
      }
    } else if (step === 2) {
      if (!motivation.trim() || !emergencyName.trim() || !emergencyPhone.trim()) {
        setError("Please complete all motivation and emergency contact details.");
        return false;
      }
    } else if (step === 3) {
      // Optional dates, but validated if set
      if (arrivalDate && departureDate && new Date(arrivalDate) > new Date(departureDate)) {
        setError("Arrival date cannot be after departure date.");
        return false;
      }
    } else if (step === 4) {
      if (!termsAccepted) {
        setError("You must accept the Terms and Conditions to complete registration.");
        return false;
      }
    }
    return true;
  };

  const handleNext = () => {
    if (validateStep()) {
      setStep((s) => s + 1);
    }
  };

  const handlePrev = () => {
    setError(null);
    setStep((s) => Math.max(1, s - 1));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep()) return;

    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName,
          email,
          phone,
          nationality,
          gender,
          universityOccupation,
          emergencyName,
          emergencyPhone,
          dietaryPrefs,
          arrivalDate: arrivalDate || null,
          departureDate: departureDate || null,
          motivation,
          paymentProof: paymentProof || null,
          termsAccepted,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "An unexpected error occurred.");
      }

      setSuccessData(result.data);
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please check your inputs.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // ─── RENDER SUCCESS STATE ───────────────────────────────────
  if (windowState === "loading") {
    return <div className="min-h-screen bg-bg flex items-center justify-center text-text-muted">Loading...</div>;
  }

  if (windowState !== "open") {
    const isClosed = windowState === "closed";
    return (
      <div className="min-h-screen bg-bg flex flex-col items-center justify-center pt-24 pb-16">
        <div className="section-container max-w-2xl px-4 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="glass-card p-8 md:p-12 border border-accent-purple/30 bg-gradient-to-br from-accent-purple/5 to-transparent shadow-glow-purple"
          >
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-accent-purple/10 mb-6">
              <AlertCircle className="text-accent-purple" size={48} />
            </div>
            <Badge variant="purple" className="mb-4">
              {isClosed ? "Registration Closed" : "Registration Not Open"}
            </Badge>
            <h1 className="font-display text-3xl font-bold md:text-4xl text-text-primary">
              {isClosed ? "We've Reached Capacity" : "Coming Soon"}
            </h1>
            <p className="mt-4 text-sm text-text-secondary leading-relaxed">
              {isClosed 
                ? "Registration for Beyond Borders Conference 2026 is officially closed. Thank you to everyone who applied!"
                : "Registration will open soon. Please check back later."}
            </p>
            <Button href="/" className="mt-10 w-full md:w-auto" variant="glass">
              Back to Home
            </Button>
          </motion.div>
        </div>
      </div>
    );
  }

  if (successData) {
    return (
      <div className="min-h-screen bg-bg flex flex-col items-center justify-center pt-24 pb-16">
        <div className="section-container max-w-2xl px-4 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="glass-card p-8 md:p-12 border border-accent-teal/30 bg-gradient-to-br from-accent-teal/5 to-transparent shadow-glow-purple"
          >
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-accent-teal/10 mb-6">
              <CheckCircle className="text-accent-teal" size={48} />
            </div>

            <Badge variant="teal" className="mb-4">
              Registration Successful!
            </Badge>

            <h1 className="font-display text-3xl font-bold md:text-4xl text-text-primary">
              Welcome to the Journey
            </h1>
            
            <p className="mt-4 text-sm text-text-secondary leading-relaxed">
              Your application has been logged directly into our conference registry database. A verification email outline has been dispatched to <span className="text-text-primary font-medium">{email}</span>.
            </p>

            <div className="mt-8 p-6 glass-card border border-white/5 bg-surface-3/30 max-w-md mx-auto">
              <span className="text-xs uppercase tracking-wider text-text-muted">
                Your Internal Delegate ID
              </span>
              <div className="font-mono text-3xl font-bold text-accent-pink tracking-tight mt-1">
                {successData.delegateId}
              </div>
            </div>

            <div className="mt-8 text-left space-y-4 max-w-md mx-auto border-t border-white/10 pt-6">
              <h3 className="font-semibold text-text-primary text-sm uppercase tracking-wider">
                Next Steps:
              </h3>
              <ul className="text-xs text-text-secondary space-y-3 list-disc pl-4 leading-relaxed">
                <li>
                  Our financial oversight team will verify your manual payment proof (if provided) or contact you directly.
                </li>
                <li>
                  Upon verification of registration, your custom visual entrance ticket containing your secure check-in QR code will be generated.
                </li>
              </ul>
            </div>

            <Button href="/" className="mt-10 w-full md:w-auto" variant="glass">
              Back to Home
            </Button>
          </motion.div>
        </div>
      </div>
    );
  }

  // ─── RENDER FORM STATE ──────────────────────────────────────
  return (
    <div className="min-h-screen bg-bg">
      <PageHeader
        title="Conference Registration"
        description="Join Exchange Participants from around the globe at this summer's premier leadership and cultural exchange summit."
      />

      <div className="section-container max-w-3xl pb-24 px-4">
        {/* Progress Stepper */}
        <div className="mb-12 relative flex items-center justify-between">
          <div className="absolute left-0 right-0 h-0.5 bg-white/10 z-0 top-1/2 -translate-y-1/2" />
          {STEPS.map((s) => {
            const Icon = s.icon;
            const active = step >= s.id;
            const current = step === s.id;
            return (
              <div key={s.id} className="relative z-10 flex flex-col items-center">
                <div
                  className={`flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full transition-all duration-300 ${
                    active
                      ? "bg-gradient-cta text-white ring-4 ring-bg shadow-glow-purple"
                      : "bg-surface-2 text-text-muted ring-4 ring-bg"
                  } ${current ? "scale-110" : ""}`}
                >
                  <Icon size={20} />
                </div>
                <span
                  className={`mt-2 text-2xs sm:text-xs font-medium tracking-wider uppercase hidden sm:block ${
                    active ? "text-text-primary" : "text-text-muted"
                  }`}
                >
                  {s.label}
                </span>
              </div>
            );
          })}
        </div>

        {/* Form Container */}
        <Card className="shadow-card border border-white/10 relative overflow-hidden p-6 sm:p-10">
          <form onSubmit={handleSubmit} className="space-y-6">
            <AnimatePresence mode="wait">
              {/* Error Callout */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="p-4 rounded-xl border border-red-500/30 bg-red-500/10 flex items-start gap-3"
                >
                  <AlertCircle className="text-red-400 shrink-0 mt-0.5" size={20} />
                  <p className="text-xs text-red-300 leading-normal">{error}</p>
                </motion.div>
              )}

              {/* STEP 1: Personal Profile */}
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.25 }}
                  className="space-y-4"
                >
                  <h2 className="font-display text-xl font-semibold border-b border-white/10 pb-2">
                    Personal Profile
                  </h2>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs text-text-secondary font-medium">Full Name</label>
                      <input
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="John Doe"
                        className="glass-card px-4 py-3 text-sm text-text-primary bg-white/5 outline-none border border-white/10 focus:border-accent-purple/60 rounded-xl transition"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs text-text-secondary font-medium">Email Address</label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="john.doe@aiesec.net"
                        className="glass-card px-4 py-3 text-sm text-text-primary bg-white/5 outline-none border border-white/10 focus:border-accent-purple/60 rounded-xl transition"
                      />
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs text-text-secondary font-medium">Phone Number</label>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+216 55 123 456"
                        className="glass-card px-4 py-3 text-sm text-text-primary bg-white/5 outline-none border border-white/10 focus:border-accent-purple/60 rounded-xl transition"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs text-text-secondary font-medium">Gender</label>
                      <select
                        value={gender}
                        onChange={(e) => setGender(e.target.value)}
                        className="glass-card px-4 py-3 text-sm text-text-primary bg-surface-2 outline-none border border-white/10 focus:border-accent-purple/60 rounded-xl transition cursor-pointer"
                      >
                        <option value="">Select Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other / Prefer not to say</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs text-text-secondary font-medium">Nationality</label>
                      <input
                        type="text"
                        value={nationality}
                        onChange={(e) => setNationality(e.target.value)}
                        placeholder="Tunisian"
                        className="glass-card px-4 py-3 text-sm text-text-primary bg-white/5 outline-none border border-white/10 focus:border-accent-purple/60 rounded-xl transition"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs text-text-secondary font-medium">University / Occupation</label>
                      <input
                        type="text"
                        value={universityOccupation}
                        onChange={(e) => setUniversityOccupation(e.target.value)}
                        placeholder="INSAT / Software Engineering Student"
                        className="glass-card px-4 py-3 text-sm text-text-primary bg-white/5 outline-none border border-white/10 focus:border-accent-purple/60 rounded-xl transition"
                      />
                    </div>
                  </div>
                </motion.div>
              )}

              {/* STEP 2: Expectations & Motivation */}
              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.25 }}
                  className="space-y-4"
                >
                  <h2 className="font-display text-xl font-semibold border-b border-white/10 pb-2">
                    Expectations & Emergency
                  </h2>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs text-text-secondary font-medium">
                      What is your motivation to attend? (expectations)
                    </label>
                    <textarea
                      rows={4}
                      value={motivation}
                      onChange={(e) => setMotivation(e.target.value)}
                      placeholder="Share your goals, learning expectations, and why you wish to unlock leadership development..."
                      className="glass-card px-4 py-3 text-sm text-text-primary bg-white/5 outline-none border border-white/10 focus:border-accent-purple/60 rounded-xl transition resize-none"
                    />
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2 mt-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs text-text-secondary font-medium">Emergency Contact Name</label>
                      <input
                        type="text"
                        value={emergencyName}
                        onChange={(e) => setEmergencyName(e.target.value)}
                        placeholder="Parent / Guardian Name"
                        className="glass-card px-4 py-3 text-sm text-text-primary bg-white/5 outline-none border border-white/10 focus:border-accent-purple/60 rounded-xl transition"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs text-text-secondary font-medium">Emergency Contact Phone</label>
                      <input
                        type="tel"
                        value={emergencyPhone}
                        onChange={(e) => setEmergencyPhone(e.target.value)}
                        placeholder="+216 22 987 654"
                        className="glass-card px-4 py-3 text-sm text-text-primary bg-white/5 outline-none border border-white/10 focus:border-accent-purple/60 rounded-xl transition"
                      />
                    </div>
                  </div>
                </motion.div>
              )}

              {/* STEP 3: Logistics */}
              {step === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.25 }}
                  className="space-y-4"
                >
                  <h2 className="font-display text-xl font-semibold border-b border-white/10 pb-2">
                    Logistics & dietary preferences
                  </h2>

                  <div className="flex flex-col gap-2">
                    <span className="text-xs text-text-secondary font-medium">Dietary Requirements</span>
                    <div className="flex flex-wrap gap-2">
                      {["Vegetarian", "Vegan", "Gluten-Free", "Halal", "Lactose-Free"].map((pref) => {
                        const checked = dietaryPrefs.includes(pref);
                        return (
                          <button
                            key={pref}
                            type="button"
                            onClick={() => handleDietaryToggle(pref)}
                            className={`px-4 py-2 rounded-full text-xs font-medium border transition ${
                              checked
                                ? "bg-accent-purple/20 text-accent-purple border-accent-purple/40"
                                : "bg-white/5 text-text-secondary border-white/10 hover:border-white/20"
                            }`}
                          >
                            {pref}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2 mt-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs text-text-secondary font-medium">
                        Arrival Date & Time (Optional)
                      </label>
                      <input
                        type="datetime-local"
                        value={arrivalDate}
                        onChange={(e) => setArrivalDate(e.target.value)}
                        className="glass-card px-4 py-3 text-sm text-text-secondary bg-surface-2 outline-none border border-white/10 focus:border-accent-purple/60 rounded-xl transition cursor-pointer"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs text-text-secondary font-medium">
                        Departure Date & Time (Optional)
                      </label>
                      <input
                        type="datetime-local"
                        value={departureDate}
                        onChange={(e) => setDepartureDate(e.target.value)}
                        className="glass-card px-4 py-3 text-sm text-text-secondary bg-surface-2 outline-none border border-white/10 focus:border-accent-purple/60 rounded-xl transition cursor-pointer"
                      />
                    </div>
                  </div>
                </motion.div>
              )}

              {/* STEP 4: Payment Upload */}
              {step === 4 && (
                <motion.div
                  key="step4"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.25 }}
                  className="space-y-4"
                >
                  <h2 className="font-display text-xl font-semibold border-b border-white/10 pb-2">
                    Payment Confirmation
                  </h2>
                  <div className="p-5 glass-card border border-accent-purple/30 bg-accent-purple/5 rounded-2xl text-xs sm:text-sm text-text-secondary leading-relaxed">
                    <h3 className="font-semibold text-text-primary mb-2">Manual Bank Transfer Details:</h3>
                    <p className="font-mono text-2xs sm:text-xs">
                      <strong>Bank</strong>: Banque Nationale Agricole (BNA)<br />
                      <strong>Account Name</strong>: AIESEC in Tunisia - Bizerte<br />
                      <strong>RIB</strong>: 03 100 0500115003248 81<br />
                      <strong>Reference Note</strong>: Write your full name when performing transfer.
                    </p>
                  </div>

                  <div className="flex flex-col gap-1.5 mt-4">
                    <label className="text-xs text-text-secondary font-medium mb-1">
                      Payment Receipt Upload (Optional)
                    </label>
                    {paymentProof ? (
                      <div className="flex items-center justify-between p-4 glass-card bg-accent-teal/10 border border-accent-teal/30 rounded-xl">
                        <div className="flex items-center gap-3">
                          <CheckCircle className="text-accent-teal" size={20} />
                          <span className="text-sm text-accent-teal font-medium">Receipt Uploaded Successfully</span>
                        </div>
                        <Button type="button" variant="glass" size="sm" onClick={() => setPaymentProof("")}>
                          Remove
                        </Button>
                      </div>
                    ) : (
                      <UploadDropzone
                        endpoint="paymentProof"
                        onClientUploadComplete={(res) => {
                          if (res && res[0]) {
                            setPaymentProof(res[0].url);
                          }
                        }}
                        onUploadError={(error: Error) => {
                          setError(`Upload failed: ${error.message}`);
                        }}
                        className="ut-label:text-text-primary ut-button:bg-accent-purple hover:ut-button:bg-accent-purple/90 border border-white/10 glass-card p-4 rounded-xl"
                      />
                    )}
                  </div>

                  <div className="flex items-start gap-3 mt-6">
                    <input
                      type="checkbox"
                      id="terms"
                      checked={termsAccepted}
                      onChange={(e) => setTermsAccepted(e.target.checked)}
                      className="mt-1 h-4 w-4 rounded border-white/10 bg-surface-2 accent-accent-purple cursor-pointer"
                    />
                    <label htmlFor="terms" className="text-xs text-text-secondary leading-normal select-none cursor-pointer">
                      I agree that my personal registration details can be retained by the organizing committee of AIESEC in Bizerte for coordination, emergency logistics, and visual credential creation.
                    </label>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Stepper Navigation Actions */}
            <div className="flex justify-between gap-4 border-t border-white/10 pt-6 mt-6">
              {step > 1 ? (
                <Button type="button" variant="glass" size="md" onClick={handlePrev}>
                  Back
                </Button>
              ) : (
                <div />
              )}

              {step < STEPS.length ? (
                <Button type="button" size="md" onClick={handleNext}>
                  Next Step
                </Button>
              ) : (
                <Button type="submit" size="md" disabled={isSubmitting}>
                  {isSubmitting ? "Registering..." : "Submit Registration"}
                </Button>
              )}
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}
