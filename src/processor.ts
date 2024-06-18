import { Image, Text, PDF, CSV, Video, Audio } from "./core/index.js";

export default class Processor {
  private readonly files: Buffer[];

  constructor(...files: Buffer[]) {
    this.files = files;
  }

  async image() {
    return new Image(...this.files);
  }

  async pdf() {
    return new PDF(...this.files);
  }

  async csv() {
    return new CSV(...this.files);
  }

  async text() {
    return new Text(...this.files);
  }

  async video() {
    return new Video(...this.files);
  }

  async audio() {
    return new Audio(...this.files);
  }
}
