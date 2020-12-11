import { NFTEntity } from "./NFTEntity";
export declare class NFTWorker {
    private _dispatcher;
    private worker;
    private markerData;
    private _hadProcessed;
    private vw;
    private vh;
    private w;
    private h;
    private pw;
    private ph;
    constructor(d: NFTEntity);
    initialize(workerURL: string, cameraURL: string, markerURL: string): Promise<boolean>;
    process(imageData: ImageData): void;
    protected load(cameraURL: string): Promise<boolean>;
}
//# sourceMappingURL=NFTWorker.d.ts.map