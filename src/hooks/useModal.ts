import { useState } from "react";

export default function useModal(): [boolean, Function, Function] {
    const [isModalVisible, setVisible] = useState(false);

    const hideModal = () => {
        setVisible(false);
    }

    const showModal = () => {
        setVisible(true);
    }

    return [
        isModalVisible,
        showModal,
        hideModal,
    ];
}