import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Code2, Trophy, Users, Zap, Shield, Brain } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-hidden">
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/20 via-background to-background opacity-50" />
        <div className="container mx-auto px-4 relative z-10 text-center">
          <div className="inline-block mb-4 px-4 py-1.5 rounded-full border border-primary/30 bg-primary/10 text-primary text-sm font-semibold animate-in fade-in slide-in-from-bottom-4 duration-1000">
            Welcome to the Underworld
          </div>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
            Code Like a <span className="text-primary">Boss</span>.
            <br />
            Rule the <span className="text-red-500">Syndicate</span>.
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10 animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-400">
            Join the elite community of developers. Master algorithms, compete in high-stakes contests, and climb the ranks of the MafiaCoder hierarchy.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-in fade-in slide-in-from-bottom-16 duration-1000 delay-600">
            <Link href="/auth/signup">
              <Button size="lg" className="w-full sm:w-auto text-lg px-8 py-6 bg-primary hover:bg-red-600 shadow-lg shadow-primary/25 transition-all hover:scale-105">
                Join the Family
              </Button>
            </Link>
            <Link href="/auth/login">
              <Button variant="outline" size="lg" className="w-full sm:w-auto text-lg px-8 py-6 border-white/10 hover:bg-white/5 transition-all hover:scale-105">
                Member Login
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 bg-secondary/30 border-y border-white/5">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Code2 className="h-8 w-8 text-primary" />}
              title="Question Bank"
              description="Access a vast archive of problems from top tech giants. Filter by company, difficulty, and topic."
            />
            <FeatureCard
              icon={<Trophy className="h-8 w-8 text-yellow-500" />}
              title="Weekly Contests"
              description="Prove your worth in high-stakes coding battles. Climb the leaderboard and earn respect."
            />
            <FeatureCard
              icon={<Brain className="h-8 w-8 text-purple-500" />}
              title="AI Consigliere"
              description="Stuck on a problem? Our AI assistant provides intelligent hints without giving away the answer."
            />
            <FeatureCard
              icon={<Users className="h-8 w-8 text-blue-500" />}
              title="Clan System"
              description="Form alliances, create families, and compete against rival gangs for territory."
            />
            <FeatureCard
              icon={<Zap className="h-8 w-8 text-orange-500" />}
              title="Real-time Battles"
              description="Challenge other members to 1v1 duels. Winner takes all. Loser sleeps with the fishes."
            />
            <FeatureCard
              icon={<Shield className="h-8 w-8 text-green-500" />}
              title="Rank System"
              description="Start as an Associate and work your way up to become the Don of the coding world."
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-primary/5" />
        <div className="container mx-auto px-4 relative z-10 text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Make an Offer They Can't Refuse?</h2>
          <p className="text-muted-foreground max-w-xl mx-auto mb-8">
            The code doesn't write itself. Your empire awaits. Start your journey today.
          </p>
          <Link href="/auth/signup">
            <Button size="lg" className="text-lg px-10 py-6 bg-white text-black hover:bg-gray-200 transition-all hover:scale-105">
              Start Coding Now
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="p-6 rounded-2xl bg-card border border-white/5 hover:border-primary/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/5 group">
      <div className="mb-4 p-3 rounded-xl bg-secondary w-fit group-hover:scale-110 transition-transform duration-300">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">{title}</h3>
      <p className="text-muted-foreground leading-relaxed">
        {description}
      </p>
    </div>
  );
}
