import { ClientProvider } from '../ClientProvider';
import ResultsPage from './ResultsPage';

export default function Page() {
  return (
    <ClientProvider>
      <ResultsPage />
    </ClientProvider>
  );
}