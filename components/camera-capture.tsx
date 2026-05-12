"use client"

import { useRef, useState, useCallback } from "react"
import { Camera, X, RefreshCw, Check } from "lucide-react"
import { Button } from "@/components/ui/button"

interface CameraCaptureProps {
  onCapture: (file: File) => void
}

export function CameraCapture({ onCapture }: CameraCaptureProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const [active, setActive] = useState(false)
  const [captured, setCaptured] = useState<string | null>(null)

  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment", aspectRatio: 4 / 3 },
      })
      streamRef.current = stream
      if (videoRef.current) {
        videoRef.current.srcObject = stream
      }
      setActive(true)
    } catch {
      console.log("Camera not available")
    }
  }, [])

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop())
      streamRef.current = null
    }
    setActive(false)
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
    const dataUrl = canvas.toDataURL("image/jpeg", 0.9)
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
    setCaptured(null)
  }, [captured, onCapture, stopCamera])

  function dataURLToBlob(dataUrl: string) {
    const parts = dataUrl.split(",")
    const mime = parts[0].match(/:(.*?);/)![1]
    const bytes = atob(parts[1])
    const arr = new Uint8Array(bytes.length)
    for (let i = 0; i < bytes.length; i++) arr[i] = bytes.charCodeAt(i)
    return new Blob([arr], { type: mime })
  }

  if (!active) {
    return (
      <Button variant="outline" type="button" onClick={startCamera} className="w-full">
        <Camera className="mr-2 h-4 w-4" />
        Take Photo
      </Button>
    )
  }

  return (
    <div className="relative overflow-hidden rounded-lg border border-[#D4CEC4] bg-black">
      {captured ? (
        <img src={captured} alt="Captured" className="w-full object-contain" />
      ) : (
        <video ref={videoRef} autoPlay playsInline className="w-full" />
      )}
      <canvas ref={canvasRef} className="hidden" />

      <div className="absolute bottom-0 left-0 right-0 flex justify-center gap-4 bg-gradient-to-t from-black/60 to-transparent p-4">
        {captured ? (
          <>
            <Button variant="secondary" size="sm" onClick={retake}>
              <RefreshCw className="mr-1 h-4 w-4" />
              Retake
            </Button>
            <Button size="sm" onClick={confirm}>
              <Check className="mr-1 h-4 w-4" />
              Use Photo
            </Button>
          </>
        ) : (
          <>
            <Button variant="secondary" size="sm" onClick={stopCamera}>
              <X className="mr-1 h-4 w-4" />
              Cancel
            </Button>
            <Button size="sm" onClick={capture}>
              <Camera className="mr-1 h-4 w-4" />
              Capture
            </Button>
          </>
        )}
      </div>
    </div>
  )
}
