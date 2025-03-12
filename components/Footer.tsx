"use client";

import { footerData } from '@/lib/footer-data';

export function Footer() {
  return (
    <footer className="bg-gray-900 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {footerData.sections.map((section) => (
            <div key={section.title} className="space-y-4">
              <h3 className="text-lg font-semibold text-white">{section.title}</h3>
              {section.description ? (
                <p className="text-gray-400 text-sm">{section.description}</p>
              ) : (
                <ul className="space-y-2 text-sm">
                  {section.links?.map((link) => (
                    <li key={link.text}>
                      {"href" in link ? ( // ✅ Check if 'href' exists
                        <a
                          href={link.href}
                          className="text-gray-400 hover:text-white transition-colors"
                        >
                          {link.text}
                        </a>
                      ) : (
                        <span className="text-gray-400">{link.text}</span>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>

        <div className="mt-12 pt-8 border-t border-gray-800">
          <p className="text-center text-gray-400 text-sm">
            {footerData.copyright}
          </p>
        </div>
      </div>
    </footer>
  );
}
