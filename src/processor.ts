import { Image, Text, PDF, CSV, Video, Audio } from "./core/index.js";

export default class Processor {
  private readonly files: Buffer[];

  constructor(...files: Buffer[]) {
    this.files = files;
  }

  image() {
    return Image.new(this.files);
  }

  pdf() {
    return PDF.new(this.files);
  }

  csv() {
    return CSV.new(this.files);
  }

  text() {
    return Text.new(this.files);
  }

  video() {
    return Video.new(this.files);
  }

  audio() {
    return Audio.new(this.files);
  }
}
