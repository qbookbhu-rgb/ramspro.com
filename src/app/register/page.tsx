import Link from "next/link";
import { registrationRoles } from "@/lib/data";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";

export default function RegisterPage() {
  return (
    <div className="container py-20">
      <div className="text-center max-w-2xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold font-headline">Join RAMS.com</h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Create an account to access a world of healthcare services. Choose the role that best describes you.
        </p>
      </div>

      <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {registrationRoles.map((role) => (
          <Link href={role.href} key={role.name} className="block group">
            <Card className="h-full flex flex-col justify-between transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:border-primary">
              <CardHeader>
                <div className="flex items-center gap-4 mb-4">
                    <div className="bg-primary/10 text-primary p-3 rounded-lg">
                        <role.icon className="h-7 w-7" />
                    </div>
                    <CardTitle className="font-headline text-2xl">{role.name}</CardTitle>
                </div>
                <CardDescription>{role.description}</CardDescription>
              </CardHeader>
              <div className="p-6 pt-0 flex justify-end">
                <ArrowRight className="h-6 w-6 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-primary" />
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
