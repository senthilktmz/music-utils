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

function App() {
    const [activeTab, setActiveTab] = useState("chords");
    const [scratchPadItems, setScratchPadItems] = useState<any[]>([]);

    const addScratchPadItem = (item: any) => {
        setScratchPadItems(items => [...items, item]);
    };

    let content;
    if (activeTab === "chords") content = <ChordsMulti addScratchPadItem={addScratchPadItem}/>;
    else if (activeTab === "scales") content =
        <ScalesMulti patterns={SCALES_PATTERNS_ARRAY.map(generateScalePattern)} scalesPatternType={activeTab}
                     ragasPatterns={[]}/>;
    else if (activeTab === "carnatic_scales") content =
        <ScalesMulti patterns={RAGAS_PATTERNS_ARRAY.map(generateScalePattern)} scalesPatternType={activeTab}
                     ragasPatterns={RAGAS_PATTERNS}/>;
    else if (activeTab === "intervals") content = <Intervals/>;
    else if (activeTab === "scratchpad") content = <ScratchPad items={scratchPadItems}/>;

    return (
        <div className="App">
            <MenuBar activeTab={activeTab} setActiveTab={setActiveTab}/>
            <div style={{padding: '24px 0 0 0'}}>{content}</div>
            {/* Main content follows header */}
        </div>
    );
}

export default App;
