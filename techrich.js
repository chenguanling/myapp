'use strict';
angular.module('ngLocale', [], ['$provide', function($provide) {
    var PLURAL_CATEGORY = {ZERO: 'zero', ONE: 'one', TWO: 'two', FEW: 'few', MANY: 'many', OTHER: 'other'};
    $provide.value('$locale', {
        'DATETIME_FORMATS': {
            'AMPMS': ['上午', '下午'],
            'DAY': ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'],
            'MONTH': ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
            'SHORTDAY': ['周日', '周一', '周二', '周三', '周四', '周五', '周六'],
            'SHORTMONTH': ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
            'fullDate': 'y年M月d日EEEE',
            'longDate': 'y年M月d日',
            'medium': 'yyyy-MM-dd ahh:mm:ss',
            'mediumDate': 'yyyy-MM-dd',
            'mediumTime': 'ahh:mm:ss',
            'short': 'yyyy-MM-dd ahh:mm',
            'shortDate': 'yy-M-d',
            'shortTime': 'ahh:mm'
        },
        'NUMBER_FORMATS': {
            'CURRENCY_SYM': '\u00a5',
            'DECIMAL_SEP': '.',
            'GROUP_SEP': ',',
            'PATTERNS': [
                {'gSize': 3, 'lgSize': 3, 'macFrac': 0, 'maxFrac': 3, 'minFrac': 0, 'minInt': 1, 'negPre': '-', 'negSuf': '', 'posPre': '', 'posSuf': ''},
                {'gSize': 3, 'lgSize': 3, 'macFrac': 0, 'maxFrac': 2, 'minFrac': 2, 'minInt': 1, 'negPre': '(\u00a4', 'negSuf': ')', 'posPre': '\u00a4', 'posSuf': ''}
            ]
        },
        'id': 'zh-cn',
        'pluralCat': function(n) {
            return PLURAL_CATEGORY.OTHER;
        }
    });
}]);

angular.module('techrich', ['ngSanitize', 'ngResource', 'ui.bootstrap', 'ui.select'],function ($compileProvider) {
    $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|data|file):/);
});

