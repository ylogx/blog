import Container from "./Container";

export function Footer() {
  return (
    <footer className="bg-transparent border-t border-gray-200 dark:border-gray-800 mt-20">
      <Container>
        <div className="py-12 flex flex-col items-center space-y-4">
          <div className="h-px w-24 bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-600 to-transparent"></div>
          <p className="text-center text-gray-600 dark:text-gray-400 text-sm">
            © {new Date().getFullYear()} • All rights reserved
          </p>
          <p className="text-center text-gray-500 dark:text-gray-500 text-xs">
            Built with Astro
          </p>
        </div>
      </Container>
    </footer>
  );
}

export default Footer;
