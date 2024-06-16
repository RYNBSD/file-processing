import { Image, Text, PDF, CSV, Video, Audio } from "./core/index.js";

export default class Processor {
  private readonly files: Buffer[];

  constructor(...files: Buffer[]) {
    this.files = files;
  }

  /**
   *
   * @param check Check if provided files are images @default false
   * @returns - Image instance
   */
  async image(check = false) {
    const image = new Image(...this.files);
    if (check) await image.check();
    return image;
  }

  /**
   *
   * @param check Check if provided files are pdfs @default false
   * @returns - PDF instance
   */
  async pdf(check = false) {
    const pdf = new PDF(...this.files);
    if (check) await pdf.check();
    return pdf;
  }

  /**
   *
   * @param check Check if provided files are csvs @default false
   * @returns - CSV instance
   */
  async csv(check = false) {
    const csv = new CSV(...this.files);
    if (check) await csv.check();
    return csv;
  }

  /**
   *
   * @param check Check if provided files are texts @default false
   * @returns - Text instance
   */
  async text(check = false) {
    const text = new Text(...this.files);
    if (check) await text.check();
    return text;
  }

  /**
   *
   * @param check Check if provided files are videos @default false
   * @returns - Text instance
   */
  async video(check = false) {
    const video = new Video(...this.files);
    if (check) await video.check();
    return video;
  }

  /**
   *
   * @param check Check if provided files are audios @default false
   * @returns - Text instance
   */
  async audio(check = false) {
    const audio = new Audio(...this.files);
    if (check) await audio.check();
    return audio;
  }
}
