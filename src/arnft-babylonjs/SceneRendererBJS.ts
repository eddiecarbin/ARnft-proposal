import { Camera } from "@babylonjs/core/Cameras/camera";
import { Engine } from "@babylonjs/core/Engines/engine";
import { ShadowGenerator } from "@babylonjs/core/Lights/Shadows/shadowGenerator";
import { Color3, Color4, Vector3 } from "@babylonjs/core/Maths/math";
import { Scene } from "@babylonjs/core/scene";
import { IShadowLight, DirectionalLight, HemisphericLight } from "@babylonjs/core/Lights";

export class SceneRendererBJS {

    public canvas_draw: HTMLCanvasElement;


    private engine: Engine;

    private _scene: Scene;

    public get scene(): Scene {
        return this._scene;
    }

    // exlude these below
    public camera: Camera;
    public light: IShadowLight;
    public shadowGenerator: ShadowGenerator;
    
    constructor ( canvasElement : HTMLCanvasElement, scene?:Scene ){
        this.canvas_draw = canvasElement;

        this._scene = scene;
    }

    public initialize(): Promise<boolean> {

        console.log("Scene3DRendererBabylon");
        if ( this._scene )
            return Promise.resolve(true);

        return new Promise<boolean>(async (resolve, reject) => {


            this.engine = new Engine(this.canvas_draw, true, {
                preserveDrawingBuffer: true,
                stencil: true
            });

            this._scene = new Scene(this.engine);
            this._scene.clearColor = new Color4(0, 0, 0, 0);
            this._scene.ambientColor = new Color3(1, 1, 1);
            this._scene.useRightHandedSystem = true;

            this.camera = new Camera('camera1', new Vector3(0, 0, 0), this._scene);

            // lights should come out.  allow the user to place lights
            this.light = new DirectionalLight('light', new Vector3(0, -10, -20), this._scene);
            this.light.position.y = 100;
            this.light.position.z = -250;
            this.light.intensity = 2;
            this.shadowGenerator = new ShadowGenerator(1024, this.light)
            // this.shadowGenerator.useBlurExponentialShadowMap = true;
            // this.shadowGenerator.blurScale = 2;
            this.shadowGenerator.setDarkness(0.3);

            this.camera.fovMode = Camera.FOVMODE_VERTICAL_FIXED;
            this.camera.attachControl(this.canvas_draw, true);

            // lights should come out.  allow the user to place lights
            var light2 = new HemisphericLight("HemiLight", new Vector3(0, 1, 0), this._scene);
            light2.intensity = 0.3;
            resolve(true);

        });
    }

    public update(): void {
        this.scene.render();
    }
}