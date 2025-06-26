
import Link from "next/link";
import HeroSection from "./components/Hero";
import TrustedBySection from "./components/Trusted";
import WorkflowSection from "./components/Core";
import FeaturesSection from "./components/Feature";
import BenefitsSection from "./components/Bennifits";

export default function Home() {
  return (
   < >
   <HeroSection />
   <TrustedBySection/>
   <WorkflowSection/>
   <FeaturesSection/>
   <BenefitsSection/>
   </>
  );
}