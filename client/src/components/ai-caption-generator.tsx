import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { apiRequest } from "@/lib/queryClient";
import { Loader2 } from "lucide-react";
// Import check_secrets when implemented
// import { check_secrets } from "@/lib/api";

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

const AICaptionGenerator = () => {
  const [prompt, setPrompt] = useState("");
  const [tone, setTone] = useState("casual");
  const [length, setLength] = useState<'short' | 'medium' | 'long'>('medium');
  const [keywords, setKeywords] = useState("");
  const [creativity, setCreativity] = useState(70);
  const [languageStyle, setLanguageStyle] = useState("simple");
  const [includeEmoji, setIncludeEmoji] = useState(true);
  const [hasApiKey, setHasApiKey] = useState<boolean | null>(null);
  const [generatedCaptions, setGeneratedCaptions] = useState<GeneratedCaption[]>([]);
  const [activeTab, setActiveTab] = useState("generate");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Check for OpenAI API key
  const checkForApiKey = async () => {
    try {
      // This functionality will be implemented later
      // const result = await check_secrets(['OPENAI_API_KEY']);
      // setHasApiKey(result.includes('OPENAI_API_KEY'));
      setHasApiKey(false); // Assume no API key for now
    } catch (error) {
      setHasApiKey(false);
    }
  };

  // Run API key check on component mount
  useState(() => {
    checkForApiKey();
  });

  // Generate caption mutation
  const generateCaptionMutation = useMutation({
    mutationFn: async (data: GenerateAICaptionRequest) => {
      const response = await apiRequest('POST', '/api/ai/generate-caption', data);
      return response.json();
    },
    onSuccess: (data: { captions: GeneratedCaption[] }) => {
      setGeneratedCaptions(data.captions);
      setActiveTab("results");
      toast({
        title: "Captions generated",
        description: `${data.captions.length} captions have been generated successfully.`,
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to generate captions",
        variant: "destructive",
      });
    },
  });

  // Save caption mutation
  const saveCaptionMutation = useMutation({
    mutationFn: async (caption: string) => {
      const response = await apiRequest('POST', '/api/captions', { content: caption });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/captions'] });
      toast({
        title: "Caption saved",
        description: "The caption has been saved to your collection.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to save caption",
        variant: "destructive",
      });
    },
  });

  const handleGenerateCaption = () => {
    if (!prompt) {
      toast({
        title: "Missing prompt",
        description: "Please provide a description or topic for your caption.",
        variant: "destructive",
      });
      return;
    }

    generateCaptionMutation.mutate({
      prompt,
      tone,
      length,
      keywords: keywords.split(",").map(k => k.trim()).filter(k => k),
      creativity: creativity,
      languageStyle,
    });
  };

  const handleSaveCaption = (caption: string) => {
    saveCaptionMutation.mutate(caption);
  };

  const toneOptions = [
    { value: "casual", label: "Casual" },
    { value: "professional", label: "Professional" },
    { value: "humorous", label: "Humorous" },
    { value: "inspirational", label: "Inspirational" },
    { value: "informative", label: "Informative" },
    { value: "persuasive", label: "Persuasive" },
  ];

  const languageStyleOptions = [
    { value: "simple", label: "Simple" },
    { value: "conversational", label: "Conversational" },
    { value: "formal", label: "Formal" },
    { value: "technical", label: "Technical" }
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>AI Caption Generator</CardTitle>
          <CardDescription>
            Generate engaging captions for your Facebook videos using AI
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!hasApiKey && (
            <div className="mb-6 p-4 border border-yellow-200 bg-yellow-50 rounded-md text-yellow-800">
              <h3 className="font-medium mb-2">OpenAI API Key Required</h3>
              <p className="text-sm mb-3">
                To use the AI Caption Generator, you need to provide an OpenAI API key. 
                This allows the system to generate high-quality captions for your videos.
              </p>
              <p className="text-sm">
                Please contact the administrator to add your OpenAI API key to the system.
              </p>
            </div>
          )}

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="generate">Generate</TabsTrigger>
              <TabsTrigger value="results" disabled={generatedCaptions.length === 0}>
                Results {generatedCaptions.length > 0 && `(${generatedCaptions.length})`}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="generate" className="space-y-4 mt-4">
              <div>
                <Label htmlFor="prompt">
                  What should the caption be about?
                </Label>
                <Textarea
                  id="prompt"
                  placeholder="Describe your video or the topic you want to highlight in your caption"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  className="mt-1.5"
                  rows={4}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="tone">Tone</Label>
                  <Select value={tone} onValueChange={setTone}>
                    <SelectTrigger id="tone" className="mt-1.5">
                      <SelectValue placeholder="Select tone" />
                    </SelectTrigger>
                    <SelectContent>
                      {toneOptions.map(option => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="length">Length</Label>
                  <Select 
                    value={length} 
                    onValueChange={(value) => setLength(value as 'short' | 'medium' | 'long')}
                  >
                    <SelectTrigger id="length" className="mt-1.5">
                      <SelectValue placeholder="Select length" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="short">Short (1-2 sentences)</SelectItem>
                      <SelectItem value="medium">Medium (2-3 sentences)</SelectItem>
                      <SelectItem value="long">Long (3-5 sentences)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="keywords">
                    Keywords (comma-separated)
                  </Label>
                  <Input
                    id="keywords"
                    placeholder="Enter keywords to include"
                    value={keywords}
                    onChange={(e) => setKeywords(e.target.value)}
                    className="mt-1.5"
                  />
                </div>

                <div>
                  <Label htmlFor="languageStyle">Language Style</Label>
                  <Select value={languageStyle} onValueChange={setLanguageStyle}>
                    <SelectTrigger id="languageStyle" className="mt-1.5">
                      <SelectValue placeholder="Select language style" />
                    </SelectTrigger>
                    <SelectContent>
                      {languageStyleOptions.map(option => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-1.5">
                  <Label htmlFor="creativity">Creativity Level: {creativity}%</Label>
                </div>
                <Slider
                  id="creativity"
                  min={0}
                  max={100}
                  step={5}
                  value={[creativity]}
                  onValueChange={(values) => setCreativity(values[0])}
                />
                <div className="flex justify-between text-xs text-neutral-500 mt-1">
                  <span>Conservative</span>
                  <span>Balanced</span>
                  <span>Creative</span>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="includeEmoji"
                  checked={includeEmoji}
                  onCheckedChange={setIncludeEmoji}
                />
                <Label htmlFor="includeEmoji">Include emojis</Label>
              </div>
            </TabsContent>

            <TabsContent value="results" className="mt-4">
              {generatedCaptions.length > 0 ? (
                <div className="space-y-4">
                  {generatedCaptions.map((caption, index) => (
                    <Card key={index} className="overflow-hidden">
                      <CardContent className="p-4">
                        <p className="whitespace-pre-wrap mb-4">{caption.content}</p>
                        <div className="flex justify-end space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              navigator.clipboard.writeText(caption.content);
                              toast({
                                title: "Copied",
                                description: "Caption copied to clipboard",
                              });
                            }}
                          >
                            Copy
                          </Button>
                          <Button 
                            size="sm" 
                            onClick={() => handleSaveCaption(caption.content)}
                            disabled={saveCaptionMutation.isPending}
                          >
                            Save
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="py-10 text-center text-neutral-500">
                  Generate captions to see results here
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button 
            variant="outline" 
            onClick={() => {
              setPrompt("");
              setTone("casual");
              setLength("medium");
              setKeywords("");
              setCreativity(70);
              setLanguageStyle("simple");
              setIncludeEmoji(true);
            }}
          >
            Reset
          </Button>
          <Button 
            onClick={handleGenerateCaption}
            disabled={generateCaptionMutation.isPending || !hasApiKey}
          >
            {generateCaptionMutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              "Generate Captions"
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default AICaptionGenerator;