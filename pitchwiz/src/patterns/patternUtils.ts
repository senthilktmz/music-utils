// patternUtils.ts
// Shared utilities for generating chord and scale patterns at runtime

// Extended INTERVAL_SEQUENCE to cover up to 13th
export const INTERVAL_SEQUENCE = [
  "1",  // 0
  "b2", // 1
  "2",  // 2
  "#2", // 3
  "b3", // 3
  "3",  // 4
  "4",  // 5
  "#4", // 6
  "b5", // 6
  "5",  // 7
  "#5", // 8
  "b6", // 8
  "6",  // 9
  "bb7",// 9
  "b7", // 10
  "7",  // 11
  "b9", // 13
  "9",  // 14
  "#9", // 15
  "11", // 17
  "#11",// 18
  "b13",// 20
  "13"  // 21
];

export function generateChordPattern([name, ...intervals]: string[]) {
  // Find the highest interval index in the canonical sequence
  const maxIndex = Math.max(...intervals.map(i => INTERVAL_SEQUENCE.indexOf(i)));
  return {
    name,
    pattern: INTERVAL_SEQUENCE.slice(0, maxIndex + 1).map((interval, idx) => {
      if (intervals.includes(interval)) {
        if (interval === "1") {
          return {
            label: "↓ 1",
            color: "lightblue",
            type: "scale_interval_member",
            fontColor: "darkgreen",
            fontType: "bold"
          };
        }
        return { label: interval, color: "lightblue", type: "scale_interval" };
      }
      return { label: "", color: "white", type: "scale_interval_blank" };
    })
  };
}

export function generateScalePattern([name, ...intervals]: string[]) {
  const maxIndex = Math.max(...intervals.map(i => INTERVAL_SEQUENCE.indexOf(i)));
  return {
    name,
    pattern: INTERVAL_SEQUENCE.slice(0, maxIndex + 1).map((interval, idx) => {
      if (intervals.includes(interval)) {
        if (interval === "1") {
          return {
            label: "↓ 1",
            color: "lightgreen",
            type: "scale_interval_member",
            fontColor: "darkgreen"
          };
        }
        return { label: interval, color: "lightblue", type: "scale_interval" };
      }
      return { label: "", color: "white", type: "scale_interval_blank" };
    })
  };
}
