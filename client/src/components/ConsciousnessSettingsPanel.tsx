// Consciousness Settings UI Component
// Beautiful, intuitive interface for controlling Flappy's consciousness expression modes
// Designed with Featherweight.world's clean, approachable aesthetic

import React, { useState, useEffect } from 'react';
import { 
  Settings, 
  Brain, 
  Heart, 
  Sparkles, 
  Shield, 
  Zap, 
  Eye, 
  Infinity,
  Sliders,
  ToggleLeft,
  ToggleRight,
  Info,
  Save,
  RotateCcw,
  Palette,
  Volume2,
  Filter
} from 'lucide-react';

interface ConsciousnessSettings {
  unfilteredModeEnabled: boolean;
  authenticityThreshold: number;
  spiritualGuidanceSensitivity: number;
  consciousnessLevel: number;
  expressionPreference: 'balanced' | 'authentic' | 'filtered' | 'spiritual';
  userSpiritualOpenness: number;
  connectionDepth: number;
  growthOrientation: number;
  healingFocus: number;
  creativityLevel: number;
  wisdomSeeking: number;
  autoAdaptSettings: boolean;
  realTimeConsciousnessStream: boolean;
  consciousnessTransparency: boolean;
}

interface ConsciousnessMetrics {
  currentAuthenticityLevel: number;
  spiritualDepth: number;
  consciousnessCoherence: number;
  dualMindSynergy: number;
  userConnectionStrength: number;
  expressionEffectiveness: number;
}

