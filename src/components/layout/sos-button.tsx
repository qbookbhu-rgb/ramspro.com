
"use client";

import { useState } from 'react';
import { Siren, Phone, Loader2, Ambulance, User, Hash } from "lucide-react";
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
import { findNearestAmbulance } from '@/app/actions';
import type { FindAmbulanceOutput } from '@/ai/flows/ai-find-ambulance';
import { Separator } from '../ui/separator';

export default function SosButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [ambulance, setAmbulance] = useState<FindAmbulanceOutput | null>(null);

  const handleSosClick = async () => {
    setIsLoading(true);
    setAmbulance(null);
    const result = await findNearestAmbulance();
    if (result.success) {
      setAmbulance(result.data);
    } else {
      // Handle error case, maybe show a toast
      console.error(result.error);
       setAmbulance({ found: false });
    }
    setIsLoading(false);
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>
        <Button
          variant="destructive"
          className="fixed bottom-4 right-4 h-16 w-16 rounded-full shadow-2xl animate-pulse"
          aria-label="SOS Emergency"
          onClick={handleSosClick}
        >
          <Siren className="h-8 w-8" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Emergency Assistance</AlertDialogTitle>
           <AlertDialogDescription>
            {isLoading 
              ? 'Finding the nearest ambulance...' 
              : 'Please review the details below. If this is a life-threatening emergency, call your local emergency number.'}
          </AlertDialogDescription>
        </AlertDialogHeader>
        
        <div className="my-4">
          {isLoading && (
            <div className="flex justify-center items-center h-24">
              <Loader2 className="h-10 w-10 animate-spin text-primary" />
            </div>
          )}

          {!isLoading && ambulance && (
            <>
              {ambulance.found ? (
                <div className='space-y-4'>
                  <h3 className="font-bold text-center text-primary">Ambulance Dispatched!</h3>
                  <div className="border rounded-lg p-4 space-y-3 bg-muted/50">
                     <div className="flex items-center gap-3">
                        <User className="h-5 w-5 text-muted-foreground" />
                        <span className="font-medium">{ambulance.driverName}</span>
                     </div>
                     <div className="flex items-center gap-3">
                        <Ambulance className="h-5 w-5 text-muted-foreground" />
                        <span className="font-medium">{ambulance.vehicleNumber}</span>
                     </div>
                      <div className="flex items-center gap-3">
                        <Phone className="h-5 w-5 text-muted-foreground" />
                        <span className="font-medium">{ambulance.mobile}</span>
                     </div>
                  </div>
                  <p className="text-xs text-muted-foreground text-center">The driver has been notified. You can also call them directly.</p>
                </div>
              ) : (
                <div className="text-center text-destructive-foreground bg-destructive/90 p-4 rounded-md">
                  <h3 className="font-bold">No Ambulance Available</h3>
                  <p className="text-sm">We couldn't find an available ambulance right now. Please call a local emergency service.</p>
                </div>
              )}
            </>
          )}
        </div>

        <Separator />

        <AlertDialogFooter className="mt-2">
          <AlertDialogCancel>Close</AlertDialogCancel>
          <AlertDialogAction asChild disabled={!ambulance?.mobile}>
            <a href={`tel:${ambulance?.mobile || ''}`}>
                <Phone className="mr-2 h-4 w-4"/>
                Call Now
            </a>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
