"use client"

import { useRef, useState, useCallback, useEffect } from "react"
import { Camera, X, RefreshCw, Check } from "lucide-react"

interface CameraCaptureProps {
  onCapture: (file: File) => void
}

function dataURLToBlob(dataUrl: string) {
  const parts = dataUrl.split(",")
  const mime = parts[0].match(/:(.*?);/)![1]
  const bytes = atob(parts[1])
  const arr = new Uint8Array(bytes.length)
  for (let i = 0; i < bytes.length; i++) arr[i] = bytes.charCodeAt(i)
  return new Blob([arr], { type: mime })
}

export function CameraCapture({ onCapture }: CameraCaptureProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const [active, setActive] = useState(false)
  const [captured, setCaptured] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop())
      }
    }
  }, [])

  const startCamera = useCallback(async () => {
    setError(null)
    try {
      // Try rear camera first; fallback to any camera on PC
      let stream: MediaStream
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: { ideal: "environment" }, width: { ideal: 1280 }, height: { ideal: 720 } },
          audio: false,
        })
      } catch {
        // Fallback: any camera, no facing preference
        stream = await navigator.mediaDevices.getUserMedia({
          video: { width: { ideal: 1280 }, height: { ideal: 720 } },
          audio: false,
        })
      }
      streamRef.current = stream
      if (videoRef.current) {
        videoRef.current.srcObject = stream
      }
      setActive(true)
    } catch (err) {
      const msg = err instanceof DOMException
        ? err.name === "NotAllowedError"
          ? "Camera permission denied. Please allow camera access in your browser settings."
          : err.name === "NotFoundError"
            ? "No camera found on this device."
            : `Camera error: ${err.message}`
        : "Camera not available"
      setError(msg)
    }
  }, [])

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop())
      streamRef.current = null
    }
    setActive(false)
    setCaptured(null)
    setError(null)
  }, [])

  const capture = useCallback(() => {
    const video = videoRef.current
    const canvas = canvasRef.current
    if (!video || !canvas) return

    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    ctx.drawImage(video, 0, 0)
    const dataUrl = canvas.toDataURL("image/jpeg", 0.85)
    setCaptured(dataUrl)
  }, [])

  const retake = useCallback(() => {
    setCaptured(null)
  }, [])

  const confirm = useCallback(() => {
    if (!captured) return
    const blob = dataURLToBlob(captured)
    const file = new File([blob], `floor-plan-${Date.now()}.jpg`, { type: "image/jpeg" })
    onCapture(file)
    stopCamera()
  }, [captured, onCapture, stopCamera])

  return (
    <>
      {/* Trigger button */}
      {!active && !error && (
        <button
          onClick={startCamera}
          className="flex w-full items-center justify-center gap-2 rounded-full border border-[#D4CEC4] bg-white px-6 py-3 text-sm font-medium text-[#2C2C2C] transition-colors hover:bg-[#EDE8E1] active:scale-[0.98]"
        >
          <Camera className="h-5 w-5" />
          Take Photo
        </button>
      )}

      {/* Error state */}
      {error && !active && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-center">
          <p className="text-sm text-red-600">{error}</p>
          <button
            onClick={() => setError(null)}
            className="mt-2 text-xs text-[#6B6B6B] underline"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Full-screen camera overlay */}
      {active && (
        <div className="fixed inset-0 z-50 flex flex-col bg-black">
          {/* Camera view */}
          <div className="relative flex-1 overflow-hidden">
            {captured ? (
              <img
                src={captured}
                alt="Captured floor plan"
                className="h-full w-full object-contain"
              />
            ) : (
              <video
                ref={videoRef}
                autoPlay
                playsInline
                className="h-full w-full object-cover"
              />
            )}
            <canvas ref={canvasRef} className="hidden" />
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center gap-8 bg-black px-6 py-6">
            {captured ? (
              <>
                <button
                  onClick={retake}
                  className="flex flex-col items-center gap-1 text-white/70"
                >
                  <RefreshCw className="h-6 w-6" />
                  <span className="text-xs">Retake</span>
                </button>
                <button
                  onClick={confirm}
                  className="flex h-16 w-16 items-center justify-center rounded-full border-4 border-white bg-white/20"
                >
                  <Check className="h-8 w-8 text-white" />
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={stopCamera}
                  className="flex flex-col items-center gap-1 text-white/70"
                >
                  <X className="h-6 w-6" />
                  <span className="text-xs">Cancel</span>
                </button>
                <button
                  onClick={capture}
                  className="flex h-16 w-16 items-center justify-center rounded-full border-4 border-white bg-white/20"
                >
                  <div className="h-12 w-12 rounded-full border-2 border-white" />
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </>
  )
}
