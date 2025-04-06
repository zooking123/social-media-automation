import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { 
  Card, 
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter
} from "@/components/ui/card";

const HomePage = () => {
  const { user, logoutMutation } = useAuth();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-bold mb-4">Welcome to Facebook Content Manager</h1>
        <p className="text-xl text-neutral-600 max-w-2xl mx-auto">
          Manage your Facebook content, schedule posts, and generate AI captions all in one place.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-2xl">Manage Videos</CardTitle>
            <CardDescription>Upload and organize your video content</CardDescription>
          </CardHeader>
          <CardContent className="pb-2">
            <p className="text-neutral-600">
              Upload videos for your Facebook page and prepare them for scheduling.
            </p>
          </CardContent>
          <CardFooter>
            <Link href="/videos">
              <Button className="w-full">Go to Videos</Button>
            </Link>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-2xl">Create Captions</CardTitle>
            <CardDescription>Manage captions for your content</CardDescription>
          </CardHeader>
          <CardContent className="pb-2">
            <p className="text-neutral-600">
              Create and save engaging captions for your videos and posts.
            </p>
          </CardContent>
          <CardFooter>
            <Link href="/captions">
              <Button className="w-full">Manage Captions</Button>
            </Link>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-2xl">AI Captions</CardTitle>
            <CardDescription>Generate captions using AI</CardDescription>
          </CardHeader>
          <CardContent className="pb-2">
            <p className="text-neutral-600">
              Use AI to generate engaging captions for your Facebook content.
            </p>
          </CardContent>
          <CardFooter>
            <Link href="/ai-captions">
              <Button className="w-full">Generate Captions</Button>
            </Link>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-2xl">Schedule Posts</CardTitle>
            <CardDescription>Plan your content calendar</CardDescription>
          </CardHeader>
          <CardContent className="pb-2">
            <p className="text-neutral-600">
              Schedule your videos and posts for automatic publishing.
            </p>
          </CardContent>
          <CardFooter>
            <Link href="/schedule">
              <Button className="w-full">Schedule Content</Button>
            </Link>
          </CardFooter>
        </Card>
      </div>

      <div className="my-12">
        <h2 className="text-2xl font-bold mb-6 text-center">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-primary text-2xl font-bold">1</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">Upload Your Videos</h3>
            <p className="text-neutral-600">
              Upload your videos to the platform and organize them for easy access.
            </p>
          </div>
          <div className="text-center">
            <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-primary text-2xl font-bold">2</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">Create or Generate Captions</h3>
            <p className="text-neutral-600">
              Write your own captions or use our AI to generate engaging captions for your content.
            </p>
          </div>
          <div className="text-center">
            <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-primary text-2xl font-bold">3</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">Schedule for Publishing</h3>
            <p className="text-neutral-600">
              Schedule your content to be published automatically at the optimal times.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-primary/5 p-8 rounded-lg mb-12">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold mb-2">Ready to Get Started?</h2>
          <p className="text-neutral-600 max-w-lg mx-auto">
            Take control of your Facebook content strategy today.
          </p>
        </div>
        <div className="flex justify-center space-x-4">
          <Link href="/videos">
            <Button size="lg">Upload Videos</Button>
          </Link>
          <Link href="/schedule">
            <Button size="lg" variant="outline">Create Schedule</Button>
          </Link>
        </div>
      </div>

      {user && (
        <div className="text-center text-sm text-neutral-500">
          <p>Logged in as {user.name || user.username}</p>
          <button 
            onClick={() => logoutMutation.mutate()}
            className="text-primary hover:underline mt-1"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
};

export default HomePage;