

export interface IScene3DRenderer {
    update(): void;
}

export class Scene3DRenderer implements IScene3DRenderer {

    public canvas_draw!: HTMLCanvasElement;

    public initialize(sceneData: any): Promise<boolean> {

        this.canvas_draw = document.getElementById("canvas") as HTMLCanvasElement;

        return Promise.reject(false);
    }

    public update(): void {

    }
}