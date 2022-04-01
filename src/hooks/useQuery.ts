import { useState } from "react";

export interface ImageData {
    id: number,
    src: string
};

const useQuery = (): [boolean, ImageData[], number, (() => Promise<void>)] => {

    const [isLoading, setLoading] = useState(false);

    const [total, setTotal] = useState(0);

    const [list, setList] = useState<ImageData[]>([]);

    const getData = async () => {
        setLoading(true);



        setTimeout(() => {
            let list = [];
            for (let i = 400; i < 450; i++) {
                list.push({
                    id: i,
                    src: `https://cdn.jsdelivr.net/gh/uxiaohan/GitImgTypecho/Acg/api.vvhan.com[${i}].jpg`
                });
            }
            
            setList(list);
            setLoading(false);
            setTotal(100);
        }, 1200);
    }

    return [
        isLoading,
        list,
        total,
        getData
    ];
}

export default useQuery;