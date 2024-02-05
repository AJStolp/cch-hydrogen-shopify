export default function Hero() {
  return (
    <section className="bg-sSecondary">
      <div className="container flex flex-col justify-center p-6 mx-auto sm:py-12 lg:py-24 lg:flex-row lg:justify-between">
        <div className="flex flex-col justify-center p-6 text-center rounded-sm lg:max-w-md xl:max-w-lg lg:text-left">
          <h1 className="text-3xl md:text-5xl font-bold">
            Find Your Perfect{' '}
            <span className="text-accent">Coffee Companion</span>
          </h1>
          <p className="mt-6 mb-8 text-lg sm:mb-12">
            Dive into our exclusive selection of coffee cups, each crafted to
            perfect your daily coffee ritual. Whether you're seeking
            sophistication or practical innovation, your next favorite coffee
            companion awaits.
          </p>
          <div className="flex flex-col space-y-4 sm:items-center sm:justify-center sm:flex-row sm:space-y-0 sm:space-x-4 lg:justify-start">
            <a
              rel="noopener noreferrer"
              href="#"
              className="px-8 py-3 text-lg font-semibold rounded bg-primary"
            >
              Shop
            </a>
            <a
              rel="noopener noreferrer"
              href="#"
              className="px-8 py-3 text-lg font-semibold rounded bg-accent text-white"
            >
              About
            </a>
          </div>
        </div>
        <div className="flex items-center justify-center p-6 mt-8 lg:mt-0 h-72 sm:h-80 lg:h-96 xl:h-112 2xl:h-128">
          <img
            src="/assets/cup-no-bg-2x-shrunk.png"
            alt=""
            className="object-contain h-72 sm:h-80 lg:h-96 xl:h-112 2xl:h-128"
          />
        </div>
      </div>
    </section>
  );
}
