

export interface IScene3DRenderer {
    update(): void;
}

export class Scene3DRenderer implements IScene3DRenderer {

    public canvas_draw: HTMLCanvasElement;

    constructor(canvasID: string) {
        //"canvas"
        this.canvas_draw = document.getElementById(canvasID) as HTMLCanvasElement;
    }

    public initialize(sceneData: any): Promise<boolean> {
        return Promise.reject(false);
    }

    public update(): void {

    }
}