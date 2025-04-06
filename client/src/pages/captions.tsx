import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Caption } from "@/lib/types";
import { format } from "date-fns";

const Captions = () => {
  const [captionText, setCaptionText] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch captions
  const { data: captions = [], isLoading } = useQuery<Caption[]>({
    queryKey: ['/api/captions'],
  });

  // Add caption mutation
  const addCaptionMutation = useMutation({
    mutationFn: async (content: string) => {
      const response = await apiRequest('POST', '/api/captions', { content });
      return response.json();
    },
    onSuccess: () => {
      setCaptionText("");
      queryClient.invalidateQueries({ queryKey: ['/api/captions'] });
      toast({
        title: "Caption added",
        description: "Your caption has been saved successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to add caption",
        variant: "destructive",
      });
    },
  });

  // Delete caption mutation
  const deleteCaptionMutation = useMutation({
    mutationFn: async (captionId: number) => {
      await apiRequest('DELETE', `/api/captions/${captionId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/captions'] });
      toast({
        title: "Caption deleted",
        description: "The caption has been removed successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete caption",
        variant: "destructive",
      });
    },
  });

  const handleAddCaption = () => {
    if (!captionText.trim()) {
      toast({
        title: "Empty caption",
        description: "Please enter a caption first.",
        variant: "destructive",
      });
      return;
    }

    addCaptionMutation.mutate(captionText);
  };

  // Format date
  const formatDate = (dateString: string | Date) => {
    try {
      const date = new Date(dateString);
      return format(date, 'MMM d, yyyy h:mm a');
    } catch (error) {
      return 'Invalid date';
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold mb-6">Captions</h2>
      
      {/* Caption Editor */}
      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-medium mb-4">New Caption</h3>
          <div className="mb-4">
            <Textarea
              rows={4}
              placeholder="Enter your caption here..."
              value={captionText}
              onChange={(e) => setCaptionText(e.target.value)}
              className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
          <Button 
            onClick={handleAddCaption}
            disabled={addCaptionMutation.isPending || !captionText.trim()}
            className="flex items-center"
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
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            Add Caption
          </Button>
        </CardContent>
      </Card>
      
      {/* Captions List */}
      <Card>
        <CardContent className="p-6">
          {isLoading ? (
            <div className="flex justify-center py-8">
              <p>Loading captions...</p>
            </div>
          ) : captions.length === 0 ? (
            <div className="flex justify-center items-center py-12 text-neutral-500">
              <div className="text-center">
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-12 w-12 mx-auto mb-4 opacity-30" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="1" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                >
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                </svg>
                <p>No captions yet. Create one above!</p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {captions.map((caption) => (
                <div 
                  key={caption.id} 
                  className="border border-neutral-200 rounded-md p-4 relative hover:border-neutral-300 transition"
                >
                  <div className="mb-2">
                    <p className="whitespace-pre-wrap">{caption.content}</p>
                  </div>
                  <div className="flex justify-between items-center text-sm text-neutral-500">
                    <span>{formatDate(caption.createdAt)}</span>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-8 px-2 text-red-600 hover:text-red-800 hover:bg-red-50"
                      onClick={() => deleteCaptionMutation.mutate(caption.id)}
                      disabled={deleteCaptionMutation.isPending}
                    >
                      <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        className="h-4 w-4" 
                        viewBox="0 0 24 24" 
                        fill="none" 
                        stroke="currentColor" 
                        strokeWidth="2" 
                        strokeLinecap="round" 
                        strokeLinejoin="round"
                      >
                        <polyline points="3 6 5 6 21 6"></polyline>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                        <line x1="10" y1="11" x2="10" y2="17"></line>
                        <line x1="14" y1="11" x2="14" y2="17"></line>
                      </svg>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Captions;
