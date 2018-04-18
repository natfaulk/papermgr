const fs = require('fs')
const path = require('path')

var myapp = angular.module('paperMgr', [])
myapp.controller('topCtrl', function($scope, $http) {
  $scope.papers = []

  $scope.currentPaper = 0

  $scope.sidebar = (n) => {
    $scope.currentPaper = n
    let o = document.getElementById('pdfviewer')
    let c = o.cloneNode(true)
    c.setAttribute('src', $scope.papers[n].path)
    o.parentNode.replaceChild(c, o)
  }

  $scope.getSaveFile = () => {
    fs.readFile(path.join('savefiles', 'papers.json'), 'utf8', function (err, data) {
      if (err) throw err; // we'll not consider error handling for now
      $scope.papers = JSON.parse(data)
      console.log($scope.papers)
      $scope.sidebar($scope.currentPaper)
      $scope.$apply()
    })
  }

  $scope.getSaveFile()
})