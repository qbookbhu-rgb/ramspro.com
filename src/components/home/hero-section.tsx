"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Sparkles, Bot, Stethoscope, Loader2 } from "lucide-react";

import { getDoctorRecommendation } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import type { AISymptomCheckerOutput } from "@/ai/flows/ai-symptom-checker";
import { useTranslations } from 'next-intl';

const FormSchema = z.object({
  symptoms: z.string().min(10, {
    message: "Please describe your symptoms in at least 10 characters.",
  }),
});

export default function HeroSection() {
  const [result, setResult] = useState<AISymptomCheckerOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const t = useTranslations('HeroSection');

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      symptoms: "",
    },
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    setIsLoading(true);
    setResult(null);

    const response = await getDoctorRecommendation({ symptoms: data.symptoms });

    setIsLoading(false);
    if (response.success && response.data) {
      setResult(response.data);
    } else {
      toast({
        variant: "destructive",
        title: "Error",
        description: response.error || "An unknown error occurred.",
      });
    }
  }

  return (
    <section className="container">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="text-center lg:text-left">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-headline tracking-tight"
             dangerouslySetInnerHTML={{ __html: t.raw('title') }}
          />
          <p className="mt-4 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto lg:mx-0">
            {t('subtitle')}
          </p>
        </div>

        <Card className="shadow-2xl">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="flex-shrink-0 bg-primary/20 text-primary p-2 rounded-lg">
                <Sparkles className="h-6 w-6" />
              </div>
              <div>
                <CardTitle className="text-2xl font-headline">{t('cardTitle')}</CardTitle>
                <CardDescription>{t('cardDescription')}</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="symptoms"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Textarea
                          placeholder={t('symptomsPlaceholder')}
                          className="min-h-[100px] resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full bg-accent hover:bg-accent/90" disabled={isLoading}>
                  {isLoading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Sparkles className="mr-2 h-4 w-4" />
                  )}
                  {t('analyzeButton')}
                </Button>
              </form>
            </Form>

            {isLoading && (
              <div className="mt-6 flex flex-col items-center justify-center text-center gap-2 text-muted-foreground">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="font-semibold">Our AI is analyzing your symptoms...</p>
                <p className="text-sm">This may take a moment.</p>
              </div>
            )}

            {result && (
              <Card className="mt-6 bg-primary/10 border-primary/20">
                <CardHeader>
                    <div className="flex gap-4">
                        <Bot className="h-8 w-8 text-primary flex-shrink-0" />
                        <div>
                            <CardTitle className="text-xl font-headline">AI Recommendation</CardTitle>
                            <CardDescription>Based on the symptoms provided.</CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="font-semibold flex items-center gap-2"><Stethoscope className="h-4 w-4"/> Recommended Specialty</h3>
                    <p className="text-lg font-bold text-primary">{result.recommendedDoctorSpecialty}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold">Reasoning</h3>
                    <p className="text-muted-foreground text-sm">{result.reasoning}</p>
                  </div>
                  <Button className="w-full" asChild>
                    <a href="#find-a-doctor">Find a {result.recommendedDoctorSpecialty}</a>
                  </Button>
                </CardContent>
              </Card>
            )}
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
