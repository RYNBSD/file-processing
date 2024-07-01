/// <reference types="node" resolution-mode="require"/>
import { Image, Text, PDF, CSV, Video, Audio } from "./core/index.js";
export default class Processor {
  private readonly files;
  constructor(...files: Buffer[]);
  image(): Image;
  pdf(): PDF;
  csv(): CSV;
  text(): Text;
  video(): Video;
  audio(): Audio;
}
//# sourceMappingURL=processor.d.ts.map
