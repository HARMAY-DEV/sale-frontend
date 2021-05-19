import http from './http';

class UserService {
  /**
   * 用户登录
   * @param username 账号
   * @param password 密码
   * @param shopId 门店ID
   * @returns 
   */
  login(username: string, password: string, shopId: string) {
    return http.post('/auth/login', { username, password });
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
    return http.get('/');
  }
}

export default new UserService(); 