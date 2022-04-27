import { useState, useEffect } from "react";
import useSound from "use-sound";

export default function Timer() {
  const [isActive, setIsActive] = useState(false);
  const [isPicked, setIsPicked] = useState(false);
  const [sessionCount, setSessionCount] = useState(0);

  const [second, setSecond] = useState("00");
  const [minute, setMinute] = useState("00");
  const [hour, setHour] = useState("00");

  const [counter, setCounter] = useState(0);
  const [flow, setFlow] = useState(0);
  const [rest, setRest] = useState(0);
  const [bub, setBub] = useState(2);
  const [work, setWork] = useState(true);

  const [custom, setCustom] = useState(false);
  const [inputWork, setInputWork] = useState(0);
  const [inputRest, setInputRest] = useState(0);

  const [playFlowMode] = useSound("/audio/open-program-x.wav", {
    volume: 0.5,
  });
  const [playBreakMode] = useSound("/audio/close-program-x.wav", {
    volume: 0.5,
  });

  useEffect(() => {
    let flowInterval;

    if (isPicked) {
      const hourCounter = Math.floor(counter / 3600);
      const minuteCounter = Math.floor(counter / 60) % 60;
      const secondCounter = counter % 60;

      const computedSecond =
        String(secondCounter).length === 1
          ? `0${secondCounter}`
          : secondCounter;
      const computedMinute =
        String(minuteCounter).length === 1
          ? `0${minuteCounter}`
          : minuteCounter;
      const computedHour =
        String(hourCounter).length === 1 ? `0${hourCounter}` : hourCounter;

      setSecond(computedSecond);
      setMinute(computedMinute);
      setHour(computedHour);

      flowInterval = setInterval(() => {
        // when bub is even, its time for rest, when it is odd, it's time for work
        if (isActive) {
          if (counter >= 1) {
            setCounter((counter) => counter - 1);
          } else {
            setBub(bub + 1); // in rest
            if (bub % 2 === 0) {
              setCounter(rest);
              setWork(false);
              playBreakMode();
              alert(
                "Work timer is up! \n\nLook away from the screen and take your break."
              );
            } else {
              setCounter(flow);
              setWork(true);
              playFlowMode();
              setSessionCount(sessionCount + 1);
              alert(
                "Break time is up! \n\nTake a deep breath and get into flow."
              );
            }
          }
        }
      }, 1000); // 1000 milliseconds per second
    }
    return () => clearInterval(flowInterval);
  }, [isActive, isPicked, counter]);

  const stopTimer = () => {
    setWork(true);
    setIsActive(false);
    setIsPicked(false);
    setCounter(0);
    setSecond("00");
    setMinute("00");
    setHour("00");
    setSessionCount(0);
    setBub(0);
    setCustom(false);
  };

  const handleClick = (event) => {
    setIsPicked(true);
    // 25 minutes work, 5 minutes rest
    if (event.target.textContent === "Classic") {
      setCounter(10);
      setFlow(10);
      setRest(5);
    }
    // 50 minutes work, 10 minutes rest
    if (event.target.textContent === "Longer") {
      setCounter(3000);
      setFlow(3000);
      setRest(600);
    }
    // 75 minutes work, 15 minutes rest
    if (event.target.textContent === "Longest") {
      setCounter(4500);
      setFlow(4500);
      setRest(900);
    }
  };

  const handleSubmit = (event) => {
    setIsPicked(true);
    setCounter(inputWork);
    setFlow(inputWork);
    setRest(inputRest);
  };

  return (
    // background color, changes based on work or break mode
    <div className={work ? "h-screen bg-red-400" : "h-screen bg-blue-200"}>
      {/* Work status display */}
      <div className="pt-20 pb-16">
        {!isActive ? (
          <h1 className="text-7xl text-white text-center">
            start your pomodoro
          </h1>
        ) : null}
        {isActive && work ? (
          <h1 className="text-8xl text-yellow-300 text-center">working</h1>
        ) : null}
        {isActive && !work ? (
          <h1 className="text-8xl text-pink-300 text-center">break</h1>
        ) : null}
      </div>

      {/* Timer display */}
      <div className="text-white text-6xl pb-8 text-center">
        <span>{hour}</span>
        <span>:</span>
        <span>{minute}</span>
        <span>:</span>
        <span>{second}</span>
      </div>

      {/* Pomodoro session options */}
      {!isPicked ? (
        <>
          <div className="text-center">
            <button
              onClick={(event) => handleClick(event)}
              className="text-black text-lg px-4 py-1 m-3 rounded-lg shadow-sm bg-white"
            >
              Classic
            </button>
            <button
              onClick={(event) => handleClick(event)}
              className="text-black text-lg px-4 py-1 m-3 rounded-lg shadow-sm bg-white"
            >
              Longer
            </button>
            <button
              onClick={(event) => handleClick(event)}
              className="text-black text-lg px-4 py-1 m-3 rounded-lg shadow-sm bg-white"
            >
              Longest
            </button>
          </div>
          <div className="text-center">
            {!custom ? (
              <button
                onClick={() => setCustom(true)}
                className="text-black text-lg px-4 py-1 m-3 rounded-lg shadow-sm bg-white"
              >
                Custom
              </button>
            ) : (
              <form onSubmit={(event) => handleSubmit(event)} className="m-10">
                <label for="work" className="text-white mr-2 font-semibold">
                  Work timer
                </label>
                <input
                  id="work"
                  type="text"
                  onChange={(e) => {
                    setInputWork(e.target.value);
                  }}
                  placeholder="600 (seconds)"
                  className="rounded p-1"
                ></input>
                <label
                  for="break"
                  className="text-white ml-8 mr-2 font-semibold"
                >
                  Break timer
                </label>
                <input
                  id="break"
                  type="text"
                  onChange={(e) => {
                    setInputRest(e.target.value);
                  }}
                  placeholder="300 (seconds)"
                  className="rounded p-1"
                ></input>
                <button
                  type="submit"
                  for="work"
                  className="text-black text-lg px-3 py-0.5 m-3 rounded-lg shadow-sm bg-white ml-8"
                >
                  Save
                </button>
              </form>
            )}
          </div>
        </>
      ) : (
        <>
          {/* session count display */}
          <div className="text-center">
            <h1 className="font-semibold text-blue-800">
              Sessions completed: {sessionCount}
            </h1>
          </div>
          {/* pause or cancel */}
          <div className="flex justify-center space-x-5">
            <button
              className="text-black px-4 py-1 text-lg shadow-sm mt-10 bg-white rounded-lg"
              onClick={() => setIsActive(!isActive)}
            >
              {isActive ? "Pause" : "Start"}
            </button>
            <button
              className="text-black px-4 py-1 text-lg shadow-sm mt-10 bg-white rounded-lg"
              onClick={() => stopTimer()}
            >
              Cancel
            </button>
          </div>
        </>
      )}
    </div>
  );
}
