
import { Search, Calendar, MessageSquare } from "lucide-react";
import { getTranslations } from "next-intl/server";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function HowItWorksSection() {
  const t = await getTranslations('HowItWorks');

  const steps = [
    {
      icon: Search,
      title: t('step1Title'),
      description: t('step1Description'),
    },
    {
      icon: Calendar,
      title: t('step2Title'),
      description: t('step2Description'),
    },
    {
      icon: MessageSquare,
      title: t('step3Title'),
      description: t('step3Description'),
    },
  ];

  return (
    <section className="container text-center">
      <h2 className="text-3xl md:text-4xl font-bold font-headline">{t('title')}</h2>
      <p className="mt-2 text-muted-foreground md:text-lg max-w-2xl mx-auto">
        {t('subtitle')}
      </p>
      <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
        {steps.map((step, index) => (
          <Card key={index} className="text-center shadow-lg transition-transform hover:scale-105">
            <CardHeader className="items-center">
              <div className="bg-primary/20 text-primary p-4 rounded-full">
                <step.icon className="h-8 w-8" />
              </div>
              <CardTitle className="mt-4">{step.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{step.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
