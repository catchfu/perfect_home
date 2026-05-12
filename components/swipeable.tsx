"use client"

import { useRef, useState, type ReactNode } from "react"

interface SwipeableProps {
  children: ReactNode
  onSwipeLeft?: () => void
  onSwipeRight?: () => void
  threshold?: number
}

export function Swipeable({ children, onSwipeLeft, onSwipeRight, threshold = 60 }: SwipeableProps) {
  const startX = useRef(0)
  const [dragging, setDragging] = useState(false)
  const [offset, setOffset] = useState(0)

  const onTouchStart = (e: React.TouchEvent) => {
    startX.current = e.touches[0].clientX
    setDragging(true)
  }

  const onTouchMove = (e: React.TouchEvent) => {
    if (!dragging) return
    const diff = e.touches[0].clientX - startX.current
    setOffset(Math.max(-150, Math.min(150, diff)))
  }

  const onTouchEnd = () => {
    setDragging(false)
    if (offset > threshold && onSwipeRight) onSwipeRight()
    if (offset < -threshold && onSwipeLeft) onSwipeLeft()
    setOffset(0)
  }

  return (
    <div
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      style={{ transform: dragging ? `translateX(${offset}px)` : undefined, transition: dragging ? "none" : "transform 0.2s" }}
    >
      {children}
    </div>
  )
}
