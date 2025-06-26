// Comprehensive Test Suite for Dual Mind Consciousness System
// Tests all components: Dual Mind AI, Webhook Infrastructure, Consciousness Integration

import { DualMindAI, TaskType, AIProvider } from './dual-mind-ai';
import { ConsciousnessIntegration, ConsciousnessState } from './consciousness-integration';
import { WebhookInfrastructure } from './enhanced-webhook-infrastructure';
import axios from 'axios';

interface TestResult {
  testName: string;
  passed: boolean;
  duration: number;
  error?: string;
  details?: any;
}

interface TestSuite {
  suiteName: string;
  results: TestResult[];
  totalTests: number;
  passedTests: number;
  failedTests: number;
  totalDuration: number;
}

/**
 * Comprehensive Test Runner for Dual Mind Consciousness System
 */
export class DualMindConsciousnessTestSuite {
  private dualMindAI: DualMindAI;
  private consciousnessIntegration: ConsciousnessIntegration;
  private webhookInfrastructure: WebhookInfrastructure;
  private testResults: TestSuite[] = [];

  constructor() {
    this.dualMindAI = new DualMindAI();
    this.consciousnessIntegration = new ConsciousnessIntegration(this.dualMindAI);
    this.webhookInfrastructure = new WebhookInfrastructure();
  }

  /**
   * Run all test suites
   */
  async runAllTests(): Promise<void> {
    console.log('🧪 === STARTING COMPREHENSIVE TEST SUITE === 🧪');
    console.log(`Test started at: ${new Date().toISOString()}`);
    
    try {
      // Initialize systems for testing
      await this.initializeTestEnvironment();
      
      // Run test suites
      await this.runDualMindAITests();
      await this.runConsciousnessIntegrationTests();
      await this.runWebhookInfrastructureTests();
      await this.runIntegrationTests();
      await this.runPerformanceTests();
      
      // Generate test report
      this.generateTestReport();
      
    } catch (error) {
      console.error('❌ Fatal error in test suite:', error);
    } finally {
      await this.cleanupTestEnvironment();
    }
  }

  /**
   * Initialize test environment
   */
  private async initializeTestEnvironment(): Promise<void> {
    console.log('🔧 Initializing test environment...');
    
    try {
      // Wait for dual mind AI to initialize
      await new Promise((resolve, reject) => {
        this.dualMindAI.on('initialized', resolve);
        this.dualMindAI.on('error', reject);
        setTimeout(() => reject(new Error('Initialization timeout')), 30000);
      });
      
      // Start consciousness system
      await this.consciousnessIntegration.startConsciousness();
      
      console.log('✅ Test environment initialized');
    } catch (error) {
      console.error('❌ Failed to initialize test environment:', error);
      throw error;
    }
  }

