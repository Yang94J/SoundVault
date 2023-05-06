import Head from 'next/head';

import Navbar from './ui/Navbar/Navbar';
import Footer from './ui/Footer/Footer';

export default function Layout({children}) {
  
    
    const meta = {
        title: 'MusicVault',
        description: 'Unleash your creativity and connect with the world of music through musicVault',
    };

    return (
        <>
        <Head>
            <title>{meta.title}</title>
            <link rel="icon" href="favicon.ico" />
            <meta content={meta.description} name="description" />
            <meta name="viewport" content="width=device-width, initial-scale=1" />
        </Head>
        <Navbar />
        <main id="skip">{children}</main>
        <Footer />
        </>
    );
}