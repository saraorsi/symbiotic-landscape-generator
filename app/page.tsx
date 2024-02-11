"use client";
import Frame from "@/components/Frames";
import { useRef, useState } from "react";

export default function Home() {
  const input =
    "Although the modern Western worldview is built on their division, nature and culture are interconnected. Culture is a complex and dynamic process of interaction and co-evolution between humans and other species, as well as technologies and environments. Thus, as seen with climate change, technology and nature are historically interconnected and should be viewed as part of the ecological niche within which the human animal lives.";

  const [start, setStart] = useState(false);
  const [startFrames, setStartFrames] = useState(false);

  const audioRef = useRef<HTMLAudioElement>(null);

  const playAudio = () => {
    setStart(true);
    setTimeout(() => setStartFrames(true), 3000);
    if (audioRef.current) {
      audioRef.current.volume = 0.04;
      audioRef.current.playbackRate = 0.6;
      audioRef.current
        .play()
        .catch((err) => console.error("Error playing audio:", err));
    }
  };

  return (
    <>
      {!start && (
        <div className="w-[900px] h-screen flex flex-col items-center justify-center m-auto text-justify-center text-last-center">
          <div className="text-lg mb-8 uppercase">
            Symbiotic Landscape Generator
          </div>
          <div className="text-lg mb-8">{input}</div>
          <div className="text-sm mb-4">
            [excerpt from residency synopsis used as initial input]
            <br />
            CADA
          </div>
          <div className="text-sm mb-12">
            [sound]
            <br />
            valt​​​Ü​​​ü​​​d by Catarina Arbusto
          </div>
          <button
            onClick={playAudio}
            className="text-lg flicker bg-transparent py-2 px-8 text-green rounded-3xl border-solid border-2 border-[#00ff00]"
          >
            start the performance
          </button>
        </div>
      )}
      {startFrames && <Frame initialInput={input} />}
      <audio ref={audioRef} style={{ display: "none" }}>
        <source src="./3626487201.mp3" type="audio/mp3" />
        Your browser does not support the audio element.
      </audio>
    </>
  );
}
