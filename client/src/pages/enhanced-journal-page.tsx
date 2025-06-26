import { useState } from "react";
import { Header } from "@/components/layout/enhanced-header";
import { Footer } from "@/components/layout/footer";
import { Container } from "@/components/ui/container";
import { JournalList } from "@/components/journal/journal-list";
import { JournalSidebar } from "@/components/journal/journal-sidebar";
import { JournalForm } from "@/components/journal/journal-form";
import { WelcomeDialog } from "@/components/welcome-dialog";
import { Advertisement, MockAdvertisement } from "@/components/ui/advertisement";
import { Button } from "@/components/ui/button";
import { Helmet } from 'react-helmet';
import { 
  PlusCircle, 
  Sparkles, 
  TrendingUp, 
  Heart, 
  Brain,
  Calendar,
  Filter,
  Search,
  BarChart3,
  Lightbulb
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

export default function JournalPage() {
  const { user } = useAuth();
  const [filter, setFilter] = useState({
    dateRange: "7days",
    mood: undefined,
    tags: [] as string[],
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <>
      <Helmet>
        <title>My Journal - Featherweight</title>
        <meta name="description" content="View and manage your journal entries from Flappy. Reflect on your journey and explore your thoughts." />
      </Helmet>
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 via-white to-blue-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950/30">
        <Header />
        <main className="flex-grow py-8">
          {/* Welcome Dialog for new users */}
          <WelcomeDialog />
          
          <Container>
            {!user?.isPremium && (
              <div className="mb-6">
                <Advertisement adSlot="8137349583" adFormat="horizontal" className="w-full" />
              </div>
            )}

            {/* Enhanced Header Section */}
            <div className="mb-8">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                <div className="space-y-2">
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-600/20 rounded-2xl blur-lg"></div>
                      <div className="relative w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-xl">
                        <Heart className="h-6 w-6 text-white" />
                      </div>
                    </div>
                    <div>
                      <h1 className="font-quicksand font-black text-4xl lg:text-5xl bg-gradient-to-r from-slate-800 to-slate-600 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
                        My Journal
                      </h1>
                      <p className="text-lg text-slate-600 dark:text-slate-400 font-light">
                        Your personal space for reflection and growth
                      </p>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                      <div className="group relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl blur-lg group-hover:blur-xl transition-all duration-300 opacity-70"></div>
                        <Button className="relative font-quicksand font-semibold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0 rounded-xl px-6 py-3 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200">
                          <PlusCircle className="mr-2 h-5 w-5" />
                          New Entry
                        </Button>
                      </div>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto p-6 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-slate-200/50 dark:border-slate-700/50 rounded-2xl shadow-2xl">
                      <DialogHeader className="mb-6">
                        <DialogTitle className="font-quicksand text-2xl font-bold">Create New Journal Entry</DialogTitle>
                        <DialogDescription className="text-slate-600 dark:text-slate-400">
                          Document your thoughts, feelings, and reflections with Flappy's guidance.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="pb-20 md:pb-0">
                        <JournalForm 
                          onSuccess={() => setIsDialogOpen(false)}
                        />
                      </div>
                    </DialogContent>
                  </Dialog>

                  <Button 
                    variant="outline" 
                    className="font-quicksand font-medium border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all duration-200"
                  >
                    <BarChart3 className="mr-2 h-4 w-4" />
                    View Insights
                  </Button>
                </div>
              </div>

              {/* Quick Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-8">
                <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center">
                        <Calendar className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <p className="text-sm text-slate-600 dark:text-slate-400">This Week</p>
                        <p className="text-2xl font-bold text-slate-900 dark:text-white">5</p>
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
                        <p className="text-sm text-slate-600 dark:text-slate-400">Streak</p>
                        <p className="text-2xl font-bold text-slate-900 dark:text-white">12</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                        <Brain className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <p className="text-sm text-slate-600 dark:text-slate-400">Insights</p>
                        <p className="text-2xl font-bold text-slate-900 dark:text-white">8</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-500 rounded-lg flex items-center justify-center">
                        <Sparkles className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <p className="text-sm text-slate-600 dark:text-slate-400">Mood</p>
                        <p className="text-lg font-semibold text-slate-900 dark:text-white">Positive</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Enhanced Tabs Interface */}
            <Tabs defaultValue="entries" className="space-y-6">
              <TabsList className="grid w-full grid-cols-3 bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50 rounded-xl p-1">
                <TabsTrigger 
                  value="entries" 
                  className="font-quicksand font-medium data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-500 data-[state=active]:text-white rounded-lg transition-all duration-200"
                >
                  <Heart className="mr-2 h-4 w-4" />
                  Journal Entries
                </TabsTrigger>
                <TabsTrigger 
                  value="insights" 
                  className="font-quicksand font-medium data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-500 data-[state=active]:text-white rounded-lg transition-all duration-200"
                >
                  <Lightbulb className="mr-2 h-4 w-4" />
                  AI Insights
                </TabsTrigger>
                <TabsTrigger 
                  value="analytics" 
                  className="font-quicksand font-medium data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-500 data-[state=active]:text-white rounded-lg transition-all duration-200"
                >
                  <BarChart3 className="mr-2 h-4 w-4" />
                  Analytics
                </TabsTrigger>
              </TabsList>

              <TabsContent value="entries" className="space-y-6">
                {/* Search and Filter Bar */}
                <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50 rounded-xl shadow-lg">
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row gap-4">
                      <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <Input
                          placeholder="Search your journal entries..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="pl-10 bg-white/50 dark:bg-slate-900/50 border-slate-200/50 dark:border-slate-700/50 rounded-lg"
                        />
                      </div>
                      <Button variant="outline" className="font-quicksand font-medium rounded-lg">
                        <Filter className="mr-2 h-4 w-4" />
                        Filters
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <div className="flex flex-col lg:flex-row gap-6">
                  {/* Sidebar with filters */}
                  <div className="lg:w-1/4 space-y-6">
                    <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50 rounded-xl shadow-lg">
                      <CardHeader>
                        <CardTitle className="font-quicksand text-lg">Filters</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <JournalSidebar />
                      </CardContent>
                    </Card>
                    
                    {/* Vertical ad for desktop */}
                    {!user?.isPremium && (
                      <div className="hidden lg:block">
                        <Advertisement adSlot="8137349583" adFormat="vertical" className="mx-auto" />
                      </div>
                    )}
                  </div>
                  
                  {/* Journal entries */}
                  <div className="lg:w-3/4">
                    <JournalList filter={filter} />
                    
                    {/* Bottom ad */}
                    {!user?.isPremium && (
                      <div className="mt-8">
                        <Advertisement adSlot="8137349583" adFormat="auto" className="w-full" />
                      </div>
                    )}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="insights" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50 rounded-xl shadow-lg">
                    <CardHeader>
                      <CardTitle className="font-quicksand flex items-center space-x-2">
                        <Lightbulb className="h-5 w-5 text-amber-500" />
                        <span>Recent Insights</span>
                      </CardTitle>
                      <CardDescription>AI-generated insights from your recent entries</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg border border-blue-200/50 dark:border-blue-700/50">
                        <p className="text-sm text-slate-700 dark:text-slate-300">
                          "You've been consistently mentioning work stress in your entries. Consider exploring stress management techniques."
                        </p>
                        <div className="flex items-center justify-between mt-2">
                          <Badge variant="secondary" className="text-xs">Work Patterns</Badge>
                          <span className="text-xs text-slate-500">2 days ago</span>
                        </div>
                      </div>
                      
                      <div className="p-4 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-lg border border-emerald-200/50 dark:border-emerald-700/50">
                        <p className="text-sm text-slate-700 dark:text-slate-300">
                          "Your mood has been consistently positive when you mention time with friends. Social connections seem important to your wellbeing."
                        </p>
                        <div className="flex items-center justify-between mt-2">
                          <Badge variant="secondary" className="text-xs">Social Insights</Badge>
                          <span className="text-xs text-slate-500">5 days ago</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50 rounded-xl shadow-lg">
                    <CardHeader>
                      <CardTitle className="font-quicksand flex items-center space-x-2">
                        <TrendingUp className="h-5 w-5 text-emerald-500" />
                        <span>Growth Patterns</span>
                      </CardTitle>
                      <CardDescription>Positive trends in your journaling journey</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between p-3 bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/20 rounded-lg">
                        <div>
                          <p className="font-medium text-sm">Consistency Streak</p>
                          <p className="text-xs text-slate-600 dark:text-slate-400">12 days of regular journaling</p>
                        </div>
                        <div className="text-2xl font-bold text-emerald-600">📈</div>
                      </div>
                      
                      <div className="flex items-center justify-between p-3 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg">
                        <div>
                          <p className="font-medium text-sm">Emotional Balance</p>
                          <p className="text-xs text-slate-600 dark:text-slate-400">Improved mood stability</p>
                        </div>
                        <div className="text-2xl font-bold text-blue-600">⚖️</div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="analytics" className="space-y-6">
                <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50 rounded-xl shadow-lg">
                  <CardHeader>
                    <CardTitle className="font-quicksand">Analytics Dashboard</CardTitle>
                    <CardDescription>Detailed analytics and visualizations coming soon</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-center h-64 text-slate-500 dark:text-slate-400">
                      <div className="text-center">
                        <BarChart3 className="h-16 w-16 mx-auto mb-4 opacity-50" />
                        <p className="text-lg font-medium">Analytics Dashboard</p>
                        <p className="text-sm">Coming soon with advanced insights and visualizations</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </Container>
        </main>
        <Footer />
      </div>
    </>
  );
}

