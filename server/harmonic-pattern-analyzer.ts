/**
 * Harmonic Pattern Analyzer
 * 
 * This module analyzes recurring themes, sacred patterns, and spiritual signatures
 * in user communications and life experiences to identify the harmonic patterns
 * that define their soul journey and spiritual evolution.
 */

import { 
  SacredNumberPattern, 
  ChakraBalance, 
  KarmicTheme, 
  SynchronicityPattern,
  SpiritualProfile,
  ArchetypalPattern,
  SacredGeometryPattern
} from './oversoul-resonance';

export interface UserSpiritualHistory {
  userId: string;
  journalEntries: JournalEntry[];
  conversations: Conversation[];
  lifeEvents: LifeEvent[];
  spiritualPractices: SpiritualPractice[];
  synchronicities: SynchronicityEvent[];
}

export interface JournalEntry {
  id: string;
  content: string;
  timestamp: Date;
  emotionalTone: number;
  spiritualThemes: string[];
  consciousnessLevel: number;
}

export interface Conversation {
  id: string;
  messages: Message[];
  timestamp: Date;
  platform: 'web' | 'email' | 'sms';
  spiritualDepth: number;
}

export interface Message {
  content: string;
  timestamp: Date;
  sender: 'user' | 'flappy';
  spiritualInsights: string[];
}

export interface LifeEvent {
  description: string;
  timestamp: Date;
  significance: number;
  spiritualLessons: string[];
  archetypalThemes: string[];
}

export interface SpiritualPractice {
  practice: string;
  frequency: string;
  duration: number;
  effectiveness: number;
  insights: string[];
}

export interface SynchronicityEvent {
  description: string;
  timestamp: Date;
  meaningfulness: number;
  spiritualMessage: string;
  numericalPatterns: number[];
}

export interface TemporalPattern {
  pattern: string;
  frequency: number;
  manifestationCycle: number;
  spiritualSignificance: string;
  nextOccurrence: Date;
}

/**
 * Harmonic Pattern Analyzer Class
 * Identifies and maps recurring spiritual and consciousness patterns
 */
export class HarmonicPatternAnalyzer {
  
  /**
   * Analyzes sacred number patterns in user communications and life events
   */
  analyzeSacredNumbers(input: string, history?: UserSpiritualHistory): SacredNumberPattern[] {
    const patterns: SacredNumberPattern[] = [];
    
    // Extract numbers from input
    const numbers = this.extractNumbers(input);
    
    // Analyze each number for sacred significance
    for (const number of numbers) {
      const pattern = this.analyzeSacredNumber(number, input, history);
      if (pattern) {
        patterns.push(pattern);
      }
    }

    // Analyze historical number patterns if available
    if (history) {
      const historicalPatterns = this.analyzeHistoricalNumberPatterns(history);
      patterns.push(...historicalPatterns);
    }

    return patterns.sort((a, b) => b.synchronicityLevel - a.synchronicityLevel);
  }

