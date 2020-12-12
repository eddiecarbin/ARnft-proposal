import { NFTWorker } from "./NFTWorker";


export class NFTEntity extends EventTarget {

    public onNFTDataCallback!: Function;

    private _worker: NFTWorker;

    private _workerURL: string;

    private _cameraURL: string;

    protected world: any;

    protected _markerURL : string;

    constructor(markerURL : string) {
        super();
        this._markerURL = markerURL;
    }

    public initialize(cameraData : string): Promise<boolean> {
        this._cameraURL = cameraData;
        this._worker = new NFTWorker(this);
        return this._worker.initialize(this._workerURL, this._cameraURL, this._markerURL);
    }

    public found(msg: any): void {
        if (!msg) {
            this.world = null;
        } else {
            this.world = JSON.parse(msg.matrixGL_RH);
        }
    }

    public process(imageData: ImageData) { 
        this._worker.process(imageData);
    }

    public update(): void {

    }

    protected getArrayMatrix(value: any): any {
        var array: any = [];
        for (var key in value) {
            array[key] = value[key]; //.toFixed(4);
        }
        return array;
    }
}