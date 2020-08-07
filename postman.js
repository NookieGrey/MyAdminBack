const http = require('http');

const data = JSON.stringify({
  login: 'name',
  password: "secret123"
});

const options = {
  hostname: 'localhost',
  port: 8090,
  path: '/sign-in',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length
  }
}

const req = http.request(options, (response) => {
  console.log(`statusCode: ${response.statusCode}`)

  let str = ''
  response.on('data', function (chunk) {
    str += chunk;
  });

  response.on('end', function () {
    console.log(str);
  });
})

req.on('error', (error) => {
  console.error(error)
})

req.write(data)
req.end()