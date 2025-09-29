import React, { useRef, useState, useEffect } from "react";

export interface PatternRect {
  label?: string;
  fontColor?: string;
  fontType?: string;
  color: string;
  type?: string;
}

interface PianoPatternProps {
  pattern: PatternRect[]; // JSON pattern array
  keyWidth?: number;
  keyHeight?: number;
  slidable?: boolean;
  onRootChange?: (rootIndex: number) => void;
  offsetX?: number; // NEW: allow external control
}

const PianoPattern: React.FC<PianoPatternProps> = ({
  pattern,
  keyWidth = 40,
  keyHeight = 60,
  slidable = true,
  onRootChange,
  offsetX: controlledOffsetX,
}) => {
  const [offsetX, setOffsetX] = useState(controlledOffsetX || 0);
  const [dragging, setDragging] = useState(false);
  const dragStartX = useRef(0);
  const dragStartOffset = useRef(0);
  const patternWidth = pattern.length * keyWidth;
  const backgroundWidth = 36 * keyWidth;

  // Keep internal offsetX in sync with controlledOffsetX
  useEffect(() => {
    if (typeof controlledOffsetX === 'number' && !dragging) {
      setOffsetX(controlledOffsetX);
    }
  }, [controlledOffsetX, dragging]);

  // Drag logic
  useEffect(() => {
    if (!slidable || !dragging) return;
    const onMouseMove = (e: MouseEvent) => {
      const delta = e.clientX - dragStartX.current;
      let nextOffset = dragStartOffset.current + delta;
      // Clamp so you can't drag out of bounds
      nextOffset = Math.max(0, Math.min(backgroundWidth - patternWidth, nextOffset));
      setOffsetX(nextOffset);
    };
    const onMouseUp = () => {
      setDragging(false);
      // Only call onRootChange on drag end
      if (onRootChange) {
        const rootIndex = Math.round(offsetX / keyWidth);
        onRootChange(rootIndex);
      }
      document.body.style.cursor = "auto";
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, [dragging, keyWidth, offsetX, onRootChange, patternWidth, backgroundWidth, slidable]);

  const handleOverlayMouseDown = (e: React.MouseEvent<SVGRectElement, MouseEvent>) => {
    if (!slidable) return;
    setDragging(true);
    dragStartX.current = e.clientX;
    dragStartOffset.current = offsetX;
    document.body.style.cursor = "grabbing";
  };

  return (
    <svg width={backgroundWidth} height={keyHeight} style={{ border: "1px solid #ccc", background: "#fff" }}>
      <rect x={0} y={0} width={backgroundWidth} height={keyHeight} fill="#fff" />
      <g
        style={{ cursor: slidable && dragging ? "grabbing" : slidable ? "grab" : "default" }}
        transform={slidable ? `translate(${offsetX}, 0)` : undefined}
        onMouseDown={slidable ? handleOverlayMouseDown : undefined}
      >
        {pattern.map((rect, idx) => (
          <g key={`${rect.label ?? 'key'}-${idx}`}>
            <rect
              x={idx * keyWidth}
              y={0}
              width={keyWidth}
              height={keyHeight}
              fill={rect.color}
              stroke="#000"
            />
            {rect.label && (
              <text
                x={idx * keyWidth + keyWidth / 2}
                y={keyHeight / 2 + 6}
                textAnchor="middle"
                fontSize={16}
                fill={rect.fontColor || (rect.color === "black" ? "#fff" : "#222")}
                fontWeight={rect.fontType === "bold" ? "bold" : "normal"}
                style={{ userSelect: "none" }}
              >
                {rect.label}
              </text>
            )}
          </g>
        ))}
      </g>
    </svg>
  );
};

export default PianoPattern;
