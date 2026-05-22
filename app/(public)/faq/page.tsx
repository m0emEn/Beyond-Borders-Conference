import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/PageHeader";
import { FAQ } from "@/components/sections/FAQ";

export const metadata: Metadata = { title: "FAQ" };

export default function FAQPage() {
  return (
    <>
      <PageHeader title="Frequently Asked Questions" />
      <FAQ />
    </>
  );
}
