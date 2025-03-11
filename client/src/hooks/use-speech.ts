import { useState, useEffect, useCallback, useRef } from 'react';

interface UseSpeechProps {
  onSpeechResult?: (text: string) => void;
  continuous?: boolean;
  language?: string;
}

export function useSpeech({
  onSpeechResult,
  continuous = false,
  language = 'en-IN'
}: UseSpeechProps = {}) {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(true);
  const [ttsSupported, setTtsSupported] = useState(true);
  
  const recognitionRef = useRef<any>(null);
  
  // Initialize speech recognition
  useEffect(() => {
    // Check if browser supports SpeechRecognition API
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      console.warn("Speech recognition is not supported in this browser.");
      setSpeechSupported(false);
      return;
    }
    
    // Create speech recognition instance
    const recognition = new SpeechRecognition();
    recognition.continuous = continuous;
    recognition.interimResults = false;
    recognition.lang = language;
    
    // Setup event handlers
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript.trim();
      if (onSpeechResult && transcript) {
        onSpeechResult(transcript);
      }
      
      if (!continuous) {
        setIsListening(false);
      }
    };
    
    recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);
    };
    
    recognition.onend = () => {
      if (isListening && continuous) {
        recognition.start();
      } else {
        setIsListening(false);
      }
    };
    
    recognitionRef.current = recognition;
    
    // Check if browser supports speech synthesis
    if (!window.speechSynthesis) {
      console.warn("Text-to-speech is not supported in this browser.");
      setTtsSupported(false);
    }
    
    // Clean up on component unmount
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, [continuous, language, onSpeechResult, isListening]);
  
  // Start listening for speech input
  const startListening = useCallback(() => {
    if (!speechSupported || !recognitionRef.current) return;
    
    try {
      recognitionRef.current.start();
      setIsListening(true);
    } catch (error) {
      console.error('Error starting speech recognition:', error);
    }
  }, [speechSupported]);
  
  // Stop listening for speech input
  const stopListening = useCallback(() => {
    if (!speechSupported || !recognitionRef.current) return;
    
    try {
      recognitionRef.current.stop();
      setIsListening(false);
    } catch (error) {
      console.error('Error stopping speech recognition:', error);
    }
  }, [speechSupported]);
  
  // Speak text using text-to-speech
  const speak = useCallback((text: string, rate = 1, pitch = 1, voice?: SpeechSynthesisVoice) => {
    if (!ttsSupported || !window.speechSynthesis) return;
    
    // Cancel any ongoing speech
    window.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = rate;
    utterance.pitch = pitch;
    utterance.lang = language;
    
    if (voice) {
      utterance.voice = voice;
    }
    
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = (event) => {
      console.error('Speech synthesis error:', event);
      setIsSpeaking(false);
    };
    
    window.speechSynthesis.speak(utterance);
  }, [language, ttsSupported]);
  
  // Stop any ongoing speech
  const stopSpeaking = useCallback(() => {
    if (!ttsSupported || !window.speechSynthesis) return;
    
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  }, [ttsSupported]);
  
  // Get available voices for text-to-speech
  const getVoices = useCallback(() => {
    if (!ttsSupported || !window.speechSynthesis) return [];
    
    return window.speechSynthesis.getVoices();
  }, [ttsSupported]);
  
  return {
    isListening,
    isSpeaking,
    speechSupported,
    ttsSupported,
    startListening,
    stopListening,
    speak,
    stopSpeaking,
    getVoices
  };
}