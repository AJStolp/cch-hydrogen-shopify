import {Await, NavLink} from '@remix-run/react';
import {Suspense, useState} from 'react';
import type {HeaderQuery} from 'storefrontapi.generated';
import type {LayoutProps} from './Layout';
import {useRootLoaderData} from '~/root';

type HeaderProps = Pick<LayoutProps, 'header' | 'cart' | 'isLoggedIn'>;

type Viewport = 'desktop' | 'mobile';

export function Header({header, isLoggedIn, cart}: HeaderProps) {
  const {shop, menu} = header;
  return (
    <header className="header bg-background">
      <NavLink prefetch="intent" to="/" style={activeLinkStyle} end>
        <strong>{shop.name}</strong>
      </NavLink>
      <HeaderMenu
        menu={menu}
        viewport="desktop"
        primaryDomainUrl={header.shop.primaryDomain.url}
      />
      <HeaderCtas isLoggedIn={isLoggedIn} cart={cart} />
    </header>
  );
}

export function HeaderMenu({
  menu,
  primaryDomainUrl,
  viewport,
}: {
  menu: HeaderProps['header']['menu'];
  primaryDomainUrl: HeaderQuery['shop']['primaryDomain']['url'];
  viewport: Viewport;
}) {
  const {publicStoreDomain} = useRootLoaderData();
  const className = `header-menu-${viewport}`;

  const [activeDropDownId, setActiveDropDownId] = useState<string | null>(null);
  const [activeSubDropDownId, setActiveSubDropDownId] = useState<string | null>(
    null,
  );

  const toggleDropdown =
    (itemId: string) =>
    (
      event:
        | React.MouseEvent<HTMLAnchorElement>
        | React.TouchEvent<HTMLAnchorElement>,
    ) => {
      event.preventDefault();
      setActiveDropDownId((prevId) => (prevId === itemId ? null : itemId));
    };

  const toggleSubDropdown =
    (subItemId: string) =>
    (
      event:
        | React.MouseEvent<HTMLAnchorElement>
        | React.TouchEvent<HTMLAnchorElement>,
    ) => {
      event.preventDefault();
      setActiveSubDropDownId((prevId) =>
        prevId === subItemId ? null : subItemId,
      );
    };

  const MenuItem = ({item}: {item: any}) => {
    if (!item.url) return null;

    const url =
      item.url.includes('myshopify.com') ||
      item.url.includes(publicStoreDomain) ||
      item.url.includes(primaryDomainUrl)
        ? new URL(item.url).pathname
        : item.url;

    return (
      <>
        <NavLink
          end
          prefetch="intent"
          to={url}
          onClick={
            item.items && item.items.length
              ? toggleDropdown(item.id)
              : undefined
          }
          className={
            item.items && item.items.length ? 'flex flex-row items-center' : ''
          }
          key={item.id}
        >
          {item.title}
          {item.items && item.items.length ? (
            <span>
              <svg
                className="h-5 w-5"
                viewBox="0 0 320 512"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M310.6 246.6l-127.1 128C176.4 380.9 168.2 384 160 384s-16.38-3.125-22.63-9.375l-127.1-128C.2244 237.5-2.516 223.7 2.438 211.8S19.07 192 32 192h255.1c12.94 0 24.62 7.781 29.58 19.75S319.8 237.5 310.6 246.6z" />
              </svg>
            </span>
          ) : null}
        </NavLink>
        {item.items && (
          <div
            className={`${
              activeDropDownId === item.id
                ? 'flex flex-col w-fit md:absolute border-text border-2 text-text bg-sAccent rounded py-2 px-4 top-[42px]'
                : 'hidden'
            }`}
          >
            {item.items.map((subItem: any) => (
              <div key={subItem.id} className="menu-subitem">
                <NavLink
                  end
                  prefetch="intent"
                  to={subItem.url ? new URL(subItem.url).pathname : '#'}
                  onClick={
                    subItem.items && subItem.items.length
                      ? toggleSubDropdown(subItem.id)
                      : undefined
                  }
                  className={
                    subItem.items && subItem.items.length
                      ? 'flex flex-row items-center'
                      : ''
                  }
                >
                  {subItem.title}
                  {subItem.items && subItem.items.length ? (
                    <span>
                      <svg
                        className="h-5 w-5"
                        viewBox="0 0 320 512"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M310.6 246.6l-127.1 128C176.4 380.9 168.2 384 160 384s-16.38-3.125-22.63-9.375l-127.1-128C.2244 237.5-2.516 223.7 2.438 211.8S19.07 192 32 192h255.1c12.94 0 24.62 7.781 29.58 19.75S319.8 237.5 310.6 246.6z" />
                      </svg>
                    </span>
                  ) : null}
                </NavLink>
                {subItem.items && activeSubDropDownId === subItem.id && (
                  <ul>
                    {subItem.items.map((nestedItem: any) => (
                      <li className="mb-0 ml-4">
                        <MenuItem key={nestedItem.id} item={nestedItem} />
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        )}
      </>
    );
  };

  return (
    <nav className={className} role="navigation">
      {(menu || FALLBACK_HEADER_MENU).items.map((item) => (
        <MenuItem key={item.id} item={item} />
      ))}
    </nav>
  );
}

function HeaderCtas({
  isLoggedIn,
  cart,
}: Pick<HeaderProps, 'isLoggedIn' | 'cart'>) {
  return (
    <nav className="header-ctas" role="navigation">
      <HeaderMenuMobileToggle />
      <NavLink prefetch="intent" to="/account" style={activeLinkStyle}>
        {isLoggedIn ? 'Account' : 'Sign in'}
      </NavLink>
      <SearchToggle />
      <CartToggle cart={cart} />
    </nav>
  );
}

function HeaderMenuMobileToggle() {
  return (
    <a className="header-menu-mobile-toggle" href="#mobile-menu-aside">
      <h3>☰</h3>
    </a>
  );
}

function SearchToggle() {
  return <a href="#search-aside">Search</a>;
}

function CartBadge({count}: Readonly<{count: number}>) {
  return <a href="#cart-aside">Cart {count}</a>;
}

function CartToggle({cart}: Readonly<Pick<HeaderProps, 'cart'>>) {
  return (
    <Suspense fallback={<CartBadge count={0} />}>
      <Await resolve={cart}>
        {(cart) => {
          if (!cart) return <CartBadge count={0} />;
          return <CartBadge count={cart.totalQuantity || 0} />;
        }}
      </Await>
    </Suspense>
  );
}

const FALLBACK_HEADER_MENU = {
  id: 'gid://shopify/Menu/199655587896',
  items: [
    {
      id: 'gid://shopify/MenuItem/461609500728',
      resourceId: null,
      tags: [],
      title: 'Collections',
      type: 'HTTP',
      url: '/collections',
      items: [],
    },
    {
      id: 'gid://shopify/MenuItem/461609533496',
      resourceId: null,
      tags: [],
      title: 'Blog',
      type: 'HTTP',
      url: '/blogs/journal',
      items: [],
    },
    {
      id: 'gid://shopify/MenuItem/461609566264',
      resourceId: null,
      tags: [],
      title: 'Policies',
      type: 'HTTP',
      url: '/policies',
      items: [],
    },
    {
      id: 'gid://shopify/MenuItem/461609599032',
      resourceId: 'gid://shopify/Page/92591030328',
      tags: [],
      title: 'About',
      type: 'PAGE',
      url: '/pages/about',
      items: [],
    },
  ],
};

function activeLinkStyle({
  isActive,
  isPending,
}: {
  isActive: boolean;
  isPending: boolean;
}) {
  return {
    fontWeight: isActive ? 'bold' : undefined,
    color: isPending ? 'grey' : 'black',
  };
}