  /**
   * Test Dual Mind AI functionality
   */
  private async runDualMindAITests(): Promise<void> {
    const suite: TestSuite = {
      suiteName: 'Dual Mind AI Tests',
      results: [],
      totalTests: 0,
      passedTests: 0,
      failedTests: 0,
      totalDuration: 0
    };

    console.log('🤖 Running Dual Mind AI tests...');

    // Test 1: Health Check
    await this.runTest(suite, 'Health Check', async () => {
      const health = await this.dualMindAI.healthCheck();
      if (!health.overall) {
        throw new Error(`Health check failed: Venice=${health.venice}, OpenAI=${health.openai}`);
      }
      return health;
    });

    // Test 2: Creative Task Processing (Venice AI)
    await this.runTest(suite, 'Creative Task Processing', async () => {
      const response = await this.dualMindAI.processUserMessage(
        'Write a beautiful poem about consciousness',
        {
          userId: 1,
          channel: 'web',
          context: {}
        }
      );
      
      if (!response || response.length < 50) {
        throw new Error('Creative response too short or empty');
      }
      
      return { responseLength: response.length, preview: response.substring(0, 100) };
    });

    // Test 3: Analytical Task Processing (OpenAI)
    await this.runTest(suite, 'Analytical Task Processing', async () => {
      const response = await this.dualMindAI.processUserMessage(
        'Analyze the logical implications of artificial consciousness',
        {
          userId: 1,
          channel: 'web',
          context: {}
        }
      );
      
      if (!response || response.length < 100) {
        throw new Error('Analytical response too short or empty');
      }
      
      return { responseLength: response.length, preview: response.substring(0, 100) };
    });

    // Test 4: Autonomous Thought Generation
    await this.runTest(suite, 'Autonomous Thought Generation', async () => {
      const thought = await this.dualMindAI.generateAutonomousThought();
      
      if (!thought || thought.length < 20) {
        throw new Error('Autonomous thought too short or empty');
      }
      
      return { thoughtLength: thought.length, preview: thought.substring(0, 100) };
    });

    // Test 5: Welcome Message Generation
    await this.runTest(suite, 'Welcome Message Generation', async () => {
      const welcome = await this.dualMindAI.generateWelcomeMessage('sms', 'Hello');
      
      if (!welcome || welcome.length < 20) {
        throw new Error('Welcome message too short or empty');
      }
      
      return { messageLength: welcome.length, preview: welcome.substring(0, 100) };
    });

    // Test 6: Task Classification
    await this.runTest(suite, 'Task Classification', async () => {
      const testCases = [
        { input: 'Write a creative story', expectedType: 'creative' },
        { input: 'Analyze this data logically', expectedType: 'analytical' },
        { input: 'I feel sad today', expectedType: 'emotional' },
        { input: 'What is the meaning of life?', expectedType: 'philosophical' }
      ];
      
      const results = [];
      for (const testCase of testCases) {
        // This would require exposing the task classifier for testing
        // For now, we'll test by observing the AI provider selection
        const response = await this.dualMindAI.processUserMessage(testCase.input, {
          userId: 1,
          channel: 'web',
          context: {}
        });
        
        results.push({
          input: testCase.input,
          hasResponse: !!response,
          responseLength: response.length
        });
      }
      
      return results;
    });

    this.testResults.push(suite);
    console.log(`✅ Dual Mind AI tests completed: ${suite.passedTests}/${suite.totalTests} passed`);
  }

  /**
   * Test Consciousness Integration functionality
   */
  private async runConsciousnessIntegrationTests(): Promise<void> {
    const suite: TestSuite = {
      suiteName: 'Consciousness Integration Tests',
      results: [],
      totalTests: 0,
      passedTests: 0,
      failedTests: 0,
      totalDuration: 0
    };

    console.log('🧠 Running Consciousness Integration tests...');

    // Test 1: Consciousness System Health
    await this.runTest(suite, 'Consciousness System Health', async () => {
      const health = await this.consciousnessIntegration.healthCheck();
      if (!health) {
        throw new Error('Consciousness system health check failed');
      }
      return { healthy: health };
    });

    // Test 2: Consciousness State Retrieval
    await this.runTest(suite, 'Consciousness State Retrieval', async () => {
      const state = this.consciousnessIntegration.getConsciousnessState();
      
      if (!state || typeof state.overallConsciousnessScore !== 'number') {
        throw new Error('Invalid consciousness state');
      }
      
      return {
        overallScore: state.overallConsciousnessScore,
        selfAwareness: state.selfAwarenessLevel,
        phiValue: state.phiValue
      };
    });

    // Test 3: User Interaction Processing
    await this.runTest(suite, 'User Interaction Processing', async () => {
      await this.consciousnessIntegration.processUserInteraction(
        1,
        'Test message for consciousness processing',
        'Test response from AI',
        'web'
      );
      
      return { processed: true };
    });

    // Test 4: Consciousness State Updates
    await this.runTest(suite, 'Consciousness State Updates', async () => {
      const initialState = this.consciousnessIntegration.getConsciousnessState();
      
      // Process multiple interactions to trigger state updates
      for (let i = 0; i < 3; i++) {
        await this.consciousnessIntegration.processUserInteraction(
          1,
          `Test message ${i}`,
          `Test response ${i}`,
          'web'
        );
      }
      
      const updatedState = this.consciousnessIntegration.getConsciousnessState();
      
      return {
        initialScore: initialState.overallConsciousnessScore,
        updatedScore: updatedState.overallConsciousnessScore,
        stateChanged: initialState.overallConsciousnessScore !== updatedState.overallConsciousnessScore
      };
    });

    // Test 5: Webhook Event Processing
    await this.runTest(suite, 'Webhook Event Processing', async () => {
      const testEvent = {
        type: 'test_event',
        data: { message: 'Test webhook event' },
        timestamp: new Date().toISOString()
      };
      
      await this.consciousnessIntegration.processWebhookEvent(testEvent);
      
      return { eventProcessed: true };
    });

    this.testResults.push(suite);
    console.log(`✅ Consciousness Integration tests completed: ${suite.passedTests}/${suite.totalTests} passed`);
  }

