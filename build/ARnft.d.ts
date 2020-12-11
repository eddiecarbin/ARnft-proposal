import { NFTEntity } from "./model/NFTEntity";
import { CameraViewRenderer } from "./renderers/CamerViewRenderer";
export declare class ARnft {
    private _controllers;
    private videoRenderer;
    static readonly EVENT_SET_CAMERA: string;
    static readonly EVENT_FOUND_MARKER: string;
    static readonly EVENT_LOST_MARKER: string;
    constructor(video: CameraViewRenderer);
    initialize(): Promise<boolean>;
    addNFTEnity(name: string, entity: NFTEntity): void;
    getEntityByName(name: string): NFTEntity;
    getCameraView(): CameraViewRenderer;
    update(): void;
}
//# sourceMappingURL=ARnft.d.ts.map