import React, { useRef, useState, useEffect } from "react";

export interface PatternRect {
  label?: string;
  color: string;
  type?: string;
}

interface PianoPatternProps {
  pattern: PatternRect[]; // JSON pattern array
  keyWidth?: number;
  keyHeight?: number;
  slidable?: boolean;
}

const PianoPattern: React.FC<PianoPatternProps> = ({
  pattern,
  keyWidth = 40,
  keyHeight = 60,
  slidable = true,
}) => {
  const [offsetX, setOffsetX] = useState(0);
  const [dragging, setDragging] = useState(false);
  const dragStartX = useRef(0);
  const dragStartOffset = useRef(0);
  const patternWidth = pattern.length * keyWidth;

  // Set the background width to match the full keyboard below (e.g. 3 octaves = 36 keys)
  const backgroundWidth = 36 * keyWidth; // 3 octaves below

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
      document.body.style.cursor = "auto";
    };
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, [dragging, slidable, pattern.length, keyWidth, patternWidth, backgroundWidth]);

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
                fill={rect.color === "black" ? "#fff" : "#222"}
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
