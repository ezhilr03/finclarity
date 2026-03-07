import { Link } from "react-router-dom";
import { TrendingUp } from "lucide-react";
import { NAV_LINKS } from "@/constants";

export function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400 pt-12 pb-6 mt-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-fin-blue to-fin-green flex items-center justify-center">
                <TrendingUp className="w-4 h-4 text-white" />
              </div>
              <span className="text-lg font-extrabold text-white">FinClarity</span>
            </div>
            <p className="text-sm leading-relaxed text-slate-500">
              Financial decision-support platform for salaried professionals in India. Free, instant, and education-focused.
            </p>
          </div>

          {/* Links */}
          <div>
            <p className="text-white font-semibold text-sm mb-3 uppercase tracking-wider">Tools</p>
            <div className="grid grid-cols-2 gap-1.5">
              {NAV_LINKS.slice(1).map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className="text-sm text-slate-500 hover:text-slate-300 transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Disclaimer */}
          <div>
            <p className="text-white font-semibold text-sm mb-3 uppercase tracking-wider">Disclaimer</p>
            <p className="text-xs leading-relaxed text-slate-500">
              All content on FinClarity is for <strong className="text-slate-400">educational and informational purposes only</strong>. It does not constitute financial advice. Please consult a SEBI-registered financial advisor before making investment or financial decisions.
            </p>
          </div>
        </div>

        <div className="border-t border-slate-800 pt-5 flex flex-col sm:flex-row justify-between gap-2">
          <p className="text-xs">© {new Date().getFullYear()} FinClarity. All rights reserved.</p>
          <p className="text-xs">Made with ❤️ in India 🇮🇳 · Not SEBI-registered</p>
        </div>
      </div>
    </footer>
  );
}
