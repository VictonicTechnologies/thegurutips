'use client';

import { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Trophy, Star, Crown, History, TrendingUp, Percent, Shield, Calendar } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { getCards } from '@/lib/api';
import type { CardData } from '@/lib/api';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { format } from 'date-fns';

const FootballIcon = () => (
  <img 
    src="https://raw.githubusercontent.com/derekkipkemoi/SmartScoreAnalysis.com/refs/heads/main/football-2-svgrepo-com.svg"
    width="18"
    height="18"
    alt="Football"
    className="text-emerald-400 flex-shrink-0"
  />
);

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
      case 'TrendingUp':
        return TrendingUp;
      case 'Shield':
        return Shield;
      default:
        return Trophy;
    }
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

  if (error) {
    return (
      <div className="min-h-screen bg-[url('https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&q=80')] bg-cover bg-center bg-no-repeat bg-fixed">
        <div className="min-h-screen bg-black/95 flex items-center justify-center">
          <div className="text-center px-4">
            <p className="text-red-500 mb-4">{error}</p>
            <Button 
              onClick={() => window.location.reload()}
              className="bg-emerald-500 hover:bg-emerald-600"
            >
              Try Again
            </Button>
          </div>
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
                Football Winning Predictions
              </h1>
              <p className="text-sm text-white/90 max-w-2xl mx-auto mb-6">
                Expert-driven football predictions and in-depth analysis for informed decisions.
              </p>
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ 
                  duration: 0.3,
                  repeat: Infinity,
                  repeatType: "reverse",
                  repeatDelay: 0.5
                }}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-emerald-600 to-emerald-400 shadow-lg shadow-emerald-500/30"
              >
                <Calendar className="h-5 w-5 text-white" />
                <span className="text-base font-bold text-white">
                  Games for Today: {format(new Date(), 'dd MMMM yyyy')}
                </span>
              </motion.div>
            </div>
          </motion.div>

          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="grid gap-4">
              {cards.map((card, index) => {
                const IconComponent = getIcon(card.icon);
                const href = card.id === 'free-analysis' || card.id === 'results' ? `/${card.id}` : `/paid/${card.id}`;

                return (
                  <motion.div
                    key={`card-${index}-${card.title}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <Link href={href} className="block">
                      <Card className="stats-card">
                        <div className="p-6">
                          <div className="flex items-start gap-4">
                            <div className="bg-emerald-500 p-3 rounded-lg">
                              <IconComponent className="h-6 w-6 text-white" />
                            </div>
                            <div className="flex-grow">
                              <div className="flex items-start justify-between mb-2">
                                <h2 className="text-lg font-semibold text-white">
                                  {card.title}
                                </h2>
                                {card.price && (
                                  <div className="text-right">
                                    <div className="text-base font-bold text-white">{card.price}</div>
                                    {card.period && (
                                      <div className="text-sm text-blue-400">{card.period}</div>
                                    )}
                                  </div>
                                )}
                              </div>
                              <p className="text-white/80 text-sm mb-3">{card.description}</p>
                              {card.features && (
                                <ul className="mb-4 grid grid-cols-2 gap-2">
                                  {card.features.map((feature, idx) => (
                                    <li key={`feature-${idx}`} className="feature-list-item text-sm">
                                      <FootballIcon />
                                      <span className="text-blue-300">{feature}</span>
                                    </li>
                                  ))}
                                </ul>
                              )}
                              <Button 
                                className="bg-emerald-500 hover:bg-emerald-600 text-white text-sm"
                              >
                                <span>{card.buttonText}</span>
                                <ArrowRight className="h-4 w-4 ml-2" />
                              </Button>
                            </div>
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
      </div>
    </div>
  );
}