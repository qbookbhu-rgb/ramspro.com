import Link from "next/link";
import { registrationRoles } from "@/lib/data";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Lock } from "lucide-react";
import { cn } from "@/lib/utils";

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
        {registrationRoles.map((role) => {
          const cardContent = (
            <Card className={cn(
              "h-full flex flex-col justify-between transition-all duration-300",
              role.disabled ? "bg-muted/50 cursor-not-allowed" : "hover:shadow-xl hover:-translate-y-1 hover:border-primary group"
            )}>
              <CardHeader>
                <div className="flex items-center gap-4 mb-4">
                    <div className={cn("p-3 rounded-lg", role.disabled ? "bg-muted" : "bg-primary/10 text-primary")}>
                        <role.icon className="h-7 w-7" />
                    </div>
                    <div>
                      <CardTitle className="font-headline text-2xl">{role.name}</CardTitle>
                      {role.disabled && <CardDescription className="text-xs text-amber-600">Coming Soon</CardDescription>}
                    </div>
                </div>
                <CardDescription>{role.description}</CardDescription>
              </CardHeader>
              <div className="p-6 pt-0 flex justify-end">
                {role.disabled ? (
                  <Lock className="h-6 w-6 text-muted-foreground" />
                ) : (
                  <ArrowRight className="h-6 w-6 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-primary" />
                )}
              </div>
            </Card>
          );

          if (role.disabled) {
            return <div key={role.name} className="block">{cardContent}</div>;
          }

          return (
            <Link href={role.href} key={role.name} className="block group">
              {cardContent}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
