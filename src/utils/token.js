let KEY = 'hmtt_token'

//存储token
export const setToken = token => {
    window.localStorage.setItem(KEY,token)
}

//获取token
export const getToken = token => {
    return window.localStorage.getItem(KEY)
}

//删除token
export const removeToken = token => {
    window.localStorage.removeItem(KEY)
}
