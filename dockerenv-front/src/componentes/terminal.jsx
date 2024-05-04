import { Terminal as XTerminal } from "@xterm/xterm";
import { useRef, useEffect } from "react";
import "@xterm/xterm/css/xterm.css";
import socket from "../socket.js";

const Terminal = () => {
  const refterminal = useRef();
  const isRendered = useRef(false);

  useEffect(() => {
    if (isRendered.current) return null;

    const term = new XTerminal({
      rows: 20,
    });
    term.open(refterminal.current);

    term.onData((data) => {
      console.log(data);
      socket.emit("terminal:write", data);
    });

    socket.on("terminal:data", (data) => {
      term.write(data);
    });

    isRendered.current = true;
  }, []);

  return <div id="terminal" ref={refterminal} />;
};

export default Terminal;

