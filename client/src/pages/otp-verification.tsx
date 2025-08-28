import { useState, useEffect, useRef } from "react";
import { useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { MailCheck } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

export default function OTPVerification() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [email, setEmail] = useState("");
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    const storedEmail = sessionStorage.getItem("otpEmail");
    if (!storedEmail) {
      setLocation("/register");
      return;
    }
    setEmail(storedEmail);
  }, [setLocation]);

  const verifyOtpMutation = useMutation({
    mutationFn: async ({ email, otp }: { email: string; otp: string }) => {
      const response = await apiRequest("POST", "/api/auth/verify-otp", { email, otp });
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Email Verified!",
        description: "Your account has been created successfully. Please sign in to continue.",
      });
      sessionStorage.removeItem("otpEmail");
      // Redirect to Replit Auth login
      window.location.href = "/api/login";
    },
    onError: (error: Error) => {
      toast({
        title: "Verification Failed",
        description: error.message,
        variant: "destructive",
      });
      // Clear OTP inputs on error
      setOtp(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
    },
  });

  const resendOtpMutation = useMutation({
    mutationFn: async (email: string) => {
      const response = await apiRequest("POST", "/api/auth/resend-otp", { email });
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "OTP Resent",
        description: "A new verification code has been sent to your email.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Resend Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return; // Only allow digits

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-submit when all fields are filled
    if (newOtp.every(digit => digit !== "") && value) {
      const otpString = newOtp.join("");
      verifyOtpMutation.mutate({ email, otp: otpString });
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const otpString = otp.join("");
    if (otpString.length === 6) {
      verifyOtpMutation.mutate({ email, otp: otpString });
    } else {
      toast({
        title: "Invalid OTP",
        description: "Please enter all 6 digits",
        variant: "destructive",
      });
    }
  };

  const handleResendOtp = () => {
    resendOtpMutation.mutate(email);
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="bg-green-500 text-white p-3 rounded-lg w-fit mx-auto mb-4">
            <MailCheck className="h-8 w-8" />
          </div>
          <h2 className="text-3xl font-bold text-freedoc-dark">Verify Your Email</h2>
          <p className="text-freedoc-secondary mt-2">
            We've sent a 6-digit code to{" "}
            <span className="font-medium text-freedoc-dark" data-testid="text-email">
              {email}
            </span>
          </p>
        </div>

        <Card className="border-none shadow-lg">
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-freedoc-dark mb-4 text-center">
                  Enter Verification Code
                </label>
                <div className="flex justify-center space-x-2">
                  {otp.map((digit, index) => (
                    <Input
                      key={index}
                      ref={(el) => {
                        inputRefs.current[index] = el;
                      }}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(index, e)}
                      className="w-12 h-12 text-center text-lg font-bold border-2 focus:border-freedoc-blue"
                      data-testid={`input-otp-${index}`}
                    />
                  ))}
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-freedoc-blue hover:bg-freedoc-blue-dark"
                disabled={verifyOtpMutation.isPending || otp.some(digit => !digit)}
                data-testid="button-verify-email"
              >
                {verifyOtpMutation.isPending ? "Verifying..." : "Verify Email"}
              </Button>
            </form>

            <div className="text-center space-y-2 mt-6">
              <p className="text-sm text-freedoc-secondary">Didn't receive the code?</p>
              <Button
                variant="ghost"
                onClick={handleResendOtp}
                disabled={resendOtpMutation.isPending}
                className="text-freedoc-blue hover:text-freedoc-blue/80"
                data-testid="button-resend-code"
              >
                {resendOtpMutation.isPending ? "Resending..." : "Resend Code"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
