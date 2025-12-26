export default function Footer() {
  return (
    <footer className="border-t border-gray-200 dark:border-gray-800 mt-12">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex flex-col items-center gap-4 text-center">
          <p className="text-gray-600 dark:text-gray-400">
            © {new Date().getFullYear()} My Personal Blog. All rights reserved.
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-500">
            Built with Next.js, TypeScript, and Tailwind CSS
          </p>
        </div>
      </div>
    </footer>
  );
}
