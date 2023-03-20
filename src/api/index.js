import axios from "@/api/request";

/**
 * 获取热榜分类数据
 * @param {string} type 热榜分类名称
 * @param {boolean} isNew 是否拉取最新数据
 * @returns
 */
export const getHotLists = (type, isNew) => {
  return axios({
    method: "GET",
    url: `/${type}${isNew ? "/new" : "/"}`,
  });
};
