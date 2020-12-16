import { ARnft } from "app/arnft/ARnft";
import { NFTEntity } from "./NFTEntity";

export class NFTWorker {

    private _dispatcher: NFTEntity;

    private worker: Worker;

    private markerURL: any;

    private _processing: boolean = false;

    private vw: number;
    private vh: number;

    constructor(d: NFTEntity, markerURL: string, w: number, h: number) {
        this._dispatcher = d;
        this.markerURL = markerURL;
        this.vw = w;
        this.vh = h;
    }

    public initialize(workerURL: string, cameraURL: string): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            this.worker = new Worker(workerURL);
            this.worker.onmessage = (ev) => {
                this.load(cameraURL).then(() => {
                    // Overwrite load onmessage with search onmessage
                    this.worker.onmessage = (ev) => {

                        // console.log("response found = " + (ev.data.type == "found"));
                        let msg: any = (ev.data.type == "found") ? ev.data : null;
                        this._dispatcher.found(msg);
                        this._processing = false;
                    };
                    //
                    resolve(true);
                });
            };

        });
    }

    public process(imageData: ImageData) {

        if (this._processing) {
            // console.log("because i am sooooooooooooo slow")
            return;
        }
        this._processing = true;

        //this.worker.postMessage({ type: 'process', imagedata: imageData }, [imageData.data.buffer]);
        this.worker.postMessage({ type: 'process', imagedata: imageData });
    }

    protected load(cameraURL: string): Promise<boolean> {

        return new Promise<boolean>((resolve, reject) => {

            var pscale = 320 / Math.max(this.vw, this.vh / 3 * 4);

            let w: number = this.vw * pscale;
            let h: number = this.vh * pscale;
            let pw: number = Math.max(w, (h / 3) * 4);
            let ph: number = Math.max(h, (w / 4) * 3);

            this.worker.postMessage({
                type: 'load',
                pw: pw,
                ph: ph,
                camera_para: cameraURL,
                marker: this.markerURL
            });

            this.worker.onmessage = (ev) => {
                var msg = ev.data;
                switch (msg.type) {
                    case 'loaded': {
                        var proj = JSON.parse(msg.proj);
                        // this._dispatcher.dispatchEvent(new CustomEvent(ARnft.EVENT_SET_CAMERA, proj));
                        break;
                    }
                    case "endLoading": {
                        if (msg.end == true)
                            resolve(true);
                        break;
                    }
                }
                this._processing = false;
            };
        });
    };

}