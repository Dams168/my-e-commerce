export const paging = (page, limit) => {
    const take = +limit;
    const skip = (page - 1) * take;
    return { take, skip };
}

export const Pageable = (data, paging) => {
    return {
        data,
        paging
    }
}