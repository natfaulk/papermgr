const fs = require('fs')
const path = require('path')
const {dialog} = require('electron').remote
const loadRis = require('./loadRis.js')

const SAVE_FILE = path.join('savefiles', 'papers.json')
const AUTO_SAVE_TIMEOUT = 10 * 1000 // in ms

var myapp = angular.module('paperMgr', [])
myapp.controller('topCtrl', ['$scope', '$http', function($s, $http) {
  $s.papers = []

  $s.currentPaper = 0

  $s.sidebar = (n) => {
    $s.currentPaper = n
    let o = document.getElementById('pdfviewer')
    let c = o.cloneNode(true)
    c.setAttribute('src', $s.papers[n].path)
    o.parentNode.replaceChild(c, o)
  }

  $s.getSaveFile = () => {
    fs.readFile(SAVE_FILE, 'utf8', function (err, data) {
      if (err) throw err; // we'll not consider error handling for now
      $s.papers = JSON.parse(data)
      console.log($s.papers)
      $s.sidebar($s.currentPaper)
      $s.$apply()
    })
  }

  $s.addtag = () => {
    $s.papers[$s.currentPaper].tags.push($s.newTag)
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
    fs.writeFile(SAVE_FILE, JSON.stringify($s.papers), 'utf8', function (err) {
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
    $s.risFile = dialog.showOpenDialog({properties: ['openFile']})
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
    $s.pdfFile = dialog.showOpenDialog({properties: ['openFile']})[0]
  }
  
  $s.addPaper = () => {
    if ($s.risFile != '' && $s.pdfFile != '') {
      $s.addPaperDetails.path = $s.pdfFile
      $s.papers.push($s.addPaperDetails)
      $s.addPaperDetails = {}
      $s.risFile = ''
      $s.pdfFile = ''
      $s.showAddPaper = false
    }
  }


  $s.getSaveFile()
}])