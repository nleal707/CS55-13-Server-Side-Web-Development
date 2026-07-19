// Import the Layout component for a consistent page structure
import Layout from '../../components/layout';
// Import functions to get all article IDs and the data for a specific article
import { getAllPostIds, getPostData } from '../../lib/articles-json';
// Import the Head component from Next.js to manage the document's <head>
import Head from 'next/head';
// Import utility styles from a CSS Module for component-scoped styling
import utilStyles from '../../styles/utils.module.css';
// Import the Link component from Next.js for client-side navigation
import Link from 'next/link';
// Import the Button component from the react-bootstrap library
import Button from 'react-bootstrap/Button';
// Import the Grid component from the react-bootstrap library
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';


// Export an async function to fetch data for a specific article at build time
export async function getStaticProps({ params }) {
  // Fetch the data for a single article using the ID from the route parameters
  const articleData = await getPostData(params.id);
    // Return the fetched data as props to the Article component
  return {
    props: {
      articleData,
    },
    revalidate: 60
  };
}

// Export an async function to define the list of paths to be statically generated
export async function getStaticPaths() {
  // Get the array of all possible article IDs
  const paths = await getAllPostIds();  
  // Return the paths and set fallback to false (shows a 404 for unknown paths)
  return {
    paths,
    fallback: false,
  };
}

// Define and export the Article component, which displays a single article
export default function Article({ articleData }) {
    // Return the JSX to be rendered for the page
    return (
      <Layout>
        <Head>
          <title>{articleData.title || 'Article'}</title>
        </Head>
        <article>
          <h1 className={utilStyles.headingXl}>{articleData.title || 'Article'}</h1>
          
            <section className="mb-4">
                {/* FEATURED IMAGE */}
                <Col className="col-12">
                    {/* Check if we have an image URL before trying to render it */}
                    {articleData.featured_image ? (
                        <img 
                        src={articleData.featured_image} 
                        /* Note: For alt text, we generally want plain text. 
                            If title has HTML, consider stripping it or using a fallback here */
                        alt={articleData.title || 'Article Image'} 
                        className="img-fluid rounded mb-4" 
                        />
                    ) : (
                        <div></div>
                    )}
                </Col>

                {/* FEATURED IMAGE DESCRIPTION */}
                <Col className="col-12">
                    <div>
                    <span dangerouslySetInnerHTML={{ __html: articleData.featured_image_description || '' }} />
                    </div>
                </Col>
            </section>
                            
            <section className="mb-4">
                {/* SECTION 1 TITLE */}
                <Col className="col-12">
                    <h2>
                    <span dangerouslySetInnerHTML={{ __html: articleData.section_1_title || '' }} />
                    
                    </h2>
                </Col>
    
                {/* SECTION 1 DESCRIPTION */}
                <Col className="col-12">
                    <div>
                    <span dangerouslySetInnerHTML={{ __html: articleData.section_1_description || '' }} />
                    </div>
                </Col>
            </section>

            <section className="mb-4">
                {/* SECTION 2 TITLE */}
                <Col className="col-12">
                    <h2>
                    <span dangerouslySetInnerHTML={{ __html: articleData.section_2_title || '' }} />
                    </h2>
                </Col>
                {/* SECTION 2 DESCRIPTION */}
                <Col className="col-12">
                    <div>
                    <span dangerouslySetInnerHTML={{ __html: articleData.section_2_description || '' }} />
                    </div>
                </Col>
            </section>

            <section className="mb-4">
                {/* SECTION 3 TITLE */}
                <Col className="col-12">
                    <h2>
                    <span dangerouslySetInnerHTML={{ __html: articleData.section_3_title || '' }} />
                    </h2>
                </Col>
                {/* SECTION 3 DESCRIPTION */}
                <Col className="col-12">
                    <div>
                    <span dangerouslySetInnerHTML={{ __html: articleData.section_3_description || '' }} />
                    </div>
                </Col>
            </section>

            <section className="mb-4">
                {/* SECTION 4 TITLE */}
                <Col className="col-12">
                    <h2>
                    <span dangerouslySetInnerHTML={{ __html: articleData.section_4_title || '' }} />
                    </h2>
                </Col>
                {/* SECTION 4 DESCRIPTION */}
                <Col className="col-12">
                    <div>
                    <span dangerouslySetInnerHTML={{ __html: articleData.section_4_description || '' }} />
                    </div>
                </Col>
            </section>

            <section className="mb-4">
                {/* SECTION 5 TITLE */}
                <Col className="col-12">
                <h2>
                    <span dangerouslySetInnerHTML={{ __html: articleData.section_5_title || '' }} />
                </h2>
                </Col>
            
                {/* SECTION 5 DESCRIPTION */}
                <Col className="col-12">
                    <div>
                    <span dangerouslySetInnerHTML={{ __html: articleData.section_5_description || '' }} />
                    </div>
                </Col>
            </section>

            <section className="mb-4">
                {/* SECONDARY IMAGE */}
                <Col className="col-12">
                    {articleData.secondary_image ? (
                    <img src={articleData.secondary_image} alt={articleData.secondary_image_description} className="img-fluid rounded mb-4" />
                    ) : (
                    <div></div>
                    )}
                </Col>
                {/* SECONDARY IMAGE DESCRIPTION */}
                <Col className="col-12">
                    <div>
                    <span dangerouslySetInnerHTML={{ __html: articleData.secondary_image_description || '' }} />
                    </div>
                </Col>
            </section>

        </article>
        <h2>
          <Button className={utilStyles.button}><Link className={utilStyles.buttonLink} href="/">Back to home</Link></Button>
        </h2>
      </Layout>
    );
  }