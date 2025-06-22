import { useState, useRef, useEffect } from "react"
import { Mic, MicOff, Volume2, Play, MessageCircle, CheckCircle, AlertCircle, Users } from "lucide-react"
import { apiService } from "@/lib/services/api-service"

interface InterviewRoundProps {
  onComplete: (result: any) => void
  roundId: string
  userName: string
  userRole: string
}

interface ConversationMessage {
  type: "ai" | "user"
  text: string
  timestamp: Date
  questionNumber?: number
}

export default function InterviewRound({ onComplete, roundId, userName, userRole }: InterviewRoundProps) {
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [currentQuestionNumber, setCurrentQuestionNumber] = useState(1)
  const [isListening, setIsListening] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [isAISpeaking, setIsAISpeaking] = useState(false)
  const [conversation, setConversation] = useState<ConversationMessage[]>([])
  const [currentTranscript, setCurrentTranscript] = useState("")
  const [isInterviewStarted, setIsInterviewStarted] = useState(false)
  const [isInterviewEnded, setIsInterviewEnded] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [interviewFeedback, setInterviewFeedback] = useState("")
  const [currentlyDisplayedText, setCurrentlyDisplayedText] = useState("")
  const [isProcessingResponse, setIsProcessingResponse] = useState(false)

  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const recognitionRef = useRef<any>(null)
  const currentAudioRef = useRef<HTMLAudioElement | null>(null)
  const audioChunksRef = useRef<Blob[]>([])
  const speechTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    // Initialize speech recognition
    if ("webkitSpeechRecognition" in window || "SpeechRecognition" in window) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
      recognitionRef.current = new SpeechRecognition()
      recognitionRef.current.continuous = true
      recognitionRef.current.interimResults = true
      recognitionRef.current.lang = "en-US"

      recognitionRef.current.onresult = (event: any) => {
        let finalTranscript = ""
        let interimTranscript = ""

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript
          if (event.results[i].isFinal) {
            finalTranscript += transcript
          } else {
            interimTranscript += transcript
          }
        }

        if (finalTranscript.trim()) {
          setCurrentTranscript(finalTranscript.trim())
          
          // Clear any existing timeout
          if (speechTimeoutRef.current) {
            clearTimeout(speechTimeoutRef.current)
          }
          
          // Set a timeout to automatically process the response after 2 seconds of silence
          speechTimeoutRef.current = setTimeout(() => {
            if (finalTranscript.trim()) {
              handleUserResponse(finalTranscript.trim())
            }
          }, 2000)
        } else if (interimTranscript.trim()) {
          setCurrentTranscript(interimTranscript.trim())
        }
      }

      recognitionRef.current.onerror = (event: any) => {
        console.error("Speech recognition error:", event.error)
        setIsListening(false)
        setIsRecording(false)
        
        // Restart listening if it was just a network error
        if (event.error === 'network') {
          setTimeout(() => {
            if (!isProcessingResponse && !isAISpeaking) {
              startListening()
            }
          }, 1000)
        }
      }

      recognitionRef.current.onend = () => {
        setIsListening(false)
        setIsRecording(false)
        
        // Auto-restart listening if we're not processing a response and AI isn't speaking
        if (!isProcessingResponse && !isAISpeaking && isInterviewStarted && !isInterviewEnded) {
          setTimeout(() => {
            startListening()
          }, 1000)
        }
      }
    }

    // Check for existing session
    const savedSessionId = localStorage.getItem("interview_session_id")
    if (savedSessionId) {
      setSessionId(savedSessionId)
      // setIsInterviewStarted(true)
      // loadConversationHistory(savedSessionId)
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop()
      }
      if (currentAudioRef.current) {
        currentAudioRef.current.pause()
      }
      if (speechTimeoutRef.current) {
        clearTimeout(speechTimeoutRef.current)
      }
    }
  }, [])

  const loadConversationHistory = async (sessionId: string) => {
    try {
      const data = await apiService.getConversation(sessionId)
      console.log("Conversation history:", data)
      // Process and set conversation history if available
      if (data.conversation && Array.isArray(data.conversation)) {
        setConversation(data.conversation)
      }
    } catch (error) {
      console.error("Failed to load conversation history:", error)
    }
  }

  const base64ToAudio = (base64String: string): string => {
    try {
      // Remove data URL prefix if present
      const base64Data = base64String.replace(/^data:audio\/[^;]+;base64,/, '')
      const binaryString = atob(base64Data)
      const bytes = new Uint8Array(binaryString.length)
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i)
      }
      const blob = new Blob([bytes], { type: "audio/wav" })
      return URL.createObjectURL(blob)
    } catch (error) {
      console.error("Error converting base64 to audio:", error)
      throw error
    }
  }

  const playAudio = (base64Audio: string, text: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      try {
        const audioUrl = base64ToAudio(base64Audio)
        const audio = new Audio(audioUrl)
        currentAudioRef.current = audio

        setIsAISpeaking(true)
        setCurrentlyDisplayedText(text)
        
        audio.onended = () => {
          setIsAISpeaking(false)
          setCurrentlyDisplayedText("")
          URL.revokeObjectURL(audioUrl)
          currentAudioRef.current = null
          resolve()
        }

        audio.onerror = (error) => {
          setIsAISpeaking(false)
          setCurrentlyDisplayedText("")
          URL.revokeObjectURL(audioUrl)
          currentAudioRef.current = null
          console.error("Failed to play audio response:", error)
          reject(error)
        }

        audio.play().catch(reject)
      } catch (error) {
        console.error("Error playing audio:", error)
        setIsAISpeaking(false)
        setCurrentlyDisplayedText("")
        reject(error)
      }
    })
  }

  const startInterview = async () => {
    setIsLoading(true)
    try {
      const data = await apiService.startInterview({
        user_name: userName,
        user_role: userRole,
        round_id: roundId,
      })
      
      setSessionId(data.session_id)
      localStorage.setItem("interview_session_id", data.session_id)

      // Add greeting to conversation
      const greetingMessage: ConversationMessage = {
        type: "ai",
        text: data.greeting_text,
        timestamp: new Date(),
        questionNumber: 0,
      }
      setConversation([greetingMessage])

      setIsInterviewStarted(true)

      // Play greeting audio and then start first question
      if (data.audio_data) {
        await playAudio(data.audio_data, data.greeting_text)
      }

      // Automatically start first question after greeting
      setTimeout(() => {
        getFirstQuestion()
      }, 1000)

    } catch (error) {
      console.error("Failed to start interview:", error)
      alert("Failed to start interview. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const getFirstQuestion = async () => {
    if (!sessionId) return

    setIsLoading(true)
    try {
      const data = await apiService.getAIResponse({
        session_id: sessionId,
        question_number: 1,
        user_transcript: " ", // Empty transcript for first question
      })

      // Add AI question to conversation
      const aiMessage: ConversationMessage = {
        type: "ai",
        text: data.question_text,
        timestamp: new Date(),
        questionNumber: data.question_number,
      }

      setConversation((prev) => [...prev, aiMessage])

      // Play AI question audio
      if (data.audio_data) {
        await playAudio(data.audio_data, data.question_text)
      }

      setCurrentQuestionNumber(data.question_number + 1)

      // Automatically start listening after AI finishes speaking
      setTimeout(() => {
        startListening()
      }, 1000)

    } catch (error) {
      console.error("Failed to get first question:", error)
      alert("Failed to get first question. Please try again.")
      endInterview()
    } finally {
      setIsLoading(false)
    }
  }

  const getNextQuestion = async (userTranscript: string) => {
    if (!sessionId) return

    setIsLoading(true)
    setIsProcessingResponse(true)
    
    try {
      const data = await apiService.getAIResponse({
        session_id: sessionId,
        question_number: currentQuestionNumber,
        user_transcript: userTranscript,
      })

      // Check if interview is complete (you might need to adjust this logic based on your backend)
      if (data.is_complete || data.question_text.toLowerCase().includes("interview complete")) {
        endInterview()
        return
      }

      // Add AI question to conversation
      const aiMessage: ConversationMessage = {
        type: "ai",
        text: data.question_text,
        timestamp: new Date(),
        questionNumber: data.question_number,
      }

      setConversation((prev) => [...prev, aiMessage])

      // Play AI response audio
      if (data.audio_data) {
        await playAudio(data.audio_data, data.question_text)
      }

      setCurrentQuestionNumber(data.question_number + 1)

      // Automatically start listening after AI finishes speaking
      setTimeout(() => {
        startListening()
      }, 1000)

    } catch (error) {
      console.error("Failed to get AI response:", error)
      alert("Failed to get next question. Please try again.")
      endInterview()
    } finally {
      setIsLoading(false)
      setIsProcessingResponse(false)
    }
  }

  const handleUserResponse = async (transcript: string) => {
    if (!transcript.trim() || isProcessingResponse) return

    // Clear speech timeout
    if (speechTimeoutRef.current) {
      clearTimeout(speechTimeoutRef.current)
      speechTimeoutRef.current = null
    }

    // Add user response to conversation
    const userMessage: ConversationMessage = {
      type: "user",
      text: transcript,
      timestamp: new Date(),
    }

    setConversation((prev) => [...prev, userMessage])
    setCurrentTranscript("")

    // Stop listening
    stopListening()

    // Get next question
    await getNextQuestion(transcript)
  }

  const startListening = async () => {
    if (!recognitionRef.current || isAISpeaking || isProcessingResponse) {
      return
    }

    if (isListening) {
      return // Already listening
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      
      // Initialize MediaRecorder for audio recording
      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder
      audioChunksRef.current = []

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data)
        }
      }

      mediaRecorder.start()
      recognitionRef.current.start()
      setIsListening(true)
      setIsRecording(true)
    } catch (error) {
      console.error("Error starting recording:", error)
      alert("Failed to access microphone. Please ensure microphone permissions are granted.")
    }
  }

  const stopListening = () => {
    if (speechTimeoutRef.current) {
      clearTimeout(speechTimeoutRef.current)
      speechTimeoutRef.current = null
    }

    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop()
    }

    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      mediaRecorderRef.current.stream.getTracks().forEach((track) => track.stop())
      setIsRecording(false)
    }

    setIsListening(false)
  }

  const endInterview = async () => {
    stopListening()
    setIsInterviewEnded(true)
    
    // Load final conversation
    if (sessionId) {
      await loadConversationHistory(sessionId)
      localStorage.removeItem("interview_session_id")
    }
  }

  const submitFeedback = () => {
    const result = {
      type: "interview",
      sessionId,
      conversation,
      feedback: interviewFeedback,
      questionsAnswered: conversation.filter((msg) => msg.type === "user").length,
      totalQuestions: currentQuestionNumber - 1,
    }

    onComplete(result)
  }

  // Manual controls for testing
  const manualStartListening = () => {
    startListening()
  }

  const manualStopListening = () => {
    if (currentTranscript.trim()) {
      handleUserResponse(currentTranscript.trim())
    } else {
      stopListening()
    }
  }

  if (!isInterviewStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="max-w-2xl w-full bg-white shadow-2xl rounded-lg border-0">
          <div className="text-center space-y-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-lg p-6">
            <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto">
              <Users className="h-10 w-10 text-white" />
            </div>
            <h1 className="text-3xl font-bold">AI Mock Interview</h1>
            <p className="text-blue-100 text-lg">
              Ready to practice for {userRole} position?
            </p>
          </div>
          <div className="space-y-8 p-8">
            <div className="text-center space-y-6">
              <div>
                <h3 className="text-xl font-semibold mb-4 text-gray-800">Interview Guidelines</h3>
                <div className="grid gap-4 text-left max-w-md mx-auto">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-1 flex-shrink-0" />
                    <span className="text-gray-700">Ensure you're in a quiet environment</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-1 flex-shrink-0" />
                    <span className="text-gray-700">Allow microphone access when prompted</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-1 flex-shrink-0" />
                    <span className="text-gray-700">Speak clearly and at normal pace</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-amber-600 mt-1 flex-shrink-0" />
                    <span className="text-gray-700">Interview will be recorded for analysis</span>
                  </div>
                </div>
              </div>
              
              <button 
                onClick={startInterview} 
                disabled={isLoading} 
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-3 text-lg shadow-lg hover:shadow-xl transition-all duration-200 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                    Connecting...
                  </>
                ) : (
                  <>
                    <Play className="h-5 w-5 mr-3" />
                    Start Interview
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (isInterviewEnded) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-4">
        <div className="max-w-2xl w-full bg-white shadow-2xl rounded-lg border-0">
          <div className="text-center bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-t-lg p-6">
            <h1 className="text-3xl font-bold">Interview Completed! 🎉</h1>
            <p className="text-green-100 text-lg">
              Great job! How was your experience?
            </p>
          </div>
          <div className="space-y-6 p-8">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-3 text-gray-700">
                  Share your feedback about the interview experience:
                </label>
                <textarea
                  value={interviewFeedback}
                  onChange={(e) => setInterviewFeedback(e.target.value)}
                  className="w-full p-4 border-2 border-gray-200 rounded-xl resize-none focus:border-green-500 focus:outline-none transition-colors"
                  rows={4}
                  placeholder="How did you find the interview? Any suggestions for improvement?"
                />
              </div>
              <div className="flex gap-4 justify-center pt-4">
                <button 
                  onClick={() => setIsInterviewEnded(false)}
                  className="px-6 py-2 border-2 border-gray-300 hover:border-gray-400 rounded-lg bg-white text-gray-800 hover:bg-gray-50 transition-colors"
                >
                  Continue Interview
                </button>
                <button 
                  onClick={submitFeedback} 
                  className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 px-6 py-2 shadow-lg hover:shadow-xl rounded-lg text-white transition-all"
                >
                  Generate Interview Report
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4">
      <div className="max-w-6xl mx-auto bg-white shadow-2xl rounded-lg border-0">
        <div className="flex flex-row items-center justify-between bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-t-lg p-6">
          <div>
            <h1 className="text-2xl font-bold">AI Interview Session</h1>
            <p className="text-indigo-100">
              Question {Math.max(currentQuestionNumber - 1, 1)} • {userName} - {userRole}
            </p>
          </div>
          <button 
            onClick={endInterview} 
            className="bg-white/10 border border-white/20 text-white hover:bg-white/20 px-4 py-2 rounded-lg text-sm transition-colors"
          >
            End Interview
          </button>
        </div>

        <div className="space-y-6 p-6">
          {/* AI Speaking Status */}
          {isAISpeaking && (
            <div className="flex items-center justify-center gap-3 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl">
              <Volume2 className="h-6 w-6 text-blue-600" />
              <span className="text-blue-800 font-medium">AI is speaking...</span>
              <div className="flex gap-1">
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"
                    style={{ animationDelay: `${i * 0.1}s` }}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Current AI Text Display */}
          {currentlyDisplayedText && (
            <div className="p-4 bg-blue-50 border-l-4 border-blue-400 rounded-lg">
              <p className="text-blue-900 font-medium text-lg">
                {currentlyDisplayedText}
              </p>
            </div>
          )}

          {/* Conversation History */}
          <div className="max-h-96 overflow-y-auto space-y-4 p-4 bg-white rounded-xl border border-gray-200 shadow-inner">
            {conversation.map((message, index) => (
              <div
                key={index}
                className={`flex gap-3 ${message.type === "user" ? "justify-end" : "justify-start"}`}
              >
                {message.type === "ai" && (
                  <div className="w-10 h-10 shadow-md rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                    <span className="text-white font-bold text-xs">AI</span>
                  </div>
                )}
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl shadow-md ${
                    message.type === "ai" 
                      ? "bg-gradient-to-br from-blue-100 to-blue-200 text-blue-900" 
                      : "bg-gradient-to-br from-green-100 to-green-200 text-green-900"
                  }`}
                >
                  <p className="text-sm leading-relaxed">{message.text}</p>
                  <span className="text-xs opacity-70 mt-1 block">
                    {message.timestamp.toLocaleTimeString()}
                  </span>
                </div>
                {message.type === "user" && (
                  <div className="w-10 h-10 shadow-md rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
                    <span className="text-white font-bold text-xs">
                      {userName.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
              </div>
            ))}

            {isLoading && (
              <div className="flex gap-3 justify-start">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                  <span className="text-white font-bold text-xs">AI</span>
                </div>
                <div className="bg-blue-100 text-blue-900 px-4 py-3 rounded-2xl">
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                    <span className="text-sm">AI is thinking...</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Current Transcript Display */}
          {currentTranscript && (
            <div className="p-4 bg-gradient-to-r from-yellow-50 to-amber-50 border border-yellow-200 rounded-xl">
              <p className="text-sm text-yellow-800">
                <strong>You're saying:</strong> {currentTranscript}
              </p>
            </div>
          )}

          {/* Recording Controls */}
          <div className="flex justify-center gap-4">
            {isListening ? (
              <button 
                onClick={manualStopListening} 
                className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 shadow-lg hover:shadow-xl px-8 py-3 rounded-lg text-white flex items-center justify-center transition-all"
              >
                <MicOff className="h-6 w-6 mr-3" />
                Stop & Submit
              </button>
            ) : (
              <button
                onClick={manualStartListening}
                disabled={isAISpeaking || isLoading || isProcessingResponse}
                className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl px-8 py-3 rounded-lg text-white flex items-center justify-center transition-all"
              >
                <Mic className="h-6 w-6 mr-3" />
                {conversation.length <= 1 ? "Start Responding" : "Record Response"}
              </button>
            )}
          </div>

          {/* Recording Status */}
          {isListening && (
            <div className="text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-100 to-red-200 text-red-700 rounded-full text-sm font-medium shadow-md">
                <div className="w-3 h-3 bg-red-600 rounded-full animate-pulse"></div>
                Recording... Speak now (auto-submit after 2s pause)
              </div>
            </div>
          )}

          {/* Processing Status */}
          {isProcessingResponse && (
            <div className="text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-100 to-blue-200 text-blue-700 rounded-full text-sm font-medium shadow-md">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                Processing your response...
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}