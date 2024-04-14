"use client";
import React from "react";
import {
  FaHand,
  FaHandFist,
  FaHandHolding,
  FaHandLizard,
  FaHandPeace,
  FaHandPointLeft,
  FaHandPointRight,
  FaHandScissors,
  FaHandSpock,
  FaRegHandPointLeft,
  FaRegHandPointRight,
} from "react-icons/fa6";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Image from "next/image";
// import { PlusCircledIcon } from "@radix-ui/react-icons";

import { cn } from "@/lib/utils";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";

import { Album } from "./data/albums";
import { playlists } from "./data/playlists";
import { listenNowAlbums, madeForYouAlbums } from "./data/albums";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Check, FileAudio, ListMusic } from "lucide-react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { useRouter } from "next/navigation";
import { ClipLoader } from "react-spinners";
import { IconType } from "react-icons/lib";

const invoices = [
  {
    invoice: "The xx",
    paymentStatus: "Intro",
    totalAmount: "$200.00",
    paymentMethod: "Ambient",
  },
  {
    invoice: "Marconi Union",
    paymentStatus: "Weightless",
    totalAmount: "$150.00",
    paymentMethod: "Relaxing",
  },
  {
    invoice: "Claude Debussy",
    paymentStatus: "Clair de Lune",
    totalAmount: "$350.00",
    paymentMethod: "Soothing",
  },
  {
    invoice: "Deadmau5",
    paymentStatus: "Strobe",
    totalAmount: "$450.00",
    paymentMethod: "Hypnotic",
  },
  {
    invoice: "Bon Iver",
    paymentStatus: "Re:Stacks",
    totalAmount: "$550.00",
    paymentMethod: "Serene",
  },
];

interface AlbumArtworkProps extends React.HTMLAttributes<HTMLDivElement> {
  album: Album;
  aspectRatio?: "portrait" | "square";
  width?: number;
  height?: number;
}

export default function Page() {
  const router = useRouter();
  const [loginLoading, setLoginLoading] = React.useState<boolean>(false);
  const [loginValid, setLoginValid] = React.useState<boolean>(false);
  const [open, setOpen] = React.useState<boolean>(false);
  const [create, setCreate] = React.useState<boolean>(false)

  return (
    <Tabs defaultValue="music" className="container">
      <TabsList>
        <TabsTrigger value="music">Music</TabsTrigger>
        <TabsTrigger value="gesture">Gesture</TabsTrigger>
      </TabsList>
      <TabsContent value="music" className="border-none p-0 outline-none mt-6">
        <div className="flex justify-between">
          <div className="space-y-1">
            <h2 className="text-2xl font-semibold tracking-tight">
              Your Playlists
            </h2>
            <p className="text-sm text-muted-foreground">
              Feel free to create a new one :D
            </p>
          </div>
          <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <ListMusic className="w-4 h-4" />
                Create
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              </AlertDialogHeader>
              <div className="flex flex-col mt-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" placeholder="playlist name" className="mt-3" />
              </div>
              <div className="flex justify-between items-center mt-3">
                <Label>Song list</Label>
                <Button size="sm" variant="secondary">
                  <FileAudio className="w-4 h-4 mr-1.5" />
                  Add external
                </Button>
              </div>
              <ScrollArea className="max-h-[200px] border rounded-lg">
                <TableDemo />
              </ScrollArea>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <Button
                  onClick={() => {
                    setLoginLoading(true);
                    setLoginValid(false);
                    setTimeout(() => {
                      setLoginLoading(false);
                      setLoginValid(true);
                      setTimeout(() => {
                        setOpen(false);
                        setCreate(true)
                      }, 300);
                    }, 2000);
                  }}
                >
                  Create
                  {loginLoading && (
                    <ClipLoader color="white" size={16} className="ml-1.5" />
                  )}
                  {loginValid && (
                    <Check className="text-white w-4 h-4 font-bold ml-1.5" />
                  )}
                </Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
        <Separator className="my-4" />
        <div className="relative">
          <ScrollArea>
            <div className="flex space-x-4 pb-4">
              {listenNowAlbums.slice(0, -1).map((album) => (
                <AlbumArtwork
                  key={album.name}
                  album={album}
                  className="w-[200px]"
                />
              ))}
              {create && [listenNowAlbums[listenNowAlbums.length - 1]].map((album) => (
                <AlbumArtwork
                  key={album.name}
                  album={album}
                  className="w-[200px]"
                />
              ))}
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </div>
        <div className="flex items-center justify-between mt-6">
          <div className="space-y-1">
            <h2 className="text-2xl font-semibold tracking-tight">
              Listen Now
            </h2>
            <p className="text-sm text-muted-foreground">
              Top picks for you. Updated daily.
            </p>
          </div>
        </div>
        <Separator className="my-4" />
        <div className="relative">
          <ScrollArea>
            <div className="flex space-x-4 pb-4">
              {madeForYouAlbums.map((album) => (
                <AlbumArtwork
                  key={album.name}
                  album={album}
                  className="w-[150px]"
                  aspectRatio="portrait"
                  width={150}
                  height={150}
                />
              ))}
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </div>
      </TabsContent>
      <TabsContent value="gesture" className="border-none p-0 outline-none">
        <HandGes
          title="Move to previous song"
          des="Select hand posture to move to previous song"
          data={[FaHandPointLeft, FaHandScissors, FaHandSpock, FaHandScissors]}
        />

        <HandGes
          title="Move to next song"
          des="Select hand posture to move to next song"
          data={[FaHandPointRight, FaHandHolding, FaHandPeace, FaHandHolding]}
        />

        <HandGes
          title="Play/Pause song"
          des="Select hand posture to move to play/pause song"
          data={[FaHandFist, FaHandLizard, FaHand, FaHandLizard]}
        />
        {/* <HandGes
          title="Move to previous song"
          des="str2"
          data={["0", "1", "2", "3", "4"]}
        />
        <HandGes
          title="Play/pause song"
          des="str2"
          data={["0", "1", "2", "3", "4"]}
        /> */}
      </TabsContent>
    </Tabs>
  );
}