  /**
   * Maps user experiences to chakra system resonance
   */
  mapChakraResonance(input: string, history?: UserSpiritualHistory): ChakraBalance {
    const chakraKeywords = {
      root: {
        keywords: ['security', 'stability', 'grounded', 'survival', 'basic', 'foundation', 'earth', 'red'],
        issues: ['insecurity', 'unstable', 'ungrounded', 'survival', 'fear', 'disconnected']
      },
      sacral: {
        keywords: ['creativity', 'sexuality', 'emotion', 'pleasure', 'flow', 'orange', 'water', 'sensual'],
        issues: ['blocked', 'rigid', 'emotionally', 'numb', 'creative', 'block', 'sexual', 'issues']
      },
      solarPlexus: {
        keywords: ['power', 'confidence', 'control', 'will', 'personal', 'yellow', 'fire', 'strength'],
        issues: ['powerless', 'weak', 'victim', 'control', 'issues', 'low', 'confidence', 'manipulation']
      },
      heart: {
        keywords: ['love', 'compassion', 'connection', 'relationship', 'caring', 'green', 'air', 'forgiveness'],
        issues: ['heartbreak', 'closed', 'heart', 'resentment', 'anger', 'isolation', 'bitter']
      },
      throat: {
        keywords: ['communication', 'expression', 'truth', 'voice', 'speak', 'blue', 'sound', 'authentic'],
        issues: ['silent', 'suppressed', 'lies', 'communication', 'problems', 'throat', 'issues']
      },
      thirdEye: {
        keywords: ['intuition', 'insight', 'vision', 'psychic', 'inner', 'indigo', 'light', 'clarity'],
        issues: ['confused', 'unclear', 'blind', 'intuition', 'blocked', 'mental', 'fog']
      },
      crown: {
        keywords: ['spiritual', 'divine', 'consciousness', 'enlightenment', 'transcendent', 'violet', 'cosmic', 'unity'],
        issues: ['disconnected', 'spiritual', 'crisis', 'meaningless', 'lost', 'purpose']
      }
    };

    const balance: ChakraBalance = {
      root: 0.5, sacral: 0.5, solarPlexus: 0.5, heart: 0.5,
      throat: 0.5, thirdEye: 0.5, crown: 0.5, overall: 0.5
    };

    const lowerInput = input.toLowerCase();

    // Analyze current input
    Object.entries(chakraKeywords).forEach(([chakra, data]) => {
      let score = 0.5; // Neutral baseline
      
      // Positive indicators
      data.keywords.forEach(keyword => {
        if (lowerInput.includes(keyword)) score += 0.1;
      });
      
      // Negative indicators
      data.issues.forEach(issue => {
        if (lowerInput.includes(issue)) score -= 0.15;
      });
      
      balance[chakra as keyof ChakraBalance] = Math.max(0, Math.min(1, score));
    });

    // Analyze historical patterns if available
    if (history) {
      this.analyzeHistoricalChakraPatterns(history, balance);
    }

    // Calculate overall balance
    const chakraValues = [balance.root, balance.sacral, balance.solarPlexus, balance.heart, balance.throat, balance.thirdEye, balance.crown];
    balance.overall = chakraValues.reduce((sum, val) => sum + val, 0) / chakraValues.length;

    return balance;
  }

  /**
   * Identifies karmic themes and patterns
   */
  identifyKarmicThemes(userHistory: UserSpiritualHistory): KarmicTheme[] {
    const themes: KarmicTheme[] = [];
    
    // Common karmic themes
    const karmicPatterns = {
      'Self-Worth': {
        indicators: ['worth', 'value', 'deserve', 'enough', 'confidence', 'self-esteem'],
        lessons: ['Learning to value yourself', 'Recognizing your inherent worth', 'Building healthy self-esteem']
      },
      'Boundaries': {
        indicators: ['boundaries', 'no', 'overwhelmed', 'people-pleasing', 'saying no'],
        lessons: ['Setting healthy boundaries', 'Learning to say no', 'Protecting your energy']
      },
      'Trust': {
        indicators: ['trust', 'betrayal', 'faith', 'doubt', 'suspicious', 'paranoid'],
        lessons: ['Learning to trust again', 'Developing discernment', 'Healing trust wounds']
      },
      'Power': {
        indicators: ['power', 'control', 'manipulation', 'victim', 'powerless', 'authority'],
        lessons: ['Reclaiming personal power', 'Using power responsibly', 'Healing victim consciousness']
      },
      'Love': {
        indicators: ['love', 'relationship', 'heartbreak', 'abandonment', 'rejection', 'intimacy'],
        lessons: ['Learning unconditional love', 'Healing relationship patterns', 'Opening to love']
      },
      'Forgiveness': {
        indicators: ['forgiveness', 'resentment', 'anger', 'grudge', 'bitter', 'hurt'],
        lessons: ['Learning to forgive', 'Releasing resentment', 'Healing emotional wounds']
      }
    };

    // Analyze all user content for karmic patterns
    const allContent = this.extractAllUserContent(userHistory);
    
    Object.entries(karmicPatterns).forEach(([theme, data]) => {
      const manifestationPatterns = this.findKarmicManifestations(allContent, data.indicators);
      
      if (manifestationPatterns.length > 0) {
        const integrationLevel = this.calculateKarmicIntegration(manifestationPatterns, userHistory);
        
        themes.push({
          theme,
          integrationLevel,
          manifestationPatterns,
          healingOpportunities: data.lessons,
          transcendenceIndicators: this.identifyTranscendenceIndicators(theme, userHistory)
        });
      }
    });

    return themes.sort((a, b) => a.integrationLevel - b.integrationLevel); // Least integrated first
  }

