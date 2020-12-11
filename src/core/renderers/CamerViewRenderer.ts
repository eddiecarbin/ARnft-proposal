

export interface ICameraViewRenderer {
    getImage(): ImageData;
}

export class CameraViewRenderer implements ICameraViewRenderer {


    private canvas_process: HTMLCanvasElement;

    private context_process: CanvasRenderingContext2D;

    public video: HTMLVideoElement;

    private vw: number;
    private vh: number;

    private w: number;
    private h: number;

    private pw: number;
    private ph: number;

    private ox: number;
    private oy: number;

    constructor(video: HTMLVideoElement) {
        this.canvas_process = document.createElement('canvas');
        this.context_process = this.canvas_process.getContext('2d');

        this.video = video;
        let input_width = this.video.videoWidth;
        let input_height = this.video.videoHeight;

        this.vw = input_width;
        this.vh = input_height;

        var pscale = 320 / Math.max(this.vw, this.vh / 3 * 4);

        this.w = this.vw * pscale;
        this.h = this.vh * pscale;
        this.pw = Math.max(this.w, (this.h / 3) * 4);
        this.ph = Math.max(this.h, (this.w / 4) * 3);
        this.ox = (this.pw - this.w) / 2;
        this.oy = (this.ph - this.h) / 2;

        this.canvas_process.width = this.pw;
        this.canvas_process.height = this.ph;

        this.context_process.fillStyle = 'black';
        this.context_process.fillRect(0, 0, this.pw, this.ph);
    }

    public getImage(): ImageData {
        this.context_process.drawImage(this.video, 0, 0, this.vw, this.vh, this.ox, this.oy, this.w, this.h);
        return this.context_process.getImageData(0, 0, this.pw, this.ph);
    }

    public initialize(cameraData: any): Promise<boolean> {
        return new Promise<boolean>(async (resolve, reject) => {
            this.video = document.getElementById('video') as HTMLVideoElement;
            if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
                var hint: any = {
                    "audio": false,
                    "video": {
                        facingMode: 'environment',
                        width: { min: 480, max: 640 }
                    }
                };

                navigator.mediaDevices.getUserMedia(hint).then(async (stream) => {
                    this.video.srcObject = stream;
                    this.video = await new Promise<HTMLVideoElement>((resolve, reject) => {
                        this.video.onloadedmetadata = () => resolve(this.video);
                    }).then((value) => {
                        resolve(true);
                        return value;
                    }).catch((msg) => {
                        console.log(msg);
                        reject(msg);
                        return null;
                    });
                }).catch((error) => {
                    console.error(error);
                    reject(error);
                });

            }
            else {
                reject("No navigator.mediaDevices && navigator.mediaDevices.getUserMedia");
            }
        });

    }
}