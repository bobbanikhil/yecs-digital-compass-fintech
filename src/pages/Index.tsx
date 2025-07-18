import { ParticleBackground } from '@/components/three/ParticleBackground';
import { YECSDashboard } from '@/components/dashboard/YECSDashboard';

const Index = () => {
  return (
    <div className="relative min-h-screen bg-background overflow-hidden">
      {/* Three.js Particle Background */}
      <ParticleBackground />
      
      {/* Main Dashboard */}
      <YECSDashboard />
    </div>
  );
};

export default Index;
