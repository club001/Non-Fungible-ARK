import {useEffect, useRef} from "react";
import useFarms from "./useFarms";

const useInterval = (callback) =>{
    const delay = 1000;
    const savedCallback = useRef();

    // Remember the latest callback.
    useEffect(() => {
        callback();
        savedCallback.current = callback;
    }, [callback]);

    // Set up the interval.
    useEffect(() => {
        function tick() {
            // @ts-ignore
            savedCallback.current();
        }
        if (delay !== null) {
            let id = setInterval(tick, delay);
            return () => clearInterval(id);
        }
    }, [delay]);
}

export default useInterval


export const useIntervalLong = (callback) =>{
    const delay = 10000;
    const savedCallback = useRef();

    // Remember the latest callback.
    useEffect(() => {
        callback();
        savedCallback.current = callback;
    }, [callback]);

    // Set up the interval.
    useEffect(() => {
        function tick() {
            // @ts-ignore
            savedCallback.current();
        }
        if (delay !== null) {
            let id = setInterval(tick, delay);
            return () => clearInterval(id);
        }
    }, [delay]);
}
