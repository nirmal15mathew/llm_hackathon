import { useState, useRef, useEffect } from "react"

function useWebSocket(wsUrl, msgCallback, debug=false, autoReconnect=true, reconnectInterval=2000) {
    const socketRef = useRef(null)
    const [isConnected, setConnected] = useState(false);


    useEffect(() => {
        socketRef.current = new WebSocket(wsUrl)
        let reconnectTimer; // interval timer for reconnecting to the server


        socketRef.current.addEventListener("open", (event) => {
            setConnected(true);
            if (debug) {
                console.log(`Websocket Connected: ${wsUrl}`)
            }
        })

        socketRef.current.addEventListener("close", (event) => {
            setConnected(false);

            if (debug) {
                console.log(`Websocket not connected: ${wsUrl}`)
            }
        });

        socketRef.current.addEventListener("message", msgCallback);
        
        


        return () => socketRef.current.close();
    }, [])


    return [socketRef, isConnected]
}

export default useWebSocket