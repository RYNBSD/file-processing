var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { FilterFile } from "../../helper/index.js";
import Core from "../core.js";
import AV from "./av.js";
export default class Audio extends AV {
    constructor(...audios) {
        super(...audios);
    }
    getAudios() {
        return [...this.avs];
    }
    setAudios(callback) {
        return __awaiter(this, void 0, void 0, function* () {
            const audios = yield Promise.all(this.avs.map((audio, index) => __awaiter(this, void 0, void 0, function* () { return callback(audio, index); })));
            const filteredAudios = audios.filter((audio) => Buffer.isBuffer(audio) && audio.length > 0);
            const validAudios = yield Audio.filter(...filteredAudios);
            this.avs = validAudios;
            return this.length;
        });
    }
    append(...audios) {
        return __awaiter(this, void 0, void 0, function* () {
            const filteredAudios = yield Audio.filter(...audios);
            this.avs.push(...filteredAudios);
            return this.length;
        });
    }
    extend(...audios) {
        audios.forEach((audio) => {
            this.avs.push(...audio.getAudios());
        });
        return this.length;
    }
    clone() {
        return new Audio(...this.avs);
    }
    filter() {
        return __awaiter(this, void 0, void 0, function* () {
            this.avs = yield Audio.filter(...this.avs);
            return this.length;
        });
    }
    static filter(...audios) {
        return new FilterFile(...audios).audio();
    }
    static fromFile(...path) {
        return __awaiter(this, void 0, void 0, function* () {
            const buffer = yield Core.loadFile(path);
            return Audio.new(buffer);
        });
    }
    static fromUrl(...url) {
        return __awaiter(this, void 0, void 0, function* () {
            const buffer = yield Core.loadUrl(url);
            return Audio.new(buffer);
        });
    }
    static new(audios) {
        return __awaiter(this, void 0, void 0, function* () {
            const filtered = yield Audio.filter(...audios);
            if (filtered.length === 0)
                throw new Error(`${Audio.name}: Non valid audio`);
            return new Audio(...filtered);
        });
    }
    /**
     * check if an object is instance of Audio or not
     * @returns - boolean
     *
     * @example
     * ```js
     *  const audio = new Audio()
     *  const isAudio = Audio.isAudio(audio)
     *  // => true
     *
     *  const object = new Object()
     *  const isNotAudio = Audio.isAudio(object)
     *  // => false
     * ```
     */
    static isAudio(obj) {
        return obj instanceof Audio;
    }
}
//# sourceMappingURL=audio.js.map