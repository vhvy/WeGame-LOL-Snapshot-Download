import { useState } from "react";

const areaTypeList = [
    {
        idx: 0,
        name: "电信区"
    },
    {
        idx: 1,
        name: "网通区"
    },
    {
        idx: 2,
        name: "全网络大区",
    }
];


const areaData = [
    {
        id: 1,
        name: "诺克萨斯"
    },
    {
        id: 2,
        name: "祖安"
    },
    {
        id: 3,
        name: "艾欧尼亚"
    }
];

export default function useArea() {
    const [areaType, setAreaType] = useState(areaTypeList[0].idx);

    const handleAreaTypeChange = (value: number) => {
        setAreaType(value);
    }

    const [areaId, setAreaId] = useState(areaData[0].id);

    const handleAreaChange = (value: number) => {
        setAreaId(value);
    }

    return {
        areaData,
        areaTypeList,

        areaId,
        areaType,

        handleAreaTypeChange,
        handleAreaChange
    };
}