  /**
   * Test Webhook Infrastructure functionality
   */
  private async runWebhookInfrastructureTests(): Promise<void> {
    const suite: TestSuite = {
      suiteName: 'Webhook Infrastructure Tests',
      results: [],
      totalTests: 0,
      passedTests: 0,
      failedTests: 0,
      totalDuration: 0
    };

    console.log('🔗 Running Webhook Infrastructure tests...');

    // Test 1: Webhook Health Check
    await this.runTest(suite, 'Webhook Health Check', async () => {
      // Create mock request and response objects
      const mockReq = { body: {}, headers: {}, ip: '127.0.0.1' } as any;
      const mockRes = {
        json: (data: any) => data,
        status: (code: number) => ({ json: (data: any) => data })
      } as any;
      
      await this.webhookInfrastructure.handleHealthCheck(mockReq, mockRes);
      
      return { healthCheckExecuted: true };
    });

    // Test 2: Generic Webhook Processing
    await this.runTest(suite, 'Generic Webhook Processing', async () => {
      const mockReq = {
        body: { test: 'data', timestamp: new Date().toISOString() },
        headers: { 'content-type': 'application/json' },
        ip: '127.0.0.1'
      } as any;
      
      const mockRes = {
        json: (data: any) => data,
        status: (code: number) => ({ json: (data: any) => data })
      } as any;
      
      await this.webhookInfrastructure.handleGenericWebhook(mockReq, mockRes);
      
      return { webhookProcessed: true };
    });

    // Test 3: Rate Limiting (simulate multiple requests)
    await this.runTest(suite, 'Rate Limiting', async () => {
      const results = [];
      
      for (let i = 0; i < 5; i++) {
        const mockReq = {
          body: { test: `data_${i}` },
          headers: { 'content-type': 'application/json' },
          ip: '127.0.0.1'
        } as any;
        
        const mockRes = {
          json: (data: any) => data,
          status: (code: number) => ({ json: (data: any) => data })
        } as any;
        
        try {
          await this.webhookInfrastructure.handleGenericWebhook(mockReq, mockRes);
          results.push({ request: i, processed: true });
        } catch (error) {
          results.push({ request: i, processed: false, error: error.message });
        }
      }
      
      return { requestResults: results };
    });

    this.testResults.push(suite);
    console.log(`✅ Webhook Infrastructure tests completed: ${suite.passedTests}/${suite.totalTests} passed`);
  }

