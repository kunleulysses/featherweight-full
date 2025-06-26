import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Loader2, 
  Sparkles, 
  FileText, 
  Tags, 
  TrendingUp,
  Calendar,
  Brain,
  Target,
  Download,
  RefreshCw
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";

interface JournalSummary {
  summary: string;
  insights: string[];
  moodAnalysis: {
    averageMood: number;
    moodTrend: string;
    dominantEmotions: string[];
    challengingDays: number;
    positiveStreak: number;
  } | null;
  themes: Array<{
    name: string;
    frequency: number;
    sentiment: string;
  }>;
  entryCount: number;
  timeframe: {
    start: string;
    end: string;
    period: string;
  };
  generatedAt: string;
}

interface TagsResponse {
  tags: Array<{
    tag: string;
    count: number;
    entryIds: number[];
  }>;
  totalTags: number;
  totalEntries: number;
}

interface TagGenerationResponse {
  message: string;
  updatedEntries: number;
  generatedTags: string[];
  entries: Array<{
    id: number;
    title: string;
    tags: string[];
  }>;
}

export function JournalAnalytics() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);
  const [isGeneratingTags, setIsGeneratingTags] = useState(false);
  const [isLoadingTags, setIsLoadingTags] = useState(false);
  const [summary, setSummary] = useState<JournalSummary | null>(null);
  const [userTags, setUserTags] = useState<TagsResponse | null>(null);
  const [tagGeneration, setTagGeneration] = useState<TagGenerationResponse | null>(null);
  const [selectedTimeframe, setSelectedTimeframe] = useState<string>("month");

  const generateSummary = async () => {
    if (!user) return;
    
    setIsGeneratingSummary(true);
    try {
      const response = await apiRequest("POST", "/api/journal/summary", {
        timeframe: selectedTimeframe,
        includeInsights: true,
        includeMoodAnalysis: true,
        includeThemes: true,
      });

      if (!response.ok) {
        throw new Error("Failed to generate summary");
      }

      const data = await response.json();
      setSummary(data);
      
      toast({
        title: "Summary Generated! ✨",
        description: `Your ${selectedTimeframe} summary is ready with AI insights.`,
      });
    } catch (error) {
      toast({
        title: "Generation Failed",
        description: error instanceof Error ? error.message : "Something went wrong.",
        variant: "destructive",
      });
    } finally {
      setIsGeneratingSummary(false);
    }
  };

  const generateTags = async () => {
    if (!user) return;
    
    setIsGeneratingTags(true);
    try {
      const response = await apiRequest("POST", "/api/journal/tags/generate", {
        timeframe: selectedTimeframe,
        regenerate: false,
      });

      if (!response.ok) {
        throw new Error("Failed to generate tags");
      }

      const data = await response.json();
      setTagGeneration(data);
      
      toast({
        title: "Tags Generated! 🏷️",
        description: `Generated tags for ${data.updatedEntries} entries.`,
      });
      
      // Refresh user tags
      loadUserTags();
    } catch (error) {
      toast({
        title: "Generation Failed",
        description: error instanceof Error ? error.message : "Something went wrong.",
        variant: "destructive",
      });
    } finally {
      setIsGeneratingTags(false);
    }
  };

  const loadUserTags = async () => {
    if (!user) return;
    
    setIsLoadingTags(true);
    try {
      const response = await apiRequest("GET", "/api/journal/tags");

      if (!response.ok) {
        throw new Error("Failed to load tags");
      }

      const data = await response.json();
      setUserTags(data);
    } catch (error) {
      toast({
        title: "Loading Failed",
        description: error instanceof Error ? error.message : "Failed to load tags.",
        variant: "destructive",
      });
    } finally {
      setIsLoadingTags(false);
    }
  };

  const getMoodColor = (mood: number) => {
    if (mood >= 8) return "text-green-600";
    if (mood >= 6) return "text-yellow-600";
    if (mood >= 4) return "text-orange-600";
    return "text-red-600";
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case "positive": return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400";
      case "negative": return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400";
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400";
    }
  };

  return (
    <div className="space-y-6">
      {/* Controls */}
      <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50 rounded-xl shadow-lg">
        <CardHeader>
          <CardTitle className="font-quicksand flex items-center space-x-2">
            <Brain className="h-5 w-5 text-purple-500" />
            <span>Journal Analytics & AI Tools</span>
          </CardTitle>
          <CardDescription>Generate insights, summaries, and organize your journal with AI assistance</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 items-end">
            <div className="flex-1">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 block">
                Time Period
              </label>
              <Select value={selectedTimeframe} onValueChange={setSelectedTimeframe}>
                <SelectTrigger className="bg-white/50 dark:bg-slate-900/50 border-slate-200/50 dark:border-slate-700/50 rounded-lg">
                  <SelectValue placeholder="Select timeframe" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="week">Past Week</SelectItem>
                  <SelectItem value="month">Past Month</SelectItem>
                  <SelectItem value="quarter">Past Quarter</SelectItem>
                  <SelectItem value="year">Past Year</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex gap-2">
              <Button
                onClick={generateSummary}
                disabled={isGeneratingSummary}
                className="font-quicksand font-medium bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0 rounded-lg"
              >
                {isGeneratingSummary ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <FileText className="mr-2 h-4 w-4" />
                    Generate Summary
                  </>
                )}
              </Button>
              
              <Button
                onClick={generateTags}
                disabled={isGeneratingTags}
                variant="outline"
                className="font-quicksand font-medium rounded-lg"
              >
                {isGeneratingTags ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Tags className="mr-2 h-4 w-4" />
                    Generate Tags
                  </>
                )}
              </Button>
              
              <Button
                onClick={loadUserTags}
                disabled={isLoadingTags}
                variant="outline"
                className="font-quicksand font-medium rounded-lg"
              >
                {isLoadingTags ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <RefreshCw className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      <Tabs defaultValue="summary" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3 bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50 rounded-xl p-1">
          <TabsTrigger 
            value="summary" 
            className="font-quicksand font-medium data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-500 data-[state=active]:text-white rounded-lg transition-all duration-200"
          >
            <FileText className="mr-2 h-4 w-4" />
            Summary
          </TabsTrigger>
          <TabsTrigger 
            value="tags" 
            className="font-quicksand font-medium data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-500 data-[state=active]:text-white rounded-lg transition-all duration-200"
          >
            <Tags className="mr-2 h-4 w-4" />
            Tags
          </TabsTrigger>
          <TabsTrigger 
            value="insights" 
            className="font-quicksand font-medium data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-500 data-[state=active]:text-white rounded-lg transition-all duration-200"
          >
            <Sparkles className="mr-2 h-4 w-4" />
            AI Insights
          </TabsTrigger>
        </TabsList>

        <TabsContent value="summary" className="space-y-4">
          {summary ? (
            <div className="space-y-4">
              {/* Summary Overview */}
              <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50 rounded-xl shadow-lg">
                <CardHeader>
                  <CardTitle className="font-quicksand flex items-center justify-between">
                    <span>Journal Summary - {summary.timeframe.period}</span>
                    <Badge variant="secondary" className="text-xs">
                      {summary.entryCount} entries
                    </Badge>
                  </CardTitle>
                  <CardDescription>
                    Generated on {new Date(summary.generatedAt).toLocaleDateString()}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="prose dark:prose-invert max-w-none">
                    <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                      {summary.summary}
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Mood Analysis */}
              {summary.moodAnalysis && (
                <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50 rounded-xl shadow-lg">
                  <CardHeader>
                    <CardTitle className="font-quicksand flex items-center space-x-2">
                      <TrendingUp className="h-5 w-5 text-emerald-500" />
                      <span>Mood Analysis</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="text-center">
                        <div className={`text-3xl font-bold ${getMoodColor(summary.moodAnalysis.averageMood)}`}>
                          {summary.moodAnalysis.averageMood.toFixed(1)}
                        </div>
                        <div className="text-sm text-slate-600 dark:text-slate-400">Average Mood</div>
                      </div>
                      <div className="text-center">
                        <div className="text-3xl font-bold text-emerald-600">
                          {summary.moodAnalysis.positiveStreak}
                        </div>
                        <div className="text-sm text-slate-600 dark:text-slate-400">Positive Streak</div>
                      </div>
                      <div className="text-center">
                        <div className="text-3xl font-bold text-blue-600">
                          {summary.moodAnalysis.challengingDays}
                        </div>
                        <div className="text-sm text-slate-600 dark:text-slate-400">Challenging Days</div>
                      </div>
                    </div>
                    <div className="mt-4">
                      <div className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        Dominant Emotions
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {summary.moodAnalysis.dominantEmotions.map((emotion, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {emotion}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Themes */}
              {summary.themes.length > 0 && (
                <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50 rounded-xl shadow-lg">
                  <CardHeader>
                    <CardTitle className="font-quicksand flex items-center space-x-2">
                      <Target className="h-5 w-5 text-purple-500" />
                      <span>Main Themes</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {summary.themes.map((theme, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <Badge className={getSentimentColor(theme.sentiment)}>
                              {theme.sentiment}
                            </Badge>
                            <span className="font-medium">{theme.name}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="text-sm text-slate-600 dark:text-slate-400">
                              {theme.frequency} mentions
                            </span>
                            <div className="w-20">
                              <Progress value={(theme.frequency / 10) * 100} className="h-2" />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Insights */}
              {summary.insights.length > 0 && (
                <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50 rounded-xl shadow-lg">
                  <CardHeader>
                    <CardTitle className="font-quicksand flex items-center space-x-2">
                      <Sparkles className="h-5 w-5 text-amber-500" />
                      <span>Key Insights</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {summary.insights.map((insight, index) => (
                        <li key={index} className="flex items-start space-x-2">
                          <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                          <span className="text-slate-700 dark:text-slate-300">{insight}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}
            </div>
          ) : (
            <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50 rounded-xl shadow-lg">
              <CardContent className="flex items-center justify-center h-64 text-slate-500 dark:text-slate-400">
                <div className="text-center">
                  <FileText className="h-16 w-16 mx-auto mb-4 opacity-50" />
                  <p className="text-lg font-medium">No Summary Generated</p>
                  <p className="text-sm">Click "Generate Summary" to create an AI-powered analysis of your journal entries</p>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="tags" className="space-y-4">
          {userTags ? (
            <div className="space-y-4">
              <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50 rounded-xl shadow-lg">
                <CardHeader>
                  <CardTitle className="font-quicksand flex items-center justify-between">
                    <span>Your Journal Tags</span>
                    <Badge variant="secondary" className="text-xs">
                      {userTags.totalTags} unique tags
                    </Badge>
                  </CardTitle>
                  <CardDescription>
                    Tags from {userTags.totalEntries} journal entries
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {userTags.tags.slice(0, 50).map((tag, index) => (
                      <Badge 
                        key={index} 
                        variant="outline" 
                        className="text-sm hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer transition-colors"
                      >
                        {tag.tag} ({tag.count})
                      </Badge>
                    ))}
                  </div>
                  {userTags.tags.length > 50 && (
                    <p className="text-sm text-slate-600 dark:text-slate-400 mt-4">
                      Showing top 50 tags. Total: {userTags.tags.length}
                    </p>
                  )}
                </CardContent>
              </Card>

              {tagGeneration && (
                <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50 rounded-xl shadow-lg">
                  <CardHeader>
                    <CardTitle className="font-quicksand">Recent Tag Generation</CardTitle>
                    <CardDescription>{tagGeneration.message}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex flex-wrap gap-2">
                        {tagGeneration.generatedTags.map((tag, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      {tagGeneration.entries.length > 0 && (
                        <div className="mt-4">
                          <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                            Updated Entries:
                          </h4>
                          <div className="space-y-2">
                            {tagGeneration.entries.slice(0, 5).map((entry) => (
                              <div key={entry.id} className="text-sm">
                                <span className="font-medium">{entry.title}</span>
                                <div className="flex flex-wrap gap-1 mt-1">
                                  {entry.tags.map((tag, tagIndex) => (
                                    <Badge key={tagIndex} variant="outline" className="text-xs">
                                      {tag}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          ) : (
            <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50 rounded-xl shadow-lg">
              <CardContent className="flex items-center justify-center h-64 text-slate-500 dark:text-slate-400">
                <div className="text-center">
                  <Tags className="h-16 w-16 mx-auto mb-4 opacity-50" />
                  <p className="text-lg font-medium">No Tags Loaded</p>
                  <p className="text-sm">Click the refresh button to load your journal tags</p>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="insights" className="space-y-4">
          <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50 rounded-xl shadow-lg">
            <CardContent className="flex items-center justify-center h-64 text-slate-500 dark:text-slate-400">
              <div className="text-center">
                <Sparkles className="h-16 w-16 mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium">Advanced AI Insights</p>
                <p className="text-sm">Coming soon with deeper pattern analysis and personalized recommendations</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

