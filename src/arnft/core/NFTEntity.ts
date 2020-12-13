import { NFTWorker } from "./NFTWorker";

export interface IMediaNode {
    update():void;
    found(value:any):void;
}

export class NFTEntity extends EventTarget {


    private _nodes: IMediaNode[] = [];

    public onNFTDataCallback!: Function;

    private _worker: NFTWorker;

    private _workerURL: string;

    private _cameraURL: string;

    protected orientationMatrix: any;

    protected _markerURL : string;

    constructor( node : IMediaNode, markerURL : string) {
        super();
        this._markerURL = markerURL;
        this._worker = new NFTWorker(this, this._markerURL);

        this._nodes.push(node);
    }

    public initialize(workerURL : string, cameraData : string): Promise<boolean> {
        this._workerURL = workerURL;
        this._cameraURL = cameraData;
        return this._worker.initialize(this._workerURL, this._cameraURL);
    }

    public found(msg: any): void {
        this.orientationMatrix = (msg)? JSON.parse(msg.matrixGL_RH): null;
        this._nodes.forEach(element => {
            element.found(this.orientationMatrix);
        });
    }

    public process(imageData: ImageData) { 
        this._worker.process(imageData);
    }

    public update(): void {
        //  loop through nodes and update
        this._nodes.forEach(element => {
            element.update();
        });
    }
}