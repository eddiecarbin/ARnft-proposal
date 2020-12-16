import { INFTEntity } from "./core/NFTEntity";
import { ICameraViewRenderer } from "./core/renderers/CamerViewRenderer";

export class ARnft {

    private count: number = 0;

    private _controllers: Map<string, INFTEntity> = new Map<string, INFTEntity>();

    private videoRenderer: ICameraViewRenderer;

    private _cameraDataURL: string;

    private _workerURL: string;

    private _fps: number = 15;

    private _lastTime: number = 0;

    // events
    public static readonly EVENT_SET_CAMERA: string = "ARNFT_SET_CAMERA_EVENT";
    public static readonly EVENT_FOUND_MARKER: string = "ARNFT_FOUND_MARKER_EVENT";
    public static readonly EVENT_LOST_MARKER: string = "ARNFT_LOST_MARKER_EVENT";

    constructor(video: ICameraViewRenderer, camData: string, worker: string) {
        this.videoRenderer = video;
        this._cameraDataURL = camData;
        this._workerURL = worker;
        // set default fps at 15
        this.setFPS(this._fps);
    }

    public addNFTEntity(entity: INFTEntity, name?: string): INFTEntity {
        // let entity = new NFTEntity(node, markerDataURL, this.videoRenderer.getWidth(), this.videoRenderer.getHeight());

        if (!name)
            name = "entity-" + this.count++;

        this._controllers.set(name, entity);
        return entity;
    }

    public getEntityByName(name: string): INFTEntity {
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

    public initialize(): Promise<boolean> {

        let promises: Promise<boolean>[] = [];
        this._controllers.forEach(element => {
            promises.push(element.initialize(this._workerURL, this._cameraDataURL));
        });

        // let promises: Promise<boolean>[] = this._controllers.map()

        return Promise.all(promises).then(() => {
            return true;
        });
    }

    public update(): void {
        let time: number = Date.now();
        let imageData: ImageData;
        if ((time - this._lastTime) > this._fps) {
            imageData = this.videoRenderer.getImage();
            this._lastTime = time;
        }

        this._controllers.forEach(element => {
            element.update();
            if (imageData)
                element.process(imageData);
        });
    }
}