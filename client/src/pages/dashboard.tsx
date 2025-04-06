import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link, useLocation } from "wouter";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { 
  Subscription, 
  UsageMetrics, 
  FacebookSettings, 
  availablePlans 
} from "@/lib/types";

const Dashboard = () => {
  const [_, setLocation] = useLocation();

  const { data: facebookSettings } = useQuery<FacebookSettings>({
    queryKey: ['/api/facebook-settings'],
  });

  const { data: subscription } = useQuery<Subscription>({
    queryKey: ['/api/subscription'],
  });

  const { data: usageMetrics } = useQuery<UsageMetrics>({
    queryKey: ['/api/usage-metrics'],
  });

  const handleGoToSettings = () => {
    setLocation("/settings");
  };

  // Calculate days remaining if expiry date exists
  const getDaysRemaining = () => {
    if (!subscription?.expiresAt) return 0;
    
    const expiryDate = new Date(subscription.expiresAt);
    const today = new Date();
    const diffTime = expiryDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(0, diffDays);
  };

  // Calculate storage used percentage
  const getStoragePercentage = () => {
    if (!subscription || !usageMetrics) return 0;
    const storageMB = usageMetrics.storageUsed / (1024 * 1024); // Convert bytes to MB
    return Math.min(100, (storageMB / subscription.storage) * 100);
  };

  // Calculate tasks used percentage
  const getTasksPercentage = () => {
    if (!subscription || !usageMetrics) return 0;
    return Math.min(100, (usageMetrics.tasksUsed / subscription.tasks) * 100);
  };

  // Format bytes to human-readable format
  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 B';
    
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    
    return parseFloat((bytes / Math.pow(1024, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const needsFacebookConnection = !facebookSettings?.accessToken || !facebookSettings?.pageId;

  return (
    <div className="space-y-6">
      {/* Facebook Connection Alert */}
      {needsFacebookConnection && (
        <Alert variant="warning" className="bg-amber-50 border-l-4 border-amber-400">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-5 w-5 text-amber-400" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
            <line x1="12" y1="9" x2="12" y2="13"></line>
            <line x1="12" y1="17" x2="12.01" y2="17"></line>
          </svg>
          <AlertTitle className="text-amber-800">Facebook Connection Required</AlertTitle>
          <AlertDescription className="mt-2 text-amber-700">
            <p>Please update your Facebook settings before using the tool. You need to:</p>
            <ul className="list-disc list-inside mt-1">
              <li>Add your Facebook Access Token</li>
              <li>Add your Facebook Page ID</li>
            </ul>
            <div className="mt-4">
              <Button 
                variant="outline" 
                className="text-amber-800 bg-amber-100 hover:bg-amber-200 border-transparent"
                onClick={handleGoToSettings}
              >
                Go to Settings →
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      )}
      
      {/* Dashboard Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Subscription Card */}
        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Subscription</h3>
              <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                {subscription?.status === 'active' ? 'Active' : 'Inactive'}
              </span>
            </div>
            <div className="mb-4">
              <h4 className="text-2xl font-bold">{subscription?.plan ? subscription.plan.charAt(0).toUpperCase() + subscription.plan.slice(1) : 'N/A'}</h4>
              <p className="text-neutral-600 text-sm">{subscription?.plan ? subscription.plan + ' plan' : ''}</p>
            </div>
            <div className="flex items-center">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-4 w-4 text-neutral-500 mr-2" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10"></circle>
                <polyline points="12 6 12 12 16 14"></polyline>
              </svg>
              <span className="text-sm text-neutral-600">{getDaysRemaining()} days remaining</span>
            </div>
          </CardContent>
        </Card>

        {/* Storage Card */}
        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Storage</h3>
              <div className="text-neutral-400">
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-5 w-5" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                >
                  <path d="M22 12H2"></path>
                  <path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"></path>
                  <line x1="6" y1="16" x2="6.01" y2="16"></line>
                  <line x1="10" y1="16" x2="10.01" y2="16"></line>
                </svg>
              </div>
            </div>
            <div className="mb-4">
              <div className="flex justify-between mb-1">
                <span className="text-sm text-neutral-600">Used Space</span>
                <span className="text-sm font-medium">{getStoragePercentage().toFixed(0)}%</span>
              </div>
              <Progress value={getStoragePercentage()} className="h-2" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h5 className="text-sm text-neutral-600 mb-1">Used</h5>
                <p className="font-medium">
                  {usageMetrics ? formatBytes(usageMetrics.storageUsed) : '0 B'}
                </p>
              </div>
              <div>
                <h5 className="text-sm text-neutral-600 mb-1">Total</h5>
                <p className="font-medium">
                  {subscription ? subscription.storage + ' MB' : 'N/A'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tasks Card */}
        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Tasks</h3>
              <div className="text-neutral-400">
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-5 w-5" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                >
                  <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
                  <polyline points="17 6 23 6 23 12"></polyline>
                </svg>
              </div>
            </div>
            <div className="mb-4">
              <div className="flex justify-between mb-1">
                <span className="text-sm text-neutral-600">Used Tasks</span>
                <span className="text-sm font-medium">{getTasksPercentage().toFixed(0)}%</span>
              </div>
              <Progress value={getTasksPercentage()} className="h-2" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h5 className="text-sm text-neutral-600 mb-1">Used</h5>
                <p className="font-medium">{usageMetrics?.tasksUsed || 0}</p>
              </div>
              <div>
                <h5 className="text-sm text-neutral-600 mb-1">Total</h5>
                <p className="font-medium">{subscription?.tasks || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-medium mb-4">Quick Actions</h3>
          <div className="space-y-4">
            <Link href="/videos">
              <a className="flex items-center text-neutral-700 hover:text-primary transition">
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-5 w-5 text-neutral-500 mr-3" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                >
                  <polygon points="23 7 16 12 23 17 23 7"></polygon>
                  <rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect>
                </svg>
                <span>Manage Videos</span>
              </a>
            </Link>
            <Link href="/captions">
              <a className="flex items-center text-neutral-700 hover:text-primary transition">
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-5 w-5 text-neutral-500 mr-3" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                >
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                </svg>
                <span>Manage Captions</span>
              </a>
            </Link>
            <Link href="/settings">
              <a className="flex items-center text-neutral-700 hover:text-primary transition">
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-5 w-5 text-neutral-500 mr-3" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                >
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
                <span>Account Settings</span>
              </a>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Available Plans */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold">Available Plans</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {availablePlans.map((plan) => (
            <Card key={plan.id} className="overflow-hidden">
              <CardContent className="p-0">
                <div className="p-6">
                  <h4 className="text-lg font-medium mb-1">{plan.name}</h4>
                  <p className="text-2xl font-bold mb-4">₹{plan.price.toLocaleString()}</p>
                  <ul className="space-y-2">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-center text-sm">
                        <svg 
                          xmlns="http://www.w3.org/2000/svg" 
                          className="h-4 w-4 text-neutral-500 mr-2" 
                          viewBox="0 0 24 24" 
                          fill="none" 
                          stroke="currentColor" 
                          strokeWidth="2" 
                          strokeLinecap="round" 
                          strokeLinejoin="round"
                        >
                          {index === 0 && plan.id === '5day' ? (
                            <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                          ) : (
                            index === 0 ? (
                              <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
                            ) : index === 1 ? (
                              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                            ) : (
                              <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
                            )
                          )}
                        </svg>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="px-6 pb-6">
                  <Button 
                    className="w-full" 
                    onClick={() => window.open('mailto:support@socialmanager.com?subject=Upgrade to ' + plan.name + ' Plan')}
                  >
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      className="h-4 w-4 mr-2" 
                      viewBox="0 0 24 24" 
                      fill="none" 
                      stroke="currentColor" 
                      strokeWidth="2" 
                      strokeLinecap="round" 
                      strokeLinejoin="round"
                    >
                      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
                    </svg>
                    Contact to Upgrade
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
