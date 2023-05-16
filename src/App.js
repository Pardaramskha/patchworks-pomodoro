import React, {useState, useEffect, useRef} from "react"

function App() {

  const [cycle, setCycle] = React.useState({
    on: false,
    mode: "work",
    workTime: 3,
    pauseTime: 5,
    breakTime: 10,
    loops: 2,
  })

  const [countdown, setCountdown] = React.useState(0)

  // refs
  const countdownRef = useRef(countdown)
  const modeRef = useRef(cycle.mode)
  const loopRef = useRef(cycle.loops)

  const styles = {
    wrapper: {
      minHeight: "100%",
      width: "100%",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignContent: "center",
      textAlign: "center"
    }
  }

  const tick = () => {
    countdownRef.current--
    setCountdown(countdownRef.current)
  }

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

      console.log("NEXT MODE:", nextTimer)

      setCycle({...cycle, mode: nextMode})
      modeRef.current = nextMode

      countdownRef.current = nextTimer
      setCountdown(nextTimer)

      if (modeRef.current === "work") loopRef.current--
    }

    // Default behaviour when it's work time
    if (modeRef.current === "work") {
      // countdownRef.current = cycle.workTime*60
      countdownRef.current = cycle.workTime
      setCountdown(countdownRef.current)
    }

    const interval = setInterval(() => {
      // if nothing has been clicked yet or timer is stopped
      if (!cycle.on) return
      // behaviour if countdown goes to 0
      if (countdownRef.current === 0 && modeRef.current === "break") return setCycle({...cycle, on: false})
      if (countdownRef.current === 0) return switchMode()
      // tick
      tick()
    }, 1000)

    return () => clearInterval(interval)
  }, [cycle])



  // TODO: pause feature
  const startCycle = () => {
    // start full cycle
    setCycle({...cycle, on: true, mode: "work"})
    if (loopRef.current === 0) loopRef.current = cycle.loops
    if (modeRef.current === "break") modeRef.current = "work"
  }

  // Display<<<<<<<
  const cycleForm = () => {
    return (
        <>
          <p>Work time</p>
          <input type={"number"} value={cycle.workTime} onChange={(e) => setCycle({...cycle, workTime: e.target.value})} />
          <p>Pause time</p>
          <input type={"number"} value={cycle.pauseTime} onChange={(e) => setCycle({...cycle, pauseTime: e.target.value})} />
          <p>Break time</p>
          <input type={"number"} value={cycle.breakTime} onChange={(e) => setCycle({...cycle, breakTime: e.target.value})} />
        </>
    )
  }

  return (
    <>
      <div style={styles.wrapper}>
        <h1>Pomodoro.io</h1>

        {/*Timer wrapper*/}
        <div>

          {!cycle.on && cycleForm()}

          <p>{countdown} {modeRef.current}</p>

          <p>Left: {loopRef.current}</p>

          <br/>

          <button onClick={() => startCycle()}>
            Start cycle
          </button>

          <button onClick={() => setCycle({...cycle, on: false})}>
            Stop cycle
          </button>

          <button onClick={() => console.log(cycle)}>
            Log
          </button>
        </div>

      </div>

    </>
  );
}

export default App;
