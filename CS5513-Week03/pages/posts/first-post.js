// Import the Head component from Next.js to manage the document's <head>
import Head from 'next/head';
// Import the Link component from Next.js for client-side navigation
import Link from 'next/link';
// Import styles from the layout CSS module for component-specific styling
import styles from '../../components/layout.module.css';
// Import utility styles for common styling patterns
import utilStyles from '../../styles/utils.module.css';
// Import the Button component from the react-bootstrap library
import Button from 'react-bootstrap/Button';

// Define and export the FirstPost component, which renders the first blog post page
export default function FirstPost() {
  // The component returns JSX to be rendered to the screen
  return (
    <div className={styles.container}>
      <Head>
        <title>First Post</title>
      </Head>
      <h1>First Post</h1>
      <section className={utilStyles.headingMd}>
      <p>This is my first post.</p>
      </section>
      <h2>
        <Button variant="outline-primary"><Link href="/">← Back to home</Link></Button>
      </h2>
    </div>
  );
}