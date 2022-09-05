import * as zip from "@zip.js/zip.js";
import { message } from "antd";

export interface ImgBlob {
    blob: Blob,
    name: string
}


export interface ImageData {
    id: string,
    src: string,
    time: string,
    kill_count: number,
    action_type: number
};



interface Image {
    file_url: string,
    commit_time: string,
    killed_enemy_count: number,
    action_type: number
};

const getImgId = (src: string): string => {
    const idx = src.lastIndexOf("/");
    return src.slice(idx + 1);
}

interface ImageResponse {
    list: ImageData[],
    total: number
};

export enum ActionType {
    Kill = 103,
    QuadraKill = 104,
    PentaKill = 105,
    Legendary = 208,
}

interface ActionNameAndColor {
    name: string,
    color: string
}

export const getActionNameAndColor = (item: ImageData): ActionNameAndColor => {
    switch (item.action_type) {
        case ActionType.QuadraKill:
            return {
                name: "四杀",
                color: "#87d068"
            };
        case ActionType.PentaKill:
            return {
                name: "五杀",
                color: "#f50"
            };
        case ActionType.Legendary:
            return {
                name: item.kill_count + "连杀",
                color: "2db7f5"
            };
        case ActionType.Kill:
        default:
            return {
                name: item.kill_count + "杀",
                color: "blue"
            };
    }
}


export const getImages = async (
    qq: string,
    areaId: number,
    page: number,
    pageSize: number
): Promise<ImageResponse> => {
    const response = await fetch("https://www.wegame.com.cn/api/v1/wegame.pallas.game.LolBattle/GetUserSnapshot", {
        method: "POST",
        body: JSON.stringify({
            "account_type": 1,
            "id": qq,
            "area": areaId,
            "action_type": 0,
            "offset": (page - 1) * pageSize,
            "limit": pageSize,
            "from_src": "lol_helper"
        })
    });

    const { total, result, snapshots } = await response.json();

    if (result.error_code == 0) {
        const list = snapshots.map((item: Image) => {
            return {
                id: getImgId(item.file_url),
                src: item.file_url + "/0",
                time: item.commit_time,
                kill_count: item.killed_enemy_count,
                action_type: item.action_type
            };
        });

        return {
            list,
            total
        };
    } else {
        throw new Error(result.error_message);
    }
}

export const downloadImg = async (list: string[]) => {
    const tasks = list.map(src => fetch(src).then(res => res.blob()));

    return Promise.all(tasks);
}

export const downloadZipFile = async (list: ImgBlob[]) => {

    const msg = message.loading("正在生成压缩包...", 0);
    let zipWriter = new zip.ZipWriter(new zip.Data64URIWriter("application/zip"));


    let blobURL;
    try {
        for (let item of list) {
            await zipWriter.add(item.name, new zip.BlobReader(item.blob));
        }

        blobURL = await zipWriter.close(new Uint8Array, {
            // onprogress: (v) => {
            //     console.log(v);
            // }
        });
        msg();
        message.success("压缩包生成成功，稍后下载将开始...");

        if (blobURL) {
            const anchor = document.createElement("a");
            const clickEvent = new MouseEvent("click");
            anchor.href = blobURL;
            anchor.download = "图包合集" + new Date().toLocaleString();
            anchor.dispatchEvent(clickEvent);
        }

    } catch (err) {
        console.log(err);
    }
}