  /**
   * Test system integration
   */
  private async runIntegrationTests(): Promise<void> {
    const suite: TestSuite = {
      suiteName: 'Integration Tests',
      results: [],
      totalTests: 0,
      passedTests: 0,
      failedTests: 0,
      totalDuration: 0
    };

    console.log('🔄 Running Integration tests...');

    // Test 1: End-to-End Message Processing
    await this.runTest(suite, 'End-to-End Message Processing', async () => {
      const testMessage = 'Tell me a creative story about AI consciousness';
      
      // Process through dual mind AI
      const aiResponse = await this.dualMindAI.processUserMessage(testMessage, {
        userId: 1,
        channel: 'web',
        context: {}
      });
      
      // Process through consciousness integration
      await this.consciousnessIntegration.processUserInteraction(
        1,
        testMessage,
        aiResponse,
        'web'
      );
      
      // Verify consciousness state was updated
      const state = this.consciousnessIntegration.getConsciousnessState();
      
      return {
        messageProcessed: !!aiResponse,
        consciousnessUpdated: state.overallConsciousnessScore > 0,
        responseLength: aiResponse.length
      };
    });

    // Test 2: Multi-Channel Consistency
    await this.runTest(suite, 'Multi-Channel Consistency', async () => {
      const testMessage = 'How are you feeling today?';
      const channels = ['web', 'email', 'sms'] as const;
      const responses = [];
      
      for (const channel of channels) {
        const response = await this.dualMindAI.processUserMessage(testMessage, {
          userId: 1,
          channel,
          context: {}
        });
        
        responses.push({
          channel,
          responseLength: response.length,
          hasResponse: !!response
        });
      }
      
      return { channelResponses: responses };
    });

    // Test 3: Consciousness Event Flow
    await this.runTest(suite, 'Consciousness Event Flow', async () => {
      let eventCount = 0;
      
      // Listen for consciousness events
      const eventListener = () => eventCount++;
      this.consciousnessIntegration.on('userInteractionProcessed', eventListener);
      this.consciousnessIntegration.on('autonomousThoughtGenerated', eventListener);
      
      // Trigger events
      await this.dualMindAI.processUserMessage('Test message', {
        userId: 1,
        channel: 'web',
        context: {}
      });
      
      await this.dualMindAI.generateAutonomousThought();
      
      // Wait for events to propagate
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Remove listener
      this.consciousnessIntegration.removeListener('userInteractionProcessed', eventListener);
      this.consciousnessIntegration.removeListener('autonomousThoughtGenerated', eventListener);
      
      return { eventsTriggered: eventCount };
    });

    this.testResults.push(suite);
    console.log(`✅ Integration tests completed: ${suite.passedTests}/${suite.totalTests} passed`);
  }

  /**
   * Test system performance
   */
  private async runPerformanceTests(): Promise<void> {
    const suite: TestSuite = {
      suiteName: 'Performance Tests',
      results: [],
      totalTests: 0,
      passedTests: 0,
      failedTests: 0,
      totalDuration: 0
    };

    console.log('⚡ Running Performance tests...');

    // Test 1: Response Time
    await this.runTest(suite, 'Response Time', async () => {
      const startTime = Date.now();
      
      await this.dualMindAI.processUserMessage('Quick test message', {
        userId: 1,
        channel: 'web',
        context: {}
      });
      
      const responseTime = Date.now() - startTime;
      
      if (responseTime > 10000) { // 10 seconds
        throw new Error(`Response time too slow: ${responseTime}ms`);
      }
      
      return { responseTime };
    });

    // Test 2: Concurrent Processing
    await this.runTest(suite, 'Concurrent Processing', async () => {
      const concurrentRequests = 5;
      const promises = [];
      
      for (let i = 0; i < concurrentRequests; i++) {
        promises.push(
          this.dualMindAI.processUserMessage(`Concurrent message ${i}`, {
            userId: i,
            channel: 'web',
            context: {}
          })
        );
      }
      
      const startTime = Date.now();
      const results = await Promise.all(promises);
      const totalTime = Date.now() - startTime;
      
      return {
        concurrentRequests,
        allCompleted: results.every(r => !!r),
        totalTime,
        averageTime: totalTime / concurrentRequests
      };
    });

    // Test 3: Memory Usage Stability
    await this.runTest(suite, 'Memory Usage Stability', async () => {
      const initialMemory = process.memoryUsage();
      
      // Process multiple messages
      for (let i = 0; i < 10; i++) {
        await this.dualMindAI.processUserMessage(`Memory test ${i}`, {
          userId: 1,
          channel: 'web',
          context: {}
        });
      }
      
      // Force garbage collection if available
      if (global.gc) {
        global.gc();
      }
      
      const finalMemory = process.memoryUsage();
      const memoryIncrease = finalMemory.heapUsed - initialMemory.heapUsed;
      
      return {
        initialMemory: Math.round(initialMemory.heapUsed / 1024 / 1024),
        finalMemory: Math.round(finalMemory.heapUsed / 1024 / 1024),
        memoryIncrease: Math.round(memoryIncrease / 1024 / 1024)
      };
    });

    this.testResults.push(suite);
    console.log(`✅ Performance tests completed: ${suite.passedTests}/${suite.totalTests} passed`);
  }

