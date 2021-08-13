import express from "express";
import Twitter from "twitter";
import fetch from "node-fetch";
import {
  customerKey,
  customerSeacret,
  accsessTokenKey,
  accsessTokenSeacret,
} from "./seacretDirectory/seacret";

const app: express.Express = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//CROS対応（というか完全無防備：本番環境ではだめ絶対）
app.use(
  (req: express.Request, res: express.Response, next: express.NextFunction) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "*");
    res.header("Access-Control-Allow-Headers", "*");
    next();
  }
);

// 型定義
type Message = {
  message: string;
};
type Params = {
  status: string;
};
type Data = {
  id: string;
  type: string;
  actor: Actor;
  repo: Repo;
  payload: Payload;
  public: boolean;
  created_at: string;
};
type Actor = {
  id: number;
  login: string;
  display_login: string;
  gravatar_id: string;
  url: string;
  avatar_url: string;
};
type Repo = {
  id: number;
  name: string;
  url: string;
};
type Payload = {
  push_id: number;
  size: number;
  distinct_size: number;
  ref: string;
  head: string;
  before: string;
  commits: [[Object]];
};

// -------------------------------------------------------------------------------------------------------
// ------------------------------------------------- 関数 ------------------------------------------------
// ------------------------------------------------------------------------------------------------------

// github apiに接続する非同期関数
const getGithubCommitCount = async (): Promise<Data[]> => {
  const resp = await fetch("https://api.github.com/users/watataku8911/events");
  const data: Data[] = await resp.json();
  return data;
};

// 昨日の日付を取得関数
const stringToday = (): string => {
  const today: Date = new Date();

  today.setDate(today.getDate() - 1);
  const year: number = today.getFullYear();
  const month: string = ("0" + (today.getMonth() + 1)).slice(-2);
  const day: string = ("0" + today.getDate()).slice(-2);

  return year + "-" + month + "-" + day;
};
// ---------------------------------------------------------------------------------------------------------
// -------------------------------------------------------------------------------------------------------
// ---------------------------------------------------------------------------------------------------------

const client: Twitter = new Twitter({
  consumer_key: customerKey(),
  consumer_secret: customerSeacret(),
  access_token_key: accsessTokenKey(),
  access_token_secret: accsessTokenSeacret(),
});

const message: Message = {
  message: "Bad Request",
};

//get
app.get("/api", (req: express.Request, res: express.Response) => {
  res.send(JSON.stringify(message));
});

//post
app.post("/api", (req: express.Request, res: express.Response) => {
  getGithubCommitCount()
    .then((resp) => {
      let count: number = 0;
      resp.forEach((data: Data) => {
        if (data.created_at.substr(0, 10) == stringToday()) {
          count++;
        } else {
          return;
        }
      });
      const params: Params = {
        status:
          "ver.ts-test" +
          "今日のコミット数は" +
          count +
          "です。\n" +
          "\n" +
          "https://github.com/watataku8911",
      };
      client.post("statuses/update", params, (tweet: Twitter.ResponseData) => {
        if (tweet) {
          res.json(tweet);
        }
      });
    })
    .catch(() => {
      console.log("Githubデータを取得できませんでした。");
    });
});

//put
app.put("/api", (req: express.Request, res: express.Response) => {
  res.send(JSON.stringify(message));
});

//delete
app.delete("/api", (req: express.Request, res: express.Response) => {
  res.send(JSON.stringify(message));
});

const port: string | number = process.env.PORT || 8080;
app.listen(port);
console.log("ポート番号" + port + "でWebサーバが立ち上がりました");
