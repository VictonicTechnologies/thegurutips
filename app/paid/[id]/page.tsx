import { getCards } from '@/lib/api';
import type { CardData } from '@/lib/api';
import { ClientProvider } from '@/app/ClientProvider';
import PaidPredictionsClient from './PaidPredictionsClient';
import { notFound } from 'next/navigation';

export async function generateStaticParams() {
  const cards = await getCards();
  return cards
    .filter((card: CardData) => card.id !== 'free-predictions' && card.id !== 'results')
    .map((card: CardData) => ({
      id: card.id,
    }));
}

export async function getInitialData(id: string) {
  const cards = await getCards();
  const cardDetails = cards.find((card: CardData) => card.id === id);
  return cardDetails || null;
}

export default async function PaidPredictions({ params }: { params: { id: string } }) {
  const packageDetails = await getInitialData(params.id);
  
  if (!packageDetails) {
    notFound();
  }

  return (
    <ClientProvider>
      <PaidPredictionsClient id={params.id} initialPackageDetails={packageDetails} />
    </ClientProvider>
  );
}