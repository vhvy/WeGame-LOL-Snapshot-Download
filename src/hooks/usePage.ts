import { useState } from "react";

export default function usePage(defaultPage = 1, defaultPageSize = 40) {
    const [page, setPage] = useState(defaultPage);
    const [pageSize, setPageSize] = useState(defaultPageSize);

    return {
        page,
        pageSize,

        setPage,
        setPageSize,
    };
}