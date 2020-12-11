import { NFTEntity } from "./core/NFTEntity";
import { CameraViewRenderer, ICameraViewRenderer } from "./core/renderers/CamerViewRenderer";

export class ARnft {
    private _controllers: Map<string, NFTEntity> = new Map<string, NFTEntity>();

    private videoRenderer: ICameraViewRenderer;

    private cameraData : string;

    private workerURL : string;

    // events
    public static readonly EVENT_SET_CAMERA: string = "ARNFT_SET_CAMERA_EVENT";
    public static readonly EVENT_FOUND_MARKER: string = "ARNFT_FOUND_MARKER_EVENT";
    public static readonly EVENT_LOST_MARKER: string = "ARNFT_LOST_MARKER_EVENT";

    constructor(video: ICameraViewRenderer, camData : string, worker?:string) {
        this.videoRenderer = video;
        this.cameraData = camData;
        this.workerURL = worker;
    }

    public addNFTEnity(name: string, entity: NFTEntity): NFTEntity {
        this._controllers.set(name, entity);
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

    public initialize(): Promise<boolean> {

        //  loop through 
        return Promise.resolve(true);
    }
    
    public update(): void {
        let imageData = this.videoRenderer.getImage();
        this._controllers.forEach(element => {
            element.update();
            element.process(imageData);
        });
    }
}