'use client';

import { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Trophy, Star, Crown, History } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { getCards } from '@/lib/api';
import type { CardData } from '@/lib/api';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";

export default function HomePage() {
  const [cards, setCards] = useState<CardData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setProgress(30);
        const data = await getCards();
        setProgress(70);
        setCards(data);
        setError(null);
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to load data';
        console.error('Error fetching cards:', error);
        setError(message);
        setCards([]);
        toast.error(message);
      } finally {
        setProgress(100);
        setTimeout(() => setLoading(false), 500);
      }
    };

    fetchData();
  }, []);

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Trophy':
        return Trophy;
      case 'Star':
        return Star;
      case 'Crown':
        return Crown;
      case 'History':
        return History;
      default:
        return Trophy;
    }
  };

  const getHref = (id: string) => {
    if (id === 'free-analysis' || id === 'results') {
      return `/${id}`;
    }
    return `/paid/${id}`;
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

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-black flex items-center justify-center">
        <div className="text-center px-4">
          <p className="text-red-500 mb-4">{error}</p>
          <Button 
            onClick={() => window.location.reload()}
            className="bg-blue-500 hover:bg-blue-600"
          >
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-black">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-16">
          <div className="inline-block mb-6">
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="bg-gradient-to-r from-emerald-500 via-blue-500 to-purple-500 text-white px-6 py-2 rounded-full text-sm font-semibold uppercase tracking-wider"
            >
              97% Accuracy Rate in 2024
            </motion.div>
          </div>
          <motion.h1 
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white via-gray-100 to-gray-300 text-transparent bg-clip-text"
          >
            Football Prediction Insights
          </motion.h1>
          <motion.p 
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed"
          >
            Join thousands of members accessing expert-driven football prediction, analysis and statistical insights for a deeper understanding of the game.
          </motion.p>
        </div>

        <div className="space-y-8">
          {cards.map((card, index) => {
            const IconComponent = getIcon(card.icon);
            const href = getHref(card.id || '');

            return (
              <motion.div
                key={`card-${index}-${card.title}`}
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Link href={href} className="block">
                  <Card className="relative overflow-hidden group cursor-pointer transition-all duration-300 hover:shadow-2xl hover:scale-[1.02] border-t border-gray-700 bg-gradient-to-r from-gray-900 to-gray-800">
                    <div className={`absolute inset-0 ${card.color} opacity-5 group-hover:opacity-10 transition-opacity duration-300`} />
                    <div className="p-8 flex items-center gap-6">
                      <div className={`${card.color} p-4 rounded-xl group-hover:scale-110 transition-transform duration-300`}>
                        <IconComponent className="h-8 w-8 text-white" />
                      </div>
                      <div className="flex-grow">
                        <div className="flex items-center justify-between mb-3">
                          <h2 className="text-2xl font-bold text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-gray-300 transition-all duration-300">
                            {card.title}
                          </h2>
                          {card.price && (
                            <div className="text-right">
                              <div className="text-2xl font-bold text-white">{card.price}</div>
                              {card.period && (
                                <div className="text-sm text-gray-400">{card.period}</div>
                              )}
                            </div>
                          )}
                        </div>
                        <p className="text-gray-300 mb-4 text-lg">{card.description}</p>
                        {card.features && (
                          <ul className="mb-4 space-y-2">
                            {card.features.map((feature, idx) => (
                              <li key={`feature-${idx}`} className="text-gray-400 flex items-center">
                                <ArrowRight className="h-4 w-4 mr-2 text-emerald-500" />
                                {feature}
                              </li>
                            ))}
                          </ul>
                        )}
                        <Button 
                          variant="ghost" 
                          className="group-hover:bg-white group-hover:text-gray-900 text-white border border-gray-700 hover:border-white transition-all duration-300"
                        >
                          <span>{card.buttonText}</span>
                          <ArrowRight className="h-4 w-4 ml-2 transition-transform duration-300 group-hover:translate-x-1" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}