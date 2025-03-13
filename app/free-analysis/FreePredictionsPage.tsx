"use client";

import { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, ArrowLeft, Calendar, Clock, Wallpaper as SoccerBall } from "lucide-react";
import Image from "next/image";
import { motion } from "framer-motion";
import Link from "next/link";
import { getFreePredictions } from '@/lib/api';
import type { Prediction } from '@/lib/api';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { Progress } from "@/components/ui/progress";

export default function FreePredictionsPage() {
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setProgress(30);
        const data = await getFreePredictions();
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

  if (loading) {
    return (
      <div className="min-h-screen bg-[url('https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&q=80')] bg-cover bg-center bg-no-repeat bg-fixed">
        <Progress value={progress} className="fixed top-16 left-0 right-0 z-50" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[url('https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&q=80')] bg-cover bg-center bg-no-repeat bg-fixed">
      <div className="min-h-screen bg-black/95">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="relative py-12 bg-[url('https://images.unsplash.com/photo-1489944440615-453fc2b6a9a9?auto=format&fit=crop&q=80')] bg-cover bg-center"
          >
            <div className="absolute inset-0 bg-black/80"></div>
            <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              {/* <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="inline-flex items-center justify-center gap-2 mb-4 px-4 py-1.5 rounded-full bg-emerald-500"
              >
                <span className="text-sm font-semibold text-white">Today's Free Analysis</span>
              </motion.div> */}
              <h1 className="text-2xl md:text-3xl font-bold text-white mb-3">
                Free Odds of the Day
              </h1>
              <p className="text-sm text-white/90 max-w-2xl mx-auto">
                AI-powered odds and predictions analysis of thousands of data points for high-confidence insights.
              </p>
            </div>
          </motion.div>

          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="fixed top-20 left-4 sm:left-8 z-50">
              <Link href="/">
                <Button variant="ghost" className="text-white/80 hover:text-white bg-black/50 backdrop-blur-xl">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back
                </Button>
              </Link>
            </div>

            <div className="space-y-4">
              {predictions.map((prediction, index) => (
                <motion.div
                  key={prediction.id}
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card className="stats-card">
                    <div className="p-6">
                      <div className="flex flex-col space-y-4">
                        <div className="flex flex-col md:flex-row items-center justify-between">
                          <div className="flex items-center gap-8 mb-4 md:mb-0">
                            <div className="text-right">
                              <h3 className="text-lg font-bold text-white">{prediction.homeTeam}</h3>
                              <p className="text-sm text-blue-400">Home</p>
                            </div>
                            <div className="text-2xl font-bold text-white">VS</div>
                            <div className="text-left">
                              <h3 className="text-lg font-bold text-white">{prediction.awayTeam}</h3>
                              <p className="text-sm text-blue-400">Away</p>
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-col md:flex-row items-center justify-between border-t border-white/10 pt-4">
                          <div className="flex items-center gap-6 mb-4 md:mb-0">
                            <div className="text-center">
                              <p className="text-sm text-blue-400">Prediction</p>
                              <p className="font-semibold text-white">{prediction.insight}</p>
                            </div>
                            <div className="text-center">
                              <p className="text-sm text-blue-400">ODDS</p>
                              <p className="font-semibold text-emerald-400">{prediction.odds}</p>
                            </div>
                            <div className="text-center">
                              <p className="text-sm text-blue-400">Win Confidence</p>
                              <p className="font-semibold text-white">{prediction.confidence}</p>
                            </div>
                          </div>

                          <div className="flex items-center text-white/80 text-sm">
                            <Calendar className="h-4 w-4 mr-1" />
                            <span>{prediction.date}</span>
                            <span className="mx-2">•</span>
                            <Clock className="h-4 w-4 mr-1" />
                            <span>{prediction.time}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}