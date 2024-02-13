import {json, type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {useLoaderData, type MetaFunction} from '@remix-run/react';

export const meta: MetaFunction<typeof loader> = ({data}) => {
  let title;
  let description;

  switch (data?.page.title) {
    case 'Contact Us':
      title = `Coffee Cup Hut | ${data?.page.title ?? ''}`;
      description =
        'Get in touch with Coffee Cup Hut today! Whether you have questions about our 15 oz ceramic coffee mugs, tumblers, or any inquiries, our team is here to assist you. Visit our Contact page for all the ways to connect with us.';
      break;
    case 'Welcome to The Coffee Cup Hut: A Journey of Caffeinated Creativity':
      title = `Coffee Cup Hut | ${data?.page.title ?? ''}`;
      description =
        'Discover the story behind Coffee Cup Hut, your go-to destination for premium 15 oz ceramic coffee mugs and unique tumblers. Learn about our passion for high-quality, stylish coffee accessories and our commitment to coffee lovers everywhere. Visit our About page to know more!';
      break;
    case 'Coffee Cup Hut Return Policy':
      title = `Coffee Cup Hut | ${data?.page.title ?? ''}`;
      description =
        "Read Coffee Cup Hut’s Return Policy to understand how we ensure your satisfaction with every purchase. Learn about our hassle-free returns process for our 15 oz ceramic coffee mugs and tumblers. Shop with confidence knowing we've got you covered.";
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
` as const;
