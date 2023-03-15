import config from "../../../../config";
import fetch from "node-fetch";

const Connect = async (req, res) => {
  try {
    const unFollowUserUrl = `${config.apiBaseUrl}/v2/user/unfollow/${req.query.userId}`;
     
    const unFollow = await fetch(unFollowUserUrl, {
      method: "POST",
      headers: {
        ...config.apiHeaders,
        auth_token: req.cookies.authToken,
      },
    }).then((res) => res.json());

    if (unFollow) {
      res.status(200).json({
        unFollow,
      });
    }
  } catch (err) {
     
    return res.send({ err });
  }
};

export default Connect;
