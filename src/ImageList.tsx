import React from "react";
import { ImageData } from "@/App";
import { Image, Tag } from "antd";

interface Props {
    list: ImageData[]
}


enum ActionType {
    Kill = 103,
    QuadraKill = 104,
    PentaKill = 105,
    Legendary = 208,
}

const getKillTag = (item: ImageData) => {
    let content: string;
    let color = "blue";
    switch (item.action_type) {
        case ActionType.QuadraKill:
            content = "四杀";
            color = "#87d068";
            break;
        case ActionType.PentaKill:
            content = "五杀";
            color = "#f50";
            break;
        case ActionType.Legendary:
            content = item.kill_count + "连杀";
            color = "#2db7f5";
            break;
        case ActionType.Kill:
        default:
            content = item.kill_count + "杀";
            break;
    }

    return (
        <Tag style={{ marginRight: 0 }} color={color}>
            {content}
        </Tag>
    );
}

const ImageList: React.FC<Props> = ({ list }) => {

    return (
        <div className="image-container">
            <div className="image-list">
                <Image.PreviewGroup>
                    {
                        list.map(item => {
                            return (
                                <div className="snapshot-box" key={item.id}>
                                    <Image className="snapshot" src={item.src} key={item.id} />
                                    <div className="snapshot-info flex flex-between">
                                        <Tag>{item.time}</Tag>
                                        {getKillTag(item)}
                                    </div>
                                </div>
                            );
                        })
                    }
                </Image.PreviewGroup>
            </div>
        </div>
    );
};

export default ImageList;