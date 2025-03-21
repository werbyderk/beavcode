const fs = require('fs')
const path = require('path')

const pyPath = path.join(__dirname, 'test.py')

fs.readFile(pyPath, 'utf8', (err, data) => {
  if (err) {
    console.error('Error reading file:', err)
    return
  }
  const base64Encoded = Buffer.from(data).toString('base64')
  console.log('Python')
  console.log(base64Encoded)
})

const mdPath = path.join(__dirname, 'challenge_description.md')
fs.readFile(mdPath, 'utf8', (err, data) => {
  if (err) {
    console.error('Error reading file:', err)
    return
  }
  const base64Encoded = Buffer.from(data).toString('base64')
  console.log('Markdown')
  console.log(base64Encoded)
})
