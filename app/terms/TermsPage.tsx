"use client";

import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { motion } from "framer-motion";
import { termsData } from "@/lib/page-data";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-black">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="fixed top-20 left-4 sm:left-8 z-50">
          <Link href="/">
            <Button variant="ghost" className="text-gray-400 hover:text-white bg-gray-900/80 backdrop-blur-sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </Link>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="prose prose-invert max-w-none"
        >
          <h1 className="text-4xl font-bold mb-8 text-center bg-gradient-to-r from-white via-gray-100 to-gray-300 text-transparent bg-clip-text">
            {termsData.title}
          </h1>

          <div className="space-y-6 text-gray-300">
            {termsData.sections.map((section) => (
              <section key={section.title} className="bg-gray-800/50 rounded-lg p-6">
                <h2 className="text-2xl font-semibold mb-4 text-white">{section.title}</h2>
                <p>{section.content}</p>
                {section.list && (
                  <ul className="list-disc pl-6 mt-2">
                    {section.list.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                )}
              </section>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}