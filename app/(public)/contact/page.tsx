import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { DELEGATE_INFO, ORGANIZER } from "@/lib/constants";
import { Mail, MessageCircle } from "lucide-react";

export const metadata: Metadata = { title: "Contact" };

export default function ContactPage() {
  return (
    <>
      <PageHeader
        title="Contact"
        description={`Reach the ${ORGANIZER} organizing committee.`}
      />
      <p className="section-container -mt-8 max-w-2xl text-center text-text-secondary md:text-left">
        {DELEGATE_INFO}
      </p>
      <div className="section-container grid gap-6 pb-24 md:grid-cols-2">
        <Card hover={false}>
          <Mail className="text-accent-purple" size={24} />
          <h3 className="mt-4 font-display text-lg font-semibold">Email</h3>
          <p className="mt-2 text-sm text-text-secondary">
            contact@beyondbordersconference.tn
          </p>
        </Card>
        <Card hover={false}>
          <MessageCircle className="text-accent-teal" size={24} />
          <h3 className="mt-4 font-display text-lg font-semibold">
            Social & WhatsApp
          </h3>
          <p className="mt-2 text-sm text-text-secondary">
            Follow AIESEC in Bizerte for updates. OC contact channels will be
            linked here before launch.
          </p>
        </Card>
      </div>
    </>
  );
}
