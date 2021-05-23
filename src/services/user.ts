import http from './http';

export interface LoginResponse {
  userId: number;
  username: string;
  access_token: string;
}

class UserService {
  /**
   * 用户登录
   * @param username 账号
   * @param password 密码
   * @param shopId 门店ID
   * @returns 
   */
  login(username: string, password: string, shopId: string) {
    return http.post<LoginResponse>('/auth/login', { username, password, shopId }).then((data) => {
      http.setAuthorizationToken(data.access_token);
    });
  }

  /**
   * 新增用户
   * @param username 账号
   * @param password 密码
   * @returns 
   */
  createUser(username: string, password: string) {
    return http.post('/user', { username, password });
  }

  /**
   * 获取门店列表
   * @returns 
   */
  getShopList() {
    return http.get('/shop');
  }
}

export default new UserService(); 