/*
 * @Descripttion:
 * @version: 1.0.0
 * @Author: mirror29
 * @LastEditors: mirror29
 * @LastEditTime: 2021-04-27 17:44:42
 */
import request from "../utils/axios"

/** 获取用户册别信息 */
export const userCourseInfo = () =>
  request({
    url: "/bkc/user/visit/book",
    method: "get",
  })

/**
 * 获取列表筛选条件
 * @method documents/filters?
 * @param params
 * @returns {}
 */
export const dataFilters = (params: any) =>
  request({
    url: "/documents/filters",
    method: "get",
    params,
  })

/** 学段学科数据 */
export const subjectsData = () =>
  request({
    url: "/subjects",
    method: "get",
  })

/** 保存用户册别信息 */
export const saveUserCourseInfo = (data: any) =>
  request({
    url: "/bkc/user/visit/book/sync",
    method: "post",
    data,
  })

/** 获取首页信息 */
export const bkcIndexData = (book_id: String | Number) =>
  request({
    url: `bkc/home/info?book_id=${book_id}`,
    method: "get",
  })
