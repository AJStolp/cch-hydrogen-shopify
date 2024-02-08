export default function HeroSlanted() {
  return (
    <div className="relative flex flex-col lg:flex-col lg:pb-0 lg:mt-12">
      <div className="bg-sSecondary mx-auto rounded top-0 right-0 z-0 w-full lg:pr-0 lg:mb-0 lg:mx-0 lg:w-6/12 lg:max-w-full lg:absolute h-full">
        <svg
          className="text-background absolute left-0 hidden h-full transform -translate-x-1/2 lg:block"
          viewBox="0 0 100 100"
          fill="currentColor"
          preserveAspectRatio="none slice"
        >
          <path d="M50 0H100L50 100H0L50 0Z" />
        </svg>
        <img
          className="object-cover w-full h-56 rounded h-full"
          src={'/assets/tiki-hero-cch.webp'}
          alt={''}
        />
      </div>
      <div className="relative flex flex-col items-start w-full max-w-xl md:px-0 lg:max-w-screen-xl lg:py-10">
        <div className="lg:mb-32 mt-6 lg:mt-12 md:max-w-[30rem] lg:pr-5 xl:max-w-[40rem]">
          <h1 className="mb-5 text-3xl font-bold tracking-tight sm:text-4xl sm:leading-none lg:text-6xl">
            Find Your Perfect Coffee Companion
          </h1>
          <p>
            Dive into our exclusive selection of coffee cups, each crafted to
            perfect your daily coffee ritual. Whether you're seeking
            sophistication or practical innovation, your next favorite coffee
            companion awaits.
          </p>
          <div className="flex items-center pt-4">
            <a
              href="/collections"
              className="inline-flex items-center justify-center h-12 px-6 mr-6 font-medium tracking-wide transition duration-200 rounded shadow-md bg-primary hover:bg-deep-purple-accent-700 focus:shadow-outline focus:outline-none"
            >
              Shop
            </a>
            <a
              href="/pages/about"
              aria-label=""
              className="inline-flex items-center justify-center h-12 px-6 mr-6 font-medium tracking-wide transition duration-200 rounded shadow-md bg-primary hover:bg-deep-purple-accent-700 focus:shadow-outline focus:outline-none bg-secondary"
            >
              About Us
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
