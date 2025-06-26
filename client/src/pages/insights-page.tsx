import { useState, useEffect } from "react";
import { Header } from "@/components/layout/enhanced-header";
import { Footer } from "@/components/layout/footer";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Helmet } from 'react-helmet';
import { 
  Brain, 
  TrendingUp, 
  Heart, 
  Lightbulb,
  Calendar,
  Target,
  Sparkles,
  BarChart3,
  PieChart,
  Activity,
  Zap,
  Star,
  ArrowRight,
  RefreshCw,
  Download,
  Share2
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { QuantumConsciousnessDashboard } from "@/components/consciousness/quantum-consciousness-dashboard";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart as RechartsPieChart, Cell, BarChart, Bar } from 'recharts';

// Mock data for demonstration - in real app, this would come from the backend
const mockMoodData = [
  { date: '2024-01-01', mood: 7, entries: 2 },
  { date: '2024-01-02', mood: 6, entries: 1 },
  { date: '2024-01-03', mood: 8, entries: 3 },
  { date: '2024-01-04', mood: 5, entries: 1 },
  { date: '2024-01-05', mood: 9, entries: 2 },
  { date: '2024-01-06', mood: 7, entries: 2 },
  { date: '2024-01-07', mood: 8, entries: 1 },
];

const mockThemeData = [
  { name: 'Work Stress', value: 35, color: '#ef4444' },
  { name: 'Relationships', value: 25, color: '#3b82f6' },
  { name: 'Personal Growth', value: 20, color: '#10b981' },
  { name: 'Health & Wellness', value: 15, color: '#f59e0b' },
  { name: 'Creativity', value: 5, color: '#8b5cf6' },
];

const mockInsights = [
  {
    id: 1,
    type: 'pattern',
    title: 'Weekly Stress Pattern Detected',
    description: 'You tend to experience higher stress levels on Mondays and Wednesdays. Consider planning lighter schedules on these days.',
    confidence: 0.85,
    actionable: true,
    suggestedActions: [
      'Schedule important meetings on Tuesdays or Thursdays',
      'Plan relaxing activities for Monday evenings',
      'Consider meditation before Wednesday meetings'
    ],
    relatedThemes: ['Work Stress', 'Time Management'],
    timeframe: { start: new Date('2024-01-01'), end: new Date('2024-01-31') },
    icon: Calendar,
    color: 'from-red-500 to-orange-500'
  },
  {
    id: 2,
    type: 'growth',
    title: 'Positive Emotional Trajectory',
    description: 'Your emotional well-being shows a 23% improvement over the past month, particularly in areas of self-confidence and optimism.',
    confidence: 0.92,
    actionable: true,
    suggestedActions: [
      'Continue current wellness practices',
      'Document what\'s working well',
      'Share your success strategies with others'
    ],
    relatedThemes: ['Personal Growth', 'Mental Health'],
    timeframe: { start: new Date('2024-01-01'), end: new Date('2024-01-31') },
    icon: TrendingUp,
    color: 'from-emerald-500 to-teal-500'
  },
  {
    id: 3,
    type: 'connection',
    title: 'Social Support Correlation',
    description: 'Your mood consistently improves by 40% on days when you mention spending time with friends or family.',
    confidence: 0.78,
    actionable: true,
    suggestedActions: [
      'Schedule regular social activities',
      'Reach out to friends during difficult times',
      'Consider joining social groups or communities'
    ],
    relatedThemes: ['Relationships', 'Social Connection'],
    timeframe: { start: new Date('2024-01-01'), end: new Date('2024-01-31') },
    icon: Heart,
    color: 'from-pink-500 to-rose-500'
  }
];

