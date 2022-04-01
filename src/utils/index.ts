import * as zip from "@zip.js/zip.js";
import { message } from "antd";

export interface ImgBlob {
    blob: Blob,
    name: string
}

export const downloadImg = async (list: string[]) => {
    const tasks = list.map(src => fetch(src).then(res => res.blob()));

    return Promise.all(tasks);
}

export const downloadZipFile = async (list: ImgBlob[]) => {

    const msg = message.loading("正在生成压缩包...", 0);
    let zipWriter: zip.ZipWriter | null = new zip.ZipWriter(new zip.Data64URIWriter("application/zip"));


    let blobURL;
    try {
        for (let item of list) {
            await zipWriter.add(item.name, new zip.BlobReader(item.blob));
        }

        blobURL = await zipWriter.close(new Uint8Array, {
            onprogress: (v) => {
                console.log(v);
            }
        });
        zipWriter = null;
        msg();
        message.success("压缩包生成成功，稍后下载将开始...");

        if (blobURL) {
            const anchor = document.createElement("a");
            const clickEvent = new MouseEvent("click");
            anchor.href = blobURL;
            anchor.download = "图包合集";
            anchor.dispatchEvent(clickEvent);
        }

    } catch (err) {
        console.log(err);
    }
}