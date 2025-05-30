import axios from 'axios';

const BASE_URL = 'https://victonictechnologies.github.io/thegurutips.com/';

// Create axios instance with cache busting
export const api = axios.create({
  baseURL: BASE_URL,
  params: {
    _: Date.now() // Add timestamp to prevent caching
  }
});

export const getCards = async () => {
  const response = await api.get('/cards.json');
  return response.data;
};

export const getBasicPredictions = async () => {
  const response = await api.get('/basic-predictions.json');
  return response.data;
};

export const getPremiumPredictions = async () => {
  const response = await api.get('/premium-predictions.json');
  return response.data;
};

export const getFreePredictions = async () => {
  const response = await api.get('/free-predictions.json');
  return response.data;
};

export const getResults = async () => {
  const response = await api.get('/results.json');
  return response.data;
};

export interface Bookmaker {
  name: string;
  logo: string;
  link: string;
}

export interface Prediction {
  id: number;
  homeTeam: string;
  awayTeam: string;
  date: string;
  time: string;
  insight: string;
  odds: string;
  confidence: string;
  analysis?: string;
  bookmaker: Bookmaker;
}

export interface CardData {
  id: string;
  title: string;
  price?: string;
  period?: string;
  description: string;
  features?: string[];
  icon: string;
  color: string;
  buttonText: string;
}

export interface ResultMatch {
  id: number;
  homeTeam: string;
  awayTeam: string;
  insight: string;
  result: 'success' | 'failure';
  score: string;
  analysis: string;
}

export interface ResultDay {
  date: string;
  matches: ResultMatch[];
}
