import '../styles/globals.css';  // Importando estilos globais
import '../styles/index.css';    // Importando estilos principais
import '../styles/Users.module.css'

import { useRouter } from 'next/router';

function MyApp({ Component, pageProps }) {
  const router = useRouter();
  
  return (
    <Component {...pageProps} />
  );
}

export default MyApp;