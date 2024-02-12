import {Await, NavLink} from '@remix-run/react';
import {Suspense, useRef, useState, useEffect} from 'react';
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
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [activeItemId, setActiveItemId] = useState<string | null>(null);

  function handleItemMouseEnter(itemId: string) {
    setActiveItemId(itemId);
    const dropdown = dropdownRef.current;
    if (dropdown) {
      dropdown.classList.remove('hidden'); // Show the dropdown menu
    }
  }

  function handleItemMouseLeave() {
    setActiveItemId(null);
    const dropdown = dropdownRef.current;
    if (dropdown) {
      dropdown.classList.add('hidden'); // Hide the dropdown menu
    }
  }

  return (
    <nav className={className}>
      {(menu || FALLBACK_HEADER_MENU).items.map((item) => {
        if (!item.url) return null;

        const url =
          item.url.includes('myshopify.com') ||
          item.url.includes(publicStoreDomain) ||
          item.url.includes(primaryDomainUrl)
            ? new URL(item.url).pathname
            : item.url;

        return (
          <div
            key={item.id}
            className="relative"
            onMouseEnter={() => handleItemMouseEnter(item.id)}
            onMouseLeave={handleItemMouseLeave}
          >
            <NavLink
              end
              prefetch="intent"
              style={activeLinkStyle}
              to={url}
              className="block px-4 py-2"
            >
              {item.title}
            </NavLink>
            {item.items && activeItemId === item.id && (
              <div
                ref={dropdownRef}
                className={`absolute top-full left-0 mt-2 w-48 bg-white border border-text rounded-lg shadow-lg z-10 hidden`}
              >
                {item.items.map((subItem) => (
                  <NavLink
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    end
                    key={subItem.id}
                    prefetch="intent"
                    style={activeLinkStyle}
                    to={subItem.url}
                  >
                    {subItem.title}
                  </NavLink>
                ))}
              </div>
            )}
          </div>
        );
      })}
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

function CartBadge({count}: {count: number}) {
  return <a href="#cart-aside">Cart {count}</a>;
}

function CartToggle({cart}: Pick<HeaderProps, 'cart'>) {
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
