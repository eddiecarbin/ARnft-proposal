import { NFTEntity } from "./model/NFTEntity";
import { CameraViewRenderer } from "./renderers/CamerViewRenderer";

export class ARnft {
    private _controllers: Map<string, NFTEntity> = new Map<string, NFTEntity>();

    private videoRenderer: CameraViewRenderer;

    // events
    public static readonly EVENT_SET_CAMERA: string = "ARNFT_SET_CAMERA_EVENT";
    public static readonly EVENT_FOUND_MARKER: string = "ARNFT_FOUND_MARKER_EVENT";
    public static readonly EVENT_LOST_MARKER: string = "ARNFT_LOST_MARKER_EVENT";

    constructor(video: CameraViewRenderer) {
        this.videoRenderer = video;
    }

    public initialize(): Promise<boolean> {
        return Promise.resolve(true);
    }

    public addNFTEnity(name: string, entity: NFTEntity): void {
        this._controllers.set(name, entity);
    }

    public getEntityByName(name: string): NFTEntity {
        if (!this._controllers.has(name))
            return null;

        return this._controllers.get(name);
    }

    public getCameraView(): CameraViewRenderer {
        return this.videoRenderer;
    }

    public update(): void {
        let imageData = this.videoRenderer.getImage();
        this._controllers.forEach(element => {
            element.update();
            element.process(imageData);
        });
    }
}