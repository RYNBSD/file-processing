import { Image, Text, PDF, CSV, Video, Audio } from "./core/index.js";

export default class Processor {
  private readonly files: Buffer[];

  constructor(...files: Buffer[]) {
    this.files = files;
  }

  image() {
    return new Image(...this.files);
  }

  pdf() {
    return new PDF(...this.files);
  }

  csv() {
    return new CSV(...this.files);
  }

  text() {
    return new Text(...this.files);
  }

  video() {
    return new Video(...this.files);
  }

  audio() {
    return new Audio(...this.files);
  }
}
