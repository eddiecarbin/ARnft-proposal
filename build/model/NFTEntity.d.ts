export declare class NFTEntity extends EventTarget {
    onNFTDataCallback: Function;
    private _worker;
    private _workerURL;
    private _cameraURL;
    protected world: any;
    constructor(workerURL: string, cameraURL: string);
    initialize(markerURL: string): Promise<boolean>;
    found(msg: any): void;
    process(imageData: ImageData): void;
    update(): void;
    protected getArrayMatrix(value: any): any;
}
//# sourceMappingURL=NFTEntity.d.ts.map