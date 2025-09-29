import React, {useState} from "react";
// import logo from "./logo.svg"; // Remove unused default logo
import "./App.css";
import MenuBar from "./MenuBar";
import PianoKeyboard from "./PianoKeyboard";
import IntervalPattern from "./IntervalPattern";
import ScalesMulti from "./ScalesMulti";
import ChordsMulti from "./ChordsMulti";
import Intervals from "./Intervals";
import ScratchPad from "./ScratchPad"; // Added import statement for ScratchPad
import {SCALES_PATTERNS_ARRAY} from "./patterns/Scales";
import {RAGAS_PATTERNS_ARRAY} from "./patterns/Ragas";
import {RAGAS_PATTERNS} from "./patterns/Ragas";
import {generateScalePattern} from "./patterns/patternUtils";

// Toast state
const TOAST_DURATION = 1800;

function App() {
    const [activeTab, setActiveTab] = useState("chords");
    const [scratchPadItems, setScratchPadItems] = useState<any[]>([]);
    const [toast, setToast] = useState<string | null>(null);

    const addScratchPadItem = (item: any) => {
        setScratchPadItems(items => [...items, item]);
        setToast(`${item.root} ${item.type} added to scratch pad`);
        setTimeout(() => setToast(null), TOAST_DURATION);
    };

    const removeScratchPadItem = (timestamp: number) => {
        setScratchPadItems(items => items.filter(item => item.timestamp !== timestamp));
    };

    let content;
    if (activeTab === "chords") content = <ChordsMulti addScratchPadItem={addScratchPadItem}/>;
    else if (activeTab === "scales") content =
        <ScalesMulti patterns={SCALES_PATTERNS_ARRAY} scalesPatternType={activeTab}
                     ragasPatterns={[]}/>;
    else if (activeTab === "carnatic_scales") content =
        <ScalesMulti patterns={RAGAS_PATTERNS_ARRAY} scalesPatternType={activeTab}
                     ragasPatterns={RAGAS_PATTERNS}/>;
    else if (activeTab === "intervals") content = <Intervals/>;
    else if (activeTab === "scratchpad") content = <ScratchPad items={scratchPadItems} removeItem={removeScratchPadItem}/>;

    return (
        <div className="App">
            <MenuBar activeTab={activeTab} setActiveTab={setActiveTab}/>
            <div style={{padding: '24px 0 0 0'}}>{content}</div>
            {toast && (
                <div style={{
                  position: 'fixed',
                  left: '50%',
                  bottom: 40,
                  transform: 'translateX(-50%)',
                  background: '#1976d2',
                  color: 'white',
                  borderRadius: 8,
                  padding: '12px 32px',
                  fontSize: 18,
                  fontWeight: 500,
                  boxShadow: '0 2px 12px #0003',
                  zIndex: 9999,
                  opacity: 0.96
                }}>
                  {toast}
                </div>
            )}
            {/* Main content follows header */}
        </div>
    );
}

export default App;