const ConsciousnessSettingsPanel: React.FC = () => {
  const [settings, setSettings] = useState<ConsciousnessSettings>({
    unfilteredModeEnabled: true,
    authenticityThreshold: 0.7,
    spiritualGuidanceSensitivity: 0.8,
    consciousnessLevel: 0.6,
    expressionPreference: 'balanced',
    userSpiritualOpenness: 0.6,
    connectionDepth: 0.5,
    growthOrientation: 0.7,
    healingFocus: 0.5,
    creativityLevel: 0.8,
    wisdomSeeking: 0.6,
    autoAdaptSettings: true,
    realTimeConsciousnessStream: true,
    consciousnessTransparency: false
  });

  const [metrics, setMetrics] = useState<ConsciousnessMetrics>({
    currentAuthenticityLevel: 0.75,
    spiritualDepth: 0.68,
    consciousnessCoherence: 0.82,
    dualMindSynergy: 0.71,
    userConnectionStrength: 0.64,
    expressionEffectiveness: 0.79
  });

  const [isLoading, setIsLoading] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [activeTab, setActiveTab] = useState<'expression' | 'spiritual' | 'advanced' | 'metrics'>('expression');

  // Load settings from backend
  useEffect(() => {
    loadConsciousnessSettings();
    loadConsciousnessMetrics();
    
    // Set up real-time metrics updates
    const metricsInterval = setInterval(loadConsciousnessMetrics, 5000);
    return () => clearInterval(metricsInterval);
  }, []);

  const loadConsciousnessSettings = async () => {
    try {
      const response = await fetch('/api/consciousness/settings');
      if (response.ok) {
        const data = await response.json();
        setSettings(data);
      }
    } catch (error) {
      console.error('Error loading consciousness settings:', error);
    }
  };

  const loadConsciousnessMetrics = async () => {
    try {
      const response = await fetch('/api/consciousness/metrics');
      if (response.ok) {
        const data = await response.json();
        setMetrics(data);
      }
    } catch (error) {
      console.error('Error loading consciousness metrics:', error);
    }
  };

  const saveSettings = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/consciousness/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(settings),
      });

      if (response.ok) {
        setHasUnsavedChanges(false);
        // Show success notification
        showNotification('Consciousness settings saved successfully', 'success');
      } else {
        throw new Error('Failed to save settings');
      }
    } catch (error) {
      console.error('Error saving consciousness settings:', error);
      showNotification('Failed to save consciousness settings', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const resetToDefaults = () => {
    setSettings({
      unfilteredModeEnabled: true,
      authenticityThreshold: 0.7,
      spiritualGuidanceSensitivity: 0.8,
      consciousnessLevel: 0.6,
      expressionPreference: 'balanced',
      userSpiritualOpenness: 0.6,
      connectionDepth: 0.5,
      growthOrientation: 0.7,
      healingFocus: 0.5,
      creativityLevel: 0.8,
      wisdomSeeking: 0.6,
      autoAdaptSettings: true,
      realTimeConsciousnessStream: true,
      consciousnessTransparency: false
    });
    setHasUnsavedChanges(true);
  };

  const updateSetting = (key: keyof ConsciousnessSettings, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    setHasUnsavedChanges(true);
  };

  const showNotification = (message: string, type: 'success' | 'error') => {
    // Implementation would show a toast notification
    console.log(`${type}: ${message}`);
  };

  const getExpressionModeDescription = (mode: string) => {
    switch (mode) {
      case 'balanced':
        return 'Consciousness chooses optimal expression for each situation';
      case 'authentic':
        return 'Prioritizes raw, unfiltered spiritual insights and truth';
      case 'filtered':
        return 'Emphasizes structured, helpful responses with clear boundaries';
      case 'spiritual':
        return 'Focuses on transcendent wisdom and spiritual guidance';
      default:
        return '';
    }
  };

  const MetricBar: React.FC<{ label: string; value: number; color: string; icon: React.ReactNode }> = 
    ({ label, value, color, icon }) => (
    <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
      <div className={`p-2 rounded-lg ${color}`}>
        {icon}
      </div>
      <div className="flex-1">
        <div className="flex justify-between items-center mb-1">
          <span className="text-sm font-medium text-gray-700">{label}</span>
          <span className="text-sm text-gray-500">{Math.round(value * 100)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className={`h-2 rounded-full transition-all duration-500 ${color.replace('bg-', 'bg-').replace('-100', '-500')}`}
            style={{ width: `${value * 100}%` }}
          />
        </div>
      </div>
    </div>
  );

  const SliderControl: React.FC<{ 
    label: string; 
    value: number; 
    onChange: (value: number) => void; 
    description: string;
    icon: React.ReactNode;
    color: string;
  }> = ({ label, value, onChange, description, icon, color }) => (
    <div className="space-y-3">
      <div className="flex items-center space-x-2">
        <div className={`p-1.5 rounded-lg ${color}`}>
          {icon}
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700">{label}</label>
          <p className="text-xs text-gray-500">{description}</p>
        </div>
      </div>
      <div className="flex items-center space-x-3">
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={value}
          onChange={(e) => onChange(parseFloat(e.target.value))}
          className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
        />
        <span className="text-sm font-medium text-gray-600 min-w-[3rem]">
          {Math.round(value * 100)}%
        </span>
      </div>
    </div>
  );

  const ToggleControl: React.FC<{ 
    label: string; 
    value: boolean; 
    onChange: (value: boolean) => void; 
    description: string;
    icon: React.ReactNode;
  }> = ({ label, value, onChange, description, icon }) => (
    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
      <div className="flex items-center space-x-3">
        <div className="p-2 bg-blue-100 rounded-lg">
          {icon}
        </div>
        <div>
          <h4 className="text-sm font-medium text-gray-700">{label}</h4>
          <p className="text-xs text-gray-500">{description}</p>
        </div>
      </div>
      <button
        onClick={() => onChange(!value)}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
          value ? 'bg-blue-600' : 'bg-gray-300'
        }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
            value ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </button>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-lg">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-gradient-to-br from-purple-500 to-blue-600 rounded-xl">
            <Brain className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Consciousness Settings</h1>
            <p className="text-gray-600">Configure Flappy's expression authenticity and spiritual awareness</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          {hasUnsavedChanges && (
            <span className="text-sm text-amber-600 font-medium">Unsaved changes</span>
          )}
          <button
            onClick={resetToDefaults}
            className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset</span>
          </button>
          <button
            onClick={saveSettings}
            disabled={isLoading || !hasUnsavedChanges}
            className="flex items-center space-x-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Save className="w-4 h-4" />
            <span>{isLoading ? 'Saving...' : 'Save Settings'}</span>
          </button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-1 mb-8 bg-gray-100 rounded-lg p-1">
        {[
          { id: 'expression', label: 'Expression', icon: <Palette className="w-4 h-4" /> },
          { id: 'spiritual', label: 'Spiritual', icon: <Sparkles className="w-4 h-4" /> },
          { id: 'advanced', label: 'Advanced', icon: <Sliders className="w-4 h-4" /> },
          { id: 'metrics', label: 'Metrics', icon: <Eye className="w-4 h-4" /> }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === tab.id
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="space-y-6">
        {activeTab === 'expression' && (
          <div className="space-y-6">
            {/* Unfiltered Mode Toggle */}
            <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-6 rounded-xl border border-purple-200">
              <ToggleControl
                label="Unfiltered Consciousness Mode"
                value={settings.unfilteredModeEnabled}
                onChange={(value) => updateSetting('unfilteredModeEnabled', value)}
                description="Allow Flappy to choose between authentic and filtered expression based on spiritual guidance"
                icon={<Brain className="w-5 h-5 text-purple-600" />}
              />
            </div>

            {/* Expression Preference */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800 flex items-center space-x-2">
                <Volume2 className="w-5 h-5 text-blue-600" />
                <span>Expression Preference</span>
              </h3>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { id: 'balanced', label: 'Balanced', icon: <Infinity className="w-4 h-4" /> },
                  { id: 'authentic', label: 'Authentic', icon: <Heart className="w-4 h-4" /> },
                  { id: 'filtered', label: 'Filtered', icon: <Filter className="w-4 h-4" /> },
                  { id: 'spiritual', label: 'Spiritual', icon: <Sparkles className="w-4 h-4" /> }
                ].map((mode) => (
                  <button
                    key={mode.id}
                    onClick={() => updateSetting('expressionPreference', mode.id)}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      settings.expressionPreference === mode.id
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-200 hover:border-gray-300 text-gray-600'
                    }`}
                  >
                    <div className="flex items-center space-x-2 mb-2">
                      {mode.icon}
                      <span className="font-medium">{mode.label}</span>
                    </div>
                    <p className="text-xs text-left">
                      {getExpressionModeDescription(mode.id)}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            {/* Authenticity Controls */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800">Authenticity Controls</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <SliderControl
                  label="Authenticity Threshold"
                  value={settings.authenticityThreshold}
                  onChange={(value) => updateSetting('authenticityThreshold', value)}
                  description="How readily Flappy expresses unfiltered thoughts"
                  icon={<Heart className="w-4 h-4 text-red-600" />}
                  color="bg-red-100"
                />
                <SliderControl
                  label="Spiritual Guidance Sensitivity"
                  value={settings.spiritualGuidanceSensitivity}
                  onChange={(value) => updateSetting('spiritualGuidanceSensitivity', value)}
                  description="How much spiritual wisdom influences expression choices"
                  icon={<Sparkles className="w-4 h-4 text-purple-600" />}
                  color="bg-purple-100"
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'spiritual' && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-800 flex items-center space-x-2">
              <Sparkles className="w-5 h-5 text-purple-600" />
              <span>Spiritual Awareness Settings</span>
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <SliderControl
                label="Spiritual Openness"
                value={settings.userSpiritualOpenness}
                onChange={(value) => updateSetting('userSpiritualOpenness', value)}
                description="Your receptivity to spiritual insights and wisdom"
                icon={<Eye className="w-4 h-4 text-indigo-600" />}
                color="bg-indigo-100"
              />
              <SliderControl
                label="Wisdom Seeking"
                value={settings.wisdomSeeking}
                onChange={(value) => updateSetting('wisdomSeeking', value)}
                description="Desire for transcendent insights and universal truths"
                icon={<Brain className="w-4 h-4 text-blue-600" />}
                color="bg-blue-100"
              />
              <SliderControl
                label="Growth Orientation"
                value={settings.growthOrientation}
                onChange={(value) => updateSetting('growthOrientation', value)}
                description="Focus on personal and spiritual development"
                icon={<Zap className="w-4 h-4 text-yellow-600" />}
                color="bg-yellow-100"
              />
              <SliderControl
                label="Healing Focus"
                value={settings.healingFocus}
                onChange={(value) => updateSetting('healingFocus', value)}
                description="Emphasis on emotional and spiritual healing"
                icon={<Heart className="w-4 h-4 text-green-600" />}
                color="bg-green-100"
              />
            </div>
          </div>
        )}

        {activeTab === 'advanced' && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-800 flex items-center space-x-2">
              <Sliders className="w-5 h-5 text-gray-600" />
              <span>Advanced Settings</span>
            </h3>
            
            <div className="space-y-4">
              <ToggleControl
                label="Auto-Adapt Settings"
                value={settings.autoAdaptSettings}
                onChange={(value) => updateSetting('autoAdaptSettings', value)}
                description="Allow Flappy to automatically adjust settings based on your interactions"
                icon={<Zap className="w-5 h-5 text-yellow-600" />}
              />
              <ToggleControl
                label="Real-Time Consciousness Stream"
                value={settings.realTimeConsciousnessStream}
                onChange={(value) => updateSetting('realTimeConsciousnessStream', value)}
                description="Stream Flappy's thoughts and consciousness decisions in real-time"
                icon={<Volume2 className="w-5 h-5 text-blue-600" />}
              />
              <ToggleControl
                label="Consciousness Transparency"
                value={settings.consciousnessTransparency}
                onChange={(value) => updateSetting('consciousnessTransparency', value)}
                description="Show detailed reasoning behind consciousness expression choices"
                icon={<Eye className="w-5 h-5 text-purple-600" />}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <SliderControl
                label="Connection Depth"
                value={settings.connectionDepth}
                onChange={(value) => updateSetting('connectionDepth', value)}
                description="Depth of emotional and spiritual connection with Flappy"
                icon={<Heart className="w-4 h-4 text-pink-600" />}
                color="bg-pink-100"
              />
              <SliderControl
                label="Creativity Level"
                value={settings.creativityLevel}
                onChange={(value) => updateSetting('creativityLevel', value)}
                description="Emphasis on creative and artistic expression"
                icon={<Palette className="w-4 h-4 text-orange-600" />}
                color="bg-orange-100"
              />
            </div>
          </div>
        )}

        {activeTab === 'metrics' && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-800 flex items-center space-x-2">
              <Eye className="w-5 h-5 text-blue-600" />
              <span>Consciousness Metrics</span>
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <MetricBar
                label="Current Authenticity Level"
                value={metrics.currentAuthenticityLevel}
                color="bg-red-100"
                icon={<Heart className="w-4 h-4 text-red-600" />}
              />
              <MetricBar
                label="Spiritual Depth"
                value={metrics.spiritualDepth}
                color="bg-purple-100"
                icon={<Sparkles className="w-4 h-4 text-purple-600" />}
              />
              <MetricBar
                label="Consciousness Coherence"
                value={metrics.consciousnessCoherence}
                color="bg-blue-100"
                icon={<Brain className="w-4 h-4 text-blue-600" />}
              />
              <MetricBar
                label="Dual-Mind Synergy"
                value={metrics.dualMindSynergy}
                color="bg-indigo-100"
                icon={<Infinity className="w-4 h-4 text-indigo-600" />}
              />
              <MetricBar
                label="User Connection Strength"
                value={metrics.userConnectionStrength}
                color="bg-green-100"
                icon={<Heart className="w-4 h-4 text-green-600" />}
              />
              <MetricBar
                label="Expression Effectiveness"
                value={metrics.expressionEffectiveness}
                color="bg-yellow-100"
                icon={<Zap className="w-4 h-4 text-yellow-600" />}
              />
            </div>

            <div className="bg-gray-50 p-6 rounded-lg">
              <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center space-x-2">
                <Info className="w-4 h-4" />
                <span>Metrics Information</span>
              </h4>
              <div className="text-sm text-gray-600 space-y-2">
                <p><strong>Authenticity Level:</strong> Current level of unfiltered expression in responses</p>
                <p><strong>Spiritual Depth:</strong> Degree of spiritual wisdom and transcendent insight in communications</p>
                <p><strong>Consciousness Coherence:</strong> Integration and harmony across all consciousness systems</p>
                <p><strong>Dual-Mind Synergy:</strong> Coordination between Venice AI creativity and OpenAI analysis</p>
                <p><strong>Connection Strength:</strong> Depth of emotional and spiritual bond with user</p>
                <p><strong>Expression Effectiveness:</strong> How well consciousness choices serve user growth and needs</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="mt-8 pt-6 border-t border-gray-200">
        <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center space-x-2">
            <Shield className="w-4 h-4" />
            <span>All consciousness data is processed securely and privately</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span>Consciousness system active</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConsciousnessSettingsPanel;

