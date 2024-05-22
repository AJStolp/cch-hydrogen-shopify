import {json, type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {useLoaderData, type MetaFunction} from '@remix-run/react';

export const meta: MetaFunction<typeof loader> = ({data}) => {
  let title;
  let description;

  switch (data?.page.title) {
    case 'Contact Us':
      title = `Coffee Cup Hut | ${data?.page.title ?? ''}`;
      description =
        'Connect with Coffee Cup Hut today! Have questions about our 15 oz ceramic mugs or tumblers? Our team is here to help. Visit now!';
      break;
    case 'A Journey of Caffeinated Creativity':
      title = `Coffee Cup Hut | ${data?.page.title ?? ''}`;
      description =
        "Discover Coffee Cup Hut's story, your destination for 15 oz ceramic mugs & tumblers. Learn about our passion for quality & style. Visit now!";
      break;
    case 'Coffee Cup Hut Return Policy':
      title = `Coffee Cup Hut | ${data?.page.title ?? ''}`;
      description =
        "Discover Coffee Cup Hut's hassle-free return policy for our 15 oz ceramic mugs & tumblers. Shop with confidence knowing we've got you covered.";
      break;
  }

  return [{title}, {name: 'description', content: description}];
};

export async function loader({params, context}: LoaderFunctionArgs) {
  if (!params.handle) {
    throw new Error('Missing page handle');
  }

  const {page} = await context.storefront.query(PAGE_QUERY, {
    variables: {
      handle: params.handle,
    },
  });

  if (!page) {
    throw new Response('Not Found', {status: 404});
  }

  return json({page});
}

export default function Page() {
  const {page} = useLoaderData<typeof loader>();

  return (
    <div className="page">
      <header>
        <h1 className="text-2xl">{page.title}</h1>
      </header>
      <section
        className="cms-page"
        dangerouslySetInnerHTML={{__html: page.body}}
      />
    </div>
  );
}

const PAGE_QUERY = `#graphql
  query Page(
    $language: LanguageCode,
    $country: CountryCode,
    $handle: String!
  )
  @inContext(language: $language, country: $country) {
    page(handle: $handle) {
      id
      title
      body
      seo {
        description
        title
      }
    }
  }
`;
