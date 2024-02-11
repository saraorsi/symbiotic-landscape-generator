"use client";
import axios from "axios";
import { useEffect, useState } from "react";

type FrameProps = {
  initialInput: string;
};

export default function Frame({ initialInput }: FrameProps) {
  const [input, setInput] = useState(initialInput);
  const [landscapes, setLandscapes] = useState<Array<string>>([]);
  const [reading, setReading] = useState(false);
  const [state, setState] = useState("");
  const [end, setEnd] = useState(false);
  let count = 1;

  async function fetchSpectulation(input: string) {
    setState("generating speculation");
    const response = await axios.post("/api/generateSpeculation", {
      input,
    });
    const speculation = await response.data;
    await fetchLandscape(speculation);
  }

  async function fetchLandscape(speculation: string) {
    setState("generating landscape");
    try {
      const response = await axios.post("/api/generateLandscape", {
        speculation,
      });
      const landscape = await response.data;
      setState("");
      setLandscapes((prev: Array<string>) => [...prev, landscape]);
      setTimeout(() => speakDescription(speculation), 3000);
    } catch (error) {
      console.error("Error fetching landscape:", error);
    }
  }

  async function speakDescription(speculation: string): Promise<void> {
    const synth = window.speechSynthesis;
    await new Promise<void>((resolve) => {
      const voices = synth.getVoices();
      if (voices.length > 0) {
        resolve();
      } else if (synth.onvoiceschanged !== undefined) {
        synth.onvoiceschanged = () => resolve();
      } else {
        resolve();
      }
    });

    const voices = synth.getVoices();

    const utterance = new SpeechSynthesisUtterance(speculation);
    utterance.voice = voices[132];
    utterance.rate = 0.9;
    utterance.pitch = 1;

    utterance.onstart = () => {
      setInput(speculation);
      setState("");
      setReading(true);
    };

    utterance.onend = () => {
      synth.cancel();
      setReading(false);
      console.log(count);
      if (count == 10) {
        setEnd(true);
        setTimeout(() => window.location.reload(), 3000);
      } else {
        count++;
        fetchSpectulation(speculation);
      }
    };
    synth.speak(utterance);
  }

  useEffect(() => {
    fetchSpectulation(initialInput);
  }, []);

  return (
    <div className={`${end ? "fade-out" : ""}`}>
      {state && (
        <div className="fixed top-5 left-5 flicker z-20 text-xs font-mono drop-shadow-[0_0_1px_rgba(0,0,0,0.5)">
          [{state}]
        </div>
      )}
      {landscapes &&
        landscapes.map((landscape, index) => (
          <div key={index} className="fixed top-0 left-0 w-full h-screen">
            <figure className="w-full h-full left-[-200%]">
              <img
                className={`opacity-100 ${
                  index === landscapes.length - 1
                    ? "opacity-0 fade-in"
                    : "bounce-frame"
                }`}
                src={landscape}
              />
            </figure>
          </div>
        ))}
      <div className="fixed bottom-10 text-center px-64 text-xl drop-shadow-[0_0_1px_rgba(0,0,0,0.5)]">
        {reading && input}
      </div>
    </div>
  );
}
