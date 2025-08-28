import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Link, useLocation } from "wouter";
import { UserPlus } from "lucide-react";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

const registrationSchema = z.object({
  email: z.string().email("Invalid email format"),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  dateOfBirth: z.string().min(1, "Date of birth is required"),
  medicareNumber: z.string().optional(),
  phoneNumber: z.string().optional(),
  agreeToTerms: z.boolean().refine((val) => val === true, "You must agree to the terms"),
});

type RegistrationFormData = z.infer<typeof registrationSchema>;

export default function Register() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const form = useForm<RegistrationFormData>({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      email: "",
      firstName: "",
      lastName: "",
      dateOfBirth: "",
      medicareNumber: "",
      phoneNumber: "",
      agreeToTerms: false,
    },
  });

  const registerMutation = useMutation({
    mutationFn: async (data: Omit<RegistrationFormData, "agreeToTerms">) => {
      const response = await apiRequest("POST", "/api/auth/register", data);
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Registration Successful",
        description: `We've sent a verification code to ${data.email}`,
      });
      // Store email for OTP verification
      sessionStorage.setItem("otpEmail", data.email);
      setLocation("/verify-otp");
    },
    onError: (error: Error) => {
      toast({
        title: "Registration Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: RegistrationFormData) => {
    const { agreeToTerms, ...registrationData } = data;
    registerMutation.mutate(registrationData);
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="bg-freedoc-blue text-white p-3 rounded-lg w-fit mx-auto mb-4">
            <UserPlus className="h-8 w-8" />
          </div>
          <h2 className="text-3xl font-bold text-freedoc-dark">Create Your Account</h2>
          <p className="text-freedoc-secondary mt-2">
            Join thousands of Australians accessing free healthcare
          </p>
        </div>

        <Card className="border-none shadow-lg">
          <CardContent className="p-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>First Name</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="John"
                            data-testid="input-first-name"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="lastName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Last Name</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="Smith"
                            data-testid="input-last-name"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email Address</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="email"
                          placeholder="john@example.com"
                          data-testid="input-email"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="dateOfBirth"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Date of Birth</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="date"
                          data-testid="input-date-of-birth"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="medicareNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Medicare Number (Optional)</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="1234 56789 0"
                          data-testid="input-medicare-number"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phoneNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number (Optional)</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="tel"
                          placeholder="0412 345 678"
                          data-testid="input-phone-number"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="agreeToTerms"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          data-testid="checkbox-agree-terms"
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel className="text-sm text-freedoc-secondary">
                          I agree to the{" "}
                          <Link href="/terms" className="text-freedoc-blue hover:underline">
                            Terms of Service
                          </Link>{" "}
                          and{" "}
                          <Link href="/privacy" className="text-freedoc-blue hover:underline">
                            Privacy Policy
                          </Link>
                        </FormLabel>
                        <FormMessage />
                      </div>
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  className="w-full bg-freedoc-blue hover:bg-freedoc-blue-dark"
                  disabled={registerMutation.isPending}
                  data-testid="button-create-account"
                >
                  {registerMutation.isPending ? "Creating Account..." : "Create Account"}
                </Button>
              </form>
            </Form>

            <div className="text-center mt-6">
              <p className="text-sm text-freedoc-secondary">
                Already have an account?{" "}
                <button
                  onClick={() => (window.location.href = "/api/login")}
                  className="text-freedoc-blue hover:underline font-medium"
                  data-testid="link-sign-in"
                >
                  Sign in
                </button>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
