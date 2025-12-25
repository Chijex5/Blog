export default function About() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-8">
        About Me
      </h1>
      
      <div className="prose prose-lg dark:prose-invert max-w-none">
        <p className="text-lg text-gray-700 dark:text-gray-300 mb-6">
          Welcome to my personal blog! This is where I share my thoughts, experiences, 
          and learnings about web development, technology, and software engineering.
        </p>
        
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">
          About This Blog
        </h2>
        <p className="text-gray-700 dark:text-gray-300 mb-6">
          This blog is built with modern web technologies:
        </p>
        <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 mb-6 space-y-2">
          <li><strong>Next.js 14</strong> - The React framework for production</li>
          <li><strong>TypeScript</strong> - For type-safe code</li>
          <li><strong>Tailwind CSS</strong> - For beautiful, responsive designs</li>
        </ul>
        
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">
          What I Write About
        </h2>
        <p className="text-gray-700 dark:text-gray-300 mb-6">
          I focus on topics related to:
        </p>
        <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 mb-6 space-y-2">
          <li>Web Development (React, Next.js, TypeScript)</li>
          <li>Frontend Technologies and Best Practices</li>
          <li>Software Engineering Principles</li>
          <li>Personal Projects and Learnings</li>
        </ul>
        
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">
          Get In Touch
        </h2>
        <p className="text-gray-700 dark:text-gray-300 mb-6">
          Feel free to reach out if you want to discuss any topics, collaborate on projects, 
          or just say hello!
        </p>
        
        <div className="mt-8 p-6 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <p className="text-gray-700 dark:text-gray-300">
            This is a personal blog where only I post content. All posts are written by me 
            and reflect my personal opinions and experiences.
          </p>
        </div>
      </div>
    </div>
  );
}
