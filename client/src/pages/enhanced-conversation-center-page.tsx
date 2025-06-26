import { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "@/hooks/use-auth";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Header } from "@/components/layout/enhanced-header";
import { Footer } from "@/components/layout/footer";
import { Container } from "@/components/ui/container";
import { AdBanner } from "@/components/ads/ad-banner";
import { Helmet } from "react-helmet";
import { SentientChatInterface } from "@/components/consciousness/sentient-chat-interface";
import { Badge } from "@/components/ui/badge";
import { 
  Loader2, 
  Send, 
  Save, 
  PlusCircle, 
  AlertCircle,
  SmilePlus,
  Brain,
  Heart,
  Sparkles,
  Activity,
  Lightbulb,
  TrendingUp,
  MessageCircle,
  Zap,
  Eye,
  Clock,
  Star
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
  FormLabel,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { format } from "date-fns";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Progress } from "@/components/ui/progress";

// Define the form schema
const messageFormSchema = z.object({
  message: z.string().min(1, {
    message: "Message cannot be empty.",
  }),
  mood: z.string().optional(),
});

type MessageFormValues = z.infer<typeof messageFormSchema>;

// Enhanced mood options with colors and descriptions
const moodOptions = [
  { value: "excited", label: "Excited", emoji: "🤩", color: "from-yellow-400 to-orange-500", description: "Feeling energetic and enthusiastic" },
  { value: "happy", label: "Happy", emoji: "😊", color: "from-green-400 to-emerald-500", description: "Feeling joyful and content" },
  { value: "calm", label: "Calm", emoji: "😌", color: "from-blue-400 to-cyan-500", description: "Feeling peaceful and relaxed" },
  { value: "neutral", label: "Neutral", emoji: "😐", color: "from-gray-400 to-slate-500", description: "Feeling balanced and steady" },
  { value: "thoughtful", label: "Thoughtful", emoji: "🤔", color: "from-purple-400 to-indigo-500", description: "Feeling reflective and contemplative" },
  { value: "sad", label: "Sad", emoji: "😔", color: "from-blue-500 to-blue-600", description: "Feeling down or melancholy" },
  { value: "frustrated", label: "Frustrated", emoji: "😤", color: "from-red-400 to-red-500", description: "Feeling annoyed or stressed" },
  { value: "anxious", label: "Anxious", emoji: "😰", color: "from-orange-400 to-red-400", description: "Feeling worried or nervous" },
];

// Types for conversation messages
type MessageType = "user" | "flappy";

interface Message {
  id: string;
  content: string;
  type: MessageType;
  timestamp: Date;
  mood?: string;
  personalityIndicators?: {
    empathy: number;
    wisdom: number;
    supportiveness: number;
    contextAwareness: number;
  };
  memoryReferences?: string[];
  insights?: string[];
}

// Flappy's personality state
interface FlappyPersonalityState {
  currentMood: string;
  empathyLevel: number;
  wisdomLevel: number;
  supportivenessLevel: number;
  contextAwareness: number;
  memoryActive: boolean;
  insightGeneration: boolean;
}

