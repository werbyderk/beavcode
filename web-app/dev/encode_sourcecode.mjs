import { readFile } from 'fs'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const pyPath = join(__dirname, 'test.py')

readFile(pyPath, 'utf8', (err, data) => {
  if (err) {
    console.error('Error reading file:', err)
    return
  }
  const base64Encoded = Buffer.from(data).toString('base64')
  console.log('Python')
  console.log(base64Encoded)
})

const mdPath = join(__dirname, 'challenge_description.md')
readFile(mdPath, 'utf8', (err, data) => {
  if (err) {
    console.error('Error reading file:', err)
    return
  }
  const base64Encoded = Buffer.from(data).toString('base64')
  console.log('Markdown')
  console.log(base64Encoded)
})
