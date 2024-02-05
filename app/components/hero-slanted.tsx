export default function HeroSlanted() {
  return (
    <div className="relative flex flex-col py-16 lg:flex-col lg:pb-0 lg:mt-12">
      <div className="inset-y-0 top-0 right-0 z-0 w-full max-w-xl px-4 mx-auto md:px-0 lg:pr-0 lg:mb-0 lg:mx-0 lg:w-6/12 lg:max-w-full lg:absolute xl:px-0">
        {/* <svg
          className="text-background absolute left-0 hidden h-full transform -translate-x-1/2 lg:block"
          viewBox="0 0 100 100"
          fill="currentColor"
          preserveAspectRatio="none slice"
        >
          <path d="M50 0H100L50 100H0L50 0Z" />
        </svg> */}
        <img
          className="object-cover w-full h-56 rounded shadow-lg lg:rounded-none lg:shadow-none md:h-96 lg:h-full"
          src={'/assets/cup-no-bg-2x-shrunk.png'}
          alt={''}
        />
      </div>
      <div className="relative flex flex-col items-start w-full max-w-xl px-4 mx-auto md:px-0 lg:px-8 lg:max-w-screen-xl">
        <div className="mb-16 lg:my-40 lg:max-w-lg lg:pr-5">
          <h1 className="mb-5 text-3xl font-bold tracking-tight sm:text-4xl sm:leading-none">
            Find Your Perfect{' '}
            <span className="text-accent">Coffee Companion</span>
          </h1>
          <p>
            {' '}
            Dive into our exclusive selection of coffee cups, each crafted to
            perfect your daily coffee ritual. Whether you're seeking
            sophistication or practical innovation, your next favorite coffee
            companion awaits.
          </p>
          <div className="flex items-center">
            <a
              href="/"
              className="inline-flex items-center justify-center h-12 px-6 mr-6 font-medium tracking-wide transition duration-200 rounded shadow-md bg-primary hover:bg-deep-purple-accent-700 focus:shadow-outline focus:outline-none"
            >
              Get started
            </a>
            <a
              href="/"
              aria-label=""
              className="inline-flex items-center justify-center h-12 px-6 mr-6 font-medium tracking-wide transition duration-200 rounded shadow-md bg-primary hover:bg-deep-purple-accent-700 focus:shadow-outline focus:outline-none bg-secondary"
            >
              Learn more
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
