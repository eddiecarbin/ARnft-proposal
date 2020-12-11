export class ARnft {
    constructor(video) {
        this._controllers = new Map();
        this.videoRenderer = video;
    }
    initialize() {
        return Promise.resolve(true);
    }
    addNFTEnity(name, entity) {
        this._controllers.set(name, entity);
    }
    getEntityByName(name) {
        if (!this._controllers.has(name))
            return null;
        return this._controllers.get(name);
    }
    getCameraView() {
        return this.videoRenderer;
    }
    update() {
        let imageData = this.videoRenderer.getImage();
        this._controllers.forEach(element => {
            element.update();
            element.process(imageData);
        });
    }
}
// events
ARnft.EVENT_SET_CAMERA = "ARNFT_SET_CAMERA_EVENT";
ARnft.EVENT_FOUND_MARKER = "ARNFT_FOUND_MARKER_EVENT";
ARnft.EVENT_LOST_MARKER = "ARNFT_LOST_MARKER_EVENT";
//# sourceMappingURL=ARnft.js.map