"use client";

import { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, CheckCircle, XCircle } from "lucide-react";
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
            <div className="bg-gradient-to-r from-emerald-500 via-blue-500 to-purple-500 text-white px-6 py-2 rounded-full text-sm font-semibold uppercase tracking-wider">
              Accuracy Rate: {calculateAccuracyRate()}%
            </div>
          </motion.div>
          <motion.h1
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white via-gray-100 to-gray-300 text-transparent bg-clip-text"
          >
            Research Performance
          </motion.h1>
          <motion.p
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed"
          >
            Historical accuracy of our sports analysis and research insights
          </motion.p>
        </div>

        <div className="space-y-8">
          {results.map((day, dayIndex) => (
            <motion.div
              key={day.date}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: dayIndex * 0.1 }}
            >
              <div className="flex items-center gap-2 mb-4">
                <Calendar className="h-5 w-5 text-gray-400" />
                <h2 className="text-xl font-semibold text-white">{day.date}</h2>
              </div>
              
              <div className="space-y-4">
                {day.matches.map((match, matchIndex) => (
                  <Card
                    key={match.id}
                    className="relative overflow-hidden group hover:shadow-2xl transition-all duration-300 border-t border-gray-700 bg-gradient-to-r from-gray-900 to-gray-800"
                  >
                    <div className={`absolute inset-0 ${match.result === 'success' ? 'bg-emerald-500' : 'bg-red-500'} opacity-5 group-hover:opacity-10 transition-opacity duration-300`} />
                    <div className="p-6">
                      <div className="flex flex-col space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-8">
                            <div className="text-right">
                              <h3 className="text-lg font-semibold text-white">{match.homeTeam}</h3>
                            </div>
                            <div className="text-2xl font-bold text-gray-400">{match.score}</div>
                            <div className="text-left">
                              <h3 className="text-lg font-semibold text-white">{match.awayTeam}</h3>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {match.result === 'success' ? (
                              <CheckCircle className="h-6 w-6 text-emerald-500" />
                            ) : (
                              <XCircle className="h-6 w-6 text-red-500" />
                            )}
                          </div>
                        </div>

                        <div className="flex flex-col md:flex-row items-start md:items-center justify-between border-t border-gray-700 pt-4">
                          <div className="mb-2 md:mb-0">
                            <p className="text-sm text-gray-400">Research Insight</p>
                            <p className="font-medium text-white">{match.insight}</p>
                          </div>
                          <p className="text-sm text-gray-300">{match.analysis}</p>
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
  );
}