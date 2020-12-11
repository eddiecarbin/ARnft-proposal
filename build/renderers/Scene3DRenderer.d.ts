export interface IScene3DRenderer {
}
export declare class Scene3DRenderer implements IScene3DRenderer {
    canvas_draw: HTMLCanvasElement;
    initialize(sceneData: any): Promise<boolean>;
    update(): void;
}
//# sourceMappingURL=Scene3DRenderer.d.ts.map