function TableDemo() {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead></TableHead>
          <TableHead>Author</TableHead>
          <TableHead>Song title</TableHead>
          <TableHead>Song vibe</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {invoices.map((invoice) => (
          <TableRow key={invoice.invoice} className="h-[60px]">
            <TableCell className="w-fit">
              <Checkbox className="mt-1" />
            </TableCell>
            <TableCell className="font-medium">{invoice.invoice}</TableCell>
            <TableCell>{invoice.paymentStatus}</TableCell>
            <TableCell>{invoice.paymentMethod}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

function HandGes({
  data,
  title,
  des,
}: {
  data: IconType[];
  title: string;
  des: string;
}) {
  const [hand, setHand] = React.useState<number>(0);
  return (
    <div className="my-6">
      <h2 className="text-2xl font-semibold tracking-tight">{title}</h2>
      <p className="text-sm text-muted-foreground mt-1">{des}</p>

      <div className="flex gap-4 mt-4">
        {data.map((Item, index) => {
          return (
            <div
              className={cn(
                "w-24 h-24 rounded-lg bg-black flex items-center justify-center",
                hand === index && "ring-4"
              )}
              onClick={() => setHand(index)}
            >
              <Item className="w-10 h-10 text-white" />
            </div>
          );
        })}
      </div>
    </div>
  );
}

function AlbumArtwork({ album, className, ...props }: AlbumArtworkProps) {
  return (
    <div className={cn("space-y-3", className)} {...props}>
      <ContextMenu>
        <ContextMenuTrigger>
          <div className="overflow-hidden rounded-md">
            <Image
              src={album.cover}
              alt={album.name}
              width={0}
              height={0}
              className={cn(
                "h-[200px] w-[200px] object-cover transition-all hover:scale-105"
              )}
            />
          </div>
        </ContextMenuTrigger>
        <ContextMenuContent className="w-40">
          <ContextMenuItem>Add to Library</ContextMenuItem>
          <ContextMenuSub>
            <ContextMenuSubTrigger>Add to Playlist</ContextMenuSubTrigger>
            <ContextMenuSubContent className="w-48">
              <ContextMenuItem>
                {/* <PlusCircledIcon className="mr-2 h-4 w-4" /> */}
                New Playlist
              </ContextMenuItem>
              <ContextMenuSeparator />
              {playlists.map((playlist) => (
                <ContextMenuItem key={playlist}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    className="mr-2 h-4 w-4"
                    viewBox="0 0 24 24"
                  >
                    <path d="M21 15V6M18.5 18a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5ZM12 12H3M16 6H3M12 18H3" />
                  </svg>
                  {playlist}
                </ContextMenuItem>
              ))}
            </ContextMenuSubContent>
          </ContextMenuSub>
          <ContextMenuSeparator />
          <ContextMenuItem>Play Next</ContextMenuItem>
          <ContextMenuItem>Play Later</ContextMenuItem>
          <ContextMenuItem>Create Station</ContextMenuItem>
          <ContextMenuSeparator />
          <ContextMenuItem>Like</ContextMenuItem>
          <ContextMenuItem>Share</ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
      <div className="space-y-1 text-sm">
        <h3 className="font-medium leading-none">{album.name}</h3>
        <p className="text-xs text-muted-foreground">{album.artist}</p>
      </div>
    </div>
  );
}
