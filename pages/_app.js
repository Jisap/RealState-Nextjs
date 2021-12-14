import { ChakraProvider } from '@chakra-ui/react'
import Router from 'next/router'
import Head from 'next/head'
import NProgress from 'nprogress'
import Layout from '../components/Layout'
import '../styles/globals.css'

function MyApp({ Component, pageProps }) {

  NProgress.configure({ showSpinner: false });  // Establecemos el estado inicial del spinner como falso, no se muestra.

  Router.events.on('routeChangeStart', () => {  // Cuando el router detecta cambios en las páginas cargadas spinner = start
    NProgress.start();
  });

   Router.events.on('routeChangeComplete', () => {  //  Cuando se termina la carga de las páginas spinner = done (false)
    NProgress.done();
  });

  return (
    <>
      <Head>
        <link rel='stylesheet' href='https://cdnjs.cloudflare.com/ajax/libs/nprogress/0.2.0/nprogress.min.css' integrity='sha512-42kB9yDlYiCEfx2xVwq0q7hT4uf26FUgSIZBK8uiaEnTdShXjwr8Ip1V4xGJMg3mHkUt9nNuTDxunHF0/EgxLQ==' crossOrigin='anonymous' referrerPolicy='no-referrer' />
      </Head>
      <ChakraProvider>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </ChakraProvider>
    </>
  )
}

export default MyApp
