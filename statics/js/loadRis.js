const fs = require('fs')
const readline = require('readline');

module.exports = {
  fromFile: (filepath, papers, _callback) => {
    let output = {
      title: '',
      path: '',
      notes: '',
      tags: [],
      authors: [],
      paperType: '',
      journalName: '',
      startPage: '',
      endPage: '',
      isbn: '',
      doi: '',
      year: '',
      publisher: ''
    }

    let rl = readline.createInterface({
      input: fs.createReadStream(filepath)
    })

    rl.on('line', (line) => {
      if (line.startsWith('TY')) output.paperType = line.slice(6)
      if (line.startsWith('T1')) output.title = line.slice(6)
      if (line.startsWith('A1')) output.authors.push(line.slice(6))
      if (line.startsWith('JO')) output.journalName = line.slice(6)
      if (line.startsWith('SP')) output.startPage = line.slice(6)
      if (line.startsWith('EP')) output.endPage = line.slice(6)
      if (line.startsWith('SN')) output.isbn = line.slice(6)
      if (line.startsWith('Y1')) output.year = line.slice(6)
      if (line.startsWith('PB')) output.publisher = line.slice(6)

      if (line.startsWith('ER')) {
        papers.push(output)
        _callback()
      }
    })
  }
}