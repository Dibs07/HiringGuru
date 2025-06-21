'use client';

import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Timer } from '@/components/assessment/timer';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Mic, MicOff, Volume2 } from 'lucide-react';

interface InterviewRoundProps {
  onComplete: (result: any) => void;
  duration?: number; // Added optional duration prop
}

export function InterviewRound({
  onComplete,
  duration = 30,
}: InterviewRoundProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [isListening, setIsListening] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [responses, setResponses] = useState<Record<number, string>>({});
  const [aiSpeaking, setAiSpeaking] = useState(false);
  const [timeUp, setTimeUp] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(duration * 60);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recognitionRef = useRef<any>(null);

  const questions = [
    {
      id: 1,
      question:
        'Tell me about yourself and your background in software development.',
      followUp: 'What programming languages are you most comfortable with?',
      expectedDuration: 3,
    },
    {
      id: 2,
      question:
        'Describe a challenging technical problem you solved recently. Walk me through your approach.',
      followUp:
        'What would you do differently if you encountered a similar problem again?',
      expectedDuration: 4,
    },
    {
      id: 3,
      question:
        'How do you stay updated with new technologies and industry trends?',
      followUp:
        'Can you give me an example of a new technology you recently learned?',
      expectedDuration: 3,
    },
    {
      id: 4,
      question:
        'Describe a time when you had to work with a difficult team member. How did you handle the situation?',
      followUp: 'What did you learn from that experience?',
      expectedDuration: 3,
    },
    {
      id: 5,
      question:
        'Where do you see yourself in your career in the next 3-5 years?',
      followUp: 'How does this role align with your career goals?',
      expectedDuration: 2,
    },
  ];

  const currentQ = questions[currentQuestion];

  useEffect(() => {
    // Initialize speech recognition
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition =
        (window as any).SpeechRecognition ||
        (window as any).webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;

      recognitionRef.current.onresult = (event: any) => {
        let finalTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          }
        }
        if (finalTranscript) {
          setResponses((prev) => ({
            ...prev,
            [currentQuestion]: (prev[currentQuestion] || '') + finalTranscript,
          }));
        }
      };
    }

    // Simulate AI speaking the question
    setAiSpeaking(true);
    setTimeout(() => setAiSpeaking(false), 3000);
  }, [currentQuestion]);

  const handleTimeUp = () => {
    setTimeUp(true);
    if (isRecording) {
      stopRecording();
    }
  };

  const handleTimeUpdate = (time: number) => {
    setTimeRemaining(time);
  };

  const startListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.start();
      setIsRecording(true);
      startListening();
    } catch (error) {
      console.error('Error starting recording:', error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream
        .getTracks()
        .forEach((track) => track.stop());
      setIsRecording(false);
      stopListening();
    }
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handleSubmit = () => {
    const answeredQuestions = Object.keys(responses).length;
    const totalQuestions = questions.length;
    const score = Math.round((answeredQuestions / totalQuestions) * 100);
    const qualified = score >= 60;

    // Calculate average response quality (mock)
    const avgResponseLength =
      Object.values(responses).reduce(
        (acc, response) => acc + response.length,
        0
      ) / Math.max(answeredQuestions, 1);
    const qualityScore = Math.min(
      100,
      Math.max(0, (avgResponseLength / 50) * 100)
    ); // Assume 50 chars = good response

    const finalScore = Math.round((score + qualityScore) / 2);

    onComplete({
      type: 'interview',
      score: finalScore,
      qualified: finalScore >= 70,
      answeredQuestions,
      totalQuestions,
      responses,
      timeSpent: duration * 60 - timeRemaining,
      feedback:
        finalScore >= 70
          ? `Excellent interview performance! You demonstrated strong communication skills.`
          : `Your interview performance needs improvement. Practice articulating your thoughts more clearly.`,
    });
  };

  const speakQuestion = () => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(currentQ.question);
      utterance.rate = 0.8;
      utterance.pitch = 1;
      speechSynthesis.speak(utterance);
    }
  };

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Technical Interview</CardTitle>
          <p className="text-gray-600">
            Question {currentQuestion + 1} of {questions.length}
          </p>
        </div>
        <Timer
          initialTime={duration * 60}
          onTimeUp={handleTimeUp}
          onTimeUpdate={handleTimeUpdate}
        />
      </CardHeader>

      <CardContent className="space-y-6">
        {/* AI Interviewer */}
        <div className="flex items-start gap-4 p-4 bg-blue-50 rounded-lg">
          <Avatar className="w-12 h-12">
            <AvatarFallback className="bg-blue-600 text-white">
              AI
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="font-medium">AI Interviewer</h3>
              {aiSpeaking && (
                <div className="flex items-center gap-1 text-blue-600">
                  <Volume2 className="h-4 w-4" />
                  <span className="text-sm">Speaking...</span>
                </div>
              )}
            </div>
            <div className="space-y-2">
              <p className="text-gray-800">{currentQ.question}</p>
              <Button variant="ghost" size="sm" onClick={speakQuestion}>
                <Volume2 className="h-4 w-4 mr-1" />
                Repeat Question
              </Button>
            </div>
          </div>
        </div>

        {/* Response Area */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-medium">Your Response:</h3>
            <div className="text-sm text-gray-500">
              Expected duration: ~{currentQ.expectedDuration} minutes
            </div>
          </div>

          <div className="p-4 border-2 border-dashed border-gray-300 rounded-lg min-h-32">
            {responses[currentQuestion] ? (
              <div className="space-y-2">
                <p className="text-sm text-gray-600">Transcribed response:</p>
                <p className="text-gray-800">{responses[currentQuestion]}</p>
              </div>
            ) : (
              <div className="text-center text-gray-500 py-8">
                <Mic className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>Click "Start Recording" to begin your response</p>
              </div>
            )}
          </div>

          <div className="flex justify-center">
            {isRecording ? (
              <Button
                onClick={stopRecording}
                variant="destructive"
                size="lg"
                disabled={timeUp}
              >
                <MicOff className="h-5 w-5 mr-2" />
                Stop Recording
              </Button>
            ) : (
              <Button onClick={startRecording} size="lg" disabled={timeUp}>
                <Mic className="h-5 w-5 mr-2" />
                {responses[currentQuestion]
                  ? 'Record Again'
                  : 'Start Recording'}
              </Button>
            )}
          </div>

          {isListening && (
            <div className="text-center">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm">
                <div className="w-2 h-2 bg-red-600 rounded-full animate-pulse"></div>
                Listening...
              </div>
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="flex justify-between pt-6">
          <Button
            variant="outline"
            onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
            disabled={currentQuestion === 0}
          >
            Previous Question
          </Button>

          <div className="flex gap-2">
            {currentQuestion < questions.length - 1 ? (
              <Button onClick={handleNext}>Next Question</Button>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={!timeUp && Object.keys(responses).length === 0}
              >
                {timeUp ? 'Time Up - Submit' : 'Complete Interview'}
              </Button>
            )}
          </div>
        </div>

        {/* Question Progress */}
        <div className="border-t pt-4">
          <div className="flex justify-center gap-2">
            {questions.map((_, index) => (
              <div
                key={index}
                className={`w-3 h-3 rounded-full ${
                  index === currentQuestion
                    ? 'bg-blue-600'
                    : responses[index]
                      ? 'bg-green-600'
                      : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
