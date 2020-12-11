import { NFTWorker } from "./NFTWorker";
export class NFTEntity extends EventTarget {
    constructor(workerURL, cameraURL) {
        super();
        this._workerURL = workerURL;
        this._cameraURL = cameraURL;
    }
    initialize(markerURL) {
        this._worker = new NFTWorker(this);
        return this._worker.initialize(this._workerURL, this._cameraURL, markerURL);
    }
    found(msg) {
        if (!msg) {
            this.world = null;
        }
        else {
            this.world = JSON.parse(msg.matrixGL_RH);
        }
    }
    process(imageData) {
        this._worker.process(imageData);
    }
    update() {
    }
    getArrayMatrix(value) {
        var array = [];
        for (var key in value) {
            array[key] = value[key]; //.toFixed(4);
        }
        return array;
    }
}
//# sourceMappingURL=NFTEntity.js.map