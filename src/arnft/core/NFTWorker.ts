import { ARnft } from "app/arnft/ARnft";
import { NFTEntity } from "./NFTEntity";

export class NFTWorker {

    private _dispatcher: NFTEntity;

    private worker: Worker;

    private markerURL: any;

    private _processing: boolean = false;

    private vw: number;
    private vh: number;

    private w: number;
    private h: number;

    private pw: number;
    private ph: number;

    constructor(d: NFTEntity, markerURL: string) {
        this._dispatcher = d;
        this.markerURL = markerURL;
    }

    public initialize(workerURL: string, cameraURL: string): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            this.worker = new Worker(workerURL);
            this.worker.onmessage = (ev) => {
                this.load(cameraURL).then(() => {
                    resolve(true);
                });
            };

        });
    }

    public process(imageData: ImageData) {

        if (this._processing) {
            return;
        }
        this._processing = true;
        this.worker.postMessage({ type: 'process', imagedata: imageData }, [imageData.data.buffer]);
    }

    protected load(cameraURL: string): Promise<boolean> {

        return new Promise<boolean>((resolve, reject) => {
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
                marker: this.markerURL
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
                this._processing = false;
            };
        });
    };

}