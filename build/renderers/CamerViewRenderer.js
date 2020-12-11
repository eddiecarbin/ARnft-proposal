var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
export class CameraViewRenderer {
    constructor(video) {
        this.canvas_process = document.createElement('canvas');
        this.context_process = this.canvas_process.getContext('2d');
        this.video = video;
        let input_width = this.video.videoWidth;
        let input_height = this.video.videoHeight;
        this.vw = input_width;
        this.vh = input_height;
        var pscale = 320 / Math.max(this.vw, this.vh / 3 * 4);
        this.w = this.vw * pscale;
        this.h = this.vh * pscale;
        this.pw = Math.max(this.w, (this.h / 3) * 4);
        this.ph = Math.max(this.h, (this.w / 4) * 3);
        this.ox = (this.pw - this.w) / 2;
        this.oy = (this.ph - this.h) / 2;
        this.canvas_process.width = this.pw;
        this.canvas_process.height = this.ph;
        this.context_process.fillStyle = 'black';
        this.context_process.fillRect(0, 0, this.pw, this.ph);
    }
    getImage() {
        this.context_process.drawImage(this.video, 0, 0, this.vw, this.vh, this.ox, this.oy, this.w, this.h);
        return this.context_process.getImageData(0, 0, this.pw, this.ph);
    }
    initialize(cameraData) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            this.video = document.getElementById('video');
            if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
                var hint = {
                    "audio": false,
                    "video": {
                        facingMode: 'environment',
                        width: { min: 480, max: 640 }
                    }
                };
                navigator.mediaDevices.getUserMedia(hint).then((stream) => __awaiter(this, void 0, void 0, function* () {
                    this.video.srcObject = stream;
                    this.video = yield new Promise((resolve, reject) => {
                        this.video.onloadedmetadata = () => resolve(this.video);
                    }).then((value) => {
                        resolve(true);
                        return value;
                    }).catch((msg) => {
                        console.log(msg);
                        reject(msg);
                        return null;
                    });
                })).catch((error) => {
                    console.error(error);
                    reject(error);
                });
            }
            else {
                reject("No navigator.mediaDevices && navigator.mediaDevices.getUserMedia");
            }
        }));
    }
}
//# sourceMappingURL=CamerViewRenderer.js.map