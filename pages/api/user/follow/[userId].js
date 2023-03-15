import config from "../../../../config";
import fetch from "node-fetch";

const Connect = async (req, res) => {
  try {
    const followUserUrl = `${config.apiBaseUrl}/v2/user/follow/${req.query.userId}?solGame=true`;
    const follow = await fetch(followUserUrl, {
      method: "POST",
      headers: {
        ...config.apiHeaders,
        auth_token: req.cookies.authToken,
      },
    }).then((res) => res.json());

    if (follow) {
      res.status(200).json({
        follow,
      });
    }
  } catch (err) {
    return res.send({ err });
  }
};

export default Connect;
