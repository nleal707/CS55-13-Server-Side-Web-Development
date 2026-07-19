// Import the Head component from Next.js to manage the document's <head>
import Head from 'next/head';
// Import the Layout component and siteTitle variable for a consistent page structure and title
import Layout, { siteTitle } from '../components/layout';
// Import utility styles for common styling patterns
import utilStyles from '../styles/utils.module.css';
// Import the Link component from Next.js for client-side navigation
import Link from 'next/link';

// Define and export the Home component, which serves as the main page
export default function Home() {
  // The component returns JSX to be rendered to the screen
  return (
    <Layout home>
      <Head>
        <title>{siteTitle}</title>
      </Head>
      <section className={utilStyles.headingMd}>
        <p>Hello, I'm Nick. I'm a full stack web developer.</p>
        <p>
          Read <Link href="/posts/first-post">this page!</Link>
        </p>
      </section>
    </Layout>
  );
}