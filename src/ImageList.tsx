import React from "react";
import { ImageData } from "@/hooks/useQuery";
import { Image } from "antd";

interface Props {
    list: ImageData[]
}

const ImageList: React.FC<Props> = ({ list }) => {
    return (
        <div className="image-container">
            <div className="image-list">
                <Image.PreviewGroup>
                    {
                        list.map(item => {
                            return <Image className="snapshot" src={item.src} key={item.id} />;
                        })
                    }
                </Image.PreviewGroup>
            </div>
        </div>
    );
};

export default ImageList;