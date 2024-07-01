var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Mutex } from "async-mutex";
import isFile from "@ryn-bsd/is-file";
import Core from "../core/core.js";
/**
 * Easy and fast way to filter bunche of files
 */
export default class FilterFile {
    constructor(...input) {
        this.input = input;
    }
    application() {
        return __awaiter(this, void 0, void 0, function* () {
            const { applications } = yield FilterFile.filter(...this.input);
            return applications;
        });
    }
    audio() {
        return __awaiter(this, void 0, void 0, function* () {
            const { audios } = yield FilterFile.filter(...this.input);
            return audios;
        });
    }
    font() {
        return __awaiter(this, void 0, void 0, function* () {
            const { fonts } = yield FilterFile.filter(...this.input);
            return fonts;
        });
    }
    image() {
        return __awaiter(this, void 0, void 0, function* () {
            const { images } = yield FilterFile.filter(...this.input);
            return images;
        });
    }
    model() {
        return __awaiter(this, void 0, void 0, function* () {
            const { models } = yield FilterFile.filter(...this.input);
            return models;
        });
    }
    text() {
        return __awaiter(this, void 0, void 0, function* () {
            const { texts } = yield FilterFile.filter(...this.input);
            return texts;
        });
    }
    video() {
        return __awaiter(this, void 0, void 0, function* () {
            const { videos } = yield FilterFile.filter(...this.input);
            return videos;
        });
    }
    /**
     * Filter custom file
     * @param me - mime extension
     */
    custom(me) {
        return __awaiter(this, void 0, void 0, function* () {
            const buffer = yield Core.toBuffer(this.input);
            const result = yield isFile.isCustom(buffer, me);
            return result.filter((file) => file.valid).map((file) => file.value);
        });
    }
    static filter(...input) {
        return __awaiter(this, void 0, void 0, function* () {
            const buffer = yield Core.toBuffer(input);
            const mutexes = {
                applications: new Mutex(),
                audios: new Mutex(),
                fonts: new Mutex(),
                images: new Mutex(),
                models: new Mutex(),
                texts: new Mutex(),
                videos: new Mutex(),
            };
            const files = {
                applications: [],
                audios: [],
                fonts: [],
                images: [],
                models: [],
                texts: [],
                videos: [],
            };
            yield Promise.all(buffer.map((buffer) => __awaiter(this, void 0, void 0, function* () {
                if (yield isFile.isApplication(buffer)) {
                    const release = yield mutexes.applications.acquire();
                    files.applications.push(buffer);
                    release();
                }
                else if (yield isFile.isAudio(buffer)) {
                    const release = yield mutexes.audios.acquire();
                    files.audios.push(buffer);
                    release();
                }
                else if (yield isFile.isFont(buffer)) {
                    const release = yield mutexes.fonts.acquire();
                    files.fonts.push(buffer);
                    release();
                }
                else if (yield isFile.isImage(buffer)) {
                    const release = yield mutexes.images.acquire();
                    files.images.push(buffer);
                    release();
                }
                else if (yield isFile.isModel(buffer)) {
                    const release = yield mutexes.models.acquire();
                    files.models.push(buffer);
                    release();
                }
                else if (yield isFile.isText(buffer)) {
                    const release = yield mutexes.texts.acquire();
                    files.texts.push(buffer);
                    release();
                }
                else if (yield isFile.isVideo(buffer)) {
                    const release = yield mutexes.videos.acquire();
                    files.videos.push(buffer);
                    release();
                }
            })));
            return files;
        });
    }
}
//# sourceMappingURL=filter.js.map