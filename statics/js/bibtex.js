const fs = require("fs")

module.exports = {
  export: (_papers, _file = 'test.bib') => {
    out = fs.createWriteStream(_file)
    let count = 0

    _papers.forEach(element => {
      let authors = ''
      for (let i = 0; i < element.authors.length; i++) {
        authors += element.authors[i]
        if (i < element.authors.length - 1) authors += ' and '
      }
      
      let easyname 
      if (element.easyname == undefined || element.easyname == '') easyname = count
      else easyname = element.easyname
      count++

      if (element.paperType == 'JOUR') {
        out.write(
`@article{${easyname},
  title={${element.title}},
  author={${authors}},
  journal={${element.journalName}},
  year={${element.year}},
  publisher={${element.publisher}}
}`
        )
      } else if (element.paperType == 'CONF') {
        out.write(
`@inproceedings{${easyname},
  title={${element.title}},
  author={${authors}},
  booktitle={${element.journalName}},
  year={${element.year}},
  organization={${element.publisher}}
}`
        )
      } else console.log('unknown article type')

    })

  }
}