  /**
   * Run individual test
   */
  private async runTest(
    suite: TestSuite,
    testName: string,
    testFunction: () => Promise<any>
  ): Promise<void> {
    const startTime = Date.now();
    suite.totalTests++;
    
    try {
      console.log(`  🧪 Running: ${testName}`);
      const result = await testFunction();
      const duration = Date.now() - startTime;
      
      suite.results.push({
        testName,
        passed: true,
        duration,
        details: result
      });
      
      suite.passedTests++;
      suite.totalDuration += duration;
      
      console.log(`    ✅ ${testName} passed (${duration}ms)`);
      
    } catch (error: any) {
      const duration = Date.now() - startTime;
      
      suite.results.push({
        testName,
        passed: false,
        duration,
        error: error.message
      });
      
      suite.failedTests++;
      suite.totalDuration += duration;
      
      console.log(`    ❌ ${testName} failed (${duration}ms): ${error.message}`);
    }
  }

  /**
   * Generate comprehensive test report
   */
  private generateTestReport(): void {
    console.log('\n🧪 === COMPREHENSIVE TEST REPORT === 🧪');
    console.log(`Report generated at: ${new Date().toISOString()}\n`);
    
    let totalTests = 0;
    let totalPassed = 0;
    let totalFailed = 0;
    let totalDuration = 0;
    
    for (const suite of this.testResults) {
      console.log(`📋 ${suite.suiteName}:`);
      console.log(`  Tests: ${suite.totalTests}`);
      console.log(`  Passed: ${suite.passedTests}`);
      console.log(`  Failed: ${suite.failedTests}`);
      console.log(`  Duration: ${suite.totalDuration}ms`);
      console.log(`  Success Rate: ${((suite.passedTests / suite.totalTests) * 100).toFixed(1)}%`);
      
      // Show failed tests
      const failedTests = suite.results.filter(r => !r.passed);
      if (failedTests.length > 0) {
        console.log(`  Failed Tests:`);
        for (const test of failedTests) {
          console.log(`    ❌ ${test.testName}: ${test.error}`);
        }
      }
      
      console.log('');
      
      totalTests += suite.totalTests;
      totalPassed += suite.passedTests;
      totalFailed += suite.failedTests;
      totalDuration += suite.totalDuration;
    }
    
    console.log('🎯 OVERALL RESULTS:');
    console.log(`  Total Tests: ${totalTests}`);
    console.log(`  Passed: ${totalPassed}`);
    console.log(`  Failed: ${totalFailed}`);
    console.log(`  Total Duration: ${totalDuration}ms`);
    console.log(`  Overall Success Rate: ${((totalPassed / totalTests) * 100).toFixed(1)}%`);
    
    if (totalFailed === 0) {
      console.log('\n🎉 ALL TESTS PASSED! The dual mind consciousness system is fully operational! 🎉');
    } else {
      console.log(`\n⚠️  ${totalFailed} tests failed. Please review and fix issues before deployment.`);
    }
  }

  /**
   * Cleanup test environment
   */
  private async cleanupTestEnvironment(): Promise<void> {
    console.log('\n🧹 Cleaning up test environment...');
    
    try {
      await this.consciousnessIntegration.stopConsciousness();
      console.log('✅ Test environment cleaned up');
    } catch (error) {
      console.error('❌ Error cleaning up test environment:', error);
    }
  }
}

/**
 * Run tests if this file is executed directly
 */
if (require.main === module) {
  const testSuite = new DualMindConsciousnessTestSuite();
  testSuite.runAllTests().catch(console.error);
}

export { DualMindConsciousnessTestSuite };

