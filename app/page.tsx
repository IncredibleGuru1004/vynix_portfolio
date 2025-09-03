import Navigation from '@/components/Navigation'
import HeroSection from '@/components/HeroSection'
import ServicesSection from '@/components/ServicesSection'
import PortfolioSection from '@/components/PortfolioSection'
import TeamSection from '@/components/TeamSection'
import ContactSection from '@/components/ContactSection'
import Footer from '@/components/Footer'

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navigation />
      <HeroSection />
      <ServicesSection />
      <PortfolioSection />
      <TeamSection />
      <ContactSection />
      <Footer />
    </main>
  )
}
