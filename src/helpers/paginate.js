export const paginate = async (
    model,
    pageSize = 1,
    pageLimit = 5,
    search = {},
    order = [],
    transform,
) => {
    try {
        const limit = Number(pageLimit);
        const page = Number(pageSize);

        let options = {
            offset: getOffset(page, limit),
            limit: limit,
        };

        if (Object.keys(search).length) {
            options = { ...options, ...search }; // Correctly merge search into options
        }

        if (order && order.length) {
            options.order = order; // Set the order directly
        }

        let { count, rows } = await model.findAndCountAll(options); // Pass the options correctly

        if (transform && typeof transform === "function") {
            rows = transform(rows);
        }

        return {
            previousPage: getPreviousPage(page),
            currentPage: page,
            nextPage: getNextPage(page, limit, count),
            count,
            limit: limit,
            data: rows,
        };
    } catch (error) {
        Promise.reject(new Error(error.message));
    }
};

const getOffset = (page, limit) => {
    return page * limit - limit;
};

const getNextPage = (page, limit, total) => {
    if (total / limit > page) {
        return page + 1;
    }

    return null;
};

const getPreviousPage = (page) => {
    if (page <= 1) {
        return null;
    }
    return page - 1;
};
