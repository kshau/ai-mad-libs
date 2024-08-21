"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"
import axios from "axios"
import { Loader2Icon, RefreshCwIcon } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

export default function Home() {

  const [topic, setTopic] = useState("");

  const [madLibContent, setMadLibContent] = useState(null);

  const [madLibBlanks, setMadLibBlanks] = useState([]);

  const [filledBlanks, setFilledBlanks] = useState(null);

  const [loadingMadLib, setLoadingMadLib] = useState(false);

  const {toast} = useToast();

  const generateMadLib = async () => {

    setLoadingMadLib(true);

    const res = await axios.post("/api/generateMadLib", { topic });

    if (!res.data.madLibContent) {
      toast({
        title: "Could not generate Mad Lib!", 
        description: "Please try a different topic.", 
        variant: "destructive"
      })
      setLoadingMadLib(false);
      return;
    }

    setMadLibContent(res.data.madLibContent);

    setMadLibBlanks(res.data.madLibContent.match(/\[([^\]]+)\]/g).map(match => match.slice(1, -1)));
    setLoadingMadLib(false);
  }

  const formatBlankName = (blankName) => {
    var newBlankName = blankName[0].toUpperCase() + blankName.slice(1);
    newBlankName = newBlankName.replaceAll("_", " ");
    return newBlankName;
  }

  const getFilledBlanks = () => {
    const blankElems = document.querySelectorAll("#blank");
    setFilledBlanks(Array.from(blankElems).map(elem => elem.value));
  }

  const getFilledMadLib = () => {

    const madLibContentWords = madLibContent.match(/(\[[^\]]*\])|[\w]+(?:'[\w]+)?|[.,\/#!$%\^&\*;:{}=\-_~()]/g);
    const newMadLibContentWords = [];

    var filledBlanksIdx = 0;
    madLibContentWords.forEach(word => {

      if (word.includes("[")) {
        newMadLibContentWords.push(`__${filledBlanks[filledBlanksIdx]}`);
        filledBlanksIdx++;
      }

      else {
        newMadLibContentWords.push(word);
      }

      newMadLibContentWords.push(" ");

    })

    return newMadLibContentWords;
  }

  return (
    <div className="w-screen h-screen flex flex-col items-center">
      <div className="min-w-[50rem] max-w-[70rem] mt-20">
        <div className="text-4xl mb-5 font-bold">AI Mad Libs</div>
        {madLibContent == null ? (
          <Card variant="outline">
            <CardHeader>
              <CardTitle>
                Write a Topic
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form>
                <Input onChange={(event) => setTopic(event.target.value)} disabled={loadingMadLib}/>
                <Button className="mt-2" onClick={generateMadLib} disabled={loadingMadLib}>
                  {loadingMadLib ? <Loader2Icon className="mr-2 h-4 w-4 animate-spin" /> : <></>}
                  <span>Generate</span>
                </Button>
              </form>
            </CardContent>
          </Card>
        ) : (
          <div>
            {filledBlanks == null ? (
              <Card>
                <CardHeader>
                  <CardTitle>
                    Fill in The Blanks
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form>
                    <div className="flex flex-col gap-y-5">
                      {madLibBlanks.map((blank, index) => (
                        <div className="flex flex-col gap-y-2" key={index}>
                          <span className="font-bold">{formatBlankName(blank)}</span>
                          <Input className="w-40" maxLength={32} id="blank"/>
                        </div>
                      ))}
                      <Button className="w-fit mt-2" onClick={getFilledBlanks}>Done</Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle>
                    Enjoy!
                  </CardTitle>
                  <CardDescription className="text-xl">
                    Topic: {topic}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col">
                  <span className="text-xl">
                    {getFilledMadLib().map((text, index) => (
                      (text.startsWith("__")) ? (
                        <span className="underline font-bold" key={index}>{text.replace("__", "")}</span>
                      ) : (
                        <span key={index}>{text}</span>
                      )
                    ))}
                  </span>
                  <Button className="flex flex-row gap-x-2 mt-4 w-fit" onClick={() => {location.reload()}}>
                    <RefreshCwIcon/>
                    <span>Play again</span>
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        )}
        
      </div>
    </div>
  )

}