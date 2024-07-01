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

This is an async/sync file processor, that handle convert, compression, generate, decompression, metadata, parse, filter, customize... and more!

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

image.length; // current images length
// => number

image.getImages(); // return stored images
// => Buffer[]

// This method filter non buffer values
image.setImages(
  /* async */ (image, index) => {
    return Buffer.concat([image, Buffer.alloc(index)]);
  },
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
```

### Text

```js
import { core } from "../../build/index.js";
import Text from "../../build/core/text.js";

const _text = new core.Text();
const text = new Text();
```

### CSV

```js
import { core } from "../../build/index.js";
import CSV from "../../build/core/csv.js";

const _csv = new core.CSV(Buffer.alloc(1));
const csv = new CSV(Buffer.alloc(1));
```

### PDF

```js
import { core } from "../../build/index.js";
import PDF from "../../build/core/pdf.js";

const _pdf = new core.PDF(Buffer.alloc(1));
const pdf = new PDF(Buffer.alloc(1));
```

**Note:** There are more apis 😉

# Versions

## Next

- Refactor code to optimize performance.
- Full code documentation.
- Add prettier and eslint.
- Full organize code to build next version (scalability).
- Add benchmarks.
- Add examples.

## 0.7.0 - Working

- Text unzip.
- Image watermark.
- PDF merge.
- Image to pdf.
- Fast file save (Core.toFile)
- Improve code quality.
- Improve security by adding eslint security plugin.
- Text/CSV setter filter empty buffers.
- Update doc.
- Performance optimizations.

## 0.6.0 - Current

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
- Text unzip. 🟢
- Image watermark. 🟢
- PDF merge. 🟢
- image to pdf. 🟢
- Extract text from images/videos. 🔴
- Improve filter for setters. 🔴
- Add glob loader. 🔴
- Add dir loader. 🔴
- Collect images/audios/videos from websites. 🔴
- Add files formatter. 🔴
- Add files minifier. 🔴
- Add static new (to create safe new instance). 🔴
- Video watermark. 🔴

# Support

- coffee ☕ (<https://buymeacoffee.com/rynbsd04a>)
