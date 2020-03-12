/*
 * @Date: 2020-02-18 11:46:40
 * @LastEditors: gxm
 * @LastEditTime: 2020-03-11 21:11:29
 * @FilePath: \webfrontend\src\network\home.js
 */
import {request} from "./request";

export function addGoodsTypeInfo(data) {
  return request({
    method:'post',
    url:'/api/goods',
    data:data
  })
}

export function updateGoodsTypeInfo(id,goodsPrice) {
  return request({
    method:'put',
    url:'/api/goods/'+id,
    params:{
      goodsPrice:goodsPrice
    }
  })
}

export function delGoodsTypeInfo(id){
  return request({
    method:'delete',
    url:'/api/goods/'+id,
  })
}

export function getCustomerInfos() {
  return request({
    method:'get',
    url:'/api/customers',
  })
}
export function addCustomerInfo(data) {
  return request({
    method:'post',
    url:'/api/customers',
    data: data
  })
}
export function addSupplierInfo(data){
  return request({
    method:'post',
    url:'/api/suppliers',
    data:data
  })
}
export function addSalesInfo(data){
  return request({
    method:'post',
    url:'/api/sales',
    data:data
  })
}