angular.module('techrich')
    .filter('timeSpan', function() {
        return function(value) {
            if (value) {
                var v = ''+value;
                while(v.length<6)v = '0'+v;
                if(v.length>6)v = v.slice(-6);
                return v.slice(0,2)+':'+v.slice(2,4)+':'+v.slice(-2);
            }
            return '';
        };
    })
    .controller('TechrichQueueController', ['$scope', '$rootScope', '$filter', '$http', '$timeout',
        function($scope, $rootScope, $filter, $http, $timeout) {

            $scope.calendar = {
                queryStart: false,
                queryEnd: false,
                statStart: false,
                statEnd: false,
            };
            $scope.openCalendar = function($event, type) {
                $event.preventDefault();
                $event.stopPropagation();
                $scope.calendar[type] = true;
            };

            $scope.newTimeSpan={};
            $scope.newBuzzTypes = {};
            $scope.newCounter = {};
            $scope.newTimeOutReason = {};
            $scope.newSubBuzzName = {};
            $scope.newUser = {};
            // $scope.buzzTypes = [{buzzType:'A',buzzName:'A',timeSpans:{1:[{from:'90000',to:'120000'},{from:'1300000',to:'150000'}],2:[{from:'90000',to:'120000'},{from:'1300000',to:'150000'}]}},{buzzType:'B',buzzName:'B',timeSpans:''},{buzzType:'C',buzzName:'C',timeSpans:''},{buzzType:'D',buzzName:'D',timeSpans:''}];

            // $scope.$watch('buzzType.dutyday',function(){
            // 	$scope.currSpans = $scope.currBuzzType[$scope.buzzType.dutyday];
            // });
            var updateSystemUsers = function(){
                $http.post('/systemUsers').success(function(users) {
                    if (users.responseCode == '0') {
                        $scope.users = users.result;
                        $scope.queryUsers = [{stuffId:'',stuffName:'全部人员'}].concat($scope.users);
                    }
                });
            }

            $scope.init = function() {
                $http.post('/systemConfig').success(function(systemConfig) {
                    $scope.systemConfig = systemConfig.result;
                    $scope.$watch('systemConfig', function(newVal, oldVal) {
                        if (newVal != oldVal)
                            $http.post('/updateSystemConfig', newVal).success(function() {});
                    }, true);
                });

                // $http.post('/webBuzzTypes').success(function(buzzTypes) {
                //     if (buzzTypes.responseCode == '0') {
                //         $scope.webbuzzTypes = buzzTypes.result;
                //         //$scope.buzzTypes = $scope.defaultBuzzTypes;
                //         $scope.queryBuzzTypes = [{buzzType:'',buzzName:'全部业务类型'}].concat($scope.webbuzzTypes);

                //     }
                // });

                $http.post('/buzzTypes').success(function(buzzTypes) {
                    if (buzzTypes.responseCode == '0') {
                        $scope.buzzTypes = buzzTypes.result;

                        //$scope.buzzTypes = $scope.defaultBuzzTypes;
                        $scope.queryBuzzTypes = [{buzzType:'',buzzName:'全部业务类型'}].concat($scope.buzzTypes);
                        var bts = {};
                        $scope.buzzTypes.forEach(function(bt) {
                            bts[bt.buzzType] = bt
                        });

                        $http.post('/counters').success(function(counters) {
                            if (counters.responseCode == '0') {
                                $scope.counters = counters.result;
                                $scope.counters.forEach(function(counter) {
                                    for (var i = 0; i < counter.buzzTypes.length; i++) {
                                        counter.buzzTypes[i] = counter.buzzTypes[i]
                                            .filter(function(m) { return !!bts[m]; })
                                            .map(function(m) { return bts[m]; });
                                    }
                                    counter.buzzTypes = counter.buzzTypes.filter(function(bt) {
                                        return bt.length !== 0;
                                    });
                                });
                            }
                        });
                    }
                });
                updateSystemUsers();
            }

            $scope.deleteUser = function(user) {
                if (!user || !user.stuffId) return;
                $http.post('/updateUser', {
                    stuffId: user.stuffId
                }).success(function(response) {
                    updateSystemUsers();
                });
            };

            $scope.addUser = function() {
                if (!$scope.newUser.stuffId || !$scope.newUser.stuffName) return;
                $http.post('/updateUser', $scope.newUser).success(function(response) {
                    $scope.newUser = {};
                    if (response.responseCode == '0') {
                        updateSystemUsers();
                    }
                });
            };

            $scope.addNewTimeOutReason = function() {
                if ($scope.newTimeOutReason.value) {
                    for (var i = 0; i < $scope.systemConfig.timeOutInfos.length; i++) {
                        var ntor = $scope.systemConfig.timeOutInfos[i];
                        if (ntor == $scope.newTimeOutReason.value) {
                            $scope.newTimeOutReason.value = '';
                            return;
                        }
                    }
                    $scope.systemConfig.timeOutInfos.push($scope.newTimeOutReason.value);
                    $scope.newTimeOutReason.value = '';
                }
            };

            $scope.removeSubBuzzName = function(index) {
                if ($scope.currBuzzType.subBuzzNames && $scope.currBuzzType.subBuzzNames.length){
                    $scope.currBuzzType.subBuzzNames.splice(index, 1);
                    $scope.currBuzzType.action="modify";
                    $http.post('/updateBuzzType',$scope.currBuzzType).success(function(response) {
                    });
                }
            };

            $scope.addSubBuzzName = function() {
                if ($scope.newSubBuzzName.value) {
                    if (!$scope.currBuzzType.subBuzzNames) $scope.currBuzzType.subBuzzNames = [];
                    for (var i = 0; i < $scope.currBuzzType.subBuzzNames.length; i++) {
                        var sbn = $scope.currBuzzType.subBuzzNames[i];
                        if (sbn == $scope.newSubBuzzName.value) {
                            $scope.newSubBuzzName.value = '';
                            return;
                        }
                    }

                    $scope.currBuzzType.subBuzzNames.push($scope.newSubBuzzName.value);
                    $scope.currBuzzType.action="modify";
                    $http.post('/updateBuzzType',$scope.currBuzzType).success(function(response) {
                        $scope.newSubBuzzName.value = '';
                    });
                }
            };

            $scope.removeTimeSpan = function(index) {
                if ($scope.currBuzzType.timeSpans[$scope.currDutyDay] && $scope.currBuzzType.timeSpans[$scope.currDutyDay].length){
                    $scope.currBuzzType.timeSpans[$scope.currDutyDay].splice(index, 1);
                    $scope.currBuzzType.action="modify";
                    $http.post('/updateBuzzType',$scope.buzzTypes).success(function(response) {
                    });

                }
            };
            $scope.CopeTimeSpans = function() {
                if ($scope.currBuzzType.timeSpans[$scope.currDutyDay] && $scope.currBuzzType.timeSpans[$scope.currDutyDay].length){
                    $scope.temps = $scope.currBuzzType.timeSpans[$scope.currDutyDay];
                    for(var i=1;i<8;i++){
                        if($scope.currDutyDay==i)continue;
                        $scope.currDutyDay = ''+i;
                        if(!$scope.currBuzzType.timeSpans[$scope.currDutyDay]) $scope.currBuzzType.timeSpans[$scope.currDutyDay] = [];

                        angular.extend($scope.currBuzzType.timeSpans[$scope.currDutyDay],$scope.temps);

                    }
                    $scope.currBuzzType.action="modify";
                    $scope.temps=[];
                    $http.post('/updateBuzzType',$scope.buzzTypes).success(function(response) {
                    });

                }
            };
            $scope.addTimeSpan = function() {
                if ($scope.newTimeSpan.from&&$scope.newTimeSpan.to&&$scope.currDutyDay) {
                    if (!$scope.currBuzzType.timeSpans) $scope.currBuzzType.timeSpans = {};
                    $scope.currDutyDays = [];
                    for(var ddts in $scope.currBuzzType.timeSpans[$scope.currDutyDay]){
                        for (var i = 0; i < ddts.length; i++) {
                            var ts = ddts[i];
                            if (ts.from == $scope.newTimeSpan.from&&ts.to == $scope.newTimeSpan.to) {
                                $scope.newTimeSpan.from = '';
                                $scope.newTimeSpan.to = '';
                                return;
                            }
                        }
                    }
                    //$scope.currBuzzType.timeSpans.push({from:$scope.newTimeSpan.from,to:$scope.newTimeSpan.to});
                    if(!$scope.currBuzzType.timeSpans[$scope.currDutyDay]) {
                        $scope.currDutyDays.push({from:$scope.newTimeSpan.from,to:$scope.newTimeSpan.to});
                        $scope.currBuzzType.timeSpans[$scope.currDutyDay]=$scope.currDutyDays;
                    }else{
                        $scope.currBuzzType.timeSpans[$scope.currDutyDay].push({from:$scope.newTimeSpan.from,to:$scope.newTimeSpan.to});
                    }
                    $scope.currBuzzType.action="modify";
                    $http.post('/updateBuzzType',$scope.buzzTypes).success(function(response) {
                        $scope.newTimeSpan.from = '';
                        $scope.newTimeSpan.to = '';
                    });
                }
            };


            $scope.modifyBuzzType = function(bt) {
                bt.modify = !bt.modify;
                if(!bt.modify){
                    bt.action="modify";
                    $http.post('/updateBuzzType',bt).success(function(response) {
                        if(response.responseCode!=='0')return;
                    });
                }
            };

            $scope.deleteBuzzType = function(btt) {
                btt.action="delete";
                $http.post('/updateBuzzType',btt).success(function(response) {
                    if(response.responseCode!=='0')return;
                    for (var i = 0; i < $scope.buzzTypes.length; i++) {
                        if ($scope.buzzTypes[i].buzzType === btt.buzzType && $scope.buzzTypes[i].buzzName === btt.buzzName)
                            $scope.buzzTypes.splice(i, 1);
                    }
                    $scope.queryBuzzTypes = [{buzzType:'',buzzName:'全部业务类型'}].concat($scope.buzzTypes);

                    var btype = btt.buzzType;
                    $scope.counters.forEach(function(counter) {
                        for (var i = 0; i < counter.buzzTypes.length; i++) {
                            counter.buzzTypes[i] = counter.buzzTypes[i].filter(function(bt) {
                                return bt.buzzType !== btype;
                            });
                        }
                        counter.buzzTypes = counter.buzzTypes.filter(function(bt) {
                            return bt.length > 0;
                        });
                    });
                });
            };


            $scope.addBuzzType = function() {
                //if ($scope.newBuzzTypes.buzzType && $scope.newBuzzTypes.buzzName) {
                //$scope.newBuzzTypes.action="new";

                $http.post('/updateBuzzType',$scope.buzzTypes).success(function(response) {
                    if(response.responseCode==='0'){
                        if($scope.buzzTypes.con)
                        //$scope.buzzTypes.push($scope.newBuzzTypes);
                            $scope.queryBuzzTypes = [{buzzType:'',buzzName:'全部业务类型'}].concat($scope.buzzTypes);
                        //$scope.newBuzzTypes = {};
                    }
                });

                //}
            };

            $scope.counterSelect = function(bt) {
                $scope.currCounter = bt;
            };

            $scope.buzzTypeSelect = function(bt) {
                $scope.currBuzzType = bt;
            };

            $scope.canSelect = function(bt) {
                if (!$scope.currCounter) return true;
                var bts = [].concat.apply([], $scope.currCounter.buzzTypes);
                for (var b = 0; b < bts.length; b++)
                    if (bts[b].buzzType === bt.buzzType) return true;
                return false;
            };

            $scope.addCounter = function() {
                if($scope.newCounter.counterNum){
                    for(var i=0;i< $scope.counters.length;i++){
                        if($scope.counters[i].counterNum===$scope.newCounter.counterNum)return;
                    }

                    $scope.newCounter.action="new";
                    $http.post('/updateCounter',$scope.newCounter).success(function(response) {
                        if(response.responseCode==='0'){
                            $scope.newCounter.buzzTypes = [];
                            $scope.counters.push($scope.newCounter);
                            $scope.newCounter = {};
                        }
                    })
                }
            };

            $scope.deleteCounter = function($index) {
                var counter = $scope.counters[$index];
                counter.action="delete";
                $http.post('/updateCounter',counter).success(function(response) {
                    if(response.responseCode==='0'){
                        $scope.counters.splice($index, 1);
                        if ($scope.currCounter) {
                            if (counter.counterNum === $scope.currCounter.counterNum) delete $scope.currCounter;
                        }
                    }
                })
            };

            $scope.modifyCounter = function(counter) {
                if(counter)counter.modify=!counter.modify;
                if(!counter || (counter && !counter.modify)){
                    $scope.currCounter.action="modify";
                    $http.post('/updateCounter',$scope.currCounter).success(function(response) {
                        if(response.responseCode==='0'){
                        }
                    });
                }
            };

            $scope.addCounterBuzz = function() {
                if ($scope.currCounter) {
                    var bts = [].concat.apply([], $scope.currCounter.buzzTypes);
                    if (bts.length < $scope.buzzTypes.length) {
                        for (var i = 0; i < $scope.currCounter.buzzTypes.length; i++)
                            if ($scope.currCounter.buzzTypes[i].length === 0) return;
                        $scope.currCounter.buzzTypes.push([]);
                    }
                    $scope.currCounter.action="modify";
                    $http.post('/updateCounter',$scope.currCounter).success(function(response) {
                        if(response.responseCode==='0'){

                        }
                    })
                }
            };

            $scope.deleteCounterBuzz = function($index) {
                $scope.currCounter.action="modify";
                $http.post('/updateCounter',$scope.currCounter).success(function(response) {
                    if(response.responseCode==='0')$scope.currCounter.buzzTypes.splice($index, 1);
                });
            };

            $scope.systemCtrl = function(action) {
                if(action.indexOf('restart') >= 0) $scope.rebootInfo='系统正在重启中，请稍等 .... ';
                else $scope.rebootInfo='系统将在10秒内关闭 ....';
                $http.post('/systemCtrl', {
                    action: action
                }).success(function(response) {
                    if (action === 'soft_restart') {
                        $timeout(function() {
                            window.location.reload();
                        }, 5000);
                    }
                });
            };

            $scope.statResult=[];
            $scope.stat = function() {
                if(!$scope.stat.startTransTime || !$scope.stat.endTransTime)return;
                var start = $filter('date')(new Date($scope.stat.startTransTime), 'yyyy-MM-dd hh:mm:ss');
                var end = $filter('date')(new Date($scope.stat.endTransTime), 'yyyy-MM-dd hh:mm:ss');
                var stuff = ($scope.stat.stuff && $scope.stat.stuff.stuffId ) || '';

                $http.post('/reportStat', {start: start, end: end, stuff:stuff}).success(function(response) {
                    if (response.responseCode == '0') {
                        $scope.statResult = response.result;
                        $scope.exportStatUrl = 'data:text/csv;charset=UTF-8,\ufeff';
                        var csvData = ['统计人员：'+(($scope.stat.stuff && $scope.stat.stuff.stuffName ) ||'全部人员') + '，统计时间段：'+start+' -- '+ end];
                        csvData.push('业务类型,业务名称,平均办理时间(分钟),平均等待时间(分钟)');
                        $scope.statResult.forEach(function(line) {
                            csvData.push(line.buzzType + ' ,' +line.buzzName + ',' + line.avService + ',' + line.avWait );
                        });
                        $scope.exportStatUrl += encodeURIComponent(csvData.join('\n'));
                    }
                });
            };
            $scope.statCondChanged = function(){
                $scope.statResult=[];
                $scope.exportStatUrl=''
            };

            $scope.queryResult={
                result:[],
                pages:0,
                currPage:1,
                showResult:[]
            };

            var pageSize = 15;
            $scope.prevPage = function(){
                if($scope.queryResult.currPage <= 1)return;
                $scope.queryResult.currPage--;
                $scope.queryResult.showResult = $scope.queryResult.result.slice(($scope.queryResult.currPage-1)*pageSize,$scope.queryResult.currPage*pageSize);
            };

            $scope.nextPage = function(){
                if($scope.queryResult.currPage >= $scope.queryResult.pages)return;
                $scope.queryResult.currPage++;
                $scope.queryResult.showResult = $scope.queryResult.result.slice(($scope.queryResult.currPage-1)*pageSize,$scope.queryResult.currPage*pageSize);
            };
            $scope.toPage = function(page){
                if(page<1 || page > $scope.queryResult.pages)return;
                $scope.queryResult.currPage = page;
                $scope.queryResult.showResult = $scope.queryResult.result.slice(($scope.queryResult.currPage-1)*pageSize,$scope.queryResult.currPage*pageSize);
            }

            $scope.query = function() {
                if(!$scope.query.startTransTime || !$scope.query.endTransTime)return;
                var start = $filter('date')(new Date($scope.query.startTransTime), 'yyyy-MM-dd hh:mm:ss');
                var end = $filter('date')(new Date($scope.query.endTransTime), 'yyyy-MM-dd hh:mm:ss');
                var stuff = ($scope.query.stuff && $scope.query.stuff.stuffId ) || '';

                $http.post('/query', {start: start, end: end, buzzType: $scope.query.buzzType, stuff:stuff,timeOut:$scope.query.timeOut}).success(function(response) {
                    if (response.responseCode == '0') {
                        $scope.queryResult.result = response.result;
                        $scope.queryResult.pages = Math.ceil($scope.queryResult.result.length / pageSize);
                        $scope.queryResult.currPage = 1;
                        $scope.queryResult.showResult = $scope.queryResult.result.slice(($scope.queryResult.currPage-1)*pageSize,pageSize);
                        $scope.exportQueryUrl = 'data:text/csv;charset=UTF-8,\ufeff';
                        var csvData = ['查询时间段：'+start+' -- '+ end];
                        csvData.push('工号,票号,柜台号,业务类型,业务名称,取号时间,呼叫时间,呼叫次数,开始办理,完成时间,办理名称,客户评价,超时原因');
                        $scope.queryResult.result.forEach(function(line) {
                            csvData.push((line.stuffId||'') + ' ,' +line.ticketNum + ',' + line.counterNum + ',' + line.buzzType + ',' + (line.buzzName || '') + ',' + (line.createTime ||'') + ',' +line.callTime + ',' + line.callTimes + ',' + (line.startServiceTime||'') + ',' +  line.endServiceTime + ',' + (line.subBuzzName || '')+ ',' + line.serviceRate+ ',' + (line.timeOutReason||''));
                        });
                        $scope.exportQueryUrl += encodeURIComponent(csvData.join('\n'));
                    }
                });
            };

            $scope.queryCondChanged = function(){
                $scope.queryResult.result=[];
                $scope.queryResult.showResult=[];
                $scope.queryResult.currPage=1;
                $scope.queryResult.pages=1;
                $scope.exportQueryUrl='';
            };

            $scope.currDutyDayChanged = function(currDutyDay){
                $scope.currDutyDay = currDutyDay;
            };
        }
    ]);
