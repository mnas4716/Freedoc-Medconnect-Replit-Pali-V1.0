import { useState } from "react";
import { Link } from "wouter";
import { Stethoscope, Menu, X, User, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";

const navLinks = [
  { name: "Prescriptions", href: "/prescription" },
  { name: "Medical Certificates", href: "/medical-certificate" },
  { name: "Mental Health", href: "/mental-health" },
  { name: "Telehealth", href: "/telehealth" },
  { name: "Pathology", href: "/pathology" },
  { name: "How it Works", href: "/how-it-works" },
];

const authLinks = [
  { name: "Patient Login", href: "/api/login", description: "For patients to access their health records" },
  { name: "Doctor Login", href: "/doctor-login", description: "For doctors to view consultations" },
  { name: "Admin Login", href: "/admin-login", description: "For administrators" },
];

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isAuthenticated, user } = useAuth();
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <nav className="bg-white/95 backdrop-blur-sm shadow-sm sticky top-0 z-40 border-b border-slate-100">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="p-2 rounded-xl bg-gradient-to-br from-freedoc-blue to-blue-600 shadow-lg group-hover:shadow-xl transition-all duration-300">
              <Stethoscope className="h-8 w-8 text-white" />
            </div>
            <div>
              <span className="text-3xl font-bold bg-gradient-to-r from-freedoc-dark to-slate-700 bg-clip-text text-transparent leading-none">
                freedoc.
              </span>
              <p className="text-xs text-freedoc-secondary leading-none -mt-0.5">(formerly freedoctor.)</p>
            </div>
          </Link>
          
          <nav className="hidden lg:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-sm font-medium text-freedoc-dark hover:text-freedoc-blue transition-all duration-200 relative group"
              >
                {link.name}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-freedoc-blue transition-all duration-200 group-hover:w-full"></span>
              </Link>
            ))}
          </nav>

          <div className="hidden lg:flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <Link href={
                  user?.role === "doctor" ? "/doctor-dashboard" :
                  user?.role === "admin" ? "/admin-dashboard" :
                  "/dashboard"
                } className="text-sm font-medium text-freedoc-dark hover:text-freedoc-blue transition-colors">
                  <Button variant="outline" size="sm" className="flex items-center space-x-2">
                    <User className="h-4 w-4" />
                    <span>Dashboard</span>
                  </Button>
                </Link>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={async () => {
                    if (user?.role === "doctor" || user?.role === "admin") {
                      await fetch("/api/auth/session-logout", { method: "POST" });
                      window.location.href = "/";
                    } else {
                      window.location.href = "/api/logout";
                    }
                  }}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  Logout
                </Button>
              </>
            ) : (
              <div className="flex items-center space-x-2">
                <Button 
                  size="sm" 
                  onClick={() => window.location.href = "/api/login"}
                  className="bg-freedoc-blue hover:bg-freedoc-blue/90 text-white"
                >
                  Patient Login
                </Button>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => window.location.href = "/doctor-login"}
                  className="border-blue-500 text-blue-600 hover:bg-blue-50"
                >
                  Doctor
                </Button>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => window.location.href = "/admin-login"}
                  className="border-red-500 text-red-600 hover:bg-red-50"
                >
                  Admin
                </Button>
              </div>
            )}
          </div>

          <div className="lg:hidden">
            <Button
              variant="outline"
              size="icon"
              onClick={toggleMenu}
              className="border-slate-200 hover:bg-slate-50 bg-transparent"
            >
              <Menu className="w-5 h-5" />
              <span className="sr-only">Open menu</span>
            </Button>
          </div>
          
          {/* Mobile Sheet Menu */}
          {isMenuOpen && (
            <div className="fixed inset-0 z-50 lg:hidden">
              <div className="fixed inset-0 bg-black/20 backdrop-blur-sm" onClick={toggleMenu}></div>
              <div className="fixed right-0 top-0 h-full w-full sm:w-[300px] bg-white/95 backdrop-blur-sm shadow-xl">
                <div className="flex flex-col space-y-4 p-4">
                  <div className="flex items-center justify-between mb-6">
                    <Link href="/" className="flex items-center gap-3">
                      <div className="p-2 rounded-xl bg-gradient-to-br from-freedoc-blue to-blue-600 shadow-lg">
                        <Stethoscope className="h-8 w-8 text-white" />
                      </div>
                      <div>
                        <span className="text-3xl font-bold bg-gradient-to-r from-freedoc-dark to-slate-700 bg-clip-text text-transparent leading-none">
                          freedoc.
                        </span>
                        <p className="text-xs text-freedoc-secondary leading-none -mt-0.5">(formerly freedoctor.)</p>
                      </div>
                    </Link>
                    <Button variant="ghost" size="icon" onClick={toggleMenu}>
                      <X className="w-5 h-5" />
                    </Button>
                  </div>
                  {navLinks.map((link) => (
                    <Link
                      key={link.name}
                      href={link.href}
                      className="text-lg font-medium text-freedoc-dark hover:text-freedoc-blue transition-colors py-3 px-2 rounded-lg hover:bg-slate-50"
                      onClick={toggleMenu}
                    >
                      {link.name}
                    </Link>
                  ))}
                  
                  <div className="border-t border-slate-200 pt-4 mt-4">
                    {isAuthenticated ? (
                      <>
                        <Link 
                          href={
                            user?.role === "doctor" ? "/doctor-dashboard" :
                            user?.role === "admin" ? "/admin-dashboard" :
                            "/dashboard"
                          }
                          className="text-lg font-medium text-freedoc-dark hover:text-freedoc-blue transition-colors py-3 px-2 rounded-lg hover:bg-slate-50 flex items-center space-x-2"
                          onClick={toggleMenu}
                        >
                          <User className="h-5 w-5" />
                          <span>Dashboard</span>
                        </Link>
                        <button 
                          onClick={async () => {
                            toggleMenu();
                            if (user?.role === "doctor" || user?.role === "admin") {
                              await fetch("/api/auth/session-logout", { method: "POST" });
                              window.location.href = "/";
                            } else {
                              window.location.href = "/api/logout";
                            }
                          }}
                          className="w-full text-left text-lg font-medium text-red-600 hover:text-red-700 transition-colors py-3 px-2 rounded-lg hover:bg-red-50"
                        >
                          Logout
                        </button>
                      </>
                    ) : (
                      <div className="space-y-2">
                        {authLinks.map((link) => (
                          <button 
                            key={link.name}
                            onClick={() => {
                              toggleMenu();
                              if (link.href.startsWith('/api/')) {
                                window.location.href = link.href;
                              } else {
                                window.location.href = link.href;
                              }
                            }}
                            className="w-full text-left text-sm font-medium text-freedoc-dark hover:text-freedoc-blue transition-colors py-2 px-3 rounded-lg hover:bg-slate-50 flex flex-col"
                          >
                            <span className="font-semibold">{link.name}</span>
                            <span className="text-xs text-slate-500">{link.description}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}