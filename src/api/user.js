import axios from 'axios'

export function getHeaderImage(query) {
    return axios({
        url: 'http://192.168.31.170:9081/api/user/wxCode',
        method: 'get',
        params: query
    })
}