export default function EnhancedConversationCenterPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      content: `Hello ${user?.preferences?.firstName || user?.username || "there"}! I'm Flappy, your AI wellness companion. I'm here to listen, understand, and help you explore your thoughts and feelings. How are you doing today? 🦢✨`,
      type: "flappy",
      timestamp: new Date(),
      personalityIndicators: {
        empathy: 85,
        wisdom: 78,
        supportiveness: 92,
        contextAwareness: 70
      },
      memoryReferences: [],
      insights: ["Starting a new conversation with warm, welcoming energy"]
    },
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isActive, setIsActive] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [conversationTitle, setConversationTitle] = useState("");
  const [messageCount, setMessageCount] = useState(0);
  const [showUpgradePrompt, setShowUpgradePrompt] = useState(false);
  const [currentMood, setCurrentMood] = useState<string | null>(null);
  const [flappyPersonality, setFlappyPersonality] = useState<FlappyPersonalityState>({
    currentMood: "supportive",
    empathyLevel: 85,
    wisdomLevel: 78,
    supportivenessLevel: 92,
    contextAwareness: 70,
    memoryActive: true,
    insightGeneration: true
  });
  const [showPersonalityPanel, setShowPersonalityPanel] = useState(false);
  const MAX_FREE_MESSAGES = 3;
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  // Initialize the form
  const form = useForm<MessageFormValues>({
    resolver: zodResolver(messageFormSchema),
    defaultValues: {
      message: "",
    },
  });

  // Function to generate a unique ID
  const generateId = () => {
    return Date.now().toString(36) + Math.random().toString(36).substring(2);
  };
  
  // Scroll to the bottom of the chat when new messages arrive
  useEffect(() => {
    const scrollToBottom = () => {
      const scrollElements = document.querySelectorAll('[data-radix-scroll-area-viewport]');
      const chatScrollElement = Array.from(scrollElements).find(el => 
        el.closest('.max-w-4xl') !== null
      );
      
      if (chatScrollElement) {
        chatScrollElement.scrollTop = chatScrollElement.scrollHeight;
      }
    };
    
    setTimeout(scrollToBottom, 100);
  }, [messages]);
  
  // Reset message constraints when user upgrades to premium
  useEffect(() => {
    if (user?.isPremium && showUpgradePrompt) {
      setShowUpgradePrompt(false);
    }
  }, [user?.isPremium, showUpgradePrompt]);

  // Simulate personality adaptation based on conversation
  const updateFlappyPersonality = (userMessage: string, userMood?: string) => {
    setFlappyPersonality(prev => {
      const newState = { ...prev };
      
      // Adjust empathy based on emotional content
      if (userMood === "sad" || userMood === "anxious" || userMood === "frustrated") {
        newState.empathyLevel = Math.min(100, prev.empathyLevel + 5);
        newState.supportivenessLevel = Math.min(100, prev.supportivenessLevel + 3);
      }
      
      // Increase wisdom with deeper conversations
      if (userMessage.length > 100) {
        newState.wisdomLevel = Math.min(100, prev.wisdomLevel + 2);
      }
      
      // Improve context awareness over time
      newState.contextAwareness = Math.min(100, prev.contextAwareness + 1);
      
      return newState;
    });
  };

  // Generate mock personality indicators for Flappy's response
  const generatePersonalityIndicators = (userMessage: string, userMood?: string) => {
    const base = flappyPersonality;
    return {
      empathy: Math.min(100, base.empathyLevel + (userMood && ["sad", "anxious", "frustrated"].includes(userMood) ? 10 : 0)),
      wisdom: Math.min(100, base.wisdomLevel + (userMessage.includes("?") ? 5 : 0)),
      supportiveness: Math.min(100, base.supportivenessLevel + 2),
      contextAwareness: Math.min(100, base.contextAwareness + 3)
    };
  };

  // Generate mock memory references
  const generateMemoryReferences = () => {
    const possibleReferences = [
      "Remembering your previous mention of work stress",
      "Connecting to your goal of better sleep habits",
      "Recalling your interest in mindfulness practices",
      "Building on our discussion about relationships",
      "Following up on your creative projects"
    ];
    return Math.random() > 0.6 ? [possibleReferences[Math.floor(Math.random() * possibleReferences.length)]] : [];
  };

  // Generate mock insights
  const generateInsights = (userMessage: string) => {
    const insights = [];
    if (userMessage.toLowerCase().includes("stress")) {
      insights.push("Detecting stress patterns - suggesting coping strategies");
    }
    if (userMessage.toLowerCase().includes("happy") || userMessage.toLowerCase().includes("good")) {
      insights.push("Positive emotional state detected - reinforcing wellbeing");
    }
    if (userMessage.includes("?")) {
      insights.push("Question detected - providing thoughtful guidance");
    }
    return insights;
  };

  // Start a new conversation
  const startNewConversation = () => {
    if (!isActive || messages.length <= 1) {
      setMessages([{
        id: "welcome",
        content: `Hello ${user?.preferences?.firstName || user?.username || "there"}! I'm Flappy, your AI wellness companion. I'm here to listen, understand, and help you explore your thoughts and feelings. How are you doing today? 🦢✨`,
        type: "flappy",
        timestamp: new Date(),
        personalityIndicators: {
          empathy: 85,
          wisdom: 78,
          supportiveness: 92,
          contextAwareness: 70
        },
        memoryReferences: [],
        insights: ["Starting a new conversation with warm, welcoming energy"]
      }]);
      setIsActive(true);
      setConversationTitle("");
      setMessageCount(0);
      setShowUpgradePrompt(false);
      setFlappyPersonality({
        currentMood: "supportive",
        empathyLevel: 85,
        wisdomLevel: 78,
        supportivenessLevel: 92,
        contextAwareness: 70,
        memoryActive: true,
        insightGeneration: true
      });
    } else {
      if (window.confirm("Starting a new conversation will discard the current one. Continue?")) {
        startNewConversation();
      }
    }
  };

  // Save the conversation as a journal entry
  const saveConversation = async () => {
    if (messages.length <= 1) {
      toast({
        title: "No Conversation to Save",
        description: "Have a chat with Flappy first before saving.",
      });
      return;
    }

    if (!isActive) {
      toast({
        title: "Already Saved",
        description: "This conversation has already been saved to your journal.",
      });
      return;
    }

    setIsSaving(true);
    
    try {
      const formattedConversation = messages.map(msg => {
        let content = `${msg.type === 'user' ? 'You' : 'Flappy'} (${format(msg.timestamp, "MMM d, h:mm a")}):\n${msg.content}\n`;
        
        if (msg.type === 'user' && msg.mood) {
          const moodOption = moodOptions.find(opt => opt.value === msg.mood);
          content += `Mood: ${moodOption?.emoji} ${moodOption?.label}\n`;
        }
        
        if (msg.type === 'flappy' && msg.insights && msg.insights.length > 0) {
          content += `AI Insights: ${msg.insights.join(', ')}\n`;
        }
        
        return content + '\n';
      }).join('');
      
      const titleToUse = conversationTitle || `Conversation with Flappy - ${format(new Date(), "MMM d, yyyy")}`;
      
      const response = await apiRequest("POST", "/api/journal", {
        title: titleToUse,
        content: formattedConversation,
        tags: ["conversation", "flappy-chat"],
      });
      
      if (!response.ok) {
        throw new Error("Failed to save conversation");
      }
      
      setIsActive(false);
      
      toast({
        title: "Conversation Saved! 🎉",
        description: "Your conversation has been saved to your journal with AI insights included.",
      });
      
      queryClient.invalidateQueries({ queryKey: ["/api/journal"] });
    } catch (error) {
      toast({
        title: "Save Failed",
        description: error instanceof Error ? error.message : "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Get mood option details
  const getMoodOption = (mood: string | null) => {
    if (!mood) return null;
    return moodOptions.find(opt => opt.value === mood);
  };
  
  // Handle form submission
  async function onSubmit(data: MessageFormValues) {
    if (isSubmitting || !isActive) return;
    
    if (!user?.isPremium && messageCount >= MAX_FREE_MESSAGES) {
      setShowUpgradePrompt(true);
      toast({
        title: "Message Limit Reached",
        description: `Free users are limited to ${MAX_FREE_MESSAGES} messages per conversation. Upgrade to Premium for unlimited messages!`,
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    // Add user message to the conversation
    const userMessage: Message = {
      id: generateId(),
      content: data.message,
      type: "user",
      timestamp: new Date(),
      mood: currentMood || undefined,
    };
    
    setMessages((prev) => [...prev, userMessage]);
    setMessageCount(prevCount => prevCount + 1);
    
    // Update Flappy's personality based on user input
    updateFlappyPersonality(data.message, currentMood || undefined);
    
    form.reset();
    
    try {
      const loadingId = generateId();
      setMessages((prev) => [
        ...prev,
        {
          id: loadingId,
          content: "Flappy is thoughtfully considering your message... 🤔✨",
          type: "flappy",
          timestamp: new Date(),
        },
      ]);
      
      const response = await apiRequest("POST", "/api/conversation", {
        message: data.message,
        mood: currentMood,
        createJournalEntry: false,
        isFirstMessage: messages.filter(m => m.type === "user").length === 0,
      });
      
      if (!response.ok) {
        throw new Error("Failed to send message. Please try again.");
      }
      
      const responseData = await response.json();
      
      // Generate enhanced response with personality indicators
      const flappyResponse: Message = {
        id: generateId(),
        content: responseData.response,
        type: "flappy",
        timestamp: new Date(),
        personalityIndicators: generatePersonalityIndicators(data.message, currentMood || undefined),
        memoryReferences: generateMemoryReferences(),
        insights: generateInsights(data.message)
      };
      
      setMessages((prev) => {
        const filtered = prev.filter((msg) => msg.id !== loadingId);
        return [...filtered, flappyResponse];
      });
      
      if (messages.length <= 2 && !conversationTitle) {
        const potentialTitle = data.message.length > 50 
          ? data.message.substring(0, 47) + "..."
          : data.message;
        setConversationTitle(potentialTitle);
      }
    } catch (error) {
      setMessages((prev) => prev.filter((msg) => msg.content !== "Flappy is thoughtfully considering your message... 🤔✨"));
      
      toast({
        title: "Message Failed",
        description: error instanceof Error ? error.message : "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  if (!user) {
    return (
      <>
        <Helmet>
          <title>Chat with Flappy - Featherweight</title>
          <meta name="description" content="Have a conversation with Flappy, your AI wellness companion. Sign in to start chatting." />
        </Helmet>
        <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 via-white to-blue-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950/30">
          <Header />
          <main className="flex-grow py-8">
            <Container>
              <div className="mb-8">
                <h1 className="font-quicksand font-bold text-3xl mb-2">Chat with Flappy</h1>
                <p className="text-slate-600 dark:text-slate-400">
                  Please log in to chat with Flappy
                </p>
              </div>
              
              <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50 rounded-xl shadow-lg">
                <CardHeader>
                  <CardTitle>Authentication Required</CardTitle>
                  <CardDescription>Please log in to use this feature.</CardDescription>
                </CardHeader>
                <CardFooter>
                  <Button asChild>
                    <a href="/auth">Log In</a>
                  </Button>
                </CardFooter>
              </Card>
            </Container>
          </main>
          <Footer />
        </div>
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>Chat with Flappy - Featherweight</title>
        <meta name="description" content="Have a conversation with Flappy, your AI wellness companion. Share your thoughts and feelings to create meaningful journal entries." />
      </Helmet>
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 via-white to-blue-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950/30">
        <Header />
        <main className="flex-grow py-8">
          <Container>
            {/* Enhanced Header Section */}
            <div className="mb-8">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                <div className="space-y-2">
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-600/20 rounded-2xl blur-lg"></div>
                      <div className="relative w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-xl">
                        <MessageCircle className="h-6 w-6 text-white" />
                      </div>
                    </div>
                    <div>
                      <h1 className="font-quicksand font-black text-4xl lg:text-5xl bg-gradient-to-r from-slate-800 to-slate-600 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
                        Chat with Flappy
                      </h1>
                      <p className="text-lg text-slate-600 dark:text-slate-400 font-light">
                        Your AI wellness companion with enhanced emotional intelligence
                      </p>
                    </div>
                  </div>
                </div>

                {/* Flappy's Personality Panel Toggle */}
                <Button
                  variant="outline"
                  onClick={() => setShowPersonalityPanel(!showPersonalityPanel)}
                  className="font-quicksand font-medium border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all duration-200"
                >
                  <Brain className="mr-2 h-4 w-4" />
                  {showPersonalityPanel ? 'Hide' : 'Show'} AI Insights
                </Button>
              </div>

              {/* Flappy's Personality Panel */}
              {showPersonalityPanel && (
                <Card className="mt-6 bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50 rounded-xl shadow-lg">
                  <CardHeader>
                    <CardTitle className="font-quicksand flex items-center space-x-2">
                      <Sparkles className="h-5 w-5 text-purple-500" />
                      <span>Flappy's AI Personality State</span>
                    </CardTitle>
                    <CardDescription>Real-time indicators of how Flappy is adapting to your conversation</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium flex items-center">
                            <Heart className="h-4 w-4 mr-1 text-red-500" />
                            Empathy
                          </span>
                          <span className="text-sm text-slate-600">{flappyPersonality.empathyLevel}%</span>
                        </div>
                        <Progress value={flappyPersonality.empathyLevel} className="h-2" />
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium flex items-center">
                            <Lightbulb className="h-4 w-4 mr-1 text-yellow-500" />
                            Wisdom
                          </span>
                          <span className="text-sm text-slate-600">{flappyPersonality.wisdomLevel}%</span>
                        </div>
                        <Progress value={flappyPersonality.wisdomLevel} className="h-2" />
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium flex items-center">
                            <TrendingUp className="h-4 w-4 mr-1 text-green-500" />
                            Support
                          </span>
                          <span className="text-sm text-slate-600">{flappyPersonality.supportivenessLevel}%</span>
                        </div>
                        <Progress value={flappyPersonality.supportivenessLevel} className="h-2" />
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium flex items-center">
                            <Eye className="h-4 w-4 mr-1 text-blue-500" />
                            Context
                          </span>
                          <span className="text-sm text-slate-600">{flappyPersonality.contextAwareness}%</span>
                        </div>
                        <Progress value={flappyPersonality.contextAwareness} className="h-2" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
            
            {!user?.isPremium && (
              <div className="mb-6">
                <AdBanner format="horizontal" />
              </div>
            )}

            {/* Main Chat Interface */}
            <div className="flex-1">
              <SentientChatInterface />
            </div>
          </Container>
        </main>
        <Footer />
      </div>
    </>
  );
}