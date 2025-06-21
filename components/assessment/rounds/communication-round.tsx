'use client';

import { Label } from '@/components/ui/label';

import { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Timer } from '@/components/assessment/timer';
import { Progress } from '@/components/ui/progress';
import { Mic, MicOff, Play, Pause, Volume2 } from 'lucide-react';

interface CommunicationRoundProps {
  onComplete: (result: any) => void;
}

export function CommunicationRound({ onComplete }: CommunicationRoundProps) {
  const [currentTask, setCurrentTask] = useState(0);
  const [responses, setResponses] = useState<Record<number, any>>({});
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [timeUp, setTimeUp] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const tasks = [
    {
      id: 1,
      type: 'audio_comprehension',
      title: 'Audio Comprehension',
      instruction:
        'Listen to the audio clip carefully (you can play it only once) and answer the questions below.',
      audioUrl: '/placeholder-audio.mp3', // Mock audio URL
      questions: [
        'What was the main topic discussed in the audio?',
        'What solution was proposed for the problem mentioned?',
      ],
      duration: 5,
    },
    {
      id: 2,
      type: 'verbal_response',
      title: 'Verbal Response',
      instruction:
        'Read the question below and provide your answer by speaking. You have 2 minutes to record your response.',
      question:
        'Describe a challenging project you worked on and how you overcame the difficulties. What did you learn from this experience?',
      duration: 2,
    },
    {
      id: 3,
      type: 'reading_comprehension',
      title: 'Reading Comprehension',
      instruction: 'Read the passage below and answer the questions.',
      passage: `
        Artificial Intelligence (AI) has revolutionized many industries, from healthcare to finance. Machine learning algorithms can now process vast amounts of data to identify patterns that humans might miss. However, the implementation of AI systems also raises important ethical questions about privacy, job displacement, and decision-making transparency.
        
        Companies must balance the benefits of AI automation with the need to maintain human oversight. The most successful AI implementations are those that augment human capabilities rather than replace them entirely. This collaborative approach ensures that the technology serves to enhance productivity while preserving the human element in critical decision-making processes.
      `,
      questions: [
        'According to the passage, what is the main advantage of machine learning algorithms?',
        'What approach to AI implementation does the passage suggest is most successful?',
        'What are some ethical concerns mentioned regarding AI systems?',
      ],
      duration: 8,
    },
  ];

  const currentTaskData = tasks[currentTask];
  const progress = ((currentTask + 1) / tasks.length) * 100;

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, {
          type: 'audio/wav',
        });
        const audioUrl = URL.createObjectURL(audioBlob);
        setResponses({
          ...responses,
          [currentTask]: { ...responses[currentTask], audioResponse: audioUrl },
        });
      };

      mediaRecorder.start();
      setIsRecording(true);
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
    }
  };

  const playAudio = () => {
    // Mock audio playback
    setIsPlaying(true);
    setTimeout(() => setIsPlaying(false), 3000); // Mock 3-second audio
  };

  const handleTextResponse = (questionIndex: number, value: string) => {
    const currentResponses = responses[currentTask] || {};
    const textResponses = currentResponses.textResponses || {};
    textResponses[questionIndex] = value;

    setResponses({
      ...responses,
      [currentTask]: { ...currentResponses, textResponses },
    });
  };

  const handleNext = () => {
    if (currentTask < tasks.length - 1) {
      setCurrentTask(currentTask + 1);
    }
  };

  const handleSubmit = () => {
    // Calculate score based on responses
    let score = 0;
    const totalTasks = tasks.length;

    // Simple scoring logic
    Object.keys(responses).forEach((taskIndex) => {
      const response = responses[Number.parseInt(taskIndex)];
      if (response.textResponses || response.audioResponse) {
        score += Math.floor(100 / totalTasks);
      }
    });

    const qualified = score >= 70;

    onComplete({
      type: 'communication',
      score,
      qualified,
      responses,
      feedback: qualified
        ? `Great communication skills! You scored ${score}%.`
        : `You scored ${score}%. Work on providing more detailed responses.`,
    });
  };

  const renderTask = () => {
    switch (currentTaskData.type) {
      case 'audio_comprehension':
        return (
          <div className="space-y-6">
            <div className="p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-medium">Audio Clip</h4>
                <Button
                  onClick={playAudio}
                  disabled={isPlaying}
                  variant="outline"
                  size="sm"
                >
                  {isPlaying ? (
                    <>
                      <Pause className="h-4 w-4 mr-2" />
                      Playing...
                    </>
                  ) : (
                    <>
                      <Play className="h-4 w-4 mr-2" />
                      Play Audio
                    </>
                  )}
                </Button>
              </div>
              <p className="text-sm text-gray-600">
                Note: You can only play this audio once. Listen carefully.
              </p>
            </div>

            {currentTaskData.questions?.map((question, index) => (
              <div key={index} className="space-y-2">
                <Label className="font-medium">
                  {index + 1}. {question}
                </Label>
                <Textarea
                  placeholder="Type your answer here..."
                  value={responses[currentTask]?.textResponses?.[index] || ''}
                  onChange={(e) => handleTextResponse(index, e.target.value)}
                  rows={3}
                />
              </div>
            ))}
          </div>
        );

      case 'verbal_response':
        return (
          <div className="space-y-6">
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium mb-2">Question:</h4>
              <p>{currentTaskData.question}</p>
            </div>

            <div className="text-center space-y-4">
              <div className="p-6 border-2 border-dashed border-gray-300 rounded-lg">
                {isRecording ? (
                  <div className="space-y-4">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
                      <Mic className="h-8 w-8 text-red-600 animate-pulse" />
                    </div>
                    <p className="text-red-600 font-medium">
                      Recording in progress...
                    </p>
                    <Button onClick={stopRecording} variant="outline">
                      <MicOff className="h-4 w-4 mr-2" />
                      Stop Recording
                    </Button>
                  </div>
                ) : responses[currentTask]?.audioResponse ? (
                  <div className="space-y-4">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                      <Volume2 className="h-8 w-8 text-green-600" />
                    </div>
                    <p className="text-green-600 font-medium">
                      Response recorded successfully!
                    </p>
                    <Button onClick={startRecording} variant="outline">
                      <Mic className="h-4 w-4 mr-2" />
                      Record Again
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
                      <Mic className="h-8 w-8 text-gray-600" />
                    </div>
                    <p className="text-gray-600">
                      Click to start recording your response
                    </p>
                    <Button onClick={startRecording}>
                      <Mic className="h-4 w-4 mr-2" />
                      Start Recording
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        );

      case 'reading_comprehension':
        return (
          <div className="space-y-6">
            <div className="p-4 bg-gray-50 rounded-lg max-h-64 overflow-y-auto">
              <h4 className="font-medium mb-2">Passage:</h4>
              <div className="text-sm leading-relaxed whitespace-pre-line">
                {currentTaskData.passage}
              </div>
            </div>

            {currentTaskData.questions?.map((question, index) => (
              <div key={index} className="space-y-2">
                <Label className="font-medium">
                  {index + 1}. {question}
                </Label>
                <Textarea
                  placeholder="Type your answer here..."
                  value={responses[currentTask]?.textResponses?.[index] || ''}
                  onChange={(e) => handleTextResponse(index, e.target.value)}
                  rows={3}
                />
              </div>
            ))}
          </div>
        );

      default:
        return <div>Task type not implemented</div>;
    }
  };

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Communication Round</CardTitle>
          <p className="text-gray-600">
            Task {currentTask + 1} of {tasks.length}: {currentTaskData.title}
          </p>
        </div>
        <Timer
          duration={currentTaskData.duration * 60}
          onTimeUp={() => setTimeUp(true)}
        />
      </CardHeader>

      <CardContent className="space-y-6">
        <Progress value={progress} className="w-full" />

        <div className="p-4 bg-blue-50 rounded-lg">
          <p className="text-blue-800">{currentTaskData.instruction}</p>
        </div>

        {renderTask()}

        <div className="flex justify-between pt-6">
          <Button
            variant="outline"
            onClick={() => setCurrentTask(Math.max(0, currentTask - 1))}
            disabled={currentTask === 0}
          >
            Previous Task
          </Button>

          <div className="flex gap-2">
            {currentTask < tasks.length - 1 ? (
              <Button onClick={handleNext}>Next Task</Button>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={
                  !timeUp && Object.keys(responses).length < tasks.length
                }
              >
                {timeUp ? 'Time Up - Submit' : 'Submit Communication Round'}
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
