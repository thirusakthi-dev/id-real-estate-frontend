"use client";

import { useEffect, useState } from "react";
import { Bot, ChevronDown, Maximize2, RotateCcw, X } from "lucide-react";
import { AnimatePresence, motion, type PanInfo } from "framer-motion";

import AiChat from "./ai-chat";

const DESKTOP_WIDTH = 400;
const DESKTOP_HEIGHT = 680;

const MOBILE_BREAKPOINT = 768;

export default function AiChatWidget() {
  const [isOpen, setIsOpen] = useState(false);

  const [clearTrigger, setClearTrigger] = useState(0);

  const [isMobile, setIsMobile] = useState(false);

  const [position, setPosition] = useState({
    x: 0,
    y: 0,
  });

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    };

    checkMobile();

    window.addEventListener("resize", checkMobile);

    return () => {
      window.removeEventListener("resize", checkMobile);
    };
  }, []);

  useEffect(() => {
    if (isMobile) {
      setPosition({
        x: 0,
        y: 0,
      });
    }
  }, [isMobile]);

  const handleOpen = () => {
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleClear = () => {
    setClearTrigger((current) => current + 1);
  };

  const handleDragEnd = (
    _event: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo,
  ) => {
    setPosition((current) => ({
      x: current.x + info.offset.x,
      y: current.y + info.offset.y,
    }));
  };

  return (
    <>
      {!isOpen && (
        <motion.button
          type="button"
          aria-label="Open AI property assistant"
          onClick={handleOpen}
          initial={{
            opacity: 0,
            scale: 0.8,
          }}
          animate={{
            opacity: 1,
            scale: 1,
          }}
          whileHover={{
            scale: 1.04,
          }}
          whileTap={{
            scale: 0.96,
          }}
          className="
            fixed
            bottom-5
            right-5
            z-50
            flex
            size-14
            items-center
            justify-center
            rounded-full
            bg-primary
            text-primary-foreground
            shadow-lg
            shadow-black/10
            transition
            focus-visible:outline-2
            focus-visible:outline-offset-2
            focus-visible:outline-primary
            md:bottom-6
            md:right-6
          "
        >
          <Bot size={24} strokeWidth={1.8} aria-hidden="true" />

          <span
            aria-hidden="true"
            className="
              absolute
              right-0
              top-0
              size-3
              rounded-full
              border-2
              border-background
              bg-emerald-500
            "
          />
        </motion.button>
      )}

      <AnimatePresence>
        {isOpen && (
          <>
            {isMobile ? (
              <motion.div
                key="mobile-ai-chat"
                initial={{
                  opacity: 0,
                  y: 20,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                exit={{
                  opacity: 0,
                  y: 20,
                }}
                transition={{
                  duration: 0.2,
                  ease: "easeOut",
                }}
                className="
                  fixed
                  inset-0
                  z-[100]
                  flex
                  h-[100dvh]
                  w-full
                  flex-col
                  overflow-hidden
                  bg-background
                  text-foreground
                "
              >
                <AiChatHeader
                  onClose={handleClose}
                  onClear={handleClear}
                  mobile
                />

                <div className="min-h-0 flex-1">
                  <AiChat onClose={handleClose} clearTrigger={clearTrigger} />
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="desktop-ai-chat"
                drag
                dragMomentum={false}
                dragElastic={0.05}
                dragConstraints={{
                  top: -window.innerHeight,
                  left: -window.innerWidth,
                  right: window.innerWidth,
                  bottom: window.innerHeight,
                }}
                onDragEnd={handleDragEnd}
                initial={{
                  opacity: 0,
                  scale: 0.94,
                  y: 12,
                }}
                animate={{
                  opacity: 1,
                  scale: 1,
                  y: 0,
                  x: position.x,
                }}
                exit={{
                  opacity: 0,
                  scale: 0.96,
                  y: 12,
                }}
                transition={{
                  duration: 0.2,
                  ease: "easeOut",
                }}
                style={{
                  height: `min(${DESKTOP_HEIGHT}px, calc(100dvh - 48px))`,
                  width: DESKTOP_WIDTH,
                }}
                className="
                  fixed
                  bottom-6
                  right-6
                  z-[100]
                  flex
                  max-h-[calc(100dvh-48px)]
                  flex-col
                  overflow-hidden
                  rounded-2xl
                  border
                  border-border
                  bg-background
                  text-foreground
                  shadow-2xl
                  shadow-black/10
                "
              >
                <AiChatHeader onClose={handleClose} onClear={handleClear} />

                <div
                  className="
                    min-h-0
                    flex-1
                  "
                >
                  <AiChat onClose={handleClose} clearTrigger={clearTrigger} />
                </div>
              </motion.div>
            )}
          </>
        )}
      </AnimatePresence>
    </>
  );
}

type AiChatHeaderProps = {
  onClose: () => void;
  onClear: () => void;
  mobile?: boolean;
};

function AiChatHeader({ onClose, onClear, mobile = false }: AiChatHeaderProps) {
  return (
    <header
      className={`
        flex
        shrink-0
        items-center
        justify-between
        border-b
        border-border
        bg-background
        px-4
        py-3
        ${mobile ? "pt-[max(0.75rem,env(safe-area-inset-top))]" : ""}
      `}
    >
      <div className="flex min-w-0 items-center gap-3">
        <div
          aria-hidden="true"
          className="
            flex
            size-9
            shrink-0
            items-center
            justify-center
            rounded-xl
            bg-primary
            text-primary-foreground
          "
        >
          <Bot size={18} strokeWidth={1.8} />
        </div>

        <div className="min-w-0">
          <h2 className="truncate text-sm font-semibold text-foreground">
            Property Assistant
          </h2>

          <p className="mt-0.5 text-[11px] text-muted-foreground">
            Find properties with AI
          </p>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-1">
        <button
          type="button"
          onClick={onClear}
          aria-label="Clear chat"
          title="Clear chat"
          className="
            flex
            size-9
            items-center
            justify-center
            rounded-lg
            text-muted-foreground
            transition
            hover:bg-surface-hover
            hover:text-foreground
            focus-visible:outline-2
            focus-visible:outline-offset-2
            focus-visible:outline-primary
          "
        >
          <RotateCcw size={16} strokeWidth={1.8} />
        </button>

        <button
          type="button"
          onClick={onClose}
          aria-label="Close AI assistant"
          title="Close"
          className="
            flex
            size-9
            items-center
            justify-center
            rounded-lg
            text-muted-foreground
            transition
            hover:bg-surface-hover
            hover:text-foreground
            focus-visible:outline-2
            focus-visible:outline-offset-2
            focus-visible:outline-primary
          "
        >
          <X size={18} strokeWidth={1.8} />
        </button>
      </div>
    </header>
  );
}
