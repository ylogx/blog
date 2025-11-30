export function Intro() {
  return (
    <section className="flex-col md:flex-row flex items-center md:justify-between mt-20 mb-20 md:mb-16 relative">
      <div className="relative z-10">
        <h1 className="text-6xl md:text-9xl font-extrabold tracking-tighter leading-none mb-4 gradient-text-fallback animate-gradient">
          Blog.
        </h1>
        <div className="h-1 w-24 bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400 rounded-full"></div>
      </div>
      <div className="text-center md:text-left mt-8 md:mt-0 md:pl-8 max-w-md">
        <h4 className="text-xl md:text-2xl font-light text-gray-700 dark:text-gray-300 leading-relaxed">
          A collection of thoughts, ideas and discoveries
        </h4>
        <p className="text-sm md:text-base text-gray-500 dark:text-gray-400 mt-3">
          Exploring technology, science, and life through writing
        </p>
      </div>
    </section>
  );
}
