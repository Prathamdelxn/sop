
import Link from "next/link";
import HeroSection from "./components/Hero";
import TrustedBySection from "./components/Trusted";
import WorkflowSection from "./components/Core";
import FeaturesSection from "./components/Feature";
import BenefitsSection from "./components/Bennifits";
import Header from "./components/Header";
import Footer from "./components/Footer";
export default function Home() {
  return (
   < >
   <Header/>
   <HeroSection />
   <TrustedBySection/>
   <WorkflowSection/>
   <FeaturesSection/>
   <BenefitsSection/>
   <Footer/>
   </>
  );
}