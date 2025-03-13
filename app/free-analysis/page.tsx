import { ClientProvider } from '../ClientProvider';
import FreePredictionsPage from './FreePredictionsPage';

export default function Page() {
  return (
    <ClientProvider>
      <FreePredictionsPage />
    </ClientProvider>
  );
}