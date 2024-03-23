require("dotenv").config();

const http = require("http");
const url = require("url");

const server = http.createServer(requestHandler);
server.listen(process.env.PORT, process.env.HOST, startHandler);

function startHandler() {
  const address = server.address();
  console.log(`Server listening at ${address.address}:${address.port}`);
}

function requestHandler(req, res) {
  console.log("Handling request.");
  let result;
  let contentType;

  try {
    if(req.method !== "GET") {
      writeJsonResponse(res, 405 ,{ error: `Method ${req.method} is not allowed.` });
      return;
    }

    const urlParts = url.parse(req.url, true);
    const path = urlParts.pathname;
    const query = urlParts.query;

    switch(path) {
      case "/dotted":
        contentType = "html";
        result = dotted(query);
        writeHtmlResponse(res, 200, `<pre>${result}</pre>`);
        break;
      case "/fizzBuzz":
        contentType = "html";
        result = fizzBuzz(query);
        writeHtmlResponse(res, 200, `<pre>${result}</pre>`);
        break;
      case "/gradeStats":
        contentType = "json";
        result = gradeStats(query);
        writeJsonResponse(res, 200, result);
        break;
      case "/rectangle":
        contentType = "html";
        result = rectangle(query);
        writeJsonResponse(res, 200, result);
        break;
      default:
        writeJsonResponse(res, 400, `Path ${path} not recognized.`);
    }
  }
  catch(error) {
    switch(contentType) {
      case "html":
        writeHtmlResponse(res, 400, error.message);
        break;
      default:
        writeJsonResponse(res, 400, { error: error.message });
        break;
    }
  }
}

function dotted(query) {
  const word1 = query.word1;
  const word2 = query.word2;

  if(!word1 || !word2) { throw Error("Both word1 and word2 are required."); }

  const totalWordLength = word1.length + word2.length;

  if(totalWordLength >= 30) { throw Error('The words are too long. There is no room for "." characters.'); }

  const dots = ".".repeat(30 - totalWordLength);
  const result = word1 + dots + word2;

  return result;
}

function fizzBuzz(query) {
  let start = query.start;
  let end = query.end;

  if(!start || !end) { throw Error("Both start and end are required."); }

  start = parseInt(start);
  end = parseInt(end);

  if(isNaN(start) || isNaN(end)) { throw Error("Both start and end must be integers."); }
  if(start > end) { throw Error("Start cannot be greater than end."); }

  let result = "";
  for(let i = start; i <= end; i++) {
    result += ((i % 3 ? "" : "Fizz") + (i % 5 ? "" : "Buzz") || i.toString()) + "\n";
  }

  return result;
}

function gradeStats(query) {
  if(!query.grades) { throw Error("At least one grades value is required."); }

  let grades = (query.grades instanceof Array ? query.grades : [query.grades]);
  if(grades.length < 1) { throw Error("At least one grades value is required."); }

  grades = grades.map(grade => {
    if(isNaN(grade)) { throw Error("All grades must be numbers."); }
    return parseFloat(grade);
  });

  const result = {
    minimum: Math.min(...grades),
    maximum: Math.max(...grades),
    average: grades.reduce((sum, current) => sum + current, 0) / grades.length
  };

  return result;
}

function rectangle(query) {
  let length = query.length;
  let width = query.width;

  if(!length || !width) { throw Error("Both length and width are required."); }
  if(isNaN(length) || isNaN(width)) { throw Error("Both length and width must be numbers."); }
  if(length < 0 || width < 0) { throw Error("Both length and width must be positive."); }

  length = parseFloat(length);
  width = parseFloat(width);

  const result = {
    area: length * width,
    permieter: length * 2 + width * 2
  };

  return result;
}

function writeJsonResponse(res, status, object) {
  res.writeHead(status, { "Content-Type": "application/json" });
  res.end(JSON.stringify(object));
}

function writeHtmlResponse(res, status, content) {
  res.writeHead(status, { "Content-Type": "text/html" });
  res.end(content);
}