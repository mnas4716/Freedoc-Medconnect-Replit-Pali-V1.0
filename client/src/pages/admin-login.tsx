import { useState } from "react";
import { useLocation } from "wouter";
import { Shield, Eye, EyeOff, UserCog } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Navbar } from "@/components/layout/navbar";

const ADMIN_CREDENTIALS = [
  { username: "admin", password: "admin123", name: "System Administrator", role: "admin" },
  { username: "superadmin", password: "admin123", name: "Super Administrator", role: "admin" },
  { username: "healthadmin", password: "admin123", name: "Health Administrator", role: "admin" }
];

export default function AdminLogin() {
  const [, navigate] = useLocation();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      // Check credentials
      const admin = ADMIN_CREDENTIALS.find(
        (cred) => cred.username === username && cred.password === password
      );

      if (!admin) {
        setError("Invalid username or password");
        setIsLoading(false);
        return;
      }

      // Simulate login process by sending credentials to the backend
      const response = await fetch("/api/auth/admin-login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        // The backend expects a username and password for authentication.
        // Use the provided admin username and password to authenticate.
        body: JSON.stringify({
          username: admin.username,
          password: admin.password,
        }),
      });

      if (response.ok) {
        navigate("/admin-dashboard");
      } else {
        setError("Login failed. Please try again.");
      }
    } catch (err) {
      setError("Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-red-50">
      <Navbar />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-20">
        <div className="max-w-md mx-auto">
          <Card className="bg-white/80 backdrop-blur-sm shadow-xl border-white/50">
            <CardHeader className="text-center space-y-4">
              <div className="mx-auto p-4 rounded-2xl bg-gradient-to-br from-red-500 to-red-600 w-fit">
                <UserCog className="h-8 w-8 text-white" />
              </div>
              <div>
                <CardTitle className="text-2xl font-bold text-freedoc-dark">Admin Login</CardTitle>
                <CardDescription className="text-slate-600 mt-2">
                  Access the admin dashboard to manage the healthcare platform
                </CardDescription>
              </div>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="username" className="text-sm font-medium text-freedoc-dark">
                    Username
                  </Label>
                  <Input
                    id="username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter admin username"
                    className="border-slate-200 focus:border-red-500 focus:ring-red-500"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-medium text-freedoc-dark">
                    Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter admin password"
                      className="border-slate-200 focus:border-red-500 focus:ring-red-500 pr-10"
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 text-slate-500" />
                      ) : (
                        <Eye className="h-4 w-4 text-slate-500" />
                      )}
                    </Button>
                  </div>
                </div>

                {error && (
                  <Alert variant="destructive" className="py-2">
                    <AlertDescription className="text-sm">{error}</AlertDescription>
                  </Alert>
                )}

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:shadow-lg text-white font-semibold py-2"
                  disabled={isLoading}
                >
                  {isLoading ? "Signing in..." : "Sign in as Admin"}
                </Button>
              </form>

              <div className="mt-6 p-4 bg-slate-50 rounded-lg">
                <h3 className="text-sm font-semibold text-slate-700 mb-2">Demo Credentials:</h3>
                <div className="space-y-1 text-xs text-slate-600">
                  {ADMIN_CREDENTIALS.map((cred, index) => (
                    <div key={index} className="flex justify-between">
                      <span className="font-mono">{cred.username}</span>
                      <span className="font-mono">admin123</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-4 text-center">
                <Button
                  variant="link"
                  onClick={() => navigate("/")}
                  className="text-freedoc-blue hover:text-freedoc-blue/80 text-sm"
                >
                  Back to Home
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}