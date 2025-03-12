import { ClientProvider } from './ClientProvider';
import HomePage from './HomePage';

export default function Page() {
  return (
    <ClientProvider>
      <HomePage />
    </ClientProvider>
  );
}