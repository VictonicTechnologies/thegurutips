'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";
import Link from "next/link";

export default function PaymentSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    if (!sessionId) {
      router.push('/');
    }
  }, [sessionId, router]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-black flex items-center justify-center">
      <div className="text-center px-4">
        <CheckCircle className="w-20 h-20 text-emerald-500 mx-auto mb-6" />
        <h1 className="text-4xl font-bold text-white mb-4">Payment Successful!</h1>
        <p className="text-xl text-gray-300 mb-8">
          Thank you for subscribing. You now have access to premium predictions.
        </p>
        <Link href="/">
          <Button className="bg-emerald-500 hover:bg-emerald-600">
            Back to Home
          </Button>
        </Link>
      </div>