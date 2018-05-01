const fs = require('fs')
const fse = require('fs-extra') // for copying files
const path = require('path')
const {dialog} = require('electron').remote
const loadRis = require('./loadRis.js')

let SETTINGS_FILE = path.join(__dirname, '../../settings.json')
const AUTO_SAVE_TIMEOUT = 10 * 1000 // in ms

var myapp = angular.module('paperMgr', [])
myapp.controller('topCtrl', ['$scope', '$http', function($s, $http) {
  $s.loadSettings = () => {
    fs.readFile(SETTINGS_FILE, 'utf8', function (err, data) {
      if (err) throw err; // we'll not consider error handling for now
      $s.settings = JSON.parse(data)
      console.log($s.settings)
      $s.data_file = path.join($s.settings.data_path, 'papers.json')

      $s.getSaveFile()
    })
  }

  
  $s.papers = []
  $s.currentPaper = 0
  $s.loadSettings()

  $s.hlKey = ''
  $s.hlVal = ''
  $s.shouldHl = (_paper, _key, _val) => {
    if (_paper == $s.papers[$s.currentPaper]) return true
    if (_key == '') return false
    if (_key == 'authors') {
      if (_paper.authors) return _paper.authors.includes(_val)
      else return false
    }
    return _paper[_key].toLowerCase() == _val.toLowerCase()
  }

  $s.setHlAuthors = (_author) => {
    console.log(_author)
    // hacky workaround as authors would not show
    $s.hlKey = 'authors'
    $s.hlVal = _author
  }

  $s.resetHlAuthors = (_author) => {
    // hacky workaround as authors would not clear
    $s.hlKey = ''
    $s.hlVal = ''
  }
    
  $s.tagCache = []
  // horrible jquery... Need to do it in an angular way :/
  $('#tags').typeahead({source: $s.tagCache})

  $s.regenTagCache = () => {
    $s.papers.forEach((p) => {
      if (p.tags) p.tags.forEach((t) => {
        if (!$s.tagCache.includes(t)) $s.tagCache.push(t)
      })
    })
    // console.log($s.tagCache)
  }

  $s.sidebar = (n) => {
    $s.currentPaper = n
    let o = document.getElementById('pdfviewer')
    let c = o.cloneNode(true)
    c.setAttribute('src', path.join($s.settings.pdf_path, $s.papers[n].path))
    o.parentNode.replaceChild(c, o)
  }

  $s.getSaveFile = () => {
    fs.readFile($s.data_file, 'utf8', function (err, data) {
      if (err) throw err; // we'll not consider error handling for now
      $s.papers = JSON.parse(data)
      console.log($s.papers)
      $s.sidebar($s.currentPaper)
      $s.regenTagCache()
      $s.$apply()
    })
  }

  $s.addtag = () => {
    $s.papers[$s.currentPaper].tags.push($s.newTag)
    if (!$s.tagCache.includes($s.newTag)) $s.tagCache.push($s.newTag)    
    $s.newTag = ''
    $s.saveFileToDisk()
  }

  $s.removetag = (tag) => {
    let index = $s.papers[$s.currentPaper].tags.indexOf(tag)
    if (index !== -1) {
      $s.papers[$s.currentPaper].tags.splice(index, 1)
      $s.saveFileToDisk()      
    }
  }

  $s.saveFileToDisk = () => {
    fs.writeFile($s.data_file, JSON.stringify($s.papers), 'utf8', function (err) {
      if (err) console.log(err);
  
      console.log("The file was saved!");
    })
  }

  let onChangeTimeout;
  $s.saveFileTimeout = () => {
    clearTimeout(onChangeTimeout) // effectively reset timeout if changed again
    onChangeTimeout = setTimeout(() => {
      $s.saveFileToDisk()
    }, AUTO_SAVE_TIMEOUT)
  }

  $s.selectRisFile = () => {
    $s.risFile = dialog.showOpenDialog({defaultPath: $s.settings.default_ris_path, properties: ['openFile']})
    if ($s.risFile !== undefined) {
      let t = []
      loadRis.fromFile($s.risFile[0], t, () => {
        $s.addPaperDetails = t[0]
        console.log($s.addPaperDetails)
        $s.$apply()
      })
    }
  }
  
  $s.selectPdfFile = () => {
    $s.pdfFile = dialog.showOpenDialog({defaultPath: $s.settings.pdf_path, properties: ['openFile']})[0]
  }
  
  $s.addPaper = () => {
    if ($s.risFile != '' && $s.pdfFile != '') {
      $s.addPaperDetails.path = path.basename($s.pdfFile)
      
      function addPaper() {
        $s.papers.push($s.addPaperDetails)
        $s.addPaperDetails = {}
        $s.risFile = ''
        $s.pdfFile = ''
        $s.showAddPaper = false
        $s.saveFileToDisk()
        $s.$apply()
      }
      // in case pdf already in pdf folder
      if (path.dirname($s.pdfFile) == $s.settings.pdf_path) addPaper()
      fse.copy($s.pdfFile, path.join($s.settings.pdf_path, $s.addPaperDetails.path), err => {
        if (err) return console.error(err)
        console.log('Pdf copied!')
        addPaper()
      })
    }
  }
}])
