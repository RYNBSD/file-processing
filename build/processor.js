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
    image() {
        return __awaiter(this, void 0, void 0, function* () {
            return new Image(...this.files);
        });
    }
    pdf() {
        return __awaiter(this, void 0, void 0, function* () {
            return new PDF(...this.files);
        });
    }
    csv() {
        return __awaiter(this, void 0, void 0, function* () {
            return new CSV(...this.files);
        });
    }
    text() {
        return __awaiter(this, void 0, void 0, function* () {
            return new Text(...this.files);
        });
    }
    video() {
        return __awaiter(this, void 0, void 0, function* () {
            return new Video(...this.files);
        });
    }
    audio() {
        return __awaiter(this, void 0, void 0, function* () {
            return new Audio(...this.files);
        });
    }
}
//# sourceMappingURL=processor.js.map