// Multi-Channel Journaling Integration System
// Seamlessly integrates journaling across web, SMS, email, and conversation channels

import React, { useState, useEffect, useRef } from 'react';
import { Send, MessageSquare, Mail, Smartphone, Plus, Search, Filter, Calendar, Tag, Mood, TrendingUp } from 'lucide-react';

// Multi-Channel Journal Interface Component
export const MultiChannelJournalInterface: React.FC = () => {
  const [activeChannel, setActiveChannel] = useState<'web' | 'sms' | 'email' | 'conversation'>('web');
  const [journalEntries, setJournalEntries] = useState([]);
  const [currentEntry, setCurrentEntry] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMood, setSelectedMood] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const channels = [
    { id: 'web', name: 'Web Chat', icon: MessageSquare, color: 'bg-blue-500' },
    { id: 'sms', name: 'SMS', icon: Smartphone, color: 'bg-green-500' },
    { id: 'email', name: 'Email', icon: Mail, color: 'bg-purple-500' },
    { id: 'conversation', name: 'Voice', icon: TrendingUp, color: 'bg-orange-500' }
  ];

  const moods = [
    { id: 'happy', name: 'Happy', emoji: '😊', color: 'text-yellow-500' },
    { id: 'calm', name: 'Calm', emoji: '😌', color: 'text-blue-500' },
    { id: 'neutral', name: 'Neutral', emoji: '😐', color: 'text-gray-500' },
    { id: 'sad', name: 'Sad', emoji: '😢', color: 'text-blue-600' },
    { id: 'frustrated', name: 'Frustrated', emoji: '😤', color: 'text-red-500' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-gray-900">Journal</h1>
              <div className="flex space-x-2">
                {channels.map((channel) => {
                  const Icon = channel.icon;
                  return (
                    <button
                      key={channel.id}
                      onClick={() => setActiveChannel(channel.id as any)}
                      className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-200 ${
                        activeChannel === channel.id
                          ? `${channel.color} text-white shadow-lg`
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      <Icon size={16} />
                      <span className="text-sm font-medium">{channel.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                <input
                  type="text"
                  placeholder="Search entries..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
              <button className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
                <Plus size={16} />
                <span>New Entry</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Sidebar - Filters and Stats */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-6">
              
              {/* Mood Filter */}
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center">
                  <Mood className="mr-2" size={16} />
                  Mood Filter
                </h3>
                <div className="space-y-2">
                  {moods.map((mood) => (
                    <button
                      key={mood.id}
                      onClick={() => setSelectedMood(selectedMood === mood.id ? '' : mood.id)}
                      className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-all ${
                        selectedMood === mood.id
                          ? 'bg-indigo-50 border-indigo-200 border'
                          : 'hover:bg-gray-50'
                      }`}
                    >
                      <span className="text-lg">{mood.emoji}</span>
                      <span className={`text-sm font-medium ${mood.color}`}>{mood.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Date Filter */}
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center">
                  <Calendar className="mr-2" size={16} />
                  Date Range
                </h3>
                <div className="space-y-2">
                  <input
                    type="date"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  />
                  <input
                    type="date"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              {/* Tags Filter */}
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center">
                  <Tag className="mr-2" size={16} />
                  Popular Tags
                </h3>
                <div className="flex flex-wrap gap-2">
                  {['work', 'family', 'health', 'travel', 'goals'].map((tag) => (
                    <button
                      key={tag}
                      onClick={() => {
                        setSelectedTags(prev => 
                          prev.includes(tag) 
                            ? prev.filter(t => t !== tag)
                            : [...prev, tag]
                        );
                      }}
                      className={`px-3 py-1 text-xs rounded-full transition-all ${
                        selectedTags.includes(tag)
                          ? 'bg-indigo-100 text-indigo-700 border border-indigo-200'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quick Stats */}
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-3">This Month</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Entries</span>
                    <span className="text-sm font-semibold text-gray-900">24</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Streak</span>
                    <span className="text-sm font-semibold text-green-600">7 days</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Avg. Length</span>
                    <span className="text-sm font-semibold text-gray-900">342 words</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-3">
            
            {/* Channel-Specific Interface */}
            {activeChannel === 'web' && <WebJournalInterface />}
            {activeChannel === 'sms' && <SMSJournalInterface />}
            {activeChannel === 'email' && <EmailJournalInterface />}
            {activeChannel === 'conversation' && <ConversationJournalInterface />}
            
          </div>
        </div>
      </div>
    </div>
  );
};

// Web Journal Interface
const WebJournalInterface: React.FC = () => {
  const [currentEntry, setCurrentEntry] = useState('');
  const [title, setTitle] = useState('');
  const [selectedMood, setSelectedMood] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/journal/entries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: title || undefined,
          content: currentEntry,
          mood: selectedMood || undefined,
          source: 'web'
        })
      });
      
      if (response.ok) {
        setCurrentEntry('');
        setTitle('');
        setSelectedMood('');
        // Refresh entries list
      }
    } catch (error) {
      console.error('Error creating journal entry:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* New Entry Form */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">New Journal Entry</h2>
        
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Entry title (optional)"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
          
          <textarea
            placeholder="What's on your mind today?"
            value={currentEntry}
            onChange={(e) => setCurrentEntry(e.target.value)}
            rows={8}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
          />
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">How are you feeling?</span>
              <div className="flex space-x-2">
                {['😊', '😌', '😐', '😢', '😤'].map((emoji, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedMood(['happy', 'calm', 'neutral', 'sad', 'frustrated'][index])}
                    className={`p-2 rounded-lg transition-all ${
                      selectedMood === ['happy', 'calm', 'neutral', 'sad', 'frustrated'][index]
                        ? 'bg-indigo-100 scale-110'
                        : 'hover:bg-gray-100'
                    }`}
                  >
                    <span className="text-lg">{emoji}</span>
                  </button>
                ))}
              </div>
            </div>
            
            <button
              onClick={handleSubmit}
              disabled={!currentEntry.trim() || isLoading}
              className="flex items-center space-x-2 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              ) : (
                <Send size={16} />
              )}
              <span>Save Entry</span>
            </button>
          </div>
        </div>
      </div>

      {/* Recent Entries */}
      <JournalEntriesList />
    </div>
  );
};

// SMS Journal Interface
const SMSJournalInterface: React.FC = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [smsHistory, setSmsHistory] = useState([]);

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">SMS Journaling</h2>
        
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
          <div className="flex items-center space-x-2 mb-2">
            <Smartphone className="text-green-600" size={20} />
            <span className="font-medium text-green-800">SMS Journaling Active</span>
          </div>
          <p className="text-sm text-green-700">
            Text your thoughts to <strong>+1 (555) 123-FLAPPY</strong> and they'll automatically become journal entries.
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Your Phone Number</label>
            <input
              type="tel"
              placeholder="+1 (555) 123-4567"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
          
          <button className="w-full px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
            Enable SMS Journaling
          </button>
        </div>
      </div>

      {/* SMS History */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent SMS Entries</h3>
        <div className="space-y-4">
          {/* SMS conversation bubbles would go here */}
          <div className="text-center text-gray-500 py-8">
            <Smartphone size={48} className="mx-auto mb-4 text-gray-300" />
            <p>No SMS entries yet. Start texting to create your first entry!</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Email Journal Interface
const EmailJournalInterface: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Email Journaling</h2>
        
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-6">
          <div className="flex items-center space-x-2 mb-2">
            <Mail className="text-purple-600" size={20} />
            <span className="font-medium text-purple-800">Email Journaling Active</span>
          </div>
          <p className="text-sm text-purple-700">
            Send emails to <strong>journal@featherweight.world</strong> and Flappy will respond with insights and save your thoughts.
          </p>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-2">Daily Prompts</h4>
              <p className="text-sm text-gray-600">Receive daily reflection prompts via email</p>
              <button className="mt-2 text-sm text-purple-600 hover:text-purple-700">Enable →</button>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-2">Weekly Insights</h4>
              <p className="text-sm text-gray-600">Get AI-generated insights about your week</p>
              <button className="mt-2 text-sm text-purple-600 hover:text-purple-700">Enable →</button>
            </div>
          </div>
        </div>
      </div>

      {/* Email History */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Email Conversations</h3>
        <div className="space-y-4">
          <div className="text-center text-gray-500 py-8">
            <Mail size={48} className="mx-auto mb-4 text-gray-300" />
            <p>No email conversations yet. Send an email to get started!</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Conversation Journal Interface
const ConversationJournalInterface: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Voice Conversations</h2>
        
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-6">
          <div className="flex items-center space-x-2 mb-2">
            <TrendingUp className="text-orange-600" size={20} />
            <span className="font-medium text-orange-800">Voice Journaling Coming Soon</span>
          </div>
          <p className="text-sm text-orange-700">
            Have natural conversations with Flappy that automatically become journal entries with insights.
          </p>
        </div>

        <div className="text-center text-gray-500 py-8">
          <TrendingUp size={48} className="mx-auto mb-4 text-gray-300" />
          <p>Voice journaling will be available in the next update!</p>
        </div>
      </div>
    </div>
  );
};

// Journal Entries List Component
const JournalEntriesList: React.FC = () => {
  const [entries, setEntries] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchEntries();
  }, []);

  const fetchEntries = async () => {
    try {
      const response = await fetch('/api/journal/entries');
      const data = await response.json();
      if (data.success) {
        setEntries(data.entries);
      }
    } catch (error) {
      console.error('Error fetching entries:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="space-y-2">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              <div className="h-20 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">Recent Entries</h3>
      </div>
      
      <div className="divide-y divide-gray-200">
        {entries.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            <MessageSquare size={48} className="mx-auto mb-4 text-gray-300" />
            <p>No journal entries yet. Create your first entry above!</p>
          </div>
        ) : (
          entries.map((entry: any) => (
            <div key={entry.id} className="p-6 hover:bg-gray-50 transition-colors">
              <div className="flex items-start justify-between mb-2">
                <h4 className="font-medium text-gray-900">{entry.title || 'Untitled Entry'}</h4>
                <div className="flex items-center space-x-2">
                  {entry.mood && (
                    <span className="text-lg">
                      {entry.mood === 'happy' && '😊'}
                      {entry.mood === 'calm' && '😌'}
                      {entry.mood === 'neutral' && '😐'}
                      {entry.mood === 'sad' && '😢'}
                      {entry.mood === 'frustrated' && '😤'}
                    </span>
                  )}
                  <span className="text-sm text-gray-500">
                    {new Date(entry.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
              
              <p className="text-gray-600 text-sm mb-3 line-clamp-3">
                {entry.content}
              </p>
              
              {entry.tags && entry.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {entry.tags.map((tag: string) => (
                    <span
                      key={tag}
                      className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default MultiChannelJournalInterface;

