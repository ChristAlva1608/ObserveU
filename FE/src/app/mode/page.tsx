"use client";
import React from "react";
import dynamic from "next/dynamic";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Car,
  Circle,
  FileText,
  PauseCircle,
  PlayCircle,
  SkipBack,
  SkipForward,
  StopCircle,
  Video,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Image from "next/image";
import CombinedComponent from "./facemesh";
// import { usestartSession } from "../useData";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";


// const CombinedComponent = dynamic(() => import("./facemesh"), {
//   ssr: false,
// });


export default function Page() {
  // const { startSession: data } = usestartSession()
  const [userLog, setUserLog] = React.useState<
    { message: string; time: Date }[]
  >([]);
  const [startSession, setStartSession] = React.useState<boolean>(false);
  const [realTime, setRealTime] = React.useState<Date | null>(null)
  const [realTimeEnd, setRealTimeEnd] = React.useState<Date | null>(null)
  const [selectValue, setSelectValue] = React.useState<string>("none");


  return (
    <div className="flex gap-6">
      <Card className="min-w-[648px]">
        <CardHeader>
          <CardTitle className="flex gap-2 items-center">
            Video <Video className="w-6 h-6 font-bold" />
          </CardTitle>
          {/* <CardDescription>Card Description</CardDescription> */}
        </CardHeader>
        <CardContent className="h-fit flex flex-col">
          <div className="w-full h-fit rounded-md">
            <CombinedComponent setStartSession={setUserLog} />
          </div>
          <div className="flex gap-4 max-w-[600px] mx-auto mt-4">
            <Select defaultValue={"relaxed"}>
              <SelectTrigger className="w-[240px]">
                <SelectValue placeholder="Mode" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="relaxed" >Relaxed</SelectItem>
                <SelectItem value="pomodoro">Pomodoro</SelectItem>
                <SelectItem value="hardcore">Hard-core</SelectItem>
              </SelectContent>
            </Select>
            <Select defaultValue="none" value={selectValue} onValueChange={(e) => setSelectValue(e)}>
              <SelectTrigger className="w-[240px]">
                <SelectValue placeholder="Playlist" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None</SelectItem>
                <SelectItem value="playlist1">Playlist 1</SelectItem>
                <SelectItem value="playlist2">Playlist 2</SelectItem>
                <SelectItem value="playlist3">Playlist 3</SelectItem>
                <SelectItem value="playlist3">Example</SelectItem>
              </SelectContent>
            </Select>
            <Button
              variant="default"
              className="w-full mx-auto flex items-center gap-1.5"
              onClick={() => {
                console.log("Click");
                
                setStartSession(!startSession);
                if (!startSession) {
                  setRealTime(new Date())
                  setUserLog((prev) => {
                    return [ ...prev,
                      { message: "You started a new logg", time: new Date() },
                    ]
                  });
                 
                } else {
                  setUserLog((prev) => {
                    return [ ...prev,
                      { message: "You fisnish a new log", time: new Date() },
                    ]
                  });
                  setRealTimeEnd(new Date())

                }
                
              }}
            >
              {
                !startSession ? (<>Start recording <Zap className="w-4 h-4" /></>) : (<>Stop recording <StopCircle className="w-4 h-4" /></>)
              }
              
            </Button>
          </div>
          {
            startSession && selectValue !== "none" && 
            <MusicControl userLog={userLog} setUserLog={setUserLog} />
          }
        </CardContent>
      </Card>
      <Card className="flex-1">
        <CardHeader>
          <CardTitle className="flex gap-2 items-center">
            User log <FileText className="w-5 h-5 font-bold" />
          </CardTitle>
          {/* <CardDescription>Card Description</CardDescription> */}
        </CardHeader>
        <CardContent className="h-full flex flex-col gap-2">

          <ScrollArea className={cn("border rounded-md p-4 h-[490px]", (!startSession || selectValue == "none") && "h-[440px]")}>
            {userLog.map((item, index) => {
              if (realTime && item.time >= realTime ) {
                if (!realTimeEnd || (realTimeEnd && item.time <= realTimeEnd)) {
                  return (
                    <div className="flex items-center mb-2 gap-2" key={index}>
                      <Image
                        src="/logo_only.jpg"
                        alt="logo-only"
                        width={0}
                        height={0}
                        className="w-7 h-7 rounded-full border"
                      />
                      <p className="text-sm">
                        <span className="font-bold">{formatDate(item.time)}</span>:{" "}
                        {item.message}
                      </p>
                    </div>
                  );
                } 

             
              } else return <></>
            })}
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}


const songs: string[] = ["/song/song1.mp3", "/song/song2.mp3", "/song/song3.mp3", "/song/song4.mp3", "/song/song5.mp3"];
const songNames: string[] = ["A beautiful day - Lil Nas X", "Bohemian Rhapsody - Queen", "Hey Jude - The Beattle", "Yellow - Coldplay", "A sky full of money - Beyonce"];



function MusicControl({setUserLog, userLog} : {setUserLog: React.Dispatch<React.SetStateAction<{
  message: string;
  time: Date;
}[]>>, userLog: { message: string; time: Date }[]}) {
  const [currentSongIndex, setCurrentSongIndex] = React.useState<number>(0);
  const [isPlaying, setIsPlaying] = React.useState<boolean>(true);
  const audioRef = React.useRef<HTMLAudioElement | null>(null);

  const playPreviousSong = () => {
    setCurrentSongIndex((prevIndex: number) =>
      (prevIndex - 1 + songs.length) % songs.length
    );
  };

  const playNextSong = () => {
    setCurrentSongIndex((prevIndex: number) => (prevIndex + 1) % songs.length);
    setIsPlaying(true); // Auto play next song
  };

  const togglePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const [play, setPlay] = React.useState<boolean>(false)
  function prompGen(pro: string) {
    return {
      time: new Date(),
      message: pro
    }
  }

  React.useEffect(() => {
    // console.log(userLog[userLog.length-1].message)
    if (userLog[userLog.length-1].message === "Move to previous song") {
      setPlay(false)
      setIsPlaying(true)
      playPreviousSong()
    }
    if (userLog[userLog.length-1].message === "Move to next song") {
      setPlay(false)
      setIsPlaying(true)

      playNextSong()
    }
    if (userLog[userLog.length-1].message === "Play/pause song") {
      setPlay(!play)
      togglePlayPause()
    }
  }, [userLog])

  return <div className="flex items-center justify-between mt-[18px]">
  <p className="font-semibold text-lg">Current playing: {songNames[currentSongIndex]}</p>
  <div className="flex gap-3">
    <audio ref={audioRef} src={songs[currentSongIndex]} autoPlay={isPlaying} />
    <SkipBack className="w-[26px] h-[26px] cursor-pointer " onClick={() => { playPreviousSong(); setUserLog((prev) => [...prev, prompGen("You move to previous song!")])}}/>
    {!play && 
    <PauseCircle className="w-[26px] h-[26px] cursor-pointer" onClick={() => { togglePlayPause(); setPlay(!play); setUserLog((prev) => [...prev, prompGen("You paused a song!")])}} />
    }
    {play && 
    <PlayCircle className="w-[26px] h-[26px] cursor-pointer" onClick={() => {togglePlayPause(); setPlay(!play); setUserLog((prev) => [...prev, prompGen("You unpaused a song!")])}} />
    }
    <SkipForward className="w-[26px] h-[26px] cursor-pointer" onClick={() => { playNextSong(); setUserLog((prev) => [...prev, prompGen("You move to next song!")])}}/>
  </div>
</div>
}


const MusicPlayer: React.FC = () => {
  

  return (
    <div>
      
      {/* <p>Current Song: </p> */}
    </div>
  );
};



function formatDate(date: Date): string {
  let hours: number = date.getHours();
  let minutes: number = date.getMinutes();
  let seconds: number = date.getSeconds();
  let ampm: string = hours >= 12 ? "PM" : "AM";


  hours = hours % 12;
  hours = hours ? hours : 12; // 0 should be converted to 12


  const strHours: string = hours < 10 ? "0" + hours : hours.toString();
  const strMinutes: string = minutes < 10 ? "0" + minutes : minutes.toString();
  const strSeconds: string = seconds < 10 ? "0" + seconds : seconds.toString();


  const strTime: string = `${strHours}:${strMinutes}:${strSeconds} ${ampm}`;
  return strTime;
}



