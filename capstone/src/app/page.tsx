import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { Sparkles, Users, TrendingUp, Bookmark } from 'lucide-react'

export default async function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black">
      
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-5xl mx-auto text-center">
         
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-500/10 border border-yellow-500/20 rounded-full mb-8">
            <Sparkles className="w-4 h-4 text-yellow-500" />
            <span className="text-yellow-500 text-sm font-medium">
              Empowering voices worldwide
            </span>
          </div>

         
          <h1 className="text-6xl md:text-7xl font-bold mb-6">
            <span className="text-white">Share Your</span>{' '}
            <span className="text-yellow-500">Brilliance</span>
          </h1>

          
          <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-2xl mx-auto">
            A premium publishing platform where exceptional ideas illuminate the
            world.
          </p>

         
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-20">
            <Link href="/auth?mode=signup&redirect=/write">
              <Button
                variant="golden"
                size="lg"
                className="text-lg px-8 py-4"
              >
                Start Writing Today
              </Button>
            </Link>
            <Link href="/posts">
              <Button
                variant="outline-golden"
                size="lg"
                className="text-lg px-8 py-4"
              >
                Explore Stories
              </Button>
            </Link>
          </div>

          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-20 pt-12 border-t border-gray-800">
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-yellow-500 mb-2">
                10K+
              </div>
              <div className="text-gray-300 text-sm md:text-base">
                Active Writers
              </div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-yellow-500 mb-2">
                50K+
              </div>
              <div className="text-gray-300 text-sm md:text-base">
                Stories Published
              </div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-yellow-500 mb-2">
                1M+
              </div>
              <div className="text-gray-300 text-sm md:text-base">
                Monthly Readers
              </div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-yellow-500 mb-2">
                100+
              </div>
              <div className="text-gray-300 text-sm md:text-base">
                Countries
              </div>
            </div>
          </div>

          
          <div className="mb-20">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-center">
              <span className="text-white">Everything You Need to</span>{' '}
              <span className="text-yellow-500">Succeed</span>
            </h2>
            <p className="text-xl text-gray-300 mb-12 text-center">
              Professional tools designed for modern storytellers.
            </p>

            <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              
              <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-8 hover:border-yellow-500/50 transition-colors">
                <div className="w-12 h-12 bg-yellow-500/10 rounded-lg flex items-center justify-center mb-4">
                  <Sparkles className="w-6 h-6 text-yellow-500" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">
                  Rich Editor
                </h3>
                <p className="text-gray-400">
                  Craft beautiful stories with our intuitive editor featuring
                  advanced formatting tools.
                </p>
              </div>

              
              <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-8 hover:border-yellow-500/50 transition-colors">
                <div className="w-12 h-12 bg-yellow-500/10 rounded-lg flex items-center justify-center mb-4">
                  <Users className="w-6 h-6 text-yellow-500" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">
                  Vibrant Community
                </h3>
                <p className="text-gray-400">
                  Connect with passionate readers and writers who share your
                  interests.
                </p>
              </div>

              
              <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-8 hover:border-yellow-500/50 transition-colors">
                <div className="w-12 h-12 bg-yellow-500/10 rounded-lg flex items-center justify-center mb-4">
                  <TrendingUp className="w-6 h-6 text-yellow-500" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">
                  Analytics & Insights
                </h3>
                <p className="text-gray-400">
                  Track your content performance and understand your audience
                  better.
                </p>
              </div>

             
              <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-8 hover:border-yellow-500/50 transition-colors">
                <div className="w-12 h-12 bg-yellow-500/10 rounded-lg flex items-center justify-center mb-4">
                  <Bookmark className="w-6 h-6 text-yellow-500" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">
                  Save & Organize
                </h3>
                <p className="text-gray-400">
                  Bookmark your favorite stories and organize your reading list.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

