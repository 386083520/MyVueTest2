import { makeMap } from "../../../shared/util";

export const isUnaryTag = makeMap( // 是否是一元标签
    'area,base,br,col,embed,frame,hr,img,input,isindex,keygen,' +
    'link,meta,param,source,track,wbr'
)

export const canBeLeftOpenTag = makeMap( // 以下标签如果只写了左侧的tag，浏览器会自动补全
    'colgroup,dd,dt,li,options,p,td,tfoot,th,thead,tr,source'
)
