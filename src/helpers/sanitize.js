import { filterXSS } from "xss";
export const sanitize = (data) => {
    if (typeof data === "string")
        data = filterXSS(data, {
            whiteList: {},
            stripIgnoreTag: true,
            stripIgnoreTagBody: ["script"],
        });
    if (typeof data === "object") {
        if (data.length) {
            data.forEach((value, index) => {
                if (typeof value === "string")
                    data[index] = filterXSS(value, {
                        whiteList: {},
                        stripIgnoreTag: true,
                        stripIgnoreTagBody: ["script"],
                    });
            });
        } else {
            Object.keys(data).forEach((key) => {
                if (typeof data[key] === "string")
                    data[key] = filterXSS(data[key], {
                        whiteList: {},
                        stripIgnoreTag: true,
                        stripIgnoreTagBody: ["script"],
                    });
            });
        }
    }
    return data;
};
