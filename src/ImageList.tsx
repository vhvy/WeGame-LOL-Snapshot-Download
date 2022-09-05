import React from "react";
import { ImageData, getActionNameAndColor } from "@/utils/index";
import { Image, Tag } from "antd";

interface Props {
    list: ImageData[]
}

const getKillTag = (item: ImageData) => {

    const { color, name: content } = getActionNameAndColor(item);

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