
"use client";

import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { auth } from "@/lib/firebase";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { useRouter } from 'next/navigation';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2,LogIn } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

interface LoginDialogProps {
    isOpen: boolean;
    onOpenChange: (isOpen: boolean) => void;
}

export function LoginDialog({ isOpen, onOpenChange }: LoginDialogProps) {
  const { toast } = useToast();
  const router = useRouter();
  const { userRole } = useAuth(); // We can get the role from the auth context now
  const [step, setStep] = useState<'mobile' | 'otp'>('mobile');
  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  const generateRecaptcha = () => {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
        'size': 'invisible',
        'callback': (response: any) => {
          // reCAPTCHA solved, allow signInWithPhoneNumber.
        }
      });
    }
  }

  const handleSendOtp = () => {
    if (mobile.length !== 10) {
        toast({ variant: "destructive", title: "Invalid Number", description: "Please enter a valid 10-digit mobile number."});
        return;
    }
    setIsLoading(true);
    generateRecaptcha();
    let appVerifier = window.recaptchaVerifier;
    signInWithPhoneNumber(auth, `+91${mobile}`, appVerifier)
      .then(confirmationResult => {
        window.confirmationResult = confirmationResult;
        setStep('otp');
        toast({
          title: "OTP Sent!",
          description: "Please check your phone for the OTP.",
        });
      }).catch(error => {
        console.error("SMS not sent", error);
        toast({
          variant: "destructive",
          title: "OTP Failed",
          description: "Could not send OTP. Please try again.",
        });
      }).finally(() => {
        setIsLoading(false);
      });
  }

  const handleOtpSubmit = () => {
    setIsLoading(true);
    let confirmationResult = window.confirmationResult;
    confirmationResult.confirm(otp).then(async (result: any) => {
        toast({
            title: "Login Successful!",
            description: "Welcome back!",
        });
        onOpenChange(false); // Close the dialog

        // The redirect logic is now handled by the useAuth hook's effect
        // but we can still push to a default dashboard as a fallback.
        if (userRole === 'patient') {
            router.push('/patient/dashboard');
        } else if (userRole === 'doctor') {
            router.push('/doctor/dashboard');
        } else {
            // Default redirect if role is unknown or user is new
            router.push('/'); 
        }

    }).catch((error: any) => {
        console.error("OTP verification failed", error);
        toast({
          variant: "destructive",
          title: "OTP Invalid",
          description: "The OTP you entered is incorrect.",
        });
    }).finally(() => {
        setIsLoading(false);
    });
  }

  const handleClose = () => {
    onOpenChange(false);
    // Reset state after a short delay to allow the dialog to close
    setTimeout(() => {
        setStep('mobile');
        setMobile('');
        setOtp('');
    }, 300);
  }

  return (
    <>
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <div className="flex items-center gap-3 mb-4">
              <div className="bg-primary/10 text-primary p-2 rounded-lg">
                <LogIn className="h-6 w-6" />
              </div>
              <DialogTitle className="text-2xl font-headline">Login to RAMS.com</DialogTitle>
          </div>
          {step === 'mobile' && (
            <div className="flex flex-col gap-4 pt-4">
              <DialogDescription>Enter your mobile number to receive an OTP.</DialogDescription>
              <div className="flex gap-2">
                <span className="border rounded-md bg-muted px-3 flex items-center text-sm">+91</span>
                <Input 
                    type="tel"
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                    placeholder="98765 43210"
                />
              </div>
              <Button onClick={handleSendOtp} disabled={isLoading || mobile.length !== 10}>
                {isLoading ? <Loader2 className="animate-spin" /> : 'Send OTP'}
              </Button>
            </div>
          )}

          {step === 'otp' && (
             <div className="flex flex-col items-center gap-4 pt-4">
              <DialogDescription>
                We've sent a 6-digit OTP to your mobile number.
              </DialogDescription>
              <InputOTP maxLength={6} value={otp} onChange={setOtp}>
                <InputOTPGroup>
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                  <InputOTPSlot index={3} />
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
                </InputOTPGroup>
              </InputOTP>
              <Button onClick={handleOtpSubmit} disabled={isLoading || otp.length < 6} className="w-full">
                 {isLoading ? <Loader2 className="animate-spin" /> : 'Verify & Login'}
              </Button>
              <Button variant="link" size="sm" onClick={() => setStep('mobile')}>
                  Use a different number
              </Button>
            </div>
          )}
        </DialogHeader>
      </DialogContent>
    </Dialog>
    <div id="recaptcha-container"></div>
    </>
  )

}
