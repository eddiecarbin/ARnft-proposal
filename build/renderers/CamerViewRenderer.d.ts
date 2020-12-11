export declare class CameraViewRenderer {
    private canvas_process;
    private context_process;
    video: HTMLVideoElement;
    private vw;
    private vh;
    private w;
    private h;
    private pw;
    private ph;
    private ox;
    private oy;
    constructor(video: HTMLVideoElement);
    getImage(): ImageData;
    initialize(cameraData: any): Promise<boolean>;
}
//# sourceMappingURL=CamerViewRenderer.d.ts.map