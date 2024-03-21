import {defer, type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {
  Await,
  useLoaderData,
  Link,
  type MetaFunction,
  FetcherWithComponents,
} from '@remix-run/react';
import {Suspense} from 'react';
import {CartForm, Image, Money} from '@shopify/hydrogen';
import type {
  FeaturedCollectionFragment,
  RecommendedProductsQuery,
} from 'storefrontapi.generated';
import HeroSlanted from '~/components/hero-slanted';

export const meta: MetaFunction = () => {
  return [
    {title: 'Coffee Cup Hut home'},
    {
      name: 'description',
      content:
        'Welcome to Coffee Cup Hut – your go-to for 15 oz ceramic mugs & tumblers. Find stylish coffee accessories here. Start your journey today!',
    },
  ];
};

export async function loader({context}: LoaderFunctionArgs) {
  const {storefront} = context;
  const {collections} = await storefront.query(FEATURED_COLLECTION_QUERY);
  const featuredCollection = collections.nodes[0];
  const recommendedProducts = storefront.query(RECOMMENDED_PRODUCTS_QUERY);

  return defer({featuredCollection, recommendedProducts});
}

export default function Homepage() {
  const data = useLoaderData<typeof loader>();
  return (
    <div className="home">
      <HeroSlanted />
      {/* <Hero /> */}
      <FeaturedCollection collection={data.featuredCollection} />
      <RecommendedProducts products={data.recommendedProducts} />
    </div>
  );
}

function AddToCartButton({
  analytics,
  children,
  disabled,
  variantId, // Accept the variant ID as a prop
  onClick,
}: {
  analytics?: unknown;
  children: React.ReactNode;
  disabled?: boolean;
  variantId: string; // Variant ID prop
  onClick?: () => void;
}) {
  // Create the lines object with the correct structure
  const lines = [
    {
      merchandiseId: variantId, // Use the variant ID
      quantity: 1, // You can adjust the quantity as needed
    },
  ];

  return (
    <CartForm route="/cart" inputs={{lines}} action={CartForm.ACTIONS.LinesAdd}>
      {(fetcher: FetcherWithComponents<any>) => (
        <>
          <input
            name="analytics"
            type="hidden"
            value={JSON.stringify(analytics)}
          />
          <button
            type="submit"
            onClick={onClick}
            disabled={disabled ?? fetcher.state !== 'idle'}
            className="bg-primary rounded py-2 px-4 text-text"
          >
            {children}
          </button>
        </>
      )}
    </CartForm>
  );
}

function FeaturedCollection({
  collection,
}: {
  collection: FeaturedCollectionFragment;
}) {
  if (!collection) return null;
  const image = collection?.image;
  return (
    <section className="py-12">
      <div className="mx-auto rounded h-full flex flex-col lg:flex-row">
        {image && (
          <div className="featured-collection-image lg:w-full">
            <Link
              className="featured-collection lg:block lg:h-full"
              to={`/collections/${collection.handle}`}
              aria-label="Signature Sips Collections"
            >
              <svg
                className="text-background absolute right-0 hidden h-full transform translate-x-1/2 lg:!block"
                viewBox="0 0 100 100"
                fill="currentColor"
                preserveAspectRatio="none slice"
              >
                <path d="M0 0H50L100 100H50L0 0Z" />
              </svg>
              <Image
                className="object-cover w-full h-56 rounded h-full"
                data={image}
                sizes="100%"
                alt=""
                aria-hidden="true"
              />
            </Link>
          </div>
        )}
        <div className="relative flex flex-col items-start w-full max-w-xl md:px-0 lg:max-w-screen-xl lg:py-10">
          <div className="lg:mb-32 mt-4 lg:mt-12 md:max-w-[30rem] lg:pr-5 xl:max-w-[40rem]">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl sm:leading-none lg:text-4xl">
              Signature Sips: {collection.title}
            </h2>
            <p className="py-2">
              Our Signature Sips collection isn't just about cups; it's a
              playground of creativity, flavor, and charm waiting for you to
              explore. Whether you prefer a cup that whispers classic charm or
              one that screams bold personality, we've got the perfect match for
              your daily brew. So, grab your favorite mug and let's embark on a
              journey to find your new coffee companion!
            </p>
            <div className="flex items-center pt-4">
              <a
                href={`/collections/${collection.handle}`}
                className="inline-flex items-center justify-center h-12 px-6 mr-6 font-medium tracking-wide transition duration-200 rounded shadow-md bg-primary hover:bg-deep-purple-accent-700 focus:shadow-outline focus:outline-none"
              >
                Shop Signature Sips
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function RecommendedProducts({
  products,
}: {
  products: Promise<RecommendedProductsQuery>;
}) {
  return (
    <div className="recommended-products">
      <h2 className="text-2xl">Coffee Connoisseur's Picks</h2>
      <Suspense fallback={<div>Loading...</div>}>
        <Await resolve={products}>
          {({products}) => {
            // Filter products based on metafield value
            const filteredProducts = products.nodes.filter((product) => {
              return product.metafield?.value === 'cch';
            });

            if (filteredProducts.length === 0) {
              return <div>No recommended products found.</div>;
            }

            return (
              <div className="recommended-products-grid">
                {filteredProducts.map((product) => (
                  <section key={product.id}>
                    <Link
                      className="recommended-product rounded-lg"
                      to={`/products/${product.handle}`}
                    >
                      <Image
                        data={product.images.nodes[0]}
                        aspectRatio="1/1"
                        sizes="(min-width: 45em) 20vw, 50vw"
                        alt={`product name: ${product.title}`}
                      />
                    </Link>
                    <section className="bg-sAccent text-text rounded p-2 flex flex-col lg:flex-row lg:justify-between">
                      <div className="pb-2">
                        <h3 className="text">{product.title}</h3>
                        <small className="text-sm">
                          <Money data={product.priceRange.minVariantPrice} />
                        </small>
                      </div>
                      <AddToCartButton variantId={product.variants.nodes[0].id}>
                        Add to Cart
                      </AddToCartButton>
                    </section>
                  </section>
                ))}
              </div>
            );
          }}
        </Await>
      </Suspense>
      <br />
    </div>
  );
}

const FEATURED_COLLECTION_QUERY = `#graphql
  fragment FeaturedCollection on Collection {
    id
    title
    image {
      id
      url
      altText
      width
      height
    }
    handle
  }
  query FeaturedCollection($country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    collections(first: 1, sortKey: UPDATED_AT, reverse: true) {
      nodes {
        ...FeaturedCollection
      }
    }
  }
` as const;

const RECOMMENDED_PRODUCTS_QUERY = `#graphql
  fragment RecommendedProduct on Product {
    id
    title
    metafield(namespace: "ptosf", key: "storefront") {
      value
    }
    handle
    variants(first: 1) {
      nodes {
        id
      }
    }
    priceRange {
      minVariantPrice {
        amount
        currencyCode
      }
    }
    images(first: 1) {
      nodes {
        id
        url
        altText
        width
        height
      }
    }
  }
  query RecommendedProducts ($country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    products(first: 4, sortKey: UPDATED_AT) {
      nodes {
        ...RecommendedProduct
      }
    }
  }
` as const;
