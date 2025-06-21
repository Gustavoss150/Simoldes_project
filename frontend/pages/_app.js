import 'primereact/resources/themes/lara-light-green/theme.css';
import 'primereact/resources/primereact.min.css';
import { NotificationProvider } from '../components/NotificationProvider'
import 'primeicons/primeicons.css';
import '../styles/globals.css';  // Importando estilos globais
import '../styles/index.css';    // Importando estilos principais
import '../styles/sidebar.css';
import '../styles/logout.css';

import { useRouter } from 'next/router';

function MyApp({ Component, pageProps }) {
  return (
    <NotificationProvider>
      <Component {...pageProps} />
    </NotificationProvider>
  );
}

export default MyApp;