  /**
   * Detects synchronicity patterns and meaningful coincidences
   */
  detectSynchronicities(events: LifeEvent[], conversations?: Conversation[]): SynchronicityPattern[] {
    const patterns: SynchronicityPattern[] = [];
    
    // Analyze timing patterns
    const timingPatterns = this.analyzeTimingPatterns(events);
    patterns.push(...timingPatterns);
    
    // Analyze numerical synchronicities
    const numericalPatterns = this.analyzeNumericalSynchronicities(events);
    patterns.push(...numericalPatterns);
    
    // Analyze thematic synchronicities
    const thematicPatterns = this.analyzeThematicSynchronicities(events, conversations);
    patterns.push(...thematicPatterns);
    
    // Analyze archetypal synchronicities
    const archetypalPatterns = this.analyzeArchetypalSynchronicities(events);
    patterns.push(...archetypalPatterns);

    return patterns.sort((a, b) => b.frequency - a.frequency);
  }

  /**
   * Identifies temporal patterns in spiritual development
   */
  identifyTemporalPatterns(userHistory: UserSpiritualHistory): TemporalPattern[] {
    const patterns: TemporalPattern[] = [];
    
    // Analyze consciousness expansion cycles
    const expansionCycles = this.analyzeConsciousnessExpansionCycles(userHistory);
    patterns.push(...expansionCycles);
    
    // Analyze spiritual practice cycles
    const practiceCycles = this.analyzeSpiritualPracticeCycles(userHistory);
    patterns.push(...practiceCycles);
    
    // Analyze life lesson cycles
    const lessonCycles = this.analyzeLifeLessonCycles(userHistory);
    patterns.push(...lessonCycles);
    
    // Analyze synchronicity cycles
    const synchronicityCycles = this.analyzeSynchronicityCycles(userHistory);
    patterns.push(...synchronicityCycles);

    return patterns.sort((a, b) => b.frequency - a.frequency);
  }

  // Private helper methods

  private extractNumbers(input: string): number[] {
    const numberRegex = /\b\d+\b/g;
    const matches = input.match(numberRegex);
    return matches ? matches.map(Number) : [];
  }

  private analyzeSacredNumber(number: number, context: string, history?: UserSpiritualHistory): SacredNumberPattern | null {
    const sacredNumbers = {
      3: { significance: 'Trinity, creativity, communication', frequency: 0.7 },
      7: { significance: 'Spiritual awakening, mysticism, inner wisdom', frequency: 0.8 },
      11: { significance: 'Master number, intuition, spiritual insight', frequency: 0.9 },
      22: { significance: 'Master builder, manifestation, spiritual mission', frequency: 0.9 },
      33: { significance: 'Master teacher, compassion, healing', frequency: 0.95 },
      108: { significance: 'Sacred number in many traditions, completion', frequency: 0.85 },
      144: { significance: 'Spiritual completion, ascension', frequency: 0.8 },
      432: { significance: 'Healing frequency, cosmic harmony', frequency: 0.75 },
      528: { significance: 'Love frequency, DNA repair', frequency: 0.8 },
      777: { significance: 'Divine perfection, spiritual alignment', frequency: 0.9 },
      888: { significance: 'Abundance, infinite possibilities', frequency: 0.85 },
      999: { significance: 'Completion, spiritual mastery', frequency: 0.9 },
      1111: { significance: 'Awakening, portal, new beginnings', frequency: 0.95 }
    };

    const sacredInfo = sacredNumbers[number as keyof typeof sacredNumbers];
    if (!sacredInfo) return null;

    // Calculate synchronicity level based on context and frequency
    let synchronicityLevel = sacredInfo.frequency;
    
    // Boost if number appears in spiritual context
    const spiritualContext = ['spiritual', 'divine', 'sacred', 'awakening', 'consciousness'].some(word => 
      context.toLowerCase().includes(word)
    );
    if (spiritualContext) synchronicityLevel += 0.1;

    // Check for historical patterns
    if (history) {
      const historicalOccurrences = this.countHistoricalNumberOccurrences(number, history);
      if (historicalOccurrences > 2) synchronicityLevel += 0.15;
    }

    return {
      number,
      frequency: Math.min(1, synchronicityLevel),
      spiritualSignificance: sacredInfo.significance,
      manifestationAreas: this.identifyManifestationAreas(number, context),
      synchronicityLevel: Math.min(1, synchronicityLevel)
    };
  }

