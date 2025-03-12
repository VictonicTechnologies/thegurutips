"use client";

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, ArrowLeft, Calendar, Clock, Crown, Shield, Lock } from "lucide-react";
import Image from "next/image";
import { motion } from "framer-motion";
import Link from "next/link";
import { SubscriptionModal } from "@/components/SubscriptionModal";
import { getPremiumPredictions } from '@/lib/api';
import type { Prediction } from '@/lib/api';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { Progress } from "@/components/ui/progress";

export default function PremiumPredictions() {
  const searchParams = useSearchParams();
  const price = searchParams.get('price') || "$99";
  const period = searchParams.get('period') || "per month";
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setProgress(30);
        const data = await getPremiumPredictions();
        setProgress(70);
        setPredictions(data);
      } catch (error) {
        console.error('Error fetching predictions:', error);
      } finally {
        setProgress(100);
        setTimeout(() => setLoading(false), 500);
      }
    };

    fetchData();
  }, []);

  const handleSubscriptionSuccess = () => {
    setIsSubscribed(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-black">
        <Progress value={progress} className="fixed top-16 left-0 right-0 z-50" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <LoadingSpinner />
        </div>
      </div>
    );
  }

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

        <div className="text-center mb-16">
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-block mb-6"
          >
            <div className="bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700 text-white px-6 py-2 rounded-full text-sm font-semibold uppercase tracking-wider">
              VIP Analysis Package
            </div>
          </motion.div>
          <motion.h1
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white via-gray-100 to-gray-300 text-transparent bg-clip-text"
          >
            Elite VIP Analysis
          </motion.h1>
          <motion.p
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed"
          >
            Access our highest confidence insights with detailed analysis and expert consultation.
          </motion.p>
        </div>

        {isSubscribed ? (
          <div className="space-y-6">
            {predictions.map((prediction, index) => (
              <motion.div
                key={prediction.id}
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="relative overflow-hidden group hover:shadow-2xl transition-all duration-300 border-t border-gray-700 bg-gradient-to-r from-gray-900 to-gray-800">
                  <div className="absolute inset-0 bg-purple-500 opacity-5 group-hover:opacity-10 transition-opacity duration-300" />
                  <div className="p-6">
                    <div className="flex flex-col space-y-4">
                      <div className="flex flex-col md:flex-row items-center justify-between">
                        <div className="flex items-center gap-8 mb-4 md:mb-0">
                          <div className="text-right">
                            <h3 className="text-xl font-bold text-white">{prediction.homeTeam}</h3>
                            <p className="text-sm text-gray-400">Home</p>
                          </div>
                          <div className="text-3xl font-bold text-purple-500">VS</div>
                          <div className="text-left">
                            <h3 className="text-xl font-bold text-white">{prediction.awayTeam}</h3>
                            <p className="text-sm text-gray-400">Away</p>
                          </div>
                        </div>

                        <a 
                          href={prediction.bookmaker.link}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Button 
                            className="bg-white hover:bg-gray-100 text-gray-900 group-hover:scale-105 transition-transform duration-300"
                          >
                            <Image
                              src={prediction.bookmaker.logo}
                              alt={prediction.bookmaker.name}
                              width={20}
                              height={20}
                              className="rounded-full mr-2"
                            />
                            <span>View on {prediction.bookmaker.name}</span>
                            <ArrowRight className="h-4 w-4 ml-2 transition-transform duration-300 group-hover:translate-x-1" />
                          </Button>
                        </a>
                      </div>

                      <div className="flex flex-col md:flex-row items-center justify-between border-t border-gray-700 pt-4">
                        <div className="flex items-center gap-6 mb-4 md:mb-0">
                          <div className="text-center">
                            <p className="text-sm text-gray-400">Analysis</p>
                            <p className="font-semibold text-white">{prediction.insight}</p>
                          </div>
                          <div className="text-center">
                            <p className="text-sm text-gray-400">Value</p>
                            <p className="font-semibold text-purple-500">{prediction.odds}</p>
                          </div>
                          <div className="text-center">
                            <p className="text-sm text-gray-400">Confidence</p>
                            <p className="font-semibold text-blue-500">{prediction.confidence}</p>
                          </div>
                        </div>

                        <div className="flex items-center text-gray-300 text-sm">
                          <Calendar className="h-4 w-4 mr-1" />
                          <span>{prediction.date}</span>
                          <span className="mx-2">•</span>
                          <Clock className="h-4 w-4 mr-1" />
                          <span>{prediction.time}</span>
                        </div>
                      </div>

                      {prediction.analysis && (
                        <div className="border-t border-gray-700 pt-4">
                          <div className="flex items-start gap-2">
                            <Shield className="h-5 w-5 text-purple-500 mt-0.5" />
                            <p className="text-gray-300 text-sm">{prediction.analysis}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        ) : (
          <Card className="relative overflow-hidden border-t border-gray-700 bg-gradient-to-r from-gray-900 to-gray-800 p-8">
            <div className="absolute inset-0 bg-purple-500 opacity-5" />
            <div className="relative text-center">
              <Lock className="w-20 h-20 mx-auto mb-6 text-purple-500" />
              <h2 className="text-2xl font-bold text-white mb-4">Subscribe to Access VIP Analysis</h2>
              <p className="text-gray-300 mb-8">
                Get unlimited access to our most exclusive insights with a 95%+ success rate, live analysis, and personal consultation.
              </p>
              <Button 
                className="bg-gradient-to-r from-purple-500 to-purple-700 hover:from-purple-600 hover:to-purple-800 text-white px-8 py-6 text-lg"
                size="lg"
                onClick={() => setShowModal(true)}
              >
                <span>Subscribe Now - {price}</span>
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
            </div>
          </Card>
        )}

        <SubscriptionModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          onSuccess={handleSubscriptionSuccess}
          planName="VIP Analysis"
          price={price}
        />
      </div>
    </div>
  );
}