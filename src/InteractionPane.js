// InteractionPane.js
import React, { useState } from "react";

const SCROLLWHEEL_FACTOR = 0.1; //Percentage of zoom related to scroll wheel

const InteractionPane = (props) => {
  const { scale, setScale, offset, setOffset, children } = props;
  const [initialDistanceBetweenFingers, setInitialDistanceBetweenFingers] =
    useState(0);
  const [initialScale, setInitialScale] = useState(1);
  const [initialTouchCenter, setInitialTouchCenter] = useState({});
  const [initialOffset, setInitialOffset] = useState({});
  const [dragPositionStart, setDragPositionStart] = useState({ x: 0, y: 0 });
  const [dragPositionOffsetStart, setDragPositionOffsetStart] = useState({});
  const [isDragging, setIsDragging] = useState(false);
  //const [scale, setScale] = useState(2);
  //const [offset, setOffset] = useState({ x: 0, y: 0 });

  // ... All the interaction state and methods go here ...
  // e.g., initialDistanceBetweenFingers, initialScale, etc.
  function handlePointerDown(event) {
    console.log("pointerDown");
    const newDragPositionStart = { x: event.clientX, y: event.clientY };
    setDragPositionStart(newDragPositionStart); //Position start on the interactionpane
    setDragPositionOffsetStart({ ...offset }); //Position offset start original, before the drag action
    setIsDragging(true);
    /*
    if (mode === "mask") {
      drawMaskStart(event);
    }
    if (mode === "delete") {
    }
    */
  }

  function handlePointerUp(event) {
    setIsDragging(false);
  }

  function handlePointerMove(event) {
    //if (mode === "move") {
    if (isDragging) {
      const dragPositionEnd = { x: event.clientX, y: event.clientY };
      const deltaX = dragPositionEnd.x - dragPositionStart.x;
      const deltaY = dragPositionEnd.y - dragPositionStart.y;
      setOffset({
        x: Math.round(dragPositionOffsetStart.x + deltaX),
        y: Math.round(dragPositionOffsetStart.y + deltaY),
      });
    }
    /*
    }
    if (mode === "mask") {
      setCursorPosition({
        x: event.clientX,
        y: event.clientY - 56,
      });
    }
    if (mode === "mask") {
      drawMaskDrag(event);
    }
    */
  }

  function handleTouchStart(event) {
    //setOffsetStartLocation({ ...offset })
    if (event.touches.length >= 2) {
      //alert(`event.touches (${event.touches[0].clientX},${event.touches[0].clientY}) (${event.touches[1].clientX},${event.touches[1].clientY})`)
      const distanceX = event.touches[1].clientX - event.touches[0].clientX;
      const distanceY = event.touches[1].clientY - event.touches[0].clientY;
      const initialDistance = Math.sqrt(
        distanceX * distanceX + distanceY * distanceY
      );
      setInitialDistanceBetweenFingers(initialDistance);
      const centerX =
        event.touches[0].clientX +
        (event.touches[1].clientX - event.touches[0].clientX) / 2;
      const centerY =
        event.touches[0].clientY +
        (event.touches[1].clientY - event.touches[0].clientY) / 2;
      setInitialTouchCenter({
        x: centerX,
        y: centerY,
      });
      //const imageCoordinateX = ((centerX - offset.x) / scale)
      //const imageCoordinateY = ((centerY - offset.y) / scale)
      setInitialScale(scale);
      setInitialOffset({ ...offset });
      //alert(`pinch/zoom started, initial touch center (${centerX}, ${centerY}), initial scale ${scale}, initial distance ${initialDistance} original offset ${offset.x}, ${offset.y} in image coordinate space x ${imageCoordinateX}, y ${imageCoordinateY}`)
    }
  }

  //Handles two finger actions: Pinch/zoom + two finger move
  //The action is initiated by handleTouchStart, and subsequently the following code is called
  //while the fingers are on the screen.
  function handleTouchMove(event) {
    if (event.touches.length >= 2) {
      //The following calculates how much the scale must changes (given the change in distance between the fingers)
      const distanceX = event.touches[1].clientX - event.touches[0].clientX;
      const distanceY = event.touches[1].clientY - event.touches[0].clientY;
      const currentDistanceBetweenFingers = Math.sqrt(
        distanceX * distanceX + distanceY * distanceY
      );
      const scaleChange =
        currentDistanceBetweenFingers / initialDistanceBetweenFingers;
      const newScale = initialScale * scaleChange;
      setScale(newScale);

      //The following adapts the offset in such a way that we zoom in on the center point between the fingers
      //1. Take the original center, and convert it from screen coordinate space to image coordinate space
      const imageCoordinateX =
        (initialTouchCenter.x - initialOffset.x) / initialScale;
      const imageCoordinateY =
        (initialTouchCenter.y - initialOffset.y) / initialScale;
      //2. Calculate where this center would end up, given the new scale
      const wouldBeNewScreenPositionX =
        imageCoordinateX * newScale + initialOffset.x;
      const wouldBeNewScreenPositionY =
        imageCoordinateY * newScale + initialOffset.y;
      //3. Calculate the different between the two (we want it to be zero)
      const offsetAdjustmentX1 =
        initialTouchCenter.x - wouldBeNewScreenPositionX;
      const offsetAdjustmentY1 =
        initialTouchCenter.y - wouldBeNewScreenPositionY;

      //In addition, the following adapts the offset when both fingers move in a particular direction
      //This way you can pinch/zoom and move the canvas at the same time
      const currentCenterX =
        event.touches[0].clientX +
        (event.touches[1].clientX - event.touches[0].clientX) / 2;
      const currentCenterY =
        event.touches[0].clientY +
        (event.touches[1].clientY - event.touches[0].clientY) / 2;
      const offsetAdjustmentX2 = currentCenterX - initialTouchCenter.x;
      const offsetAdjustmentY2 = currentCenterY - initialTouchCenter.y;

      //Finally, apply both offset adjustments
      setOffset({
        x: initialOffset.x + offsetAdjustmentX1 + offsetAdjustmentX2,
        y: initialOffset.y + offsetAdjustmentY1 + offsetAdjustmentY2,
      });
    }
  }

  function handleWheel(event) {
    //console.log("wheel")
    //console.log(event.deltaY)
    //console.log(event.clientX, event.clientY)
    const initialScale = scale;
    const initialOffset = { ...offset };
    let newScale = 1;
    if (event.deltaY > 0) newScale = initialScale * (1 - SCROLLWHEEL_FACTOR);
    else newScale = initialScale * (1 + SCROLLWHEEL_FACTOR);
    setScale(newScale);

    //The following adapts the offset in such a way that we zoom in on point where the scroll wheel is used
    //1. Take the center, and convert it from screen coordinate space to image coordinate space
    const imageCoordinateX = (event.clientX - initialOffset.x) / initialScale;
    const imageCoordinateY = (event.clientY - initialOffset.y) / initialScale;
    console.log(
      "interaction pane coordinates, image coordinates",
      event.clientX,
      event.clientY,
      imageCoordinateX,
      imageCoordinateY
    );
    console.log(
      "imageCoordinateX, imageCoordinateY",
      imageCoordinateX,
      imageCoordinateY
    );
    //2. Calculate where this center would end up, given the new scale
    const wouldBeNewScreenPositionX =
      imageCoordinateX * newScale + initialOffset.x;
    const wouldBeNewScreenPositionY =
      imageCoordinateY * newScale + initialOffset.y;
    //3. Calculate the different between the two (we want it to be zero)
    const offsetAdjustmentX1 = event.clientX - wouldBeNewScreenPositionX;
    const offsetAdjustmentY1 = event.clientY - wouldBeNewScreenPositionY;

    //Finally, apply the adjustment
    setOffset({
      x: initialOffset.x + offsetAdjustmentX1,
      y: initialOffset.y + offsetAdjustmentY1,
    });
  }

  // Return the rendered component
  // The userinputpane div takes the full screen (see left, top, right and bottom attributes), this is there to capture the user's mouse input.
  // The child div of the interaction pane is the thing we move around and scale as a result of the actions.
  return (
    <div
      id="userinputpane"
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerMove={handlePointerMove}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onWheel={handleWheel}
      style={{
        touchAction: "none",
        position: "absolute",
        left: 0,
        top: 0,
        right: 0,
        bottom: 0,
      }}
    >
      <div
        style={{
          position: "absolute",
          left: `${offset.x}px`,
          top: `${offset.y}px`,
          transform: `scale(${scale})`,
          transformOrigin: "top left",
        }}
      >
        {children}
      </div>
    </div>
  );
};

export default InteractionPane;
