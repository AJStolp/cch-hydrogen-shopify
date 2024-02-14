import {useLoaderData, Link} from '@remix-run/react';
import {
  json,
  MetaFunction,
  type LoaderFunctionArgs,
} from '@shopify/remix-oxygen';
import {Pagination, getPaginationVariables, Image} from '@shopify/hydrogen';
import type {CollectionFragment} from 'storefrontapi.generated';

export const meta: MetaFunction<typeof loader> = ({data}) => {
  return [
    {title: `Coffee Cup Hut | All Products`},
    {
      name: 'description',
      content:
        'Explore our exclusive collection of 15oz ceramic coffee mugs, available in sleek black and classic white. Perfect for coffee enthusiasts seeking style and quality. Shop now!',
    },
  ];
};

export async function loader({context, request}: LoaderFunctionArgs) {
  const paginationVariables = getPaginationVariables(request, {
    pageBy: 4,
  });

  const {collections} = await context.storefront.query(COLLECTIONS_QUERY, {
    variables: paginationVariables,
  });

  return json({collections});
}

export default function Collections() {
  const {collections} = useLoaderData<typeof loader>();

  return (
    <div className="collections">
      <h1 className="text-2xl">Cafe Collections</h1>
      <Pagination connection={collections}>
        {({nodes, isLoading, PreviousLink, NextLink}) => (
          <div>
            <PreviousLink>
              {isLoading ? 'Loading...' : <span>↑ Load previous</span>}
            </PreviousLink>
            <CollectionsGrid collections={nodes} />
            <NextLink>
              {isLoading ? 'Loading...' : <span>Load more ↓</span>}
            </NextLink>
          </div>
        )}
      </Pagination>
    </div>
  );
}

function CollectionsGrid({collections}: {collections: CollectionFragment[]}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {collections.map((collection, index) => (
        <CollectionItem
          key={collection.id}
          collection={collection}
          index={index}
        />
      ))}
    </div>
  );
}

function CollectionItem({
  collection,
  index,
}: {
  collection: CollectionFragment;
  index: number;
}) {
  return (
    <Link
      className="collection-item"
      key={collection.id}
      to={`/collections/${collection.handle}`}
      prefetch="intent"
    >
      {collection?.image && (
        <Image
          alt={collection.image.altText || collection.title}
          // aspectRatio="1/1"
          data={collection.image}
          loading={index < 3 ? 'eager' : undefined}
          className="max-w-full"
        />
      )}
      <h2>{collection.title}</h2>
    </Link>
  );
}

const COLLECTIONS_QUERY = `#graphql
  fragment Collection on Collection {
    id
    title
    handle
    image {
      id
      url
      altText
      width
      height
    }
  }
  query StoreCollections(
    $country: CountryCode
    $endCursor: String
    $first: Int
    $language: LanguageCode
    $last: Int
    $startCursor: String
  ) @inContext(country: $country, language: $language) {
    collections(
      first: $first,
      last: $last,
      before: $startCursor,
      after: $endCursor
    ) {
      nodes {
        ...Collection
      }
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
    }
  }
` as const;
