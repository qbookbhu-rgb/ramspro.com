
import { Search, Calendar, MessageSquare } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function HowItWorksSection() {

  const steps = [
    {
      icon: Search,
      title: "Find Your Doctor",
      description: "Search by specialty or symptoms to find the right doctor for you.",
    },
    {
      icon: Calendar,
      title: "Book an Appointment",
      description: "Choose a convenient time and book a video, audio, or in-clinic visit.",
    },
    {
      icon: MessageSquare,
      title: "Consult Online",
      description: "Connect with your doctor from the comfort of your home.",
    },
  ];

  return (
    <section className="container text-center">
      <h2 className="text-3xl md:text-4xl font-bold font-headline">How It Works</h2>
      <p className="mt-2 text-muted-foreground md:text-lg max-w-2xl mx-auto">
        Get expert medical care in three simple steps.
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
