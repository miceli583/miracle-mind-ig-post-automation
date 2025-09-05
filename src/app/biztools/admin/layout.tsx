import { ReactNode } from 'react';

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-black">
      <nav className="bg-black border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <h1 className="text-xl font-semibold text-white">
                  MiracleMind
                </h1>
              </div>
              <div className="hidden sm:ml-8 sm:flex sm:space-x-8">
                <a
                  href="/admin"
                  className="border-transparent text-gray-400 hover:text-yellow-400 hover:border-yellow-400 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-all duration-300"
                >
                  Dashboard
                </a>
                <a
                  href="/admin/daily-value-manager"
                  className="border-transparent text-gray-400 hover:text-yellow-400 hover:border-yellow-400 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-all duration-300"
                >
                  Daily Value Manager
                </a>
              </div>
            </div>
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto py-8 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
}