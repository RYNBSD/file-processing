Processing files for **Juniors** or **Seniors** is **verbose** if it is not **hard** ☹️.
<br />
and that why I made this package, I made it:

- Simple 🍰
- Blazing fast 🚀
- Customizable 🔧
- Safe 🔒
- And more...

# How ?

### Simple

Did you try to config file processor before ? (yes) 🫡 <br />
Did you try to build an api for it ? (yes) 🤓 <br />
Did you enjoy this process ? (no) 🫠 <br />

### Blazing fast

Did you try to build a model for handling many files ? (yes) 😏 <br />
Did you try to search for fast (image/video/audio/pdf/csv...) processors ? (yes) 🧐 <br />
Did you enjoy the process ? (no) 🫠 <br />

### Customizable

Did you try to build an api to fit all cases ? (yes) 😩 <br />
Did you try to keep it simple and fast ? (yes) 🙃 <br />
Did you enjoy the process ? (no) 🫠 <br />

### Safe

Did you try to sanitize, filter, compress... ? (yes) 😖 <br />
Did you try to secure your server ? (yes) 🙃 <br />
Did you enjoy the process ? (no) 🫠 <br />

# Intro

You have read those questions or not, this is an async file processor, that handle convert, compression, generate, decompression, metadata, parse, filter, customize... and more!

# How it work ?

This package is build on top:

