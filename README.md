# InteractionPane

**Author:** Jeroen Kloosterman <jlklooste@gmail.com>

## Overview

`InteractionPane`` is a React component that allows end users to work with drag, pinch, and zoom using mouse (scrollwheel + mouse buttons) on the desktop as well as hand gestures (pinch/zoom/drag) on mobile devices. 

This abstraction alleviates the developer from the complexities associated with handling various mouse and gesture events.

By adding children within the `InteractionPane`, it becomes responsive to the user's interactions, scaling and moving as required. 

Note that the div that the component will take the full space of its parent (it uses attributes left=0, top=0, right=0, bottom=0).

## Demonstration Videos

Here are two demonstration videos showcasing the capabilities and usage of `InteractionPane`:

1. [Desktop (using mouse)](https://youtu.be/efzbza1Hb4M?si=sEVDXQ6RdXDbiymC)
2. [Mobile (hand gestures)](https://youtube.com/shorts/rS63jquhPO8?si=uVZ9XR_naHBnh6fn)

## Installation

npm i interactionpane

## Example Usage

```javascript
import InteractionPane from "interactionpane";
import React, { useState } from "react";

function App() {
  const [scale, setScale] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  return (
    <InteractionPane
      scale={scale}
      setScale={setScale}
      offset={offset}
      setOffset={setOffset}
    >
      <img
        src="https://github.githubassets.com/assets/GitHub-Mark-ea2971cee799.png"
        width="200px"
        style={{ position: "absolute", left: "200px" }}
      />
      <div
        style={{
          position: "absolute",
          width: "400px",
          height: "400px",
          left: "0px",
          top: "0px",
          borderColor: "red",
          borderStyle: "solid",
        }}
      ></div>
      <div style={{ position: "absolute" }}>
        <svg height="400" width="400">
          <polygon points="0,200 200,200 100,0 0,200" class="triangle" />
          <circle cx="300" cy="300" r="100" fill="blue" />
        </svg>
      </div>
    </InteractionPane>
  );
}

export default App;
