import { AbstractMesh } from "@babylonjs/core/Meshes/abstractMesh";
import { IMediaNode, NFTEntity } from "./core/NFTEntity";
import { CameraViewRenderer, ICameraViewRenderer } from "./core/renderers/CamerViewRenderer";

export class ARnft {
    private _controllers: Map<string, NFTEntity> = new Map<string, NFTEntity>();

    private videoRenderer: ICameraViewRenderer;

    private cameraData: string;

    private workerURL: string;

    private test: AbstractMesh;

    private _fps: number = 15;

    private _lastTime: number = 0;

    // events
    public static readonly EVENT_SET_CAMERA: string = "ARNFT_SET_CAMERA_EVENT";
    public static readonly EVENT_FOUND_MARKER: string = "ARNFT_FOUND_MARKER_EVENT";
    public static readonly EVENT_LOST_MARKER: string = "ARNFT_LOST_MARKER_EVENT";

    constructor(video: ICameraViewRenderer, camData: string, worker?: string) {
        this.videoRenderer = video;
        this.cameraData = camData;
        this.workerURL = worker;
        // set default fps at 15
        this.setFPS(this._fps);
    }

    public addNFTEnity(node: IMediaNode, markerDataURL: string): NFTEntity {
        let entity = new NFTEntity(node, markerDataURL);
        this._controllers.set("", entity);
        return entity;
    }

    public getEntityByName(name: string): NFTEntity {
        if (!this._controllers.has(name))
            return null;

        return this._controllers.get(name);
    }

    public getCameraView(): ICameraViewRenderer {
        return this.videoRenderer;
    }

    public setFPS(value: number): void {
        this._fps = 1000 / value;
    }

    public initialize(workerURL: string): Promise<boolean> {

        const promises: Promise<boolean>[] = [];
        this._controllers.forEach(element => {
            promises.push(element.initialize(workerURL, this.cameraData));
        });

        return Promise.all(promises).then(() => {
            return true;
        });
    }

    public update(): void {
        let time: number = Date.now();
        let imageData: ImageData;

        if (time - this._lastTime > this._fps) {
            imageData = this.videoRenderer.getImage();
        }
        this._lastTime = time;

        this._controllers.forEach(element => {
            element.update();
            if (imageData)
                element.process(imageData);
        });
    }
}