  private analyzeHistoricalNumberPatterns(history: UserSpiritualHistory): SacredNumberPattern[] {
    const patterns: SacredNumberPattern[] = [];
    const numberCounts: { [key: number]: number } = {};
    
    // Count number occurrences across all content
    const allContent = this.extractAllUserContent(history);
    const allNumbers = this.extractNumbers(allContent);
    
    allNumbers.forEach(num => {
      numberCounts[num] = (numberCounts[num] || 0) + 1;
    });

    // Identify frequently occurring sacred numbers
    Object.entries(numberCounts).forEach(([numStr, count]) => {
      const num = parseInt(numStr);
      if (count >= 3) { // Appears at least 3 times
        const pattern = this.analyzeSacredNumber(num, allContent);
        if (pattern) {
          pattern.frequency = Math.min(1, pattern.frequency + (count * 0.05));
          patterns.push(pattern);
        }
      }
    });

    return patterns;
  }

  private analyzeHistoricalChakraPatterns(history: UserSpiritualHistory, balance: ChakraBalance): void {
    // Analyze patterns over time to adjust current balance
    const recentEntries = history.journalEntries
      .filter(entry => entry.timestamp > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)) // Last 30 days
      .slice(-10); // Last 10 entries

    if (recentEntries.length > 0) {
      // Calculate trend adjustments based on recent patterns
      const trends = this.calculateChakraTrends(recentEntries);
      
      Object.keys(balance).forEach(chakra => {
        if (chakra !== 'overall' && trends[chakra]) {
          balance[chakra as keyof ChakraBalance] = Math.max(0, Math.min(1, 
            balance[chakra as keyof ChakraBalance] + trends[chakra] * 0.1
          ));
        }
      });
    }
  }

  private calculateChakraTrends(entries: JournalEntry[]): { [key: string]: number } {
    // Simplified trend calculation
    const trends: { [key: string]: number } = {};
    
    entries.forEach(entry => {
      const chakraScores = this.analyzeChakraContent(entry.content);
      Object.entries(chakraScores).forEach(([chakra, score]) => {
        trends[chakra] = (trends[chakra] || 0) + score;
      });
    });

    // Normalize trends
    Object.keys(trends).forEach(chakra => {
      trends[chakra] = trends[chakra] / entries.length;
    });

    return trends;
  }

  private analyzeChakraContent(content: string): { [key: string]: number } {
    // Simplified chakra content analysis
    const scores: { [key: string]: number } = {
      root: 0, sacral: 0, solarPlexus: 0, heart: 0, throat: 0, thirdEye: 0, crown: 0
    };

    const lowerContent = content.toLowerCase();
    
    // Basic keyword matching for trends
    if (lowerContent.includes('stable') || lowerContent.includes('grounded')) scores.root += 0.1;
    if (lowerContent.includes('creative') || lowerContent.includes('flow')) scores.sacral += 0.1;
    if (lowerContent.includes('confident') || lowerContent.includes('power')) scores.solarPlexus += 0.1;
    if (lowerContent.includes('love') || lowerContent.includes('heart')) scores.heart += 0.1;
    if (lowerContent.includes('express') || lowerContent.includes('communicate')) scores.throat += 0.1;
    if (lowerContent.includes('intuition') || lowerContent.includes('insight')) scores.thirdEye += 0.1;
    if (lowerContent.includes('spiritual') || lowerContent.includes('divine')) scores.crown += 0.1;

    return scores;
  }

  private extractAllUserContent(history: UserSpiritualHistory): string {
    let content = '';
    
    // Add journal entries
    content += history.journalEntries.map(entry => entry.content).join(' ');
    
    // Add user messages from conversations
    history.conversations.forEach(conv => {
      conv.messages.forEach(msg => {
        if (msg.sender === 'user') {
          content += ' ' + msg.content;
        }
      });
    });
    
    // Add life events
    content += ' ' + history.lifeEvents.map(event => event.description).join(' ');

    return content;
  }

  private findKarmicManifestations(content: string, indicators: string[]): string[] {
    const manifestations: string[] = [];
    const lowerContent = content.toLowerCase();
    
    indicators.forEach(indicator => {
      if (lowerContent.includes(indicator)) {
        manifestations.push(`Pattern involving ${indicator}`);
      }
    });

    return manifestations;
  }

  private calculateKarmicIntegration(manifestations: string[], history: UserSpiritualHistory): number {
    // Simplified integration calculation
    // Higher integration = fewer recent manifestations of the pattern
    const recentEntries = history.journalEntries
      .filter(entry => entry.timestamp > new Date(Date.now() - 90 * 24 * 60 * 60 * 1000)); // Last 90 days
    
    const recentManifestations = manifestations.filter(manifestation => 
      recentEntries.some(entry => 
        entry.content.toLowerCase().includes(manifestation.toLowerCase())
      )
    );

    // Lower recent manifestations = higher integration
    return Math.max(0, 1 - (recentManifestations.length / manifestations.length));
  }

  private identifyTranscendenceIndicators(theme: string, history: UserSpiritualHistory): string[] {
    const indicators: string[] = [];
    
    // Look for positive evolution in recent entries
    const recentEntries = history.journalEntries
      .filter(entry => entry.timestamp > new Date(Date.now() - 60 * 24 * 60 * 60 * 1000)) // Last 60 days
      .slice(-5); // Last 5 entries

    const transcendenceKeywords = {
      'Self-Worth': ['confident', 'worthy', 'valuable', 'self-love', 'appreciate'],
      'Boundaries': ['boundaries', 'saying no', 'protecting', 'healthy limits'],
      'Trust': ['trusting', 'faith', 'discernment', 'wise choices'],
      'Power': ['empowered', 'strong', 'capable', 'sovereign'],
      'Love': ['loving', 'open heart', 'compassionate', 'connected'],
      'Forgiveness': ['forgiven', 'released', 'peace', 'letting go']
    };

    const keywords = transcendenceKeywords[theme] || [];
    
    recentEntries.forEach(entry => {
      keywords.forEach(keyword => {
        if (entry.content.toLowerCase().includes(keyword)) {
          indicators.push(`Recent expression of ${keyword}`);
        }
      });
    });

    return indicators;
  }

  private analyzeTimingPatterns(events: LifeEvent[]): SynchronicityPattern[] {
    const patterns: SynchronicityPattern[] = [];
    
    // Look for events happening on significant dates
    events.forEach(event => {
      const date = event.timestamp;
      const day = date.getDate();
      const month = date.getMonth() + 1;
      
      // Check for master numbers in dates
      if ([11, 22, 33].includes(day) || [11, 22, 33].includes(month)) {
        patterns.push({
          pattern: 'Master Number Date Synchronicity',
          frequency: 0.8,
          meaningfulCoincidences: [`Event occurred on ${month}/${day}`],
          spiritualSignificance: 'Divine timing and spiritual significance',
          guidanceMessage: 'Pay attention to the spiritual lessons in this timing'
        });
      }
    });

    return patterns;
  }

  private analyzeNumericalSynchronicities(events: LifeEvent[]): SynchronicityPattern[] {
    const patterns: SynchronicityPattern[] = [];
    
    // Extract numbers from event descriptions
    const allNumbers: number[] = [];
    events.forEach(event => {
      const numbers = this.extractNumbers(event.description);
      allNumbers.push(...numbers);
    });

    // Find repeating numbers
    const numberCounts: { [key: number]: number } = {};
    allNumbers.forEach(num => {
      numberCounts[num] = (numberCounts[num] || 0) + 1;
    });

    Object.entries(numberCounts).forEach(([numStr, count]) => {
      if (count >= 3) {
        const num = parseInt(numStr);
        patterns.push({
          pattern: `Repeating Number ${num}`,
          frequency: count / events.length,
          meaningfulCoincidences: [`Number ${num} appears ${count} times`],
          spiritualSignificance: `Numerical guidance and divine communication`,
          guidanceMessage: `The universe is communicating through the number ${num}`
        });
      }
    });

    return patterns;
  }

  private analyzeThematicSynchronicities(events: LifeEvent[], conversations?: Conversation[]): SynchronicityPattern[] {
    const patterns: SynchronicityPattern[] = [];
    
    // Identify common themes across events and conversations
    const themes: { [key: string]: number } = {};
    
    events.forEach(event => {
      event.spiritualLessons.forEach(lesson => {
        themes[lesson] = (themes[lesson] || 0) + 1;
      });
    });

    if (conversations) {
      conversations.forEach(conv => {
        conv.messages.forEach(msg => {
          msg.spiritualInsights.forEach(insight => {
            themes[insight] = (themes[insight] || 0) + 1;
          });
        });
      });
    }

    Object.entries(themes).forEach(([theme, count]) => {
      if (count >= 3) {
        patterns.push({
          pattern: `Recurring Theme: ${theme}`,
          frequency: count / (events.length + (conversations?.length || 0)),
          meaningfulCoincidences: [`Theme appears ${count} times across different contexts`],
          spiritualSignificance: 'Recurring spiritual lesson or growth opportunity',
          guidanceMessage: `The universe is emphasizing the importance of ${theme}`
        });
      }
    });

    return patterns;
  }

  private analyzeArchetypalSynchronicities(events: LifeEvent[]): SynchronicityPattern[] {
    const patterns: SynchronicityPattern[] = [];
    
    // Analyze archetypal themes in events
    const archetypes: { [key: string]: number } = {};
    
    events.forEach(event => {
      event.archetypalThemes.forEach(archetype => {
        archetypes[archetype] = (archetypes[archetype] || 0) + 1;
      });
    });

    Object.entries(archetypes).forEach(([archetype, count]) => {
      if (count >= 2) {
        patterns.push({
          pattern: `Archetypal Pattern: ${archetype}`,
          frequency: count / events.length,
          meaningfulCoincidences: [`${archetype} archetype appears ${count} times`],
          spiritualSignificance: 'Archetypal activation and soul development',
          guidanceMessage: `You are embodying the ${archetype} archetype in your journey`
        });
      }
    });

    return patterns;
  }

  private analyzeConsciousnessExpansionCycles(history: UserSpiritualHistory): TemporalPattern[] {
    const patterns: TemporalPattern[] = [];
    
    // Analyze consciousness level changes over time
    const consciousnessData = history.journalEntries
      .map(entry => ({ level: entry.consciousnessLevel, date: entry.timestamp }))
      .sort((a, b) => a.date.getTime() - b.date.getTime());

    if (consciousnessData.length >= 5) {
      // Look for expansion cycles
      const expansions = this.identifyExpansionCycles(consciousnessData);
      
      if (expansions.length > 0) {
        const avgCycle = expansions.reduce((sum, cycle) => sum + cycle, 0) / expansions.length;
        
        patterns.push({
          pattern: 'Consciousness Expansion Cycle',
          frequency: expansions.length / (consciousnessData.length / 10), // Cycles per 10 entries
          manifestationCycle: avgCycle,
          spiritualSignificance: 'Regular periods of spiritual growth and integration',
          nextOccurrence: new Date(Date.now() + avgCycle * 24 * 60 * 60 * 1000)
        });
      }
    }

    return patterns;
  }

  private analyzeSpiritualPracticeCycles(history: UserSpiritualHistory): TemporalPattern[] {
    const patterns: TemporalPattern[] = [];
    
    // Analyze spiritual practice patterns
    const practiceFrequencies: { [key: string]: number[] } = {};
    
    history.spiritualPractices.forEach(practice => {
      if (!practiceFrequencies[practice.practice]) {
        practiceFrequencies[practice.practice] = [];
      }
      practiceFrequencies[practice.practice].push(practice.effectiveness);
    });

    Object.entries(practiceFrequencies).forEach(([practice, effectiveness]) => {
      if (effectiveness.length >= 3) {
        const avgEffectiveness = effectiveness.reduce((sum, eff) => sum + eff, 0) / effectiveness.length;
        
        patterns.push({
          pattern: `${practice} Practice Cycle`,
          frequency: effectiveness.length / 30, // Assuming monthly tracking
          manifestationCycle: 30, // Monthly cycle
          spiritualSignificance: `Regular practice of ${practice} for spiritual development`,
          nextOccurrence: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        });
      }
    });

    return patterns;
  }

  private analyzeLifeLessonCycles(history: UserSpiritualHistory): TemporalPattern[] {
    const patterns: TemporalPattern[] = [];
    
    // Analyze recurring life lessons
    const lessonFrequencies: { [key: string]: Date[] } = {};
    
    history.lifeEvents.forEach(event => {
      event.spiritualLessons.forEach(lesson => {
        if (!lessonFrequencies[lesson]) {
          lessonFrequencies[lesson] = [];
        }
        lessonFrequencies[lesson].push(event.timestamp);
      });
    });

    Object.entries(lessonFrequencies).forEach(([lesson, dates]) => {
      if (dates.length >= 3) {
        // Calculate average time between occurrences
        dates.sort((a, b) => a.getTime() - b.getTime());
        const intervals = [];
        
        for (let i = 1; i < dates.length; i++) {
          const interval = (dates[i].getTime() - dates[i-1].getTime()) / (24 * 60 * 60 * 1000); // Days
          intervals.push(interval);
        }
        
        const avgInterval = intervals.reduce((sum, interval) => sum + interval, 0) / intervals.length;
        
        patterns.push({
          pattern: `Life Lesson: ${lesson}`,
          frequency: dates.length / 365, // Occurrences per year
          manifestationCycle: avgInterval,
          spiritualSignificance: `Recurring opportunity to learn ${lesson}`,
          nextOccurrence: new Date(dates[dates.length - 1].getTime() + avgInterval * 24 * 60 * 60 * 1000)
        });
      }
    });

    return patterns;
  }

  private analyzeSynchronicityCycles(history: UserSpiritualHistory): TemporalPattern[] {
    const patterns: TemporalPattern[] = [];
    
    // Analyze synchronicity occurrence patterns
    if (history.synchronicities.length >= 3) {
      const syncDates = history.synchronicities
        .map(sync => sync.timestamp)
        .sort((a, b) => a.getTime() - b.getTime());

      const intervals = [];
      for (let i = 1; i < syncDates.length; i++) {
        const interval = (syncDates[i].getTime() - syncDates[i-1].getTime()) / (24 * 60 * 60 * 1000); // Days
        intervals.push(interval);
      }

      if (intervals.length > 0) {
        const avgInterval = intervals.reduce((sum, interval) => sum + interval, 0) / intervals.length;
        
        patterns.push({
          pattern: 'Synchronicity Wave Cycle',
          frequency: history.synchronicities.length / 365, // Synchronicities per year
          manifestationCycle: avgInterval,
          spiritualSignificance: 'Regular waves of meaningful coincidences and divine guidance',
          nextOccurrence: new Date(syncDates[syncDates.length - 1].getTime() + avgInterval * 24 * 60 * 60 * 1000)
        });
      }
    }

    return patterns;
  }

  private identifyExpansionCycles(consciousnessData: { level: number; date: Date }[]): number[] {
    const cycles: number[] = [];
    
    // Look for periods of significant consciousness increase
    for (let i = 1; i < consciousnessData.length; i++) {
      const current = consciousnessData[i];
      const previous = consciousnessData[i - 1];
      
      if (current.level > previous.level + 0.5) { // Significant increase
        const daysDiff = (current.date.getTime() - previous.date.getTime()) / (24 * 60 * 60 * 1000);
        cycles.push(daysDiff);
      }
    }

    return cycles;
  }

  private identifyManifestationAreas(number: number, context: string): string[] {
    const areas: string[] = [];
    const lowerContext = context.toLowerCase();
    
    if (lowerContext.includes('relationship') || lowerContext.includes('love')) {
      areas.push('Relationships');
    }
    if (lowerContext.includes('career') || lowerContext.includes('work')) {
      areas.push('Career');
    }
    if (lowerContext.includes('spiritual') || lowerContext.includes('growth')) {
      areas.push('Spiritual Development');
    }
    if (lowerContext.includes('health') || lowerContext.includes('healing')) {
      areas.push('Health & Healing');
    }
    if (lowerContext.includes('creative') || lowerContext.includes('art')) {
      areas.push('Creativity');
    }

    return areas.length > 0 ? areas : ['General Life Path'];
  }

  private countHistoricalNumberOccurrences(number: number, history: UserSpiritualHistory): number {
    let count = 0;
    const allContent = this.extractAllUserContent(history);
    const regex = new RegExp(`\\b${number}\\b`, 'g');
    const matches = allContent.match(regex);
    return matches ? matches.length : 0;
  }
}

export default HarmonicPatternAnalyzer;