- [fluent-ffmpeg](https://www.npmjs.com/package/fluent-ffmpeg) and [ffmpeg](https://ffmpeg.org/), that handle avs aka audios and videos.
- [sharp](https://sharp.pixelplumbing.com/) and [libvips](https://www.libvips.org/), that handle images.
- [pdf-lib](https://pdf-lib.js.org/), that handle pdfs.
- [csv](https://csv.js.org/), that handle csvs.
- [zlib](https://nodejs.org/api/zlib.html), to handle (de)compress.

What you think is it fast ? (of course, yes!)

- [@ryn-bsd/is-file](https://www.npmjs.com/package/@ryn-bsd/is-file), to handle filtering files.

What you think is it safe ? (of course, yes!)

# Usage

### Image

```js
import { core } from "../../build/index.js";
import Image from "../../build/core/image.js";

const _image = new core.Image(Buffer.alloc(1));
const image = new Image(Buffer.alloc(1));

image.getImages(); // return stored images
// => Buffer[]

// This method filter non buffer values
image.setImages(
  /* async */ (image, index) => {
    return Buffer.concat([image, Buffer.alloc(index)]);
  }
);
// => Promise<void>

// This method filter non images
image.append(Buffer.alloc(1));
// => Promise<void>

image.extend(new Image(Buffer.alloc(1)));
// => void

image.clone();
// => Image

// this method filter non images and return the new length of images
image.filter();
// => Promise<number>

// convert all the image to another format
image.convert("jpeg", { quality: 100 });
// => Promise<{ data: Buffer; info: sharp.OutputInfo; }[]>

image.custom(
  /* async */ (sharp, index) => {
    return sharp
      .resize({ width: 1280, height: 720, fit: "cover" })
      .blur(index)
      .toBuffer();
  }
);
// => Promise<Buffer[]>

image.custom(
  /* async */ (sharp, index) => {
    sharp
      .resize({ width: 1280, height: 720, fit: "cover" })
      .blur(index)
      .toBuffer();
    return index;
  }
);
// => number[]

// return metadata for all images
image.metadata();
// => Promise<sharp.Metadata[]>

Image.fromFile("image1.png", "image2.png");
// => Promise<Image>

Image.fromFile(
  "https://example.com/image1.png",
  "https://example.com/image2.png"
);
// Promise<Image>

// Create a new sharp instance
Image.newSharp();
```

### AV

```js
import { core } from "../../build/index.js";
import { Video, Audio } from "../../build/core/av.js";

const _audio = new core.Audio();
const audio = new Audio();

const _video = new core.Video();
const video = new Video();

/* shared */

video.metadata();
// => Promise<Ffmpeg.FfprobeData[]>

video.convert("mp4");
// => Promise<Buffer[]>

video.custom(
  /* async */ (command, index) => {
    return command.fps(index).pipe();
  }
);
// => (Writable | PassThrough)[]

video.custom(
  /* async */ (command, index) => {
    command.fps(index).pipe();
    return index;
  }
);
// => number[]

Video.newFfmpeg("");

/* Independent */

video.getVideos(); // return stored videos
// => Buffer[]

// This method filter non buffer values
video.setVideos(
  /* async */ (video, index) => {
    return Buffer.concat([video, Buffer.alloc(index)]);
  }
);
// => Promise<void>

// This method filter non videos
video.append(Buffer.alloc(1));
// => Promise<void>

video.extend(new Video(Buffer.alloc(1)));
// => void

video.clone();
// => Video

// this method filter non videos and return the new length of videos
video.filter();
// => Promise<number>

Video.fromFile("video1.mp4", "video2.mp4");
// => Promise<Video>

Video.fromFile(
  "https://example.com/video1.mp4",
  "https://example.com/video2.mp4"
);
// Promise<Video>

audio.getAudios(); // return stored videos
// => Buffer[]

// This method filter non buffer values
audio.setAudios(
  /* async */ (audio, index) => {
    return Buffer.concat([audio, Buffer.alloc(index)]);
  }
);
// => Promise<void>

// This method filter non videos
audio.append(Buffer.alloc(1));
// => Promise<void>

audio.extend(new Audio(Buffer.alloc(1)));
// => void

audio.clone();
// => Audio

// this method filter non videos and return the new length of videos
audio.filter();
// => Promise<number>

Audio.fromFile("audio1.mp3", "audio2.mp3");
// => Promise<Audio>

Audio.fromFile(
  "https://example.com/audio1.mp3",
  "https://example.com/audio2.mp3"
);
// Promise<Audio>
```

### Text

```js
import { core } from "../../build/index.js";
import Text from "../../build/core/text.js";

const _text = new core.Text();
const text = new Text();

text.getTexts(); // return stored texts
// => Buffer[]

// This method filter non buffer values
text.setTexts(
  /* async */ (text, index) => {
    return Buffer.concat([text, Buffer.alloc(index)]);
  }
);
// => Promise<void>

// This method filter non texts
text.append(Buffer.alloc(1));
// => Promise<void>

text.extend(new Text(Buffer.alloc(1)));
// => void

text.clone();
// => Text

// this method filter non texts and return the new length of texts
text.filter();
// => Promise<number>

text.metadata();
// => Promise<{ size: number; }[]>

// Compress all your texts
text.compress("gzip", { level: 9 });
// => Promise<Buffer[]>

// Decompress all your texts
text.decompress("gunzip");
// => Promise<Buffer[]>

text.custom(async (text, index) => {
  const gzip = await Text.gzipAsync(text, { level: index });
  const gunzip = await Text.gunzipAsync(gzip);
  return gunzip;
});
// => Promise<Buffer[]>

text.custom(async (text, index) => {
  const gzip = await Text.gzipAsync(text, { level: index });
  const gunzip = await Text.gunzipAsync(gzip);
  return gunzip.toString();
});
// => Promise<string[]>

//! at the end everything is text, so you can pass any type of file

Text.fromFile("image1.png", "video.mp4");
// => Promise<Text>

Text.fromFile(
  "https://example.com/image1.png",
  "https://example.com/audio.mp3"
);
// Promise<Text>
```

### CSV

```js
import { core } from "../../build/index.js";
import CSV from "../../build/core/csv.js";

const _csv = new core.CSV(Buffer.alloc(1));
const csv = new CSV(Buffer.alloc(1));

csv.getCsvs(); // return stored csv
// => Buffer[]

// This method filter non buffer values
csv.setCsvs(
  /* async */ (csv, index) => {
    return Buffer.concat([csv, Buffer.alloc(index)]);
  }
);
// => Promise<void>

// This method filter non csv
csv.append(Buffer.alloc(1));
// => Promise<void>

csv.extend(new CSV(Buffer.alloc(1)));
// => void

csv.clone();
// => CSV

// this method filter non csv and return the new length of csv
csv.filter();
// => Promise<number>

csv.metadata();
// => Promise<{ size: number; rows: number; columns: number; }[]>

// parse csvs
csv.parse();
// => Promise<any[]>

// transform csvs
csv.transform();
// => Promise<any[]>

csv.custom(async (csv, index) => {
  const parse = await CSV.parse(csv, { comment: "#" });
  const transform = await CSV.transform(parse, function (record) {
    record.push(record.shift());
    return record;
  });
  const stringify = await CSV.stringify(transform);
  return stringify;
});
// => Promise<string[]>

CSV.fromFile("csv1.csv", "csv2.csv");
// => Promise<CSV>

CSV.fromFile("https://example.com/csv1.csv", "https://example.com/csv2.csv");
// Promise<CSV>
```

### PDF

```js
import { core } from "../../build/index.js";
import PDF from "../../build/core/pdf.js";

const _pdf = new core.PDF(Buffer.alloc(1));
const pdf = new PDF(Buffer.alloc(1));

pdf.getPdfs(); // return stored pdf
// => Buffer[]

// This method filter non buffer values
pdf.setPdfs(
  /* async */ (pdf, index) => {
    return Buffer.concat([pdf, Buffer.alloc(index)]);
  }
);
// => Promise<void>

// This method filter non pdf
pdf.append(Buffer.alloc(1));
// => Promise<void>

pdf.extend(new PDF(Buffer.alloc(1)));
// => void

pdf.clone();
// => PDF

// this method filter non pdf and return the new length of pdf
pdf.filter();
// => Promise<number>

pdf.metadata();
// => Promise<{ title: string | undefined; author: string | undefined; subject: string | undefined; creator: string | undefined; keywords: string | undefined; producer: string | undefined; pageCount: number; pageIndices: number[]; creationDate: Date | undefined; modificationDate: Date | undefined; }[]>

pdf.custom(async (pdf, index) => {
  return pdf.addPage([index, index]);
});
// => Promise<PDFPage[]>

PDF.fromFile("csv1.pdf", "csv2.pdf");
// => Promise<PDF>

PDF.fromFile("https://example.com/csv1.pdf", "https://example.com/csv2.pdf");
// Promise<PDF>
```

**Note:** There are more apis 😉

# Todo

- fix bugs (<https://github.com/RYNBSD/file-processing/issues>)
- add new features.
- add streaming support

# Support

- coffee ☕ (<https://buymeacoffee.com/rynbsd04a>)
