import { ARnft } from "app/ARnft";
import { NFTEntity } from "./NFTEntity";

export class NFTWorker {

    private _dispatcher: NFTEntity;

    private worker: Worker;

    private markerData: any;

    private _processing: boolean = false;

    private vw: number;
    private vh: number;

    private w: number;
    private h: number;

    private pw: number;
    private ph: number;

    constructor(d: NFTEntity) {
        this._dispatcher = d;
    }
    
    public initialize( workerURL:string, cameraURL: string, markerURL: string): Promise<boolean> {
        // this.markerData = data.markerData;
        return new Promise<boolean>(async (resolve, reject) => {
            this.worker = new Worker(workerURL);
            this.worker.onmessage = async (ev) => {
                await this.load(cameraURL).then(() => {
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

    protected load(cameraURL:string): Promise<boolean> {

        return new Promise<boolean>(async (resolve, reject) => {
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
                this._processing = false;
            };
        });
    };

}