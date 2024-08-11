import { useStore } from "@/lib/state"
import { cn } from "@/lib/utils"
import { useEffect } from "react"

const Cursor = ({
  color,
  x,
  y,
  self,
  message,
  setMessage,
  messageMode,
  setMessageMode,
}: {
  color: string
  x: number
  y: number
  self: boolean
  message: string
  setMessage?: (message: string) => void
  messageMode: boolean
  setMessageMode?: (messageMode: boolean) => void
}) => {
  useEffect(() => {
    if (self && setMessage && setMessageMode) {
      const handler = (e: KeyboardEvent) => {
        if (e.key === "/") {
          setMessageMode(true)
        } else if (e.key === "Escape") {
          setMessageMode(false)
          setMessage("")
        }
      }
      const ignore = (e: KeyboardEvent) => {
        if (e.key === "/") {
          e.preventDefault()
        }
      }

      window.addEventListener("keyup", handler)
      window.addEventListener("keydown", ignore)

      return () => {
        window.removeEventListener("keyup", handler)
        window.removeEventListener("keydown", ignore)
      }
    }
  }, [])

  const expanded = useStore((state) => state.expanded)

  return (
    <div
      className="pointer-events-none absolute top-0 left-0 z-[1000]"
      style={{
        transform: `translateX(${x}px) translateY(${y}px)`,
      }}>
      {self ? null : (
        <svg
          className="relative"
          width="24"
          height="36"
          viewBox="0 0 24 36"
          fill="none"
          stroke="white"
          xmlns="http://www.w3.org/2000/svg">
          <path
            d="M5.65376 12.3673H5.46026L5.31717 12.4976L0.500002 16.8829L0.500002 1.19841L11.7841 12.3673H5.65376Z"
            fill={color}
          />
        </svg>
      )}

      {((self && messageMode) || (!self && message)) &&
        !(
          y <= 0 ||
          x <= 0 ||
          x >= window.innerWidth ||
          y >= window.innerHeight
        ) && (
          <div
            className="absolute top-5 left-2 rounded-lg p-1"
            onKeyUp={(e) => e.stopPropagation()}
            style={{
              backgroundColor: color,
              transform: `translateX(${-(expanded ? 0 : 152)}px)`,
            }}>
            {self ? (
              <input
                value={message}
                autoFocus
                onChange={(e) => {
                  if (setMessage) setMessage(e.target.value)
                }}
                onKeyDown={(e) => {
                  if (e.key === "Escape" && setMessageMode) {
                    setMessageMode(false)
                  }
                }}
                maxLength={40}
                placeholder="Type to chat..."
                className={cn(
                  "w-[14.5rem] whitespace-nowrap rounded bg-transparent px-1 pb-[1px] text-sm leading-relaxed text-white/90 placeholder:text-white/40 focus:outline-none",
                  cn("focus:ring-offset-", color)
                )}
              />
            ) : (
              <p className="max-w-[14.5rem] overflow-hidden text-ellipsis whitespace-nowrap px-1 text-sm leading-relaxed text-white">
                {message}
              </p>
            )}
          </div>
        )}
    </div>
  )
}

export default Cursor
