import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { ChevronRight, Copy, Save, Wand2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Caption } from "@shared/schema";

interface GenerateAICaptionRequest {
  prompt: string;
  tone?: string;
  length?: 'short' | 'medium' | 'long';
  keywords?: string[];
  creativity?: number;
  languageStyle?: string;
}

interface GeneratedCaption {
  content: string;
  id?: string;
}

const AICaptionsPage = () => {
  const [prompt, setPrompt] = useState("");
  const [creativity, setCreativity] = useState(50);
  const [tone, setTone] = useState("friendly");
  const [length, setLength] = useState<'short' | 'medium' | 'long'>("medium");
  const [keywords, setKeywords] = useState("");
  const [generatedCaption, setGeneratedCaption] = useState<string | null>(null);
  const [languageStyle, setLanguageStyle] = useState("casual");
  const { toast } = useToast();

  const { data: savedCaptions = [] } = useQuery<Caption[]>({
    queryKey: ['/api/captions'],
  });

  const generateMutation = useMutation({
    mutationFn: async (data: GenerateAICaptionRequest) => {
      // Replace with your API endpoint for OpenAI integration
      const res = await apiRequest('POST', '/api/ai/generate-caption', data);
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to generate caption");
      }
      return await res.json();
    },
    onSuccess: (data: { caption: string }) => {
      setGeneratedCaption(data.caption);
      toast({
        title: "Success",
        description: "Caption generated successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to generate caption. Please check your OpenAI API key.",
        variant: "destructive",
      });
    },
  });

  const saveCaptionMutation = useMutation({
    mutationFn: async (caption: string) => {
      const res = await apiRequest('POST', '/api/captions', { content: caption });
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Caption saved successfully",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/captions'] });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to save caption",
        variant: "destructive",
      });
    },
  });

  const handleGenerateCaption = () => {
    if (!prompt) {
      toast({
        title: "Warning",
        description: "Please enter a prompt before generating a caption",
        variant: "destructive",
      });
      return;
    }

    const keywordsArray = keywords
      ? keywords.split(',').map(keyword => keyword.trim()).filter(Boolean)
      : [];

    generateMutation.mutate({
      prompt,
      tone,
      length,
      keywords: keywordsArray,
      creativity: creativity / 100, // Convert to 0-1 range
      languageStyle,
    });
  };

  const handleSaveCaption = () => {
    if (generatedCaption) {
      saveCaptionMutation.mutate(generatedCaption);
    }
  };

  const handleCopyCaption = () => {
    if (generatedCaption) {
      navigator.clipboard.writeText(generatedCaption);
      toast({
        title: "Copied",
        description: "Caption copied to clipboard",
      });
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">AI Caption Generator</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Tabs defaultValue="generate" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="generate">Generate</TabsTrigger>
              <TabsTrigger value="saved">Saved Captions</TabsTrigger>
            </TabsList>

            <TabsContent value="generate">
              <Card>
                <CardHeader>
                  <CardTitle>Create an AI-Generated Caption</CardTitle>
                  <CardDescription>
                    Describe your content and we'll generate an engaging caption
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="prompt">Describe your content</Label>
                    <Textarea
                      id="prompt"
                      placeholder="Enter a description of your video or image content..."
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      className="min-h-[100px]"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="tone">Tone</Label>
                      <Select value={tone} onValueChange={setTone}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select tone" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="friendly">Friendly</SelectItem>
                          <SelectItem value="professional">Professional</SelectItem>
                          <SelectItem value="casual">Casual</SelectItem>
                          <SelectItem value="humorous">Humorous</SelectItem>
                          <SelectItem value="inspirational">Inspirational</SelectItem>
                          <SelectItem value="educational">Educational</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="length">Length</Label>
                      <Select value={length} onValueChange={(value) => setLength(value as 'short' | 'medium' | 'long')}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select length" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="short">Short</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="long">Long</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="keywords">Keywords (comma separated)</Label>
                      <Input
                        id="keywords"
                        placeholder="e.g. trending, viral, facebook"
                        value={keywords}
                        onChange={(e) => setKeywords(e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="languageStyle">Language Style</Label>
                      <Select value={languageStyle} onValueChange={setLanguageStyle}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select style" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="casual">Casual</SelectItem>
                          <SelectItem value="formal">Formal</SelectItem>
                          <SelectItem value="technical">Technical</SelectItem>
                          <SelectItem value="conversational">Conversational</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <Label htmlFor="creativity">Creativity: {creativity}%</Label>
                      </div>
                      <Slider
                        id="creativity"
                        min={0}
                        max={100}
                        step={1}
                        value={[creativity]}
                        onValueChange={(value) => setCreativity(value[0])}
                      />
                    </div>
                  </div>

                  <Button
                    className="w-full"
                    onClick={handleGenerateCaption}
                    disabled={generateMutation.isPending}
                  >
                    {generateMutation.isPending ? (
                      "Generating..."
                    ) : (
                      <>
                        <Wand2 className="mr-2 h-4 w-4" />
                        Generate Caption
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="saved">
              <Card>
                <CardHeader>
                  <CardTitle>Your Saved Captions</CardTitle>
                  <CardDescription>
                    Access your previously saved captions
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {savedCaptions.length > 0 ? (
                    <div className="space-y-4">
                      {savedCaptions.map((caption) => (
                        <Card key={caption.id} className="overflow-hidden">
                          <CardContent className="p-4">
                            <p className="text-sm whitespace-pre-line">{caption.content}</p>
                            <div className="flex justify-end mt-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  navigator.clipboard.writeText(caption.content);
                                  toast({
                                    title: "Copied",
                                    description: "Caption copied to clipboard",
                                  });
                                }}
                              >
                                <Copy className="h-4 w-4 mr-1" /> Copy
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-neutral-500">
                      No saved captions yet. Generate and save some captions!
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        <div>
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Generated Caption</CardTitle>
              <CardDescription>
                Your AI-generated caption will appear here
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {generatedCaption ? (
                <>
                  <div className="bg-neutral-50 p-4 rounded-md border min-h-[200px] whitespace-pre-line">
                    {generatedCaption}
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      onClick={handleSaveCaption}
                      disabled={saveCaptionMutation.isPending}
                      className="flex-1"
                    >
                      <Save className="mr-2 h-4 w-4" />
                      Save
                    </Button>
                    <Button
                      variant="outline"
                      onClick={handleCopyCaption}
                      className="flex-1"
                    >
                      <Copy className="mr-2 h-4 w-4" />
                      Copy
                    </Button>
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center text-center space-y-3 py-12">
                  <div className="rounded-full bg-neutral-100 p-3">
                    <ChevronRight className="h-6 w-6 text-neutral-400" />
                  </div>
                  <p className="text-neutral-500">
                    Generated captions will appear here
                  </p>
                  <div className="flex flex-wrap gap-2 justify-center">
                    <Badge variant="outline">Engaging</Badge>
                    <Badge variant="outline">Optimized</Badge>
                    <Badge variant="outline">AI-Powered</Badge>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AICaptionsPage;