const express = require('express')
const fs = require('fs-extra')
const path = require('path')

const PORT = 3000
const PAPER_FOLDER = '/Users/nathanielfaulkner/OneDrive/Documents/phd/litReview/papers'

const app = express()

app.use('/static', express.static(path.join(__dirname, 'statics')))
app.use('/json', express.static(path.join(__dirname, 'savefiles')))

app.use(express.json());       // to support JSON-encoded bodies
app.use(express.urlencoded({extended: false})); // to support URL-encoded bodies

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'templates', 'index.html'))
})

app.get('/dispPapers', (req, res) => {
  let out = {'files': []}

  res.setHeader('Content-Type', 'application/json')

  fs.readdir(PAPER_FOLDER, (err, files) => {
    files.forEach(file => {
      out.files.push(file)
    })
    
    res.send(JSON.stringify(out))
  })
})

app.post('/dispFilePath', (req, res) => {
  let currentDir = req.body.dir_path
  if (currentDir === 'none') currentDir = __dirname
  let out = {'dirs': [], 'files': [], 'currDir': currentDir}

  res.setHeader('Content-Type', 'application/json')


  fs.readdir(currentDir, (err, files) => {
    files.forEach(file => {
      if (fs.lstatSync(path.join(currentDir, file)).isDirectory()) out.dirs.push(file)
      if (fs.lstatSync(path.join(currentDir, file)).isFile()) out.files.push(file)
    })
    
    res.send(JSON.stringify(out))
  })
})

app.post('/addPaper', (req, res) => {
  let paperPath = req.body.paper_path
  let paperName = req.body.paper_name
  fs.copy(path.join(paperPath, paperName), path.join(__dirname, 'statics', paperName), (err) => {
    if (err) throw err

    fs.readFile(path.join(__dirname, 'savefiles', 'papers.json'), 'utf8', function (err, data) {
      if (err) throw err // we'll not consider error handling for now
      let sav = JSON.parse(data)
      let tempPaper = {'title': 'dummy title', 'path': 'static/' + paperName, 'notes': 'dummy notes'}
      sav.push(tempPaper)

      let out = JSON.stringify(sav)

      fs.writeFile(path.join(__dirname, 'savefiles', 'papers.json'), out, 'utf8', function (err) {
        if (err) throw err
        res.send('ack')
      })
    })
  })
})

app.listen(PORT, () => console.log(`Began listening on port ${PORT}`))

// let PDFParser = require('pdf2json')

// let pdfParser = new PDFParser()

// pdfParser.on("pdfParser_dataError", errData => console.error(errData.parserError) )
// pdfParser.on("pdfParser_dataReady", pdfData => {
//   fs.writeFile("test.json", JSON.stringify(pdfData))

  
// })

// pdfParser.loadPDF("test.pdf")