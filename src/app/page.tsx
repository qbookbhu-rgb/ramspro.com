import DoctorSearchSection from "@/components/home/doctor-search-section";
import HeroSection from "@/components/home/hero-section";
import HowItWorksSection from "@/components/home/how-it-works-section";
import SpecialtiesSection from "@/components/home/specialties-section";
import WellnessSection from "@/components/home/wellness-section";

export default function Home() {
  return (
    <div className="flex flex-col gap-20 md:gap-32 pb-20 md:pb-32">
      <HeroSection />
      <HowItWorksSection />
      <DoctorSearchSection />
      <SpecialtiesSection />
      <WellnessSection />
    </div>
  );
}
