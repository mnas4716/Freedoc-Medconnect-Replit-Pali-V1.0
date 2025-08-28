import { useState } from "react";
import { useLocation } from "wouter";
import { Stethoscope, Eye, EyeOff, UserCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Navbar } from "@/components/layout/navbar";

const DOCTOR_CREDENTIALS = [
  { username: "dr.smith", password: "doctor123", name: "Dr. Sarah Smith", specialization: "General Practice" },
  { username: "dr.johnson", password: "doctor123", name: "Dr. Michael Johnson", specialization: "Family Medicine" },
  { username: "dr.williams", password: "doctor123", name: "Dr. Emily Williams", specialization: "Internal Medicine" },
  { username: "dr.brown", password: "doctor123", name: "Dr. David Brown", specialization: "Mental Health" },
  { username: "dr.davis", password: "doctor123", name: "Dr. Lisa Davis", specialization: "General Practice" }
];

export default function DoctorLogin() {
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
      const doctor = DOCTOR_CREDENTIALS.find(
        (cred) => cred.username === username && cred.password === password
      );

      if (!doctor) {
        setError("Invalid username or password");
        setIsLoading(false);
        return;
      }

      // Simulate login process
      const response = await fetch("/api/auth/doctor-login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: doctor.username,
          name: doctor.name,
          specialization: doctor.specialization,
        }),
      });

      if (response.ok) {
        navigate("/doctor-dashboard");
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <Navbar />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-20">
        <div className="max-w-md mx-auto">
          <Card className="bg-white/80 backdrop-blur-sm shadow-xl border-white/50">
            <CardHeader className="text-center space-y-4">
              <div className="mx-auto p-4 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 w-fit">
                <UserCheck className="h-8 w-8 text-white" />
              </div>
              <div>
                <CardTitle className="text-2xl font-bold text-freedoc-dark">Doctor Login</CardTitle>
                <CardDescription className="text-slate-600 mt-2">
                  Access your doctor dashboard to view assigned consultations
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
                    placeholder="Enter your username"
                    className="border-slate-200 focus:border-freedoc-blue focus:ring-freedoc-blue"
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
                      placeholder="Enter your password"
                      className="border-slate-200 focus:border-freedoc-blue focus:ring-freedoc-blue pr-10"
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
                  className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:shadow-lg text-white font-semibold py-2"
                  disabled={isLoading}
                >
                  {isLoading ? "Signing in..." : "Sign in as Doctor"}
                </Button>
              </form>

              <div className="mt-6 p-4 bg-slate-50 rounded-lg">
                <h3 className="text-sm font-semibold text-slate-700 mb-2">Demo Credentials:</h3>
                <div className="space-y-1 text-xs text-slate-600">
                  {DOCTOR_CREDENTIALS.map((cred, index) => (
                    <div key={index} className="flex justify-between">
                      <span className="font-mono">{cred.username}</span>
                      <span className="font-mono">doctor123</span>
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