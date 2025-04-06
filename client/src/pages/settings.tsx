import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { UserProfile, FacebookSettings } from "@/lib/types";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

// Profile form schema
const profileFormSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
});

// Facebook settings form schema
const facebookFormSchema = z.object({
  accessToken: z.string().min(1, {
    message: "Facebook access token is required.",
  }),
  pageId: z.string().min(1, {
    message: "Facebook page ID is required.",
  }),
  uploadFrequency: z.coerce
    .number()
    .min(1, {
      message: "Upload frequency must be at least 1 minute.",
    })
    .max(1440, {
      message: "Upload frequency cannot exceed 1440 minutes (24 hours).",
    }),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;
type FacebookFormValues = z.infer<typeof facebookFormSchema>;

const Settings = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch user data
  const { data: user, isLoading: isLoadingUser } = useQuery<UserProfile>({
    queryKey: ['/api/user'],
  });

  // Fetch Facebook settings
  const { data: facebookSettings, isLoading: isLoadingFBSettings } = useQuery<FacebookSettings>({
    queryKey: ['/api/facebook-settings'],
  });

  // Profile form
  const profileForm = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: "",
      email: "",
    },
    mode: "onChange",
  });

  // Facebook settings form
  const facebookForm = useForm<FacebookFormValues>({
    resolver: zodResolver(facebookFormSchema),
    defaultValues: {
      accessToken: "",
      pageId: "",
      uploadFrequency: 60,
    },
    mode: "onChange",
  });

  // Update forms when data is loaded
  useEffect(() => {
    if (user) {
      profileForm.reset({
        name: user.name,
        email: user.email,
      });
    }
  }, [user, profileForm]);

  useEffect(() => {
    if (facebookSettings) {
      facebookForm.reset({
        accessToken: facebookSettings.accessToken || "",
        pageId: facebookSettings.pageId || "",
        uploadFrequency: facebookSettings.uploadFrequency || 60,
      });
    }
  }, [facebookSettings, facebookForm]);

  // Update profile mutation
  const updateProfileMutation = useMutation({
    mutationFn: async (data: ProfileFormValues) => {
      const response = await apiRequest('PATCH', '/api/user', data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/user'] });
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update profile",
        variant: "destructive",
      });
    },
  });

  // Update Facebook settings mutation
  const updateFacebookSettingsMutation = useMutation({
    mutationFn: async (data: FacebookFormValues) => {
      const response = await apiRequest('POST', '/api/facebook-settings', data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/facebook-settings'] });
      toast({
        title: "Facebook settings updated",
        description: "Your Facebook settings have been updated successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update Facebook settings",
        variant: "destructive",
      });
    },
  });

  const onProfileSubmit = (data: ProfileFormValues) => {
    updateProfileMutation.mutate(data);
  };

  const onFacebookSubmit = (data: FacebookFormValues) => {
    updateFacebookSettingsMutation.mutate(data);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold mb-6">Settings</h2>
      
      {/* Profile Settings */}
      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-medium mb-4">Profile Settings</h3>
          
          <Form {...profileForm}>
            <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-4">
              <FormField
                control={profileForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={profileForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <Button 
                type="submit" 
                className="flex items-center"
                disabled={updateProfileMutation.isPending || !profileForm.formState.isDirty}
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
                  <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
                  <polyline points="17 21 17 13 7 13 7 21"></polyline>
                  <polyline points="7 3 7 8 15 8"></polyline>
                </svg>
                Save Profile
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
      
      {/* Facebook Settings */}
      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-medium mb-4">Facebook Settings</h3>
          
          <Form {...facebookForm}>
            <form onSubmit={facebookForm.handleSubmit(onFacebookSubmit)} className="space-y-4">
              <FormField
                control={facebookForm.control}
                name="accessToken"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Facebook Access Token</FormLabel>
                    <FormControl>
                      <Input 
                        {...field} 
                        placeholder="Enter your Facebook access token" 
                        type="password"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={facebookForm.control}
                name="pageId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Facebook Page ID</FormLabel>
                    <FormControl>
                      <Input 
                        {...field} 
                        placeholder="Enter your Facebook page ID"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={facebookForm.control}
                name="uploadFrequency"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Upload Frequency (minutes)</FormLabel>
                    <FormControl>
                      <Input 
                        {...field} 
                        type="number" 
                        min={1} 
                        max={1440}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <Button 
                type="submit" 
                className="flex items-center"
                disabled={updateFacebookSettingsMutation.isPending || !facebookForm.formState.isDirty}
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
                  <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
                  <polyline points="17 21 17 13 7 13 7 21"></polyline>
                  <polyline points="7 3 7 8 15 8"></polyline>
                </svg>
                Save Facebook Settings
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Settings;
