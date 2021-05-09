const express = require("express");
const fileUpload = require("express-fileupload");
const faceApiService = require("./faceApiService");

const app = express();
const port = process.env.PORT || 3001;

app.use(fileUpload());

app.post("/upload", async (req, res) => {
  try {
    const { file } = req.files;

    const result = await faceApiService.detect(file.data, file.name);
  
    let exprArr = Object.keys(result[0].expressions)
      .map(el => {
        return {
          emotion: el,
          val: result[0].expressions[el]
        }
      })
      .sort((a, b) => b.val - a.val);
  
    res.json({
      success: true,
      message: "Face Detected!",
      detectedFaces: result.length,
      detectedEmotions: exprArr,
      // url: `http://localhost:3000/out/${file.name}`,
    });
  } catch (err) {
    return res.json({
      success: false,
      message: "Face Not Detected!",
    });
  }
});

app.use("/out", express.static("out"));

app.listen(port, () => {
  console.log("Server started on port" + port);
});
