var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { ARnft } from "app/ARnft";
export class NFTWorker {
    constructor(d) {
        this._hadProcessed = false;
        this._dispatcher = d;
    }
    initialize(workerURL, cameraURL, markerURL) {
        // this.markerData = data.markerData;
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            this.worker = new Worker(workerURL);
            this.worker.onmessage = (ev) => __awaiter(this, void 0, void 0, function* () {
                yield this.load(cameraURL).then(() => {
                    resolve(true);
                });
            });
        }));
    }
    process(imageData) {
        if (!this._hadProcessed) {
            return;
        }
        this._hadProcessed = false;
        this.worker.postMessage({ type: 'process', imagedata: imageData }, [imageData.data.buffer]);
    }
    load(cameraURL) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            var camera_para = cameraURL;
            // var camera_para = '../../data/camera_para-iPhone 5 rear 640x480 1.0m.dat';
            var pscale = 320 / Math.max(this.vw, this.vh / 3 * 4);
            this.w = this.vw * pscale;
            this.h = this.vh * pscale;
            this.pw = Math.max(this.w, (this.h / 3) * 4);
            this.ph = Math.max(this.h, (this.w / 4) * 3);
            this.worker.postMessage({
                type: 'load',
                pw: this.pw,
                ph: this.ph,
                camera_para: camera_para,
                marker: this.markerData.url
            });
            this.worker.onmessage = (ev) => {
                var msg = ev.data;
                switch (msg.type) {
                    case 'loaded': {
                        var proj = JSON.parse(msg.proj);
                        this._dispatcher.dispatchEvent(new CustomEvent(ARnft.EVENT_SET_CAMERA, proj));
                        break;
                    }
                    case "endLoading": {
                        if (msg.end == true)
                            resolve(true);
                        break;
                    }
                    case 'found': {
                        this._dispatcher.found(msg);
                        break;
                    }
                    case 'not found': {
                        this._dispatcher.found(null);
                        break;
                    }
                }
                this._hadProcessed = true;
            };
        }));
    }
    ;
}
//# sourceMappingURL=NFTWorker.js.map