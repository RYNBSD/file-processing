import fs from "node:fs";
import Video from "./build/core/av/video.js";

let buffer = await Video.loadFile("c:\\Users\\bbfgd\\Videos\\short-edit\\NodeJS.mp4");
let video = await Video.new([buffer]);

buffer = null;
const chunks = await video.spilt(60);
video = null;

await Promise.all(
  chunks.map((videos) => {
    return Promise.all(
      videos.map((video, index) =>
        fs.promises.writeFile(`./tmp-video/NodeJS - Part ${index + 1}.mp4`, video),
      ),
    );
  }),
);
