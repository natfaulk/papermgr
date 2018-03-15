var myapp = angular.module('paperMgr', [])
myapp.controller('topCtrl', function($scope, $http) {
  $scope.papers = []

  $scope.currentPaper = 0

  $scope.filepicker = {
    'show': false,
    'currDir': 'none',
    'dirs': [],
    'files': [],
    'splitCurrDir': function() {
      let out = this.currDir.split('/')
      // if (out[0] === '') out.shift()
      return out
    },
    'error': false,
    'errorMsg': ''
  }


  $scope.sidebar = (n) => {
    $scope.currentPaper = n
    let o = document.getElementById('pdfviewer')
    let c = o.cloneNode(true)
    c.setAttribute('src', $scope.papers[n].path)
    o.parentNode.replaceChild(c, o)
  }

  $scope.getSaveFile = () => {
    $http.get('json/papers.json')
    .then(function(response) {
      console.log(response.data)
      $scope.papers = response.data
      $scope.sidebar($scope.currentPaper)
    })
  }

  $scope.getSaveFile()  

  $scope.showFilePicker = () => {
    $scope.filepicker.show = true

    let req = {
      method: 'POST',
      url: 'dispFilePath',
      headers: {
        'Content-Type': 'application/json'
      },
      data: { dir_path: $scope.filepicker.currDir }
    }
     
    $http(req).then((response) => {
      console.log(response.data)
      $scope.filepicker.currDir = response.data.currDir
      $scope.filepicker.dirs = response.data.dirs
      $scope.filepicker.files = response.data.files
    }, (response) => {
      console.log('error loading files')
    })    
  }

  $scope.splitCurrDirClick = (dir) => {
    let t = ''
    let t2 = $scope.filepicker.splitCurrDir()
    for (let i = 0; i <= dir; i++) {
      t += t2[i]
      if (i < dir) t += '/' // else get too many slashes at end
    }
    console.log(t)
    $scope.filepicker.currDir = t
    $scope.showFilePicker()
  }

  $scope.dirClick = (dir) => {
    $scope.filepicker.currDir += '/' + dir
    $scope.showFilePicker()
  }

  $scope.fileClick = (_file) => {
    $scope.filepicker.currFile = _file
    // console.log(_file.split('.').pop())
    if (_file.split('.').pop() === 'pdf') {
      $scope.filepicker.show = false

      let req = {
        method: 'POST',
        url: 'addPaper',
        headers: {
          'Content-Type': 'application/json'
        },
        data: {
          paper_path: $scope.filepicker.currDir,
          paper_name: $scope.filepicker.currFile
        }
      }
       
      $http(req).then((response) => {
        console.log(response.data)
        $scope.getSaveFile()  
      }, (response) => {
        console.log('error adding pdf')
      })
    } else {
      $scope.filepicker.error = true
      $scope.filepicker.errorMsg = 'invalid file type'
    }
  }
})