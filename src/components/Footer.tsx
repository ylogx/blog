import Container from "./Container";

export function Footer() {
  return (
    <footer className="bg-neutral-50 border-t border-neutral-200 dark:bg-slate-800">
      <Container>
        <div className="py-10 flex flex-col items-center">
          <p className="text-center text-neutral-500 dark:text-neutral-400">
            © {new Date().getFullYear()} • All rights reserved
          </p>
        </div>
      </Container>
    </footer>
  );
}

export default Footer;
