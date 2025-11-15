// Simple footer component
export default function Footer() {
  return (
    <footer className="mt-16 border-t border-zinc-200 dark:border-zinc-800 py-8 text-sm text-zinc-500">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <p>© {new Date().getFullYear()} Nova. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">
              About
            </a>
            <a href="#" className="hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">
              Help
            </a>
            <a href="#" className="hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">
              Terms
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}


