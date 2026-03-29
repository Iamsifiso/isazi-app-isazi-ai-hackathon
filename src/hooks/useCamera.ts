import { useState, useRef, useCallback } from 'react';

interface UseCameraReturn {
  videoRef: React.RefObject<HTMLVideoElement>;
  canvasRef: React.RefObject<HTMLCanvasElement>;
  isActive: boolean;
  isRecording: boolean;
  capturedFrames: string[];
  startCamera: () => Promise<void>;
  stopCamera: () => void;
  startRecording: () => void;
  stopRecording: () => void;
  clearFrames: () => void;
  error: string | null;
}

const FRAME_INTERVAL = 1200; // Capture frame every 1.2 seconds
const MAX_FRAMES = 6; // Maximum 6 frames to send to API

export const useCamera = (): UseCameraReturn => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const recordingIntervalRef = useRef<number | null>(null);

  const [isActive, setIsActive] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [capturedFrames, setCapturedFrames] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  const startCamera = useCallback(async () => {
    try {
      setError(null);

      // Request camera access
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'environment', // Use back camera on mobile
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
      });

      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
        setIsActive(true);
      }
    } catch (err) {
      console.error('Error accessing camera:', err);
      setError('Failed to access camera. Please grant camera permissions.');
    }
  }, []);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }

    if (recordingIntervalRef.current) {
      clearInterval(recordingIntervalRef.current);
      recordingIntervalRef.current = null;
    }

    setIsActive(false);
    setIsRecording(false);
  }, []);

  const captureFrame = useCallback((): string | null => {
    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (!video || !canvas) return null;

    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    // Set canvas dimensions to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Draw current video frame to canvas
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Convert to base64 JPEG (smaller file size)
    return canvas.toDataURL('image/jpeg', 0.8);
  }, []);

  const startRecording = useCallback(() => {
    if (!isActive || isRecording) return;

    setCapturedFrames([]);
    setIsRecording(true);

    let frameCount = 0;

    // Capture first frame immediately
    const firstFrame = captureFrame();
    if (firstFrame) {
      setCapturedFrames([firstFrame]);
      frameCount++;
    }

    // Capture frames at intervals
    recordingIntervalRef.current = setInterval(() => {
      if (frameCount >= MAX_FRAMES) {
        stopRecording();
        return;
      }

      const frame = captureFrame();
      if (frame) {
        setCapturedFrames((prev) => [...prev, frame]);
        frameCount++;
      }
    }, FRAME_INTERVAL);
  }, [isActive, isRecording, captureFrame]);

  const stopRecording = useCallback(() => {
    if (recordingIntervalRef.current) {
      clearInterval(recordingIntervalRef.current);
      recordingIntervalRef.current = null;
    }
    setIsRecording(false);
  }, []);

  const clearFrames = useCallback(() => {
    setCapturedFrames([]);
  }, []);

  return {
    videoRef,
    canvasRef,
    isActive,
    isRecording,
    capturedFrames,
    startCamera,
    stopCamera,
    startRecording,
    stopRecording,
    clearFrames,
    error,
  };
};
