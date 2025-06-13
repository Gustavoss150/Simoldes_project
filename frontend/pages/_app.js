import 'primereact/resources/themes/lara-light-green/theme.css'; // ou outra theme
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import '../styles/globals.css';  // Importando estilos globais
import '../styles/index.css';    // Importando estilos principais
import '../styles/sidebar.css';
import '../styles/logout.css';

import { useRouter } from 'next/router';

function MyApp({ Component, pageProps }) {
  const router = useRouter();
  
  return (
    <Component {...pageProps} />
  );
}

export default MyApp;