import { NFTEntity } from "app/model/NFTEntity";
import * as BABYLON from 'babylonjs';
export class NFTRootBJS extends NFTEntity {
    constructor() {
        super(...arguments);
        this._hasFound = false;
        this.interpolationFactor = 15;
        this._frameDrops = 0;
        this._deltaAccuracy = 10;
        this.trackedMatrix = {
            // for interpolation
            delta: [
                0, 0, 0, 0,
                0, 0, 0, 0,
                0, 0, 0, 0,
                0, 0, 0, 0
            ],
            interpolated: [
                0, 0, 0, 0,
                0, 0, 0, 0,
                0, 0, 0, 0,
                0, 0, 0, 0
            ]
        };
    }
    update() {
        if (!this.world) {
            this._hasFound = false;
            this._frameDrops = 0;
            this.root.setEnabled(false);
        }
        else {
            let worldMatrix = BABYLON.Matrix.FromArray(this.getArrayMatrix(this.world));
            if (!this._hasFound) {
                this.root.setEnabled(true);
                for (var i = 0; i < 16; i++) {
                    this.trackedMatrix.interpolated[i] = this.world[i];
                }
                this._hasFound = true;
                this._lastTranslation = worldMatrix.getTranslation();
            }
            else {
                let _currentTranslation = worldMatrix.getTranslation();
                if (Math.abs(BABYLON.Vector3.Distance(_currentTranslation, this._lastTranslation)) > this._deltaAccuracy) {
                    this._frameDrops += 1;
                    if (this._frameDrops > 3) {
                        this._lastTranslation = _currentTranslation;
                    }
                    return;
                }
                this._frameDrops = 0;
                this._lastTranslation = _currentTranslation;
                for (var i = 0; i < 16; i++) {
                    this.trackedMatrix.delta[i] = this.world[i] - this.trackedMatrix.interpolated[i];
                    this.trackedMatrix.interpolated[i] = this.trackedMatrix.interpolated[i] + (this.trackedMatrix.delta[i] / this.interpolationFactor);
                }
            }
            let matrix = BABYLON.Matrix.FromArray(this.getArrayMatrix(this.trackedMatrix.interpolated));
            let rotMatrix = matrix.getRotationMatrix();
            let rotation = new BABYLON.Quaternion().fromRotationMatrix(rotMatrix);
            this.root.rotation = rotation.toEulerAngles();
            let pos = BABYLON.Vector3.TransformCoordinates(new BABYLON.Vector3(0, 0, 0), matrix);
            this.root.setAbsolutePosition(pos);
        }
    }
}
//# sourceMappingURL=NFTRootBJS.js.map