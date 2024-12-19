import '../styles/globals.css'


export default function MyApp({ Component, pageProps }: { Component: React.ComponentType<any>; pageProps: any }) {
  return (
    
      <Component {...pageProps} />
    
  )
}