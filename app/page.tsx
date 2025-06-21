import { AboutSection } from '@/components/about-section';
import { ServicesSection } from '@/components/services-section';
import { PricingSection } from '@/components/pricing-section';
import { TeamSection } from '@/components/team-section';
import { Footer } from '@/components/footer';
import { EnhancedHeroSection } from '@/components/enhanced-hero-section';

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <EnhancedHeroSection />
      <AboutSection />
      <ServicesSection />
      <PricingSection />
      <TeamSection />
      <Footer />
    </main>
  );
}
