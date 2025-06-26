import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useState, useEffect } from "react";
import { useLocation, useSearch } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { insertUserSchema } from "@shared/schema";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Helmet } from 'react-helmet';
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { AlertCircle, ArrowLeft, CheckCircle, Loader2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Checkbox } from "@/components/ui/checkbox";

// Extend schema for client-side validation
const registerSchema = insertUserSchema.extend({
  confirmPassword: z.string().min(6, {
    message: "Password must be at least 6 characters.",
  }),
  phoneNumber: z.string().optional(),
  smsConsent: z.boolean().optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

const loginSchema = insertUserSchema.pick({
  email: true,
  password: true,
});

// Add forgot password schema
const forgotPasswordSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
});

// Add reset password schema
const resetPasswordSchema = z.object({
  password: z.string().min(6, {
    message: "Password must be at least 6 characters.",
  }),
  confirmPassword: z.string().min(6, {
    message: "Password must be at least 6 characters.",
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type RegisterFormValues = z.infer<typeof registerSchema>;
type LoginFormValues = z.infer<typeof loginSchema>;
type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;
type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

export default function AuthPage() {
  const [activeTab, setActiveTab] = useState<"login" | "register">("login");
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotPasswordStatus, setForgotPasswordStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [forgotPasswordMessage, setForgotPasswordMessage] = useState("");
  
  // For reset password flow
  const [resetToken, setResetToken] = useState<string | null>(null);
  const [resetStatus, setResetStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [resetMessage, setResetMessage] = useState("");
  
  const [, navigate] = useLocation();
  const search = useSearch();
  const { toast } = useToast();
  const { user, loginMutation, registerMutation } = useAuth();

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate("/journal");
    }
  }, [user, navigate]);
  
  // Check for reset token in URL
  useEffect(() => {
    const params = new URLSearchParams(search);
    const token = params.get('token');
    if (token) {
      setResetToken(token);
    }
  }, [search]);

  // Register form
  const registerForm = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
      phoneNumber: "",
      smsConsent: false,
    },
  });

  // Login form
  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  
  // Forgot password form
  const forgotPasswordForm = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });
  
  // Reset password form
  const resetPasswordForm = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const onRegisterSubmit = (data: RegisterFormValues) => {
    const { confirmPassword, ...userData } = data;
    // Generate username from email if not provided
    const userDataWithUsername = {
      ...userData,
      username: userData.email.split('@')[0] + Math.floor(Math.random() * 1000)
    };
    registerMutation.mutate(userDataWithUsername, {
      onSuccess: () => {
        // Force navigation after registration
        navigate("/journal");
      }
    });
  };

  const onLoginSubmit = (data: LoginFormValues) => {
    loginMutation.mutate(data, {
      onSuccess: () => {
        // Force navigation after login
        navigate("/journal");
      }
    });
  };
  
  const onForgotPasswordSubmit = async (data: ForgotPasswordFormValues) => {
    try {
      setForgotPasswordStatus("loading");
      const response = await apiRequest("POST", "/api/forgot-password", data);
      const result = await response.json();
      
      if (response.ok) {
        setForgotPasswordStatus("success");
        setForgotPasswordMessage(result.message || "If your email exists in our system, you'll receive a reset link shortly.");
      } else {
        setForgotPasswordStatus("error");
        setForgotPasswordMessage(result.message || "An error occurred. Please try again.");
      }
    } catch (error) {
      setForgotPasswordStatus("error");
      setForgotPasswordMessage("An error occurred. Please try again.");
    }
  };
  
  const onResetPasswordSubmit = async (data: ResetPasswordFormValues) => {
    if (!resetToken) return;
    
    try {
      setResetStatus("loading");
      const response = await apiRequest("POST", "/api/reset-password", {
        token: resetToken,
        newPassword: data.password
      });
      const result = await response.json();
      
      if (response.ok) {
        setResetStatus("success");
        setResetMessage("Your password has been reset successfully. You can now log in with your new password.");
        
        // Clear the token from URL after successful reset
        window.history.replaceState({}, document.title, "/auth");
        
        // Auto-redirect to login after 3 seconds
        setTimeout(() => {
          setResetToken(null);
          setActiveTab("login");
        }, 3000);
      } else {
        setResetStatus("error");
        setResetMessage(result.message || "Failed to reset password. Please try again or request a new reset link.");
      }
    } catch (error) {
      setResetStatus("error");
      setResetMessage("An error occurred. Please try again.");
    }
  };

  return (
    <>
      <Helmet>
        <title>
          {resetToken 
            ? "Reset Password - Featherweight" 
            : showForgotPassword 
              ? "Forgot Password - Featherweight"
              : "Sign In or Register - Featherweight"
          }
        </title>
        <meta 
          name="description" 
          content={resetToken 
            ? "Reset your Featherweight password to regain access to your account" 
            : showForgotPassword
              ? "Request a password reset link for your Featherweight account"
              : "Sign in to your Featherweight account or create a new one to start journaling with Flappy, your email companion."
          } 
        />
      </Helmet>
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow py-12 bg-background">
          <Container>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center max-w-5xl mx-auto">
              {/* Auth Forms */}
              <div>
                <Card className="w-full">
                  <CardHeader>
                    {resetToken ? (
                      <>
                        <CardTitle className="font-quicksand text-2xl text-center">Reset Your Password</CardTitle>
                        <CardDescription className="text-center">
                          Enter your new password below to regain access to your account
                        </CardDescription>
                      </>
                    ) : showForgotPassword ? (
                      <>
                        <CardTitle className="font-quicksand text-2xl text-center">Forgot Password</CardTitle>
                        <CardDescription className="text-center">
                          Enter your email address below to receive a password reset link
                        </CardDescription>
                      </>
                    ) : (
                      <>
                        <CardTitle className="font-quicksand text-2xl text-center">Welcome to Featherweight</CardTitle>
                        <CardDescription className="text-center">
                          Sign in to your account or create a new one to start your journey with Flappy
                        </CardDescription>
                      </>
                    )}
                  </CardHeader>
                  <CardContent>
                    {resetToken ? (
                      // Reset Password Form
                      <div>
                        {resetStatus === "success" ? (
                          <Alert className="bg-green-50 text-green-800 border-green-200 mb-4">
                            <CheckCircle className="h-4 w-4" />
                            <AlertTitle>Password Reset Successfully</AlertTitle>
                            <AlertDescription>{resetMessage}</AlertDescription>
                          </Alert>
                        ) : (
                          <Form {...resetPasswordForm}>
                            <form onSubmit={resetPasswordForm.handleSubmit(onResetPasswordSubmit)} className="space-y-4">
                              <FormField
                                control={resetPasswordForm.control}
                                name="password"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>New Password</FormLabel>
                                    <FormControl>
                                      <Input type="password" placeholder="••••••••" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              
                              <FormField
                                control={resetPasswordForm.control}
                                name="confirmPassword"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Confirm Password</FormLabel>
                                    <FormControl>
                                      <Input type="password" placeholder="••••••••" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              
                              {resetStatus === "error" && (
                                <Alert variant="destructive">
                                  <AlertCircle className="h-4 w-4" />
                                  <AlertTitle>Error</AlertTitle>
                                  <AlertDescription>{resetMessage}</AlertDescription>
                                </Alert>
                              )}
                              
                              <Button type="submit" className="w-full" disabled={resetStatus === "loading"}>
                                {resetStatus === "loading" ? (
                                  <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Resetting...
                                  </>
                                ) : (
                                  "Reset Password"
                                )}
                              </Button>
                            </form>
                          </Form>
                        )}
                      </div>
                    ) : showForgotPassword ? (
                      // Forgot Password Form
                      <div>
                        {forgotPasswordStatus === "success" ? (
                          <div className="space-y-4">
                            <Alert className="bg-green-50 text-green-800 border-green-200 mb-4">
                              <CheckCircle className="h-4 w-4" />
                              <AlertTitle>Reset Link Sent</AlertTitle>
                              <AlertDescription>{forgotPasswordMessage}</AlertDescription>
                            </Alert>
                            <Button 
                              onClick={() => {
                                setShowForgotPassword(false);
                                setForgotPasswordStatus("idle");
                              }}
                              className="w-full"
                            >
                              <ArrowLeft className="mr-2 h-4 w-4" />
                              Back to Login
                            </Button>
                          </div>
                        ) : (
                          <Form {...forgotPasswordForm}>
                            <form onSubmit={forgotPasswordForm.handleSubmit(onForgotPasswordSubmit)} className="space-y-4">
                              <FormField
                                control={forgotPasswordForm.control}
                                name="email"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                      <Input placeholder="your.email@example.com" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              
                              {forgotPasswordStatus === "error" && (
                                <Alert variant="destructive">
                                  <AlertCircle className="h-4 w-4" />
                                  <AlertTitle>Error</AlertTitle>
                                  <AlertDescription>{forgotPasswordMessage}</AlertDescription>
                                </Alert>
                              )}
                              
                              <div className="flex flex-col space-y-2">
                                <Button type="submit" className="w-full" disabled={forgotPasswordStatus === "loading"}>
                                  {forgotPasswordStatus === "loading" ? (
                                    <>
                                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                      Sending...
                                    </>
                                  ) : (
                                    "Send Reset Link"
                                  )}
                                </Button>
                                
                                <Button 
                                  type="button" 
                                  variant="outline" 
                                  onClick={() => setShowForgotPassword(false)}
                                  className="w-full"
                                >
                                  <ArrowLeft className="mr-2 h-4 w-4" />
                                  Back to Login
                                </Button>
                              </div>
                            </form>
                          </Form>
                        )}
                      </div>
                    ) : (
                      // Regular login/register tabs
                      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "login" | "register")}>
                        <TabsList className="grid w-full grid-cols-2 mb-6">
                          <TabsTrigger value="login" className="font-quicksand">Login</TabsTrigger>
                          <TabsTrigger value="register" className="font-quicksand">Register</TabsTrigger>
                        </TabsList>
                        
                        {/* Login Tab */}
                        <TabsContent value="login">
                          <Form {...loginForm}>
                            <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4">
                              <FormField
                                control={loginForm.control}
                                name="email"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                      <Input placeholder="your.email@example.com" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              <FormField
                                control={loginForm.control}
                                name="password"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Password</FormLabel>
                                    <FormControl>
                                      <Input type="password" placeholder="••••••••" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              <Button 
                                type="submit" 
                                className="w-full font-quicksand" 
                                disabled={loginMutation.isPending}
                              >
                                {loginMutation.isPending ? "Signing in..." : "Sign in"}
                              </Button>
                              
                              <div className="flex justify-between items-center w-full mt-4">
                                <button
                                  type="button"
                                  className="text-xs text-muted-foreground hover:text-primary"
                                  onClick={() => setShowForgotPassword(true)}
                                >
                                  Forgot password?
                                </button>
                                <button
                                  type="button"
                                  className="text-xs text-muted-foreground hover:text-primary"
                                  onClick={() => setActiveTab("register")}
                                >
                                  Don't have an account? Register
                                </button>
                              </div>
                            </form>
                          </Form>
                        </TabsContent>
                        
                        {/* Register Tab */}
                        <TabsContent value="register">
                          <Form {...registerForm}>
                            <form onSubmit={registerForm.handleSubmit(onRegisterSubmit)} className="space-y-4">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormField
                                  control={registerForm.control}
                                  name="firstName"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>First Name</FormLabel>
                                      <FormControl>
                                        <Input placeholder="Jane" {...field} />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                                <FormField
                                  control={registerForm.control}
                                  name="lastName"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>Last Name</FormLabel>
                                      <FormControl>
                                        <Input placeholder="Doe" {...field} />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                              </div>
                              <FormField
                                control={registerForm.control}
                                name="phoneNumber"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Phone Number (Optional)</FormLabel>
                                    <FormControl>
                                      <Input placeholder="+14155552671" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              <FormField
                                control={registerForm.control}
                                name="email"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                      <Input placeholder="your.email@example.com" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              <FormField
                                control={registerForm.control}
                                name="password"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Password</FormLabel>
                                    <FormControl>
                                      <Input type="password" placeholder="••••••••" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              <FormField
                                control={registerForm.control}
                                name="confirmPassword"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Confirm Password</FormLabel>
                                    <FormControl>
                                      <Input type="password" placeholder="••••••••" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              
                              <FormField
                                control={registerForm.control}
                                name="smsConsent"
                                render={({ field }) => (
                                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                                    <FormControl>
                                      <Checkbox
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                      />
                                    </FormControl>
                                    <div className="space-y-1 leading-none">
                                      <FormLabel className="text-sm font-normal">
                                        I consent to receive SMS messages from Featherweight.world for AI chat conversations, wellness tips, and account updates. I confirm I own this phone number. Message and data rates may apply. Message frequency varies. Reply HELP for help, STOP to cancel. Consent is not required for any purchase or service. By checking this box, I agree to the{" "}
                                        <a href="/privacy" className="text-primary underline">Privacy Policy</a> and{" "}
                                        <a href="/terms" className="text-primary underline">Terms of Service</a>.
                                      </FormLabel>
                                      <FormMessage />
                                    </div>
                                  </FormItem>
                                )}
                              />
                              <Button 
                                type="submit" 
                                className="w-full font-quicksand" 
                                disabled={registerMutation.isPending}
                              >
                                {registerMutation.isPending ? "Creating account..." : "Create account"}
                              </Button>
                            </form>
                          </Form>
                        </TabsContent>
                      </Tabs>
                    )}
                  </CardContent>
                  <CardFooter className="flex flex-col space-y-4 text-center text-sm text-muted-foreground">
                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t" />
                      </div>
                      <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-background px-2 text-muted-foreground">
                          Or continue with
                        </span>
                      </div>
                    </div>
                    
                    <Button 
                      variant="outline" 
                      className="w-full" 
                      onClick={() => window.location.href = '/auth/tiktok'}
                    >
                      <svg 
                        className="mr-2 h-4 w-4" 
                        viewBox="0 0 24 24" 
                        fill="currentColor"
                      >
                        <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-.88-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z"/>
                      </svg>
                      Continue with TikTok
                    </Button>
                    
                    <p>By continuing, you agree to Featherweight's Terms of Service and Privacy Policy.</p>
                  </CardFooter>
                </Card>
              </div>
              
              {/* Hero Section */}
              <div className="hidden lg:block">
                <div className="text-center lg:text-left">
                  <h1 className="font-quicksand font-bold text-3xl md:text-4xl text-foreground mb-6">
                    Journal with Flappy, your cosmic pelican companion
                  </h1>
                  <p className="text-muted-foreground mb-8 text-lg">
                    Featherweight makes journaling effortless through email conversations with Flappy, 
                    your wise and witty pelican guide who helps you reflect, grow, and find moments of joy.
                  </p>
                  
                  <div className="space-y-6">
                    <div className="flex items-start space-x-3">
                      <div className="bg-primary/10 p-2 rounded-full mt-1">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 17a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V9.5C2 7 4 5 6.5 5H18c2.2 0 4 1.8 4 4v8Z"/><polyline points="15,9 18,9 18,11"/><path d="M6 10V5.5C6 4.1 7.1 3 8.5 3H15"/><rect x="6" y="9" width="6" height="2" rx="1"/></svg>
                      </div>
                      <div>
                        <h3 className="font-quicksand font-semibold text-lg">Daily Inspiration in Your Inbox</h3>
                        <p className="text-foreground/70">
                          Start each day with Flappy's wisdom, delivered straight to your email.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <div className="bg-secondary/10 p-2 rounded-full mt-1">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-secondary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" x2="4" y1="22" y2="15"/></svg>
                      </div>
                      <div>
                        <h3 className="font-quicksand font-semibold text-lg">Journal With Ease</h3>
                        <p className="text-foreground/70">
                          Simply reply to Flappy's emails to create journal entries. No apps to open.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <div className="bg-accent/10 p-2 rounded-full mt-1">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-accent" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/><path d="M8 14h.01"/><path d="M12 14h.01"/><path d="M16 14h.01"/><path d="M8 18h.01"/><path d="M12 18h.01"/><path d="M16 18h.01"/></svg>
                      </div>
                      <div>
                        <h3 className="font-quicksand font-semibold text-lg">Track Your Growth</h3>
                        <p className="text-foreground/70">
                          Watch your journey unfold as Flappy helps you reflect and grow over time.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Container>
        </main>
        <Footer />
      </div>
    </>
  );
}