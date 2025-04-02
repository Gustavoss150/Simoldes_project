import Head from 'next/head'
import Link from 'next/link'
import { useEffect, useState } from 'react'

export default function Home() {
  const [apiData, setApiData] = useState(null)

  useEffect(() => {
    fetch('http://localhost:9000/api')
      .then((response) => response.json())
      .then((data) => setApiData(data))
      .catch((error) => console.error('Erro ao buscar dados da API:', error))
  }, [])

  return (
    <>
      <Head>
        <meta charSet="UTF-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Simoldes PCP</title>
      </Head>

      <div className="authDesign">
        <div className="left">
          <h1>Simoldes PCP</h1>
          <p>Bem-vindo ao sistema de PCP da Simoldes Aços.</p>
        </div>
        <div className="right">
          {apiData && apiData.message !== "API working" ? (
            <div className="api-data">
              <pre>{JSON.stringify(apiData, null, 2)}</pre>
            </div>
          ) : (
            <p>Acesse</p>
          )}
          <div className="buttons">
            <Link href="/login">
              <button className="btn">Login</button>
            </Link>
            <Link href="/register">
              <button className="btn">Cadastrar</button>
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}
