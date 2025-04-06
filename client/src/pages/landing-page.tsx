import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Calendar, 
  MessageSquare, 
  Video, 
  Facebook, 
  Zap, 
  Clock, 
  Shield, 
  ArrowRight
} from "lucide-react";

const LandingPage = () => {
  const [email, setEmail] = useState("");

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Navigation */}
      <header className="container mx-auto px-4 py-6 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Facebook className="w-8 h-8 text-primary" />
          <span className="text-xl font-bold">SocialManager</span>
        </div>
        <nav className="hidden md:flex space-x-6">
          <a href="#features" className="text-neutral-700 hover:text-primary transition">Features</a>
          <a href="#pricing" className="text-neutral-700 hover:text-primary transition">Pricing</a>
          <a href="#testimonials" className="text-neutral-700 hover:text-primary transition">Testimonials</a>
        </nav>
        <div className="flex items-center space-x-4">
          <Link href="/auth">
            <Button variant="outline">Login</Button>
          </Link>
          <Link href="/auth">
            <Button>Get Started</Button>
          </Link>
        </div>
      </header>

      {/* Hero section */}
      <section className="container mx-auto px-4 py-16 md:py-24 flex flex-col md:flex-row items-center">
        <div className="md:w-1/2 md:pr-12 mb-12 md:mb-0">
          <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-6">
            Simplify Your Facebook Content Management
          </h1>
          <p className="text-xl text-neutral-600 mb-8">
            Upload videos, create AI-powered captions, and schedule posts for your Facebook pages - all in one place.
          </p>
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
            <Link href="/auth">
              <Button size="lg" className="w-full sm:w-auto">
                Start For Free <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <a href="#features">
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                Learn More
              </Button>
            </a>
          </div>
        </div>
        <div className="md:w-1/2 relative">
          <div className="relative bg-neutral-100 rounded-lg shadow-lg p-6 border border-neutral-200">
            <Tabs defaultValue="schedule" className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-4">
                <TabsTrigger value="schedule">Schedule</TabsTrigger>
                <TabsTrigger value="captions">Captions</TabsTrigger>
                <TabsTrigger value="videos">Videos</TabsTrigger>
              </TabsList>
              <TabsContent value="schedule" className="h-80 overflow-hidden">
                <div className="grid grid-cols-7 gap-1 mb-4">
                  {Array.from({ length: 7 }).map((_, i) => (
                    <div key={i} className="text-center py-2 text-sm font-medium text-neutral-600">
                      {['S', 'M', 'T', 'W', 'T', 'F', 'S'][i]}
                    </div>
                  ))}
                  {Array.from({ length: 30 }).map((_, i) => (
                    <div 
                      key={i} 
                      className={`rounded-lg border text-center py-2 ${
                        i === 4 || i === 10 || i === 18 
                          ? 'bg-primary/10 border-primary text-primary' 
                          : 'hover:bg-neutral-50 border-neutral-200'
                      }`}
                    >
                      {i + 1}
                    </div>
                  ))}
                </div>
                <div className="space-y-2">
                  <div className="flex items-center p-2 rounded-lg bg-primary/10 border border-primary">
                    <div className="w-1 h-12 bg-primary rounded-full mr-3"></div>
                    <div>
                      <p className="font-semibold">Product Launch Video</p>
                      <p className="text-sm text-neutral-600">9:00 AM - Apr 5</p>
                    </div>
                  </div>
                  <div className="flex items-center p-2 rounded-lg border border-neutral-200">
                    <div className="w-1 h-12 bg-neutral-300 rounded-full mr-3"></div>
                    <div>
                      <p className="font-semibold">Customer Testimonial</p>
                      <p className="text-sm text-neutral-600">2:00 PM - Apr 11</p>
                    </div>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="captions" className="h-80 overflow-hidden">
                <div className="space-y-2">
                  <div className="font-semibold mb-2">Generated Captions</div>
                  <div className="p-3 rounded-lg border border-neutral-200 bg-neutral-50">
                    <p className="text-sm">
                      ✨ Exciting news! Our new product line is finally here and we couldn't be more thrilled to share it with you all! 
                      Check out our latest video to see the amazing features in action. 
                      #NewProduct #Innovation #ComingSoon
                    </p>
                  </div>
                  <div className="p-3 rounded-lg border border-neutral-200 bg-neutral-50">
                    <p className="text-sm">
                      🎉 We've been working on something special and it's finally ready to share with the world! 
                      Our team has put their heart and soul into this project. 
                      #BigReveal #StayTuned
                    </p>
                  </div>
                  <div className="p-3 rounded-lg border border-primary/30 bg-primary/5">
                    <p className="text-sm">
                      🙌 Thank you for your incredible support! We've reached 10,000 followers and we're just getting started.
                      #Milestone #ThankYou #Community
                    </p>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="videos" className="h-80 overflow-hidden">
                <div className="grid grid-cols-2 gap-3">
                  <div className="border rounded-lg overflow-hidden">
                    <div className="bg-neutral-800 h-32 flex items-center justify-center">
                      <Video className="h-8 w-8 text-white/70" />
                    </div>
                    <div className="p-2">
                      <p className="font-medium text-sm truncate">Product-Demo-Final.mp4</p>
                      <p className="text-xs text-neutral-500">12.4 MB • Apr 2</p>
                    </div>
                  </div>
                  <div className="border rounded-lg overflow-hidden">
                    <div className="bg-neutral-800 h-32 flex items-center justify-center">
                      <Video className="h-8 w-8 text-white/70" />
                    </div>
                    <div className="p-2">
                      <p className="font-medium text-sm truncate">Customer-Story.mp4</p>
                      <p className="text-xs text-neutral-500">8.7 MB • Mar 28</p>
                    </div>
                  </div>
                  <div className="border rounded-lg overflow-hidden">
                    <div className="bg-neutral-800 h-32 flex items-center justify-center">
                      <Video className="h-8 w-8 text-white/70" />
                    </div>
                    <div className="p-2">
                      <p className="font-medium text-sm truncate">Team-Interview.mp4</p>
                      <p className="text-xs text-neutral-500">15.2 MB • Mar 25</p>
                    </div>
                  </div>
                  <div className="border rounded-lg overflow-hidden">
                    <div className="bg-neutral-800 h-32 flex items-center justify-center">
                      <Video className="h-8 w-8 text-white/70" />
                    </div>
                    <div className="p-2">
                      <p className="font-medium text-sm truncate">Social-Promo.mp4</p>
                      <p className="text-xs text-neutral-500">10.1 MB • Mar 20</p>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
          <div className="absolute -bottom-4 -right-4 -z-10 bg-primary/20 h-full w-full rounded-lg"></div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="bg-neutral-50 py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Powerful Features</h2>
            <p className="text-xl text-neutral-600 max-w-3xl mx-auto">
              Manage your Facebook content with ease using our comprehensive suite of tools designed to save you time and boost engagement.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-neutral-200">
              <div className="bg-primary/10 p-3 rounded-full w-14 h-14 flex items-center justify-center mb-4">
                <Video className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Video Management</h3>
              <p className="text-neutral-600">
                Upload, organize, and preview your videos before scheduling them to your Facebook pages.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-sm border border-neutral-200">
              <div className="bg-primary/10 p-3 rounded-full w-14 h-14 flex items-center justify-center mb-4">
                <MessageSquare className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">AI Caption Generator</h3>
              <p className="text-neutral-600">
                Create engaging captions for your content with our AI-powered generator to boost engagement.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-sm border border-neutral-200">
              <div className="bg-primary/10 p-3 rounded-full w-14 h-14 flex items-center justify-center mb-4">
                <Calendar className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Content Calendar</h3>
              <p className="text-neutral-600">
                Schedule your posts with our intuitive calendar interface for consistent posting.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-sm border border-neutral-200">
              <div className="bg-primary/10 p-3 rounded-full w-14 h-14 flex items-center justify-center mb-4">
                <Clock className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Automated Posting</h3>
              <p className="text-neutral-600">
                Set it and forget it - our system automatically posts your content at the scheduled time.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-sm border border-neutral-200">
              <div className="bg-primary/10 p-3 rounded-full w-14 h-14 flex items-center justify-center mb-4">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Secure Platform</h3>
              <p className="text-neutral-600">
                Your content and account information are securely stored and protected at all times.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-sm border border-neutral-200">
              <div className="bg-primary/10 p-3 rounded-full w-14 h-14 flex items-center justify-center mb-4">
                <Zap className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Fast & Reliable</h3>
              <p className="text-neutral-600">
                Our platform is optimized for speed and reliability to ensure your content is posted on time, every time.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Simple, Transparent Pricing</h2>
            <p className="text-xl text-neutral-600 max-w-3xl mx-auto">
              Choose the plan that fits your needs. All plans include core features with different usage limits.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Basic Plan */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-neutral-200 flex flex-col">
              <h3 className="text-xl font-semibold mb-2">Basic</h3>
              <div className="text-3xl font-bold mb-1">$9<span className="text-lg text-neutral-500 font-normal">/month</span></div>
              <p className="text-neutral-600 mb-6">Perfect for small businesses or individuals</p>
              
              <ul className="space-y-3 mb-8 flex-grow">
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>5 Scheduled posts per month</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>20 AI caption generations</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>500MB storage</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>Basic analytics</span>
                </li>
              </ul>
              
              <Link href="/auth">
                <Button variant="outline" className="w-full">Get Started</Button>
              </Link>
            </div>
            
            {/* Pro Plan */}
            <div className="bg-primary text-white p-6 rounded-xl shadow-md flex flex-col relative">
              <div className="absolute -top-4 right-4 bg-yellow-400 text-black text-xs font-bold px-3 py-1 rounded-full">
                POPULAR
              </div>
              <h3 className="text-xl font-semibold mb-2">Pro</h3>
              <div className="text-3xl font-bold mb-1">$29<span className="text-lg text-white/80 font-normal">/month</span></div>
              <p className="text-white/80 mb-6">For growing businesses with regular content</p>
              
              <ul className="space-y-3 mb-8 flex-grow">
                <li className="flex items-start">
                  <span className="mr-2">✓</span>
                  <span>30 Scheduled posts per month</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">✓</span>
                  <span>100 AI caption generations</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">✓</span>
                  <span>2GB storage</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">✓</span>
                  <span>Advanced analytics</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">✓</span>
                  <span>Priority support</span>
                </li>
              </ul>
              
              <Link href="/auth">
                <Button variant="secondary" className="w-full">Get Started</Button>
              </Link>
            </div>
            
            {/* Enterprise Plan */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-neutral-200 flex flex-col">
              <h3 className="text-xl font-semibold mb-2">Enterprise</h3>
              <div className="text-3xl font-bold mb-1">$79<span className="text-lg text-neutral-500 font-normal">/month</span></div>
              <p className="text-neutral-600 mb-6">For brands with high-volume content needs</p>
              
              <ul className="space-y-3 mb-8 flex-grow">
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>Unlimited scheduled posts</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>Unlimited AI caption generations</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>10GB storage</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>Complete analytics suite</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>24/7 priority support</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>Multi-user accounts</span>
                </li>
              </ul>
              
              <Link href="/auth">
                <Button variant="outline" className="w-full">Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="bg-neutral-50 py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">What Our Customers Say</h2>
            <p className="text-xl text-neutral-600 max-w-3xl mx-auto">
              Join thousands of satisfied customers who have transformed their social media management.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-neutral-200">
              <div className="flex items-center mb-4">
                <div className="h-12 w-12 rounded-full bg-neutral-200 flex items-center justify-center text-xl font-bold text-primary">
                  JS
                </div>
                <div className="ml-4">
                  <h4 className="font-semibold">James Smith</h4>
                  <p className="text-sm text-neutral-500">Marketing Director</p>
                </div>
              </div>
              <p className="text-neutral-600">
                "This tool has completely transformed how we manage our Facebook content. The AI captions save us hours each week and the scheduling is flawless."
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-sm border border-neutral-200">
              <div className="flex items-center mb-4">
                <div className="h-12 w-12 rounded-full bg-neutral-200 flex items-center justify-center text-xl font-bold text-primary">
                  LP
                </div>
                <div className="ml-4">
                  <h4 className="font-semibold">Lisa Parker</h4>
                  <p className="text-sm text-neutral-500">Social Media Manager</p>
                </div>
              </div>
              <p className="text-neutral-600">
                "The calendar feature is intuitive and makes planning our content strategy so much easier. Love the AI caption suggestions too!"
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-sm border border-neutral-200">
              <div className="flex items-center mb-4">
                <div className="h-12 w-12 rounded-full bg-neutral-200 flex items-center justify-center text-xl font-bold text-primary">
                  RJ
                </div>
                <div className="ml-4">
                  <h4 className="font-semibold">Robert Johnson</h4>
                  <p className="text-sm text-neutral-500">Small Business Owner</p>
                </div>
              </div>
              <p className="text-neutral-600">
                "As a small business owner, I don't have time for complex tools. This platform is straightforward and effective for maintaining our Facebook presence."
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="bg-primary rounded-xl p-8 md:p-12 text-white text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Transform Your Facebook Content?</h2>
            <p className="text-xl text-white/80 mb-8 max-w-3xl mx-auto">
              Join thousands of businesses that have simplified their content management with our platform.
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
              <Link href="/auth">
                <Button variant="secondary" size="lg">
                  Start Your Free Trial
                </Button>
              </Link>
              <a href="#features">
                <Button variant="outline" size="lg" className="border-white text-white hover:bg-white/10">
                  Learn More
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="bg-neutral-50 py-16">
        <div className="container mx-auto px-4 max-w-3xl text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Stay Updated</h2>
          <p className="text-neutral-600 mb-6">
            Subscribe to our newsletter for the latest features, tips, and social media strategies.
          </p>
          
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0">
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="sm:rounded-r-none"
            />
            <Button className="sm:rounded-l-none">
              Subscribe
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-neutral-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-6">
                <Facebook className="w-6 h-6 text-primary" />
                <span className="text-xl font-bold">SocialManager</span>
              </div>
              <p className="text-neutral-400">
                Simplify your Facebook content management with our all-in-one platform.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold text-lg mb-4">Product</h4>
              <ul className="space-y-2 text-neutral-400">
                <li><a href="#features" className="hover:text-primary transition">Features</a></li>
                <li><a href="#pricing" className="hover:text-primary transition">Pricing</a></li>
                <li><a href="#" className="hover:text-primary transition">Roadmap</a></li>
                <li><a href="#" className="hover:text-primary transition">Changelog</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-lg mb-4">Resources</h4>
              <ul className="space-y-2 text-neutral-400">
                <li><a href="#" className="hover:text-primary transition">Documentation</a></li>
                <li><a href="#" className="hover:text-primary transition">Tutorials</a></li>
                <li><a href="#" className="hover:text-primary transition">Blog</a></li>
                <li><a href="#" className="hover:text-primary transition">Support</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-lg mb-4">Company</h4>
              <ul className="space-y-2 text-neutral-400">
                <li><a href="#" className="hover:text-primary transition">About Us</a></li>
                <li><a href="#" className="hover:text-primary transition">Careers</a></li>
                <li><a href="#" className="hover:text-primary transition">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-primary transition">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-neutral-800 mt-12 pt-8 text-center text-neutral-500">
            <p>&copy; {new Date().getFullYear()} SocialManager. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;