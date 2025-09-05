"use client";

import { Siren, Phone } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

export default function SosButton() {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant="destructive"
          className="fixed bottom-4 right-4 h-16 w-16 rounded-full shadow-2xl animate-pulse"
          aria-label="SOS Emergency"
        >
          <Siren className="h-8 w-8" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Emergency Assistance</AlertDialogTitle>
          <AlertDialogDescription>
            If this is a life-threatening emergency, please call your local emergency number immediately.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="my-4">
            <h3 className="font-semibold mb-2">24/7 Helpline</h3>
            <p className="text-muted-foreground">For immediate medical advice, you can reach our helpline.</p>
            <div className="flex items-center gap-2 mt-2">
                <Phone className="h-5 w-5 text-primary"/>
                <a href="tel:911" className="text-lg font-bold text-primary hover:underline">911 (Toll-Free)</a>
            </div>
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel>Close</AlertDialogCancel>
          <AlertDialogAction asChild>
            <a href="tel:911">
                <Phone className="mr-2 h-4 w-4"/>
                Call Now
            </a>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
