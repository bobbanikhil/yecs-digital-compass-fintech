import { ParticleBackground } from '@/components/three/ParticleBackground';
import { AdvancedYECSDashboard } from '@/components/dashboard/AdvancedYECSDashboard';

const Index = () => {
  return (
    <div className="relative min-h-screen bg-background overflow-hidden">
      {/* Three.js Particle Background */}
      <ParticleBackground />
      
      {/* Main Dashboard */}
      <AdvancedYECSDashboard />
    </div>
  );
};

export default Index;