export default function InsightsPage() {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedTimeframe, setSelectedTimeframe] = useState('30days');

  const handleRefreshInsights = async () => {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsLoading(false);
  };

  return (
    <>
      <Helmet>
        <title>AI Insights - Featherweight</title>
        <meta name="description" content="Discover patterns, trends, and insights from your journaling journey with Flappy's AI analysis." />
      </Helmet>
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 via-white to-indigo-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950/30">
        <Header />
        <main className="flex-grow py-8">
          <Container>
            {/* Enhanced Header Section */}
            <div className="mb-8">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                <div className="space-y-2">
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-indigo-600/20 rounded-2xl blur-lg"></div>
                      <div className="relative w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-xl">
                        <Brain className="h-6 w-6 text-white" />
                      </div>
                    </div>
                    <div>
                      <h1 className="font-quicksand font-black text-4xl lg:text-5xl bg-gradient-to-r from-slate-800 to-slate-600 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
                        AI Insights
                      </h1>
                      <p className="text-lg text-slate-600 dark:text-slate-400 font-light">
                        Discover patterns and growth opportunities in your journey
                      </p>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button 
                    onClick={handleRefreshInsights}
                    disabled={isLoading}
                    variant="outline" 
                    className="font-quicksand font-medium border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all duration-200"
                  >
                    <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                    {isLoading ? 'Analyzing...' : 'Refresh Insights'}
                  </Button>

                  <Button 
                    variant="outline" 
                    className="font-quicksand font-medium border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all duration-200"
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Export Report
                  </Button>

                  <Button 
                    variant="outline" 
                    className="font-quicksand font-medium border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all duration-200"
                  >
                    <Share2 className="mr-2 h-4 w-4" />
                    Share
                  </Button>
                </div>
              </div>

              {/* Key Metrics Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-8">
                <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center">
                        <Lightbulb className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <p className="text-sm text-slate-600 dark:text-slate-400">Total Insights</p>
                        <p className="text-2xl font-bold text-slate-900 dark:text-white">24</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-lg flex items-center justify-center">
                        <TrendingUp className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <p className="text-sm text-slate-600 dark:text-slate-400">Growth Score</p>
                        <p className="text-2xl font-bold text-slate-900 dark:text-white">87%</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                        <Target className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <p className="text-sm text-slate-600 dark:text-slate-400">Patterns Found</p>
                        <p className="text-2xl font-bold text-slate-900 dark:text-white">12</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-500 rounded-lg flex items-center justify-center">
                        <Zap className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <p className="text-sm text-slate-600 dark:text-slate-400">Confidence</p>
                        <p className="text-2xl font-bold text-slate-900 dark:text-white">92%</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Enhanced Tabs Interface */}
            <Tabs defaultValue="overview" className="space-y-6">
              <TabsList className="grid w-full grid-cols-4 bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50 rounded-xl p-1">
                <TabsTrigger 
                  value="overview" 
                  className="font-quicksand font-medium data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-indigo-500 data-[state=active]:text-white rounded-lg transition-all duration-200"
                >
                  <Sparkles className="mr-2 h-4 w-4" />
                  Overview
                </TabsTrigger>
                <TabsTrigger 
                  value="patterns" 
                  className="font-quicksand font-medium data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-indigo-500 data-[state=active]:text-white rounded-lg transition-all duration-200"
                >
                  <Activity className="mr-2 h-4 w-4" />
                  Patterns
                </TabsTrigger>
                <TabsTrigger 
                  value="themes" 
                  className="font-quicksand font-medium data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-indigo-500 data-[state=active]:text-white rounded-lg transition-all duration-200"
                >
                  <PieChart className="mr-2 h-4 w-4" />
                  Themes
                </TabsTrigger>
                <TabsTrigger 
                  value="growth" 
                  className="font-quicksand font-medium data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-indigo-500 data-[state=active]:text-white rounded-lg transition-all duration-200"
                >
                  <TrendingUp className="mr-2 h-4 w-4" />
                  Growth
                </TabsTrigger>
                <TabsTrigger 
                  value="analytics" 
                  className="font-quicksand font-medium data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-indigo-500 data-[state=active]:text-white rounded-lg transition-all duration-200"
                >
                  <BarChart3 className="mr-2 h-4 w-4" />
                  Analytics
                </TabsTrigger>
                <TabsTrigger 
                  value="consciousness" 
                  className="font-quicksand font-medium data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-blue-500 data-[state=active]:text-white rounded-lg transition-all duration-200"
                >
                  <Brain className="mr-2 h-4 w-4" />
                  Quantum Consciousness
                </TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                {/* Key Insights */}
                <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50 rounded-xl shadow-lg">
                  <CardHeader>
                    <CardTitle className="font-quicksand flex items-center space-x-2">
                      <Star className="h-5 w-5 text-amber-500" />
                      <span>Key Insights</span>
                    </CardTitle>
                    <CardDescription>AI-generated insights from your journaling patterns</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {mockInsights.map((insight) => {
                      const IconComponent = insight.icon;
                      return (
                        <div key={insight.id} className="group p-6 bg-gradient-to-r from-white to-slate-50 dark:from-slate-800 dark:to-slate-700 rounded-xl border border-slate-200/50 dark:border-slate-600/50 hover:shadow-lg transition-all duration-300">
                          <div className="flex items-start space-x-4">
                            <div className={`w-12 h-12 bg-gradient-to-r ${insight.color} rounded-xl flex items-center justify-center shadow-lg`}>
                              <IconComponent className="h-6 w-6 text-white" />
                            </div>
                            <div className="flex-1 space-y-3">
                              <div className="flex items-center justify-between">
                                <h3 className="font-quicksand font-semibold text-lg text-slate-900 dark:text-white">
                                  {insight.title}
                                </h3>
                                <Badge variant="secondary" className="text-xs">
                                  {Math.round(insight.confidence * 100)}% confidence
                                </Badge>
                              </div>
                              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                                {insight.description}
                              </p>
                              {insight.actionable && (
                                <div className="space-y-2">
                                  <p className="text-sm font-medium text-slate-700 dark:text-slate-300">Suggested Actions:</p>
                                  <ul className="space-y-1">
                                    {insight.suggestedActions.map((action, index) => (
                                      <li key={index} className="text-sm text-slate-600 dark:text-slate-400 flex items-center space-x-2">
                                        <ArrowRight className="h-3 w-3 text-blue-500" />
                                        <span>{action}</span>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                              <div className="flex items-center space-x-2">
                                {insight.relatedThemes.map((theme) => (
                                  <Badge key={theme} variant="outline" className="text-xs">
                                    {theme}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="patterns" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Mood Trends */}
                  <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50 rounded-xl shadow-lg">
                    <CardHeader>
                      <CardTitle className="font-quicksand">Mood Trends</CardTitle>
                      <CardDescription>Your emotional patterns over time</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={mockMoodData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                          <XAxis dataKey="date" stroke="#64748b" />
                          <YAxis stroke="#64748b" />
                          <Tooltip 
                            contentStyle={{ 
                              backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                              border: '1px solid #e2e8f0',
                              borderRadius: '8px',
                              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                            }} 
                          />
                          <Line 
                            type="monotone" 
                            dataKey="mood" 
                            stroke="url(#moodGradient)" 
                            strokeWidth={3}
                            dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                          />
                          <defs>
                            <linearGradient id="moodGradient" x1="0" y1="0" x2="1" y2="0">
                              <stop offset="0%" stopColor="#3b82f6" />
                              <stop offset="100%" stopColor="#8b5cf6" />
                            </linearGradient>
                          </defs>
                        </LineChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>

                  {/* Weekly Patterns */}
                  <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50 rounded-xl shadow-lg">
                    <CardHeader>
                      <CardTitle className="font-quicksand">Weekly Patterns</CardTitle>
                      <CardDescription>Recurring patterns throughout the week</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">Monday Stress</span>
                          <span className="text-sm text-slate-600">High</span>
                        </div>
                        <Progress value={85} className="h-2" />
                      </div>
                      
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">Weekend Positivity</span>
                          <span className="text-sm text-slate-600">Very High</span>
                        </div>
                        <Progress value={92} className="h-2" />
                      </div>
                      
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">Wednesday Productivity</span>
                          <span className="text-sm text-slate-600">Medium</span>
                        </div>
                        <Progress value={65} className="h-2" />
                      </div>
                      
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">Friday Energy</span>
                          <span className="text-sm text-slate-600">High</span>
                        </div>
                        <Progress value={78} className="h-2" />
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="themes" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Theme Distribution */}
                  <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50 rounded-xl shadow-lg">
                    <CardHeader>
                      <CardTitle className="font-quicksand">Theme Distribution</CardTitle>
                      <CardDescription>What you write about most</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={300}>
                        <RechartsPieChart>
                          <Pie
                            data={mockThemeData}
                            cx="50%"
                            cy="50%"
                            outerRadius={100}
                            fill="#8884d8"
                            dataKey="value"
                            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                          >
                            {mockThemeData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </RechartsPieChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>

                  {/* Theme Details */}
                  <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50 rounded-xl shadow-lg">
                    <CardHeader>
                      <CardTitle className="font-quicksand">Theme Analysis</CardTitle>
                      <CardDescription>Detailed breakdown of your themes</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {mockThemeData.map((theme, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gradient-to-r from-slate-50 to-white dark:from-slate-700 dark:to-slate-600 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <div 
                              className="w-4 h-4 rounded-full" 
                              style={{ backgroundColor: theme.color }}
                            ></div>
                            <span className="font-medium text-sm">{theme.name}</span>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-semibold">{theme.value}%</p>
                            <p className="text-xs text-slate-500">of entries</p>
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="growth" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Growth Metrics */}
                  <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50 rounded-xl shadow-lg">
                    <CardHeader>
                      <CardTitle className="font-quicksand">Growth Metrics</CardTitle>
                      <CardDescription>Your personal development progress</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">Self-Awareness</span>
                          <span className="text-sm text-emerald-600 font-semibold">+23%</span>
                        </div>
                        <Progress value={87} className="h-3" />
                      </div>
                      
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">Emotional Regulation</span>
                          <span className="text-sm text-emerald-600 font-semibold">+18%</span>
                        </div>
                        <Progress value={74} className="h-3" />
                      </div>
                      
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">Goal Clarity</span>
                          <span className="text-sm text-emerald-600 font-semibold">+31%</span>
                        </div>
                        <Progress value={92} className="h-3" />
                      </div>
                      
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">Stress Management</span>
                          <span className="text-sm text-emerald-600 font-semibold">+15%</span>
                        </div>
                        <Progress value={68} className="h-3" />
                      </div>
                    </CardContent>
                  </Card>

                  {/* Milestones */}
                  <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50 rounded-xl shadow-lg">
                    <CardHeader>
                      <CardTitle className="font-quicksand">Recent Milestones</CardTitle>
                      <CardDescription>Celebrating your achievements</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center space-x-3 p-3 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-lg">
                        <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full flex items-center justify-center">
                          <Star className="h-4 w-4 text-white" />
                        </div>
                        <div>
                          <p className="font-medium text-sm">30-Day Consistency Streak</p>
                          <p className="text-xs text-slate-600 dark:text-slate-400">Achieved 3 days ago</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-3 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg">
                        <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center">
                          <TrendingUp className="h-4 w-4 text-white" />
                        </div>
                        <div>
                          <p className="font-medium text-sm">Emotional Breakthrough</p>
                          <p className="text-xs text-slate-600 dark:text-slate-400">Achieved 1 week ago</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-3 p-3 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg">
                        <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                          <Target className="h-4 w-4 text-white" />
                        </div>
                        <div>
                          <p className="font-medium text-sm">Goal Achievement</p>
                          <p className="text-xs text-slate-600 dark:text-slate-400">Achieved 2 weeks ago</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="analytics" className="space-y-6">
                <JournalAnalytics />
              </TabsContent>

              <TabsContent value="consciousness" className="space-y-6">
                <QuantumConsciousnessDashboard />
              </TabsContent>
            </Tabs>
          </Container>
        </main>
        <Footer />
      </div>
    </>
  );
}

