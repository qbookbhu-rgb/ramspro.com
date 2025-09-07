
import Link from "next/link";
import { specialties } from "@/lib/data";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function SpecialtiesSection() {

  return (
    <section className="container">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold font-headline">Browse by Specialty</h2>
        <p className="mt-2 text-muted-foreground md:text-lg max-w-2xl mx-auto">
          Find the right specialist from our wide range of medical fields.
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6">
        {specialties.map((specialty, index) => (
          <Link href="#find-a-doctor" key={index}>
            <Card className="group text-center p-4 sm:p-6 flex flex-col items-center justify-center aspect-square transition-all duration-300 hover:bg-primary/10 hover:shadow-lg hover:-translate-y-1">
              <div className="bg-secondary group-hover:bg-primary/20 text-foreground group-hover:text-primary p-4 rounded-full transition-colors duration-300">
                <specialty.icon className="h-8 w-8" />
              </div>
              <p className="mt-4 font-semibold text-sm sm:text-base">{specialty.name}</p>
            </Card>
          </Link>
        ))}
      </div>
      <div className="text-center mt-12">
        <Button variant="outline" asChild>
          <Link href="#find-a-doctor">View All Specialties</Link>
        </Button>
      </div>
    </section>
  );
}
