import React, {useState, useEffect, useRef} from "react"
import "./App.css"

function App() {

  const [cycle, setCycle] = useState({
    on: false,
    pause: false,
    mode: "work",
    workTime: 3,
    pauseTime: 5,
    breakTime: 10,
    loops: 2,
  })

  const [countdown, setCountdown] = useState(0)

  // refs
  const countdownRef = useRef(countdown)
  const modeRef = useRef(cycle.mode)
  const loopRef = useRef(cycle.loops)

  // TODO: notify
  // useEffect(() => {
  //   if (!("Notification" in window)) {
  //     console.log("This browser does not support desktop notification");
  //   } else {
  //     Notification.requestPermission();
  //   }
  // }, [])

  useEffect(() => {

    function switchMode() {

      const nextMode =
          cycle.mode === "work" && loopRef.current === 1 ? "break"
          : cycle.mode === "work" && loopRef.current > 1 ? "pause"
          : "work"

      const nextTimer =
          cycle.mode === "work" && loopRef.current === 1 ? cycle.breakTime
          : cycle.mode === "work" && loopRef.current > 1 ? cycle.pauseTime
          : cycle.workTime

      // Change cycle
      setCycle({...cycle, mode: nextMode})
      modeRef.current = nextMode
      // Change timer
      countdownRef.current = nextTimer*60
      setCountdown(countdownRef.current)
      // Removes a loop at the end of each pause (when mode is switched back to "work")
      if (modeRef.current === "work") loopRef.current--
    }

    // Default behaviour when it's work time
    if (modeRef.current === "work") {
      countdownRef.current = cycle.workTime*60
      setCountdown(countdownRef.current)
    }

    const interval = setInterval(() => {
      // if nothing has been clicked yet or timer is stopped
      if (!cycle.on) return
      // behaviour if countdown goes to 0
      // // If we are on a break, we want to stop by default
      // // TODO: implement "infinite" loop switch
      if (countdownRef.current === 0 && modeRef.current === "break") return setCycle({...cycle, on: false})
      if (countdownRef.current === 0) return switchMode()
      // tick
      tick()
    }, 1000)

    return () => clearInterval(interval)
  }, [cycle])

  // How to count time - we want to do this in a ref to prevent overlap
  const tick = () => {
    countdownRef.current--
    setCountdown(countdownRef.current)
  }

  // TODO: pause feature
  const startCycle = () => {
    // start full cycle
    setCycle({...cycle, on: true, mode: "work"})
    if (loopRef.current === 0) loopRef.current = cycle.loops
    if (modeRef.current === "break") modeRef.current = "work"
  }

  // Display
  const cycleForm = () => {
    return (
        <div className={"form"}>
          <div className={"formGrid"}>
            <div>
              <p className={"inputLabel"}>Work time</p>
              <input
                  min={1}
                  max={255}
                  className={"input"}
                  type={"number"}
                  value={cycle.workTime}
                  onChange={(e) => setCycle({...cycle, workTime: e.target.value})}
              />
            </div>
            <div>
              <p className={"inputLabel"}>Pause time</p>
              <input
                  min={1}
                  max={255}
                  className={"input"}
                  type={"number"}
                  value={cycle.pauseTime}
                  onChange={(e) => setCycle({...cycle, pauseTime: e.target.value})}
              />
            </div>
            <div>
              <p className={"inputLabel"}>Break time</p>
              <input
                  min={1}
                  max={255}
                  className={"input"}
                  type={"number"}
                  value={cycle.breakTime}
                  onChange={(e) => setCycle({...cycle, breakTime: e.target.value})}
              />
            </div>
          </div>
        </div>
    )
  }

  // Timer
  const renderTimer = () => {

    const formatTime = () => {
      let mins = Math.floor(countdown/60)
      let secs = countdown % 60
      if (secs < 10) secs = "0"+secs
      return mins + " : " + secs
    }

    return (
        <>
          <p className={"timer"} style={{ color: countdown < 60 ? "red" : "black"}}>{formatTime()}</p>

          <p>Loops left: {loopRef.current}</p>
        </>
    )
  }

  return (
    <>
      <div className={"wrapper"}>
        <h1>Yet another pomodoro</h1>

        <div>
          {!cycle.on && cycleForm()}

          {cycle.on && renderTimer()}

          <div className={"actionsWrapper"}>
            <button className={"button"} onClick={() => startCycle()}>
              Start cycle
            </button>

            <button className={"button"} onClick={() => setCycle({...cycle, on: false})}>
              Stop cycle
            </button>

            <button className={"button"} onClick={() => setCycle({...cycle, pause: !cycle.pause})}>
              Pause cycle
            </button>
          </div>
        </div>

      </div>

    </>
  );
}

export default App;
