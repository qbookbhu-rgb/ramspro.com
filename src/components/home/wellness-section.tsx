import Image from "next/image";
import Link from "next/link";
import { wellnessItems } from "@/lib/data";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export default function WellnessSection() {
  return (
    <section id="wellness">
      <div className="">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold font-headline">Wellness Zone</h2>
          <p className="mt-2 text-muted-foreground md:text-lg max-w-2xl mx-auto">
            Explore resources for a healthier body and mind.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {wellnessItems.map((item, index) => (
            <Card key={index} className="overflow-hidden group shadow-lg">
                <div className="flex flex-col sm:flex-row">
                    <div className="relative h-60 sm:h-auto sm:w-2/5">
                        <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        data-ai-hint={item.dataAiHint}
                        />
                    </div>
                    <div className="sm:w-3/5">
                        <CardHeader>
                            <div className="flex items-center gap-3">
                                <div className="flex-shrink-0 bg-primary/20 text-primary p-2 rounded-lg">
                                    <item.icon className="h-6 w-6"/>
                                </div>
                                <CardTitle className="font-headline">{item.title}</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <CardDescription>{item.description}</CardDescription>
                            <Button variant="link" asChild className="p-0 mt-4">
                                <Link href="#">
                                    Explore More <ArrowRight className="ml-2 h-4 w-4"/>
                                </Link>
                            </Button>
                        </CardContent>
                    </div>
                </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
