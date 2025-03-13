"use client";

import { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, CheckCircle, XCircle, Trophy, Wallpaper as SoccerBall } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { getResults } from '@/lib/api';
import type { ResultDay } from '@/lib/api';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { Progress } from "@/components/ui/progress";

export default function ResultsPage() {
  const [results, setResults] = useState<ResultDay[]>([]);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setProgress(30);
        const data = await getResults();
        setProgress(70);
        setResults(data);
      } catch (error) {
        console.error('Error fetching results:', error);
      } finally {
        setProgress(100);
        setTimeout(() => setLoading(false), 500);
      }
    };

    fetchData();
  }, []);

  const calculateAccuracyRate = () => {
    let totalAnalyses = 0;
    let accurateAnalyses = 0;

    results.forEach(day => {
      day.matches.forEach(match => {
        totalAnalyses++;
        if (match.result === 'success') {
          accurateAnalyses++;
        }
      });
    });

    return totalAnalyses > 0 ? Math.round((accurateAnalyses / totalAnalyses) * 100) : 0;
  };

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
            <div className="absolute inset-0 bg-black/60"></div>
            <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <h1 className="text-2xl md:text-3xl font-bold text-white mb-3">
                Our History
              </h1>
              <p className="text-sm text-white/90 max-w-2xl mx-auto">
                Historical accuracy of our sports analysis and research insights.
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

            <div className="space-y-6">
              {results.map((day, dayIndex) => (
                <motion.div
                  key={day.date}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: dayIndex * 0.1 }}
                >
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2 mb-4 inline-block">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-emerald-400" />
                      <h2 className="text-lg font-semibold text-white">{day.date}</h2>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    {day.matches.map((match, matchIndex) => (
                      <Card
                        key={match.id}
                        className="stats-card"
                      >
                        <div className="p-6">
                          <div className="flex flex-col space-y-4">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-8">
                                <div className="text-right">
                                  <h3 className="text-lg font-semibold text-white">{match.homeTeam}</h3>
                                </div>
                                <div className="text-2xl font-bold text-white">{match.score}</div>
                                <div className="text-left">
                                  <h3 className="text-lg font-semibold text-white">{match.awayTeam}</h3>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                {match.result === 'success' ? (
                                  <CheckCircle className="h-5 w-5 text-emerald-500" />
                                ) : (
                                  <XCircle className="h-5 w-5 text-red-500" />
                                )}
                              </div>
                            </div>

                            <div className="flex flex-col md:flex-row items-start md:items-center justify-between border-t border-white/10 pt-4">
                              <div className="mb-2 md:mb-0">
                                <p className="text-sm text-blue-400">Prediction</p>
                                <p className="font-medium text-white">{match.insight}</p>
                              </div>
                              <div className="flex items-center gap-2">
                                <SoccerBall className="h-4 w-4 text-blue-400" />
                                <p className="text-sm text-white/80">{match.analysis}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}