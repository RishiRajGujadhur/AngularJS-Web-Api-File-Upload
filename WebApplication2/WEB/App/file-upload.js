/// <reference path="C:\Users\GUJADHUR\Desktop\WebApplication2\WebApplication2\Scripts/angular.min.js" />
angular.module('fupApp', [])
.directive('ngFiles', ['$parse', function ($parse) {

    function fn_link(scope, element, attrs)
    {
        var onChange = $parse(attrs.ngFiles);

        element.on('change', function (event) {

            onChange(scope, { $files: event.target.files });
        })
    }
    return {

        link:fn_link
    }
}])
.controller('fupController', function ($scope,$http) {

    var formdata = new FormData();

    $scope.getTheFiles = function ($files) {

        $scope.imagesrc = [];

        for (var i = 0; i < $files.length; i++)
        {
            var reader = new FileReader();
            reader.fileName = $files[i].name;
            reader.onload = function (event) {
                var image = {};
                image.Name = event.target.fileName;
                image.Size = (event.total / 1024).toFixed(2);
                image.Src = event.target.result;
                $scope.imagesrc.push(image);
                $scope.$apply();

            }
            reader.readAsDataURL($files[i]);
        }
        angular.forEach($files, function (value, key)
        {
            formdata.append(key, value);
        })
    }
    
    $scope.uploadFiles = function () {
        var request = {

            method: 'Post',
            url: '/api/FileUpload',
            data: formdata,
            headers: {
                'Content-Type': undefined

            }

        };
        $scope.sloadingImage();
        $http(request).success(function (d) {
            $scope.data = false;
            alert(d);
            $scope.reset();
            $scope.hloadingImage();

        }).error(function () {
            
            alert("failed");
            $scope.reset();
            $scope.hloadingImage();
           
        })

    }

    $scope.reset = function () {
        $scope.imagesrc = [];
        formdata = new FormData();
        $("#fileControl").val('');
    }

    $scope.sloadingImage = function () {
        $("#spinner").show();
        $("#spinner").css({ display: "normal" });
    }

    $scope.hloadingImage = function () {
        $("#spinner").hide();
        $("#spinner").css({ display: "none" });
    }
    
  
})