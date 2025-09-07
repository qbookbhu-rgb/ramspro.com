
import Link from "next/link";
import { Twitter, Facebook, Instagram, Linkedin } from "lucide-react";
import { Button } from "@/components/ui/button";

const socialLinks = [
  { icon: Twitter, href: "#" },
  { icon: Facebook, href: "#" },
  { icon: Instagram, href: "#" },
  { icon: Linkedin, href: "#" },
];

export default async function Footer() {

  const footerLinks = [
    { title: "Company", links: ["About Us", "Careers", "Press", "For Doctors"] },
    { title: "Resources", links: ["Blog", "Help Center", "Contact Us", "Privacy Policy"] },
    { title: "Services", links: ["AI Checker", "Find a Doctor", "Wellness", "Emergency"] },
  ];

  return (
    <footer className="bg-muted/40">
      <div className="container py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div className="md:col-span-1">
            <h3 className="text-xl font-bold font-headline">RAMS.com</h3>
            <p className="mt-2 text-muted-foreground">Your health companion.</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 md:col-span-3 gap-8">
            {footerLinks.map((section) => (
              <div key={section.title}>
                <h4 className="font-semibold">{section.title}</h4>
                <ul className="mt-4 space-y-2">
                  {section.links.map((link) => (
                    <li key={link}>
                      <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                        {link}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-12 pt-8 border-t flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-muted-foreground text-sm">© {new Date().getFullYear()} RAMS.com. All rights reserved.</p>
          <div className="flex gap-2">
            {socialLinks.map((social, index) => (
              <Button key={index} variant="ghost" size="icon" asChild>
                <Link href={social.href}>
                  <social.icon className="h-5 w-5" />
                  <span className="sr-only">{social.icon.displayName}</span>
                </Link>
              </Button>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
