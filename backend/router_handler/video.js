const res = require("express/lib/response");
const { generateToken04 } = require("../utils/server/zegoServerAssistant");
/**
 * @api {post} /videoToken/get 获取视频通话token
 * @apiDescription 获取视频通话token(doctor,patient)
 * @apiName getVideoToken
 * @apiGroup video
 * @apiBody {string} userId 唯一的userId
 * @apiHeaderExample {json} Header-Example:
 *     {
 *       "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkb2NfaWQiOjYsImF2YXRhciI6Imh0dHBzOi8vZHh5LWltZy1zZXQtMTMwNTMzNjc2OS5jb3MuYXAtYmVpamluZy5teXFjbG91ZC5jb20vMjAyMjEyMDYxMDI5NTQucG5nIiwicGFzc3dvcmQiOiIiLCJ0aXRsZV9pZCI6MSwiZGVwdF9pZCI6MSwiZG9jX25hbWUiOiLkuIHlv4PlrpwiLCJlbWFpbCI6IjEzNjM4Njc5NzVAcXEuY29tIiwicGhvbmUiOiIxOTg2MTM3NjAwOSIsImRlc2NyaXB0aW9uIjoi5LiT5pS757K-56We57G755a-55eFLOaKkemDgeeXhyzni4LouoHnl4cs57K-56We5YiG6KOC55eH562JIiwiZG9jX3NwYXJlIjoxNSwidGl0bGVfbmFtZSI6IuWMu-W4iCIsImRlcHRfbmFtZSI6IueyvuelnuenkSIsImlhdCI6MTY4MDY4MjI4NywiZXhwIjoxNzEyMjE4Mjg3fQ.ApTVhub_vd226XOwKUlFQOjVHkd3WXjVJe7Ee8wZbzM"
 *     }
 * {
 *     //All required
 *     userId:"111"
 * }
 * @apiSuccessExample {json} Return Content:
{
    "status": 0,
    "message": "获取token成功",
    "token": "04AAAAAGRZCU4AEDk2Y3prOGY2MnNiMjczdXgAgLpAGwud7U9h5ddgrumZ0T/Tc33VUeHDDm7uc+puQyhy2Y4FkLdTSyVOhfExsIkORkuLcN2gb1yxDsOizkE2BkM/WR7rhJFNyl/K5w0A8BzXjTyZH5OSxDgsnv7kMwQL+qkGSujTvEz0tmIWg5l1vki/5IMflaeJiXfVRoa2IT63"
}
 * @apiVersion 1.0.0
 */
exports.getVideoToken = async (req, res) => {
  try {
    const appID = 1692162542; // type: number

    // 请将 serverSecret 修改为你的 serverSecret，serverSecret 为 string
    // 举例：'sdfsdfsd323sdfsdf'
    const serverSecret = "18c9bc7e7b7c0af9d263316f99c3d9ff"; // type: 32 byte length string

    // 请将 userId 修改为用户的 userId
    const { userId } = req.body; // type: string

    const effectiveTimeInSeconds = 3600; //type: number; unit: s； token 过期时间，单位：秒

    //生成基础鉴权 token时，payload 要设为空字符串
    const payload = "";
    // Build token
    const token = generateToken04(
      appID,
      userId,
      serverSecret,
      effectiveTimeInSeconds,
      payload
    );
    if (token)
      res.send({
        status: 0,
        message: "Getting the token was successful",
        token,
      });
  } catch (error) {
    res.cc(error);
  }
};
