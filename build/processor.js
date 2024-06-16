var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Image, Text, PDF, CSV, Video, Audio } from "./core/index.js";
export default class Processor {
    constructor(...files) {
        this.files = files;
    }
    /**
     *
     * @param check Check if provided files are images @default false
     * @returns - Image instance
     */
    image() {
        return __awaiter(this, arguments, void 0, function* (check = false) {
            const image = new Image(...this.files);
            if (check)
                yield image.check();
            return image;
        });
    }
    /**
     *
     * @param check Check if provided files are pdfs @default false
     * @returns - PDF instance
     */
    pdf() {
        return __awaiter(this, arguments, void 0, function* (check = false) {
            const pdf = new PDF(...this.files);
            if (check)
                yield pdf.check();
            return pdf;
        });
    }
    /**
     *
     * @param check Check if provided files are csvs @default false
     * @returns - CSV instance
     */
    csv() {
        return __awaiter(this, arguments, void 0, function* (check = false) {
            const csv = new CSV(...this.files);
            if (check)
                yield csv.check();
            return csv;
        });
    }
    /**
     *
     * @param check Check if provided files are texts @default false
     * @returns - Text instance
     */
    text() {
        return __awaiter(this, arguments, void 0, function* (check = false) {
            const text = new Text(...this.files);
            if (check)
                yield text.check();
            return text;
        });
    }
    /**
     *
     * @param check Check if provided files are videos @default false
     * @returns - Text instance
     */
    video() {
        return __awaiter(this, arguments, void 0, function* (check = false) {
            const video = new Video(...this.files);
            if (check)
                yield video.check();
            return video;
        });
    }
    /**
     *
     * @param check Check if provided files are audios @default false
     * @returns - Text instance
     */
    audio() {
        return __awaiter(this, arguments, void 0, function* (check = false) {
            const audio = new Audio(...this.files);
            if (check)
                yield audio.check();
            return audio;
        });
    }
}
//# sourceMappingURL=processor.js.map