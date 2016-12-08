var app = angular.module('overair');

app.controller('adminController', ['$scope','$http','$state', '$rootScope', '$sessionStorage', 'config', 'adminApi', 'socket', function($scope, $http, $state, $rootScope, $sessionStorage, config, adminApi, socket) {
	console.log("hey controller");
	var base_url = config.overAir.url;
	var changeOldVal = 0;
	var changeNewVal = 0;
	$scope.margin = 0;
	$scope.onloadFlg = true;
	if($sessionStorage.hasOwnProperty('sessionBcon')) {
		$scope.hideBtn = true
		$scope.saveBconId = $sessionStorage.sessionBcon.save_bconId;
		socket.emit('channel2', $scope.saveBconId);
	}
	else {
		$scope.hideBtn = false;
	}
//***********************Fetch Data based on current BconId ****************//
	function getConnectedUser() {
		adminApi.getAllUserData().then(
			function(response) {
				console.log("response is:::", response)
				$scope.dashBrdData = response;
					//$state.reload();
			},
			function(error) {
				console.log("error to get data", error);
			}
		);
	}
	socket.on('connectedUserData', function(message) {
		console.log("hello", message)
		$scope.checkAssignBcon = message.slice(-1).pop();
		if($scope.checkAssignBcon.bcon_id && !$scope.checkAssignBcon.click_cnt && !$scope.checkAssignBcon.cookie_val) {
			console.log("found bcon");
			message.pop();
		}
		$scope.filterBcon = $sessionStorage.sessionBcon.save_bconId;
		$scope.filterGrp1Data = [];
		$scope.filterGrp2Data = [];
		$scope.grp1Total = 0;
		$scope.grp2Total = 0;
		$scope.frstGrpFlg = false;
		$scope.scndGrpFlg = false;
		$scope.assignGroupFlg = true;
		if($scope.filterBcon) {
			for(var i in message) {
				if(message[i].bcon_id === $scope.filterBcon) {
					if($scope.assignGroupFlg) {
						$scope.filterGrp1Data.push(message[i]);
						$scope.grp1Total += message[i].click_cnt;
						$scope.assignGroupFlg = false;
					}
					else {
						$scope.filterGrp2Data.push(message[i]);
						$scope.grp2Total += message[i].click_cnt;
						$scope.assignGroupFlg = true;
					}
				}
			}
			$scope.$watch('grp1Total', function(newValue, oldValue) {
				console.log("grp1 changeOldVal & oldValue", changeOldVal, oldValue)
				if(changeOldVal !== oldValue) {
				  console.log("11oldValue and newValue",oldValue, newValue)
				  if(newValue !== oldValue) {
				  	changeOldVal = oldValue;
					console.log("grp1 after assign changeOldVal and oldValue", changeOldVal, oldValue)
					//if($scope.grp1Total > $scope.grp2Total) {
						console.log("group 1 before", $scope.margin)
						if($scope.margin >= -1235) {
							$scope.margin -= 40;
							console.log("group 1 after", $scope.margin)
							console.log("-1235 true")
							$scope.imgStyle = {
								'margin-left': $scope.margin + 'px' 
							}
						}
					//}
				  }
				}
			  $scope.frstGrpFlg = true;
			});

			$scope.$watch('grp2Total', function(newValue, oldValue) {
				console.log("grp2 changeOldVal & oldValue", changeOldVal, oldValue)
                if(changeOldVal !== oldValue) {
                	console.log("inside")

				  	console.log("222oldValue and newValue",oldValue, newValue)
				  	$scope.scndGrpFlg = true;
				  	if(newValue !== oldValue) {
					changeOldVal = oldValue;
					console.log("grp2 after assign changeOldVal and oldValue", changeOldVal, oldValue)
					  	//if($scope.grp1Total < $scope.grp2Total) {
			            	console.log("group 2 before", $scope.margin)
							if($scope.margin <= 1166) {
				            	$scope.margin += 40;
				            	console.log("group 2 after", $scope.margin)
								console.log("-1166 true")
								$scope.imgStyle = {
									'margin-left': $scope.margin + 'px' 
								}
							}
						//}
				    }
			    }
			    if($scope.frstGrpFlg === true && $scope.scndGrpFlg === true) {
			    	setEqualMargin();
			    }
			});


			/*if($scope.grp1Total > $scope.grp2Total) {
				console.log("group 1 before", $scope.margin)
				$scope.margin -= 40;
				console.log("group 1 after", $scope.margin)
				if($scope.margin >= -1235) {
					console.log("-1235 true")
					$scope.imgStyle = {
						'margin-left': $scope.margin + 'px' 
					}
				}
			}*/
            
            /*if($scope.grp1Total < $scope.grp2Total) {
            	console.log("group 2 before", $scope.margin)
            	$scope.margin += 40;
            	console.log("group 2 after", $scope.margin)
				if($scope.margin <= 1166) {
					console.log("-1166 true")
					$scope.imgStyle = {
						'margin-left': $scope.margin + 'px' 
					}
				}
			}*/
			function setEqualMargin() {
				if($scope.grp1Total === $scope.grp2Total) {
					console.log("both group equal")
					$scope.margin = 0;
					$scope.imgStyle = {
						'margin-left': $scope.margin + 'px'
					}
				}

                if($scope.onloadFlg === true) {
					if($scope.grp1Total > $scope.grp2Total) {
						$scope.diff = $scope.grp1Total - $scope.grp2Total;
						console.log("if group 1 before and diff", $scope.margin, $scope.diff)
						if($scope.margin >= -1235) {
							$scope.margin -= 40 * $scope.diff;
							console.log("group 1 after", $scope.margin)
							console.log("-1235 true")
							$scope.imgStyle = {
								'margin-left': $scope.margin + 'px' 
							}
						}
					}
	            
		            if($scope.grp1Total < $scope.grp2Total) {
		            	$scope.diff = $scope.grp2Total - $scope.grp1Total;
		            	console.log("if group 2 before and diff", $scope.margin, $scope.diff)
						if($scope.margin <= 1166) {
			            	$scope.margin += 40 *$scope.diff;
			            	console.log("group 2 after", $scope.margin)
							console.log("-1166 true")
							$scope.imgStyle = {
								'margin-left': $scope.margin + 'px' 
							}
						}
					}
				}
				$scope.onloadFlg = false;
			}
		}
	});
	getConnectedUser();

	$scope.SaveBconData = function() {
		var chars = 'acdefhiklmnoqrstuvwxyz0123456789'.split('');
	    var bcon = '';
	    for(var i=0; i<4; i++){
	      var x = Math.floor(Math.random() * chars.length);
	      bcon += chars[x];
	    }
		console.log("Bcon id is::", bcon, base_url);
		$scope.bconData = {bconId: bcon};
		
		$http.post(base_url + '/bconId', $scope.bconData).then(
			function(response) {
				console.log("response is::", response);
				$scope.saveBconId = response.data;
				$sessionStorage.sessionBcon = {'save_bconId': $scope.saveBconId};
				$scope.getSession = $sessionStorage.sessionBcon;
				console.log("getSession is::", $scope.getSession);
				$scope.hideBtn = true;
			},
			function(error) {
				console.log("error to save bcon id");
			}
		);
	}
}]);



