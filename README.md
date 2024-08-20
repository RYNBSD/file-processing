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

This is an async/sync/stream file processor, that handle convert, compression, generate, decompression, metadata, parse, filter, customize... and more!

# How it work ?

This package is build on top:

- [fluent-ffmpeg](https://www.npmjs.com/package/fluent-ffmpeg) and [ffmpeg](https://ffmpeg.org/), to handle avs aka audios and videos.
- [sharp](https://sharp.pixelplumbing.com/) and [libvips](https://www.libvips.org/), to handle images.
- [pdf-lib](https://pdf-lib.js.org/), to handle pdfs.
- [csv](https://csv.js.org/), to handle csvs.
- [zlib](https://nodejs.org/api/zlib.html), to handle (de)compress.
- [crypto](https://nodejs.org/api/crypto.html), to handle encryption/decryption and hashing.

What you think is it fast ? (of course, yes!)

- [@ryn-bsd/is-file](https://www.npmjs.com/package/@ryn-bsd/is-file), to handle filtering files.
- [clamscan](https://www.npmjs.com/package/clamscan) and [clamav](https://www.clamav.net/), to handle file scanning and antivirus.

What you think is it safe ? (of course, yes!)

# Environment

make sure to specify if you are in production/development/test environment, this has an impact on performance.

# Prerequisite

- In case you want to add file scanning and anti-virus, make sure to install [clamav](https://www.clamav.net/downloads)

# Usage

### Image

```js
import { core } from "@ryn-bsd/file-processing";
import Image from "@ryn-bsd/file-processing/core/image.js";

const _image = new core.Image(Buffer.alloc(1));
const image = new Image(Buffer.alloc(1));

image.length; // current images length
// => number

image.getImages(); // return stored images
// => Buffer[]

// filter non images and return the new length of images
image.setImages(
  /* async */ (image, index) => {
    return Buffer.concat([image, Buffer.alloc(index)]);
  },
);
// => Promise<number>

// This method filter non images and return the new length of images
image.append(Buffer.alloc(1));
// => Promise<number>

image.extend(new Image(Buffer.alloc(1)));
// => number

image.clone();
// => Image

// Free memory (remove all stored images buffer), you can reuse this instance again.
image.clean();

// this method filter non images and return the new length of images
image.filter();
// => Promise<number>

// convert all the image to another format
image.convert("jpeg", { quality: 100 });
// => Promise<{ data: Buffer; info: sharp.OutputInfo; }[]>

image.custom(
  /* async */ (sharp, index) => {
    return sharp.resize({ width: 1280, height: 720, fit: "cover" }).blur(index).toBuffer();
  },
);
// => Promise<Buffer[]>

image.custom(
  /* async */ (sharp, index) => {
    sharp.resize({ width: 1280, height: 720, fit: "cover" }).blur(index).toBuffer();
    return index;
  },
);
// => Promise<number[]>

// return metadata for all images
image.metadata();
// => Promise<sharp.Metadata[]>

Image.fromFile("image1.png", "image2.png");
// => Promise<Image>

Image.fromFile("https://example.com/image1.png", "https://example.com/image2.png");
// Promise<Image>

// Create a new safe instance
Image.new([Buffer.alloc(1)]);
// => Promise<Image>

// Create a new sharp instance
Image.newSharp();
```

### AV

```js
import { core } from "@ryn-bsd/file-processing";
import { Video, Audio } from "@ryn-bsd/file-processing/core/av/index.js";

const _audio = new core.Audio();
const audio = new Audio();

const _video = new core.Video();
const video = new Video();
```

### Text

```js
import { core } from "@ryn-bsd/file-processing";
import Text from "@ryn-bsd/file-processing/core/text.js";

const _text = new core.Text();
const text = new Text();
```

### CSV

```js
import { core } from "@ryn-bsd/file-processing";
import CSV from "@ryn-bsd/file-processing/core/csv.js";

const _csv = new core.CSV(Buffer.alloc(1));
const csv = new CSV(Buffer.alloc(1));
```

### PDF

```js
import { core } from "@ryn-bsd/file-processing";
import PDF from "@ryn-bsd/file-processing/core/pdf.js";

const _pdf = new core.PDF(Buffer.alloc(1));
const pdf = new PDF(Buffer.alloc(1));
```

**Note:** There are more apis, all tested apis are documented.

# Versions

## 0.9.0 - Working

- Remove puppeteer.
- Remove loader from Core (class).
- Remove parser from Core (class).

## 0.8.0 - Current

- Add examples.
- Refactor code to optimize performance.
- Full code documentation.
- Full organize code to build next versions (scalability).
- Add benchmarks.
- Take screenshots from video.
- Get video audio.
- Get only video (no audio).
- Video/Audio split.
- Add OCR.
- Add instance check for each processor.
- Improve code quality.
- Performance optimizations.

## 0.7.0

- Text unzip.
- Image watermark.
- PDF merge.
- Image to pdf.
- Fast file save (Core.toFile)
- Improve code quality.
- Improve security by adding eslint security plugin.
- Update doc.
- Performance optimizations.
- Add a minified version.
- Add formatter prettier.
- Add esbuild to create a minified version.
- Return length of elements in append/extend.
- Static fn (new) for all processors to generate safe new instance.
- Improve filter for setters.

## 0.6.0

- Sync support.
- Images screenshots (take screenshots from websites).
- PDF generator (generate pdf from websites).
- Stream implementation (not well tested) for CSV/Text.
- Readable support (Core.toReadable).
- Base64 support (Core.toBase64).
- Text more metadata (charactersMap).
- Text more customizable (compress/decompress).
- Some APIs changed.
- Performance optimizations.
- Filter path/URL loaders.
- deprecate input2buffer use Core.toBuffer.
- Disable filter for CSV/Text append.
- Improve code quality.
- Update doc.

## 0.5.0

- Support for images, avs, pdfs, csvs, texts.
- Async support.
- Buffer support (Core.toBuffer).
- File base loader.
- URL loader.

# Todo

🔴 - not implemented yet. <br />
🟠 - implemented, not tested yet. <br />
🟢 - tested. <br />

- fix bugs (<https://github.com/RYNBSD/file-processing/issues>)
- add new features.
- add streaming. 🟠
- Add dir loader. 🟠
- Add glob loader. 🟠
- Generate hash. 🟢
- Generate Hmac. 🟢
- Encryption/Decryption. 🟢
- Custom Error handler. 🟢
- Merge videos/audios in one video/audio. 🟠
- Merge audio and video in one video. 🔴
- Pdf to image. 🔴
- File scanner (antivirus). 🔴
- PDF/Video/Audio watermark. 🔴
- PDF remove page. 🔴
- PDF split. 🔴
- Extract image from pdf. 🔴
- Convert images to svg. 🔴
- Convert svg to image. 🔴
- Add archiver. 🔴

# Support

- coffee ☕ (<https://buymeacoffee.com/rynbsd04a>)
