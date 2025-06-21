'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Timer } from '@/components/assessment/timer';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Play, CheckCircle, XCircle, Code } from 'lucide-react';

interface CodingRoundProps {
  onComplete: (result: any) => void;
}

export function CodingRound({ onComplete }: CodingRoundProps) {
  const [selectedLanguage, setSelectedLanguage] = useState('javascript');
  const [code, setCode] = useState('');
  const [testResults, setTestResults] = useState<any[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [timeUp, setTimeUp] = useState(false);

  const problem = {
    title: 'Two Sum',
    difficulty: 'Medium',
    description: `Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.

You may assume that each input would have exactly one solution, and you may not use the same element twice.

You can return the answer in any order.`,
    examples: [
      {
        input: 'nums = [2,7,11,15], target = 9',
        output: '[0,1]',
        explanation: 'Because nums[0] + nums[1] == 9, we return [0, 1].',
      },
      {
        input: 'nums = [3,2,4], target = 6',
        output: '[1,2]',
        explanation: 'Because nums[1] + nums[2] == 6, we return [1, 2].',
      },
    ],
    constraints: [
      '2 <= nums.length <= 10^4',
      '-10^9 <= nums[i] <= 10^9',
      '-10^9 <= target <= 10^9',
      'Only one valid answer exists.',
    ],
  };

  const languages = [
    { value: 'javascript', label: 'JavaScript' },
    { value: 'python', label: 'Python' },
    { value: 'java', label: 'Java' },
    { value: 'cpp', label: 'C++' },
  ];

  const starterCode = {
    javascript: `function twoSum(nums, target) {
    // Write your solution here
    
}

// Test cases
console.log(twoSum([2,7,11,15], 9)); // Expected: [0,1]
console.log(twoSum([3,2,4], 6)); // Expected: [1,2]`,
    python: `def two_sum(nums, target):
    # Write your solution here
    pass

# Test cases  
print(two_sum([2,7,11,15], 9))  # Expected: [0,1]
print(two_sum([3,2,4], 6))  # Expected: [1,2]`,
    java: `public class Solution {
    public int[] twoSum(int[] nums, int target) {
        // Write your solution here
        return new int[]{};
    }
    
    public static void main(String[] args) {
        Solution sol = new Solution();
        // Test cases
        System.out.println(Arrays.toString(sol.twoSum(new int[]{2,7,11,15}, 9))); // Expected: [0,1]
        System.out.println(Arrays.toString(sol.twoSum(new int[]{3,2,4}, 6))); // Expected: [1,2]
    }
}`,
    cpp: `#include <vector>
#include <iostream>
using namespace std;

class Solution {
public:
    vector<int> twoSum(vector<int>& nums, int target) {
        // Write your solution here
        return {};
    }
};

int main() {
    Solution sol;
    // Test cases
    vector<int> nums1 = {2,7,11,15};
    vector<int> result1 = sol.twoSum(nums1, 9); // Expected: [0,1]
    
    vector<int> nums2 = {3,2,4};  
    vector<int> result2 = sol.twoSum(nums2, 6); // Expected: [1,2]
    
    return 0;
}`,
  };

  const handleLanguageChange = (language: string) => {
    setSelectedLanguage(language);
    setCode(starterCode[language as keyof typeof starterCode] || '');
  };

  const runCode = async () => {
    setIsRunning(true);

    // Mock code execution and testing
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Mock test results
    const mockResults = [
      {
        input: '[2,7,11,15], target = 9',
        expected: '[0,1]',
        actual: '[0,1]',
        passed: true,
        executionTime: '1ms',
      },
      {
        input: '[3,2,4], target = 6',
        expected: '[1,2]',
        actual: '[1,2]',
        passed: true,
        executionTime: '1ms',
      },
      {
        input: '[3,3], target = 6',
        expected: '[0,1]',
        actual: '[0,1]',
        passed: true,
        executionTime: '1ms',
      },
    ];

    setTestResults(mockResults);
    setIsRunning(false);
  };

  const handleSubmit = () => {
    const passedTests = testResults.filter((result) => result.passed).length;
    const totalTests = testResults.length || 3; // Default to 3 if no tests run
    const score = Math.round((passedTests / totalTests) * 100);
    const qualified = score >= 70;

    onComplete({
      type: 'coding',
      score,
      qualified,
      passedTests,
      totalTests,
      code,
      language: selectedLanguage,
      testResults,
      feedback: qualified
        ? `Excellent coding skills! You passed ${passedTests}/${totalTests} test cases.`
        : `You passed ${passedTests}/${totalTests} test cases. You need to pass at least 70% to qualify.`,
    });
  };

  return (
    <Card className="max-w-6xl mx-auto">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="flex items-center gap-2">
            <Code className="h-5 w-5" />
            Coding Round
          </CardTitle>
          <p className="text-gray-600">Solve the coding problem below</p>
        </div>
        <Timer duration={45 * 60} onTimeUp={() => setTimeUp(true)} />
      </CardHeader>

      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Problem Description */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-semibold">{problem.title}</h2>
              <Badge
                variant="outline"
                className="text-orange-600 border-orange-600"
              >
                {problem.difficulty}
              </Badge>
            </div>

            <div className="prose prose-sm max-w-none">
              <p className="text-gray-700 leading-relaxed">
                {problem.description}
              </p>
            </div>

            <div className="space-y-3">
              <h3 className="font-medium">Examples:</h3>
              {problem.examples.map((example, index) => (
                <div key={index} className="p-3 bg-gray-50 rounded-lg text-sm">
                  <div>
                    <strong>Input:</strong> {example.input}
                  </div>
                  <div>
                    <strong>Output:</strong> {example.output}
                  </div>
                  <div className="text-gray-600">
                    <strong>Explanation:</strong> {example.explanation}
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-2">
              <h3 className="font-medium">Constraints:</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                {problem.constraints.map((constraint, index) => (
                  <li key={index}>• {constraint}</li>
                ))}
              </ul>
            </div>

            {/* Test Results */}
            {testResults.length > 0 && (
              <div className="space-y-3">
                <h3 className="font-medium">Test Results:</h3>
                <div className="space-y-2">
                  {testResults.map((result, index) => (
                    <div
                      key={index}
                      className={`p-3 rounded-lg border ${
                        result.passed
                          ? 'bg-green-50 border-green-200'
                          : 'bg-red-50 border-red-200'
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        {result.passed ? (
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        ) : (
                          <XCircle className="h-4 w-4 text-red-600" />
                        )}
                        <span className="font-medium text-sm">
                          Test Case {index + 1}
                        </span>
                        <span className="text-xs text-gray-500">
                          {result.executionTime}
                        </span>
                      </div>
                      <div className="text-xs space-y-1">
                        <div>Input: {result.input}</div>
                        <div>Expected: {result.expected}</div>
                        <div>Actual: {result.actual}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Code Editor */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Select
                value={selectedLanguage}
                onValueChange={handleLanguageChange}
              >
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {languages.map((lang) => (
                    <SelectItem key={lang.value} value={lang.value}>
                      {lang.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Button onClick={runCode} disabled={isRunning || !code.trim()}>
                {isRunning ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                    Running...
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4 mr-2" />
                    Run Code
                  </>
                )}
              </Button>
            </div>

            <div className="relative">
              <Textarea
                value={
                  code ||
                  starterCode[selectedLanguage as keyof typeof starterCode]
                }
                onChange={(e) => setCode(e.target.value)}
                className="font-mono text-sm min-h-[400px] resize-none"
                placeholder="Write your code here..."
              />
            </div>

            <div className="flex justify-end">
              <Button
                onClick={handleSubmit}
                disabled={!timeUp && testResults.length === 0}
                size="lg"
              >
                {timeUp ? 'Time Up - Submit' : 'Submit Solution'}
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
