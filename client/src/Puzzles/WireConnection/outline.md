WireConnection.tsx
- Maintains the state of the activeWire
    - Will modify properties of the activeWire depending on specific events
        - Example: if a hover occurs, the main module will find the end coordinate
                   of the hover and promptly force the state of the activeWire to that
            - IF the activeWire has an endPoint, releasing the mouse will not destroy it, but
                   rather make it stick.


SYSTEM DESIGN
- Separate components are only there to listen for clicks/hovers
- The main module will handle wire lifecycle and state
- Information will be passed down to child components

