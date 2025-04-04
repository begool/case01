


// 연산 관련 function ----------------------------------------------------------------------------------

function transpose(matrix) {
    return matrix[0].map((col, i) => matrix.map(row => row[i]));
}

function getColumnsByIndex_(arr, colIndexes) {
    return arr.reduce(function(p, c) {
        p.push(colIndexes.map(function(d) {
            return c[d];
        }));
        return p;
    }, []);
}

function getDistance(lat1,lng1,lat2,lng2) {
    function deg2rad(deg) {
        return deg * (Math.PI/180)
    }
    let R = 6371; // Radius of the earth in km
    let dLat = deg2rad(lat2-lat1);  // deg2rad below
    let dLon = deg2rad(lng2-lng1);
    let a = Math.sin(dLat/2) * Math.sin(dLat/2) + Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLon/2) * Math.sin(dLon/2);
    let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    let d = R * c; // Distance in km
    
    d = d*1.4;

    return d; 
}


function morethan3lanes (data3lane, data2lane, requestids) {

    let result_data_x = [];

    for (let i=0; i<data3lane.length ; i++) {
        for (let j=0; j<data2lane.length ; j++) {
            if (data3lane[i][requestids] == data2lane[j][0] ) {
                let curr_result = [data3lane[i].concat(data2lane[j])];
                result_data_x = result_data_x.concat(curr_result); 
            }
        }
    }

    return result_data_x;
}

// 3turn  잡는 로직
function cal3Lanes (result_data, requestids) {

    let result_data_a = [];

    result_data.forEach(function (start_lane) {

        let end_lane_list = result_data.filter( row => row[0] == start_lane[requestids] );
        
        end_lane_list.forEach(function (end_lane) {
        let curr_result = [start_lane.concat(end_lane)];
        result_data_a = result_data_a.concat(curr_result);
        // Logger.log(curr_result)
        });

    })

    return result_data_a;
}

function getUniqueRows_(data) {
    const keys = data.map(row => row.join('→'));
    return data.filter((row, index) => keys.indexOf(row.join('→')) === index);
}


// 
function totaleict(result_data) {

    // 위경도로 다음 연결/출발지까지 공차거리 산출
    for (let p=0; p<result_data.length ; p++) {
        result_data[p].push(   0   );
    }
    for (let i=0; i<result_data.length ; i++) {
        result_data[i][24] = getDistance( Number(result_data[i][5]), Number(result_data[i][6]),  Number(result_data[i][14]),  Number(result_data[i][15]) );
    }
    
    // requestid 조합을 표기
    for (let p=0; p<result_data.length ; p++) {
        result_data[p].push(   0   );
    }
    for (let i=0; i<result_data.length ; i++) {
        result_data[i][25] = result_data[i][0] + '|' + result_data[i][12]; 
    }
    
    // truck cost의 합계를 표기
    for (let p=0; p<result_data.length ; p++) {
        result_data[p].push(   0   );
    }			
    for (let i=0; i<result_data.length ; i++) {
        result_data[i][26] = Number(result_data[i][11]) + Number(result_data[i][23]); 
    }
    
    // 총운행 시간의 합계를 표기
    for (let p=0; p<result_data.length ; p++) {
        result_data[p].push(   0   );
    }			
    for (let i=0; i<result_data.length ; i++) {
        result_data[i][27] = Number(result_data[i][21]) - Number(result_data[i][8]); 
    }

    return result_data;
}


function lanes3_eict(lanes3, maxempty) {

    for (let i=0; i<lanes3.length ; i++) {
        // 위경도로 다음 연결/출발지까지 공차거리 산출
        lanes3[i][24] = Number(lanes3[i][24]) + Number(lanes3[i][52]);
        // requestid 조합을 표기
        lanes3[i][25] = lanes3[i][25] + '|' + lanes3[i][40];
        // truck cost의 합계를 표기
        lanes3[i][26] = Number(lanes3[i][26]) + Number(lanes3[i][51]);
        // 총운행 시간의 합계를 표기
        lanes3[i][27] = Number(lanes3[i][49]) - Number(lanes3[i][8]);
        
        lanes3[i][12] = lanes3[i][12+28];
        lanes3[i][13] = lanes3[i][13+28];
        lanes3[i][14] = lanes3[i][14+28];
        lanes3[i][15] = lanes3[i][15+28];
        lanes3[i][16] = lanes3[i][16+28];
        lanes3[i][17] = lanes3[i][17+28];
        lanes3[i][18] = lanes3[i][18+28];
        lanes3[i][19] = lanes3[i][19+28];
        lanes3[i][20] = lanes3[i][20+28];
        lanes3[i][21] = lanes3[i][21+28];
        lanes3[i][22] = lanes3[i][22+28];
        lanes3[i][23] = lanes3[i][23+28];
    }
    lanes3 = lanes3.filter(row => row[24] <= maxempty);
    
    return lanes3;
}


// 배열에서 첫번째 칼럼 중복 제거
function removeDuplicateRows(array) {
  
  var uniqueArray = [];
  var seenValues = {};

  for (var i = 0; i < array.length; i++) {
    var firstColumnValue = array[i][0];
    if (!seenValues[firstColumnValue]) {
      uniqueArray.push(array[i]);
      seenValues[firstColumnValue] = true;
    }
  }
  
  return uniqueArray;
}


// 배열에서 첫번째, 두번째 칼럼 동시 중복 제거
function remove2DuplicateRows(array) {
  var uniqueArray = [];
  var seenValues = {};

  for (var i = 0; i < array.length; i++) {
    var firstColumnValue = array[i][0];
    var secondColumnValue = array[i][12];
    var combinedValue = firstColumnValue + ',' + secondColumnValue;

    if (!seenValues[combinedValue]) {
      uniqueArray.push(array[i]);
      seenValues[combinedValue] = true;
    }
  }

  return uniqueArray;
}

// 두 배열간에 교집합 배열을 return 함
function getCommon(array1, depa_row1, dest_row1, array2, depa_row2, dest_row2){
    let arrayCommon = array1.filter(row1 => 
        array2.some(row2 => row1[depa_row1] === row2[depa_row2] && row1[dest_row1] === row2[dest_row2])
    );
    return arrayCommon;
}



// list에 포함되지 않는 array를 filter하는 function
function getDiffer(array1, col1, list1) {
    const filteredArray = array1.filter(row => !list1.includes(row[col1]));
    return filteredArray;
}

// Array를 list로 변환하는 function
function arrayToList(array) {
  let list = null;
  for (let i = array.length - 1; i >= 0; i--) {
    list = { value: array[i], rest: list };
  }
  return list;
}




// pivot 진행 거리까지 3개버전
function getPivotedArr(lsData, col1, col2, col3) {
    
    let ls_grouped = {};
    
    lsData.forEach(row => {
        let key = `${row[col1]}-${row[col2]}-${row[col3]}`;
        if (!ls_grouped[key]) {
            ls_grouped[key] = [row[col1], row[col2], row[col3], 0]; // Initialize with departure_name, destination_name, distance, and count
        }
        ls_grouped[key][3] += 1; // Increment the count (truckrequestid)
    });
    
    return Object.values(ls_grouped);
            
}

// pivot 진행 거리까지 2개버전 - 출도만 
function getPivotedArrOnly2(lsData, col1, col2) {
    
    let ls_grouped = {};
    
    lsData.forEach(row => {
        let key = `${row[col1]}-${row[col2]}`;
        if (!ls_grouped[key]) {
            ls_grouped[key] = [row[col1], row[col2], 0]; // Initialize with departure_name, destination_name, distance, and count
        }
        ls_grouped[key][2] += 1; // Increment the count (truckrequestid)
    });
    
    return Object.values(ls_grouped);
            
}




async function simulData() {

    // 추가 고려 필요사항 
    /*
    1. 턴별 근무시간 
    2. 최소매출 고려 (35,000원 예상)
    */

    var data = []; // 데이터를 저장할 빈 배열을 생성합니다.

    data = readTableData('resultTable');
    
    data = data.map(row => {
      row[0] = 'VV'+row[0]+'ZZ';
      return row;
    });
    
    
    // 최대 대기 시간 120
    let maxWait = Number(document.getElementById("wait_txt").value);
    // 최대 직선 공차 거리 30 
    let maxempty = Number(document.getElementById("maxempty_txt").value);

    let lsData = data.filter( row => row[1] && row[1].toString().length > 1);
    // 원본 보존
    let initLSdata = lsData;
    
    // 출도착지 회전수로 pivot 진행
    let ls_grouped_arr = getPivotedArr(lsData,col1=1, col2=4, col3=10);
    
    // 셔틀 필터함 정방향 7회이상 거리 5km이하
    ls_grouped_arr = ls_grouped_arr.filter(row => row[3]>=7 && row[2]<=5  );
    
    // 두 배열간에 교집합 배열을 return 함
    let shuttleArr = getCommon(lsData, depa_row1=1, dest_row1=4, ls_grouped_arr, depa_row2=0, dest_row2=1);
    let shuttleIds = getColumnsByIndex_(arr = shuttleArr , colIndexes = [0]);
                
    // 셔틀 제외한 데이터 
    lsData = getDiffer(array1=lsData, col1=0, shuttleIds.join(",") );
    
    // 월대를 위해 --- 출도착지 회전수로 pivot 진행 역방향 & 정방향
    let fwd_arr = getPivotedArrOnly2(lsData, col1=1, col2=4);
    let rev_arr = getPivotedArrOnly2(lsData, col1=4, col2=1);

    const leftJoin2 = (arr1, arr2, keyIndex1_1, keyIndex1_2, keyIndex2_1, keyIndex2_2) => {
      return arr1.map(row1 => {
        const match = arr2.find(row2 => (row1[keyIndex1_1] === row2[keyIndex2_1]) && (row1[keyIndex1_2] === row2[keyIndex2_2])   );
        return match ? [...row1, ...match] : row1;
      });
    };

    let monthlyCro_join = leftJoin2(fwd_arr, rev_arr, keyIndex1_1= 0,keyIndex1_2= 1, keyIndex2_1=0, keyIndex2_2=1);
    monthlyCro_join = monthlyCro_join.filter(row => Number(row[2]) + Number(row[5]) >=4 || Number(row[2])>=4 );
    
    let monthlyCro_join1 = getColumnsByIndex_(  arr = monthlyCro_join , colIndexes = [0, 1 ]);
    let monthlyCro_join2 = getColumnsByIndex_(  arr = monthlyCro_join , colIndexes = [3, 4 ,5]);
    
    monthlyCro_join2 = monthlyCro_join2.filter(row => row[2]>0);
    monthlyCro_join2 = getColumnsByIndex_(  arr = monthlyCro_join2 , colIndexes = [0,1]);
    
    let monthlyArrLanes = monthlyCro_join1.concat(monthlyCro_join2);
    let monthlyArr = getCommon(lsData, depa_row1=1, dest_row1=4, monthlyArrLanes, depa_row2=0, dest_row2=1);
    monthlyArr = monthlyArr.filter(row => row[10] <= 45);
    
    let monthIds = getColumnsByIndex_(arr = monthlyArr , colIndexes = [0]);
                
    // 월대를 제외한 데이터
    lsData = getDiffer(array1=lsData, col1=0, monthIds.join(",") );
    
    
    
    let result_data = [];
    lsData.forEach(function (start_lane) {
        // 조건 1. id가 같지 않고, 접안시간이 start_lane 도착시간 이후여야 한다. 그리고 최대 대기 시간을 넘기지 않는다
        end_lane_list = lsData.filter( function(r) {

        if (r[0] != start_lane[0] ) {

            // 거리 구하기
            let se_distance = getDistance( Number(start_lane[5]), Number(start_lane[6]), Number(r[2]), Number(r[3] )  );
            
            // console.log(se_distance);
            
            let se_time = 0;

            if (se_distance>=100) {
            se_time = (se_distance/80)*60+15;
            } else if (se_distance<100 && se_distance >= 60) {
            se_time = se_distance+30;
            } else if (se_distance<60 && se_distance >= 40) {
            se_time = se_distance+30;
            }  else if (se_distance<40 && se_distance >= 10) {
            se_time = se_distance+30;
            } else {
            se_time = se_distance+15;
            }
            
            if (  (  Number(r[8]) > Number(start_lane[9]) + 10) && (  Number(r[8]) <= Number(start_lane[9]) + maxWait) ) {
                
                // // 다음 구간은 동일한 지점이거나 위경도 2km 이내면
                if (start_lane[4] == r[1] || se_distance < 2  ) {
                    return true;
                } else {  // 거리 parameter 여기에 넣자
                    if ( Number(r[8]) > Number(start_lane[9]) + se_time) {
                        return true;
                    } else {
                        return false;
                    }
                }
                
            } else {
                return false;
            }
            

        } else {
            return false;
        }
        } );
        
        
        
        end_lane_list.forEach(function (end_lane) {
            curr_result = [start_lane.concat(end_lane)];
            result_data = result_data.concat(curr_result);
        });
    })
    
    result_data = totaleict(result_data);
    result_data  = result_data.filter(row => row[24] <= maxempty);
                
    lanes2 = result_data;
    lanes2_input = 	getColumnsByIndex_(arr = lanes2 , colIndexes = [0, 1,	2,	3,	4,	5,	6,	7,	8,	9,	10,	11,	12,	13,	14,	15,	16,	17,	18,	19,	20,	21,	22,	23,	24, 25, 26 , 27] );		
    
    
    
    let lanes3 = [];
    
    
    const leftJoin1 = (arr1, arr2, keyIndex1,  keyIndex2) => {
      return arr1.map(row1 => {
        const match = arr2.find(row2 => (row1[keyIndex1] === row2[keyIndex2])    );
        return match ? [...row1, ...match] : row1;
      });
    };
    
    // test code 
    lanes3 = leftJoin1(lanes2_input, lanes2_input, keyIndex1= 12, keyIndex2= 0);
    lanes3 = lanes3.filter(row => row[55] > 0);
    
    
    // lanes3 = await cal3Lanes (result_data = lanes2_input, requestids = 12);
                
    lanes3 = lanes3_eict(lanes3, maxempty); 
    lanes3_input = 	getColumnsByIndex_(arr = lanes3 , colIndexes = [0, 1,	2,	3,	4,	5,	6,	7,	8,	9,	10,	11,	12,	13,	14,	15,	16,	17,	18,	19,	20,	21,	22,	23,	24, 25, 26 , 27] );
    
    // 공차거리로 정렬
    lanes3_input.sort(function(a, b) {
        return a[24] - b[24];
    });
    // 첫번째, 마지막 requestid 기준으로 중복 제거
    lanes3_input = remove2DuplicateRows(lanes3_input);
    lanes3_input = lanes3_input.slice(0,8000);
                
    let lanes4 = [];
    
    lanes4 = leftJoin1(lanes3_input, lanes2_input, keyIndex1= 12, keyIndex2= 0);
    lanes4 = lanes4.filter(row => row[55] > 0);
    
    // lanes4 = await cal3Lanes (result_data = lanes3_input, requestids = 12);
    
    lanes4 = lanes3_eict(lanes4, maxempty); 
    lanes4_input = 	getColumnsByIndex_(arr = lanes4 , colIndexes = [0, 1,	2,	3,	4,	5,	6,	7,	8,	9,	10,	11,	12,	13,	14,	15,	16,	17,	18,	19,	20,	21,	22,	23,	24, 25, 26 , 27] );
    
    // 공차거리로 정렬
    lanes4_input.sort(function(a, b) {
        return a[24] - b[24];
    });
    // 첫번째, 마지막 requestid 기준으로 중복 제거
    lanes4_input = remove2DuplicateRows(lanes4_input);
    lanes4_input = lanes4_input.slice(0,8000);
    
    
    
    
    let lanes5 = [];
    
    lanes5 = leftJoin1(lanes4_input, lanes2_input, keyIndex1= 12, keyIndex2= 0);
    lanes5 = lanes5.filter(row => row[55] > 0);
    
    //lanes5 = await cal3Lanes (result_data = lanes4_input, requestids = 12);
    lanes5 = lanes3_eict(lanes5, maxempty); 
    lanes5_input = 	getColumnsByIndex_(arr = lanes5 , colIndexes = [0, 1,	2,	3,	4,	5,	6,	7,	8,	9,	10,	11,	12,	13,	14,	15,	16,	17,	18,	19,	20,	21,	22,	23,	24, 25, 26 , 27] );
    
    // 공차거리로 정렬
    lanes5_input.sort(function(a, b) {
        return a[24] - b[24];
    });
    // 첫번째, 마지막 requestid 기준으로 중복 제거
    lanes5_input = remove2DuplicateRows(lanes5_input);
    lanes5_input = lanes5_input.slice(0,8000);
    
    
    let dis2r = 0.8;
    let dis3r = 0.75;
    
    
    lanes2_input = lanes2_input.map(row => [...row, '2연계']);	
    lanes2_input = lanes2_input.map(row => {
      row[26] = row[26]*dis2r;
      return row;
    });
    
    lanes3_input = lanes3_input.map(row => [...row, '3연계']);
    lanes3_input = lanes3_input.map(row => {
      row[26] = row[26]*dis3r;
      return row;
    });
    
    
    lanes4_input = lanes4_input.map(row => [...row, '4연계']);
    lanes4_input = lanes4_input.map(row => {
      row[26] = row[26]*dis3r;
      return row;
    });
    
    lanes5_input = lanes5_input.map(row => [...row, '5연계']);
    lanes5_input = lanes5_input.map(row => {
      row[26] = row[26]*dis3r;
      return row;
    });
    
    
    let lane1 = leftJoin1(arr1= lsData, arr2= lsData, keyIndex1= 0, keyIndex2= 0);
    let lane1_input = lane1.map(row => [...row, 0]);
    lane1_input = lane1_input.map(row => [...row, '']);
    lane1_input = lane1_input.map(row => {
      row[25] = row[0];
      return row;
    });
    lane1_input = lane1_input.map(row => [...row, '']);
    lane1_input = lane1_input.map(row => {
      row[26] = Number(row[23]);
      return row;
    });
    lane1_input = lane1_input.map(row => [...row, '']);
    lane1_input = lane1_input.map(row => {
      row[27] = Number(row[21])-Number(row[20]) ;
      return row;
    });
    lane1_input = lane1_input.map(row => [...row, '편도']);
    
    // 셔틀
    shuttleArr = shuttleArr.map(row => {
      row[25] = row[0];
      return row;
    });
    shuttleArr = shuttleArr.map(row => {
      row[26] = Number(row[11]);
      return row;
    });
    shuttleArr = shuttleArr.map(row => {
      row[27] = Number(row[9])-Number(row[8]) ;
      return row;
    });
    shuttleArr = shuttleArr.map(row => {
      row[28] = '셔틀' ;
      return row;
    });
    
    // 월대
    monthlyArr = monthlyArr.map(row => {
      row[25] = row[0];
      return row;
    });
    monthlyArr = monthlyArr.map(row => {
      row[26] = Number(row[11]);
      return row;
    });
    monthlyArr = monthlyArr.map(row => {
      row[27] = Number(row[9])-Number(row[8]) ;
      return row;
    });
    monthlyArr = monthlyArr.map(row => {
      row[28] = '월대' ;
      return row;
    });
    
    
    
    let linkedAll = lanes5_input.concat(lanes4_input).concat(lanes3_input).concat(lanes2_input).concat(lane1_input); 
    
    
    let maxReturn = 30;
    maxReturn = Number(document.getElementById("maxreturn_txt").value) ;
    
    let minHourCost = 35000;
    minHourCost = Number(document.getElementById("min_trn_hour_txt").value) ;
    
    let max3hour = 720;
    let max4hour = 840;
    let max5hour = 1020;
    
    max3hour = Number(document.getElementById("max3hour_txt").value);
    max4hour = Number(document.getElementById("max4hour_txt").value);
    max5hour = Number(document.getElementById("max5hour_txt").value);	
    
    // 링크 계산 안맞음
    linkedAll = linkedAll.map(row => {
        row[29] = getDistance(lat1=Number(row[2]),lng1=Number(row[3]),lat2=Number(row[17]),lng2=Number(row[18]));
        return row;
    });
    
    
    linkedAll = linkedAll.map(row => {
        
        if (row[28]=='3연계'||row[28]=='4연계'||row[28]=='5연계' ) {
            if ( (row[27]/60)*minHourCost > row[26] ) {
                row[26] = (row[27]/60)*minHourCost;
                row[28] = row[28] + '-최소매출';
            }
        }
        
        // 근무시간이 각 연계 타겟 시간을 초과하면 페널티를 부여한다
        
        if (row[28]=='3연계' && row[27]> max3hour) {
            row[26] = Number(row[26])+90000000;
        }
        
        if (row[28]=='4연계' && row[27]> max4hour) {
            row[26] = Number(row[26])+90000000;
        }
        
        if (row[28]=='5연계' && row[27]> max5hour) {
            row[26] = Number(row[26])+90000000;
        }
    
        if ((Number(row[29]) > maxReturn)) {
            if (row[28]=='2연계') {
                row[26] = Number(row[26])+90000000; //페널티를 부여하여 초과 복귀공차의 경우의 수를 없앤다
                row[28] = '2to편도';
            }
            if (row[28]=='3연계') {
                row[26] = Number(row[26])+90000000; //페널티를 부여하여 초과 복귀공차의 경우의 수를 없앤다
                row[28] = '3to편도';
            }
            if (row[28]=='4연계') {
                row[26] = Number(row[26])+90000000; //페널티를 부여하여 초과 복귀공차의 경우의 수를 없앤다
                row[28] = '4to편도';
            }
            if (row[28]=='5연계') {
                row[26] = Number(row[26])+90000000; //페널티를 부여하여 초과 복귀공차의 경우의 수를 없앤다
                row[28] = '5to편도';
            }
        }
                        
        return row;
    });
    
    
    
    // start ################################
    let model = {
        "optimize": "costs",
        "opType": "min",
        "constraints": {},
        "variables": {}
    };
    
    let truckids = getColumnsByIndex_(lsData, [0]);
    truckids = getUniqueRows_(truckids).flat();
    
    let cxcnt = 0;
    
    truckids.forEach(function (curr_id) {
    // var constraint = engine.addConstraint(0, 1);  // requestid 자체를 선택을 안할수도 있다
    
    let candidates_including_curr_id = linkedAll.filter(row => row[25].includes(curr_id));
            
        candidates_including_curr_id.forEach(function (cand) {
            
            let variable = {
                "costs": cand[26],
                [cand[25]]: 1,
                [curr_id+'SUM']: 1,
            }
            
            
            let idsplit = cand[25].split("|");
            
            for (let i=0; i <idsplit.length; i++) {
                if (idsplit[i].length>2) {
                    idsplit[i] = idsplit[i].trim()+'SUM';
                    variable[idsplit[i]]  =1;
                }
            }
            
            model.variables[cand[25]] = variable;
            model.constraints[cand[25]] = {
                "min": 0 ,
                "max": 1,
                "type": "integer",
            };
            
            model.constraints[curr_id+'SUM'] = {
                "min": 1 ,
                "max": 1,
                "type": "integer",
            };
            cxcnt = cxcnt + 1;
        })
    })

    // Solve the problem
    let results = solver.Solve(model);
    
    let resultdt = Object.entries(results).map(([key, value]) => [key, value]);
    
    
    let fin_link = getCommon(array1= linkedAll, depa_row1=25, dest_row1=25, array2=resultdt, depa_row2=0, dest_row2=0);
    fin_link = fin_link.concat( shuttleArr ).concat(monthlyArr);
    fin_link = getColumnsByIndex_(arr=fin_link, colIndexes=[25, 26, 27, 28, 24]);
    
    const leftJoinIncl = (arr1, arr2, keyIndex1, keyIndex2) => {
      return arr1.map(row1 => {
        const match = arr2.find(row2 =>  row2[keyIndex2].includes(row1[keyIndex1] )  );
        return match ? [...row1, ...match] : row1;
      });
    };
    
    initLSdata = getColumnsByIndex_(initLSdata, [0,1,2,3,4,5,6,7,8,9,10,11]);
    
    let combineArr = leftJoinIncl(arr1=initLSdata, arr2=fin_link, keyIndex1= 0,keyIndex2= 0);
    
    
    
    combineArr = combineArr.map(row => {
      row[0] = row[0].replace('VV', '').replace('ZZ', '') ;
      row[12] = row[12].replace('VV', '').replace('ZZ', '') ;
      return row;
    });
    
    let comHdr = ['요청 ID','출발지','출발지_위도','출발지_경도','도착지','도착지_위도','도착지_경도','접안요청시간_분','발차시간_분','도착시간_분','거리','원비용','연계 ID','수정비용','총운행시간_분','비용구분', '복귀공차'];
    combineArr = [ comHdr , ...combineArr.map(item => Object.values(item))];
    //console.log(initLSdata);
    XdownloadCSV(combineArr, '경로 최적화 결과.csv');
    // end ################################
    
}

function XdownloadCSV(array, filename) {
    // CSV 문자열 생성
    const csvContent = array.map(row => row.map(value => `"${value}"`).join(",")).join("\n");
    // BOM 추가 (Excel에서 ANSI로 인식하게 함)
    const bom = new Uint8Array([0xEF, 0xBB, 0xBF]); // UTF-8 BOM 추가 (Excel에서 ANSI처럼 읽힘)
    // Blob 생성 (UTF-8 + BOM)
    const blob = new Blob([bom, csvContent], { type: "text/csv;charset=utf-8;" });
    // URL 생성
    const url = URL.createObjectURL(blob);
    // 가상 링크 생성 후 클릭하여 다운로드
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    // 정리
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

function getColumnCount(arr) {
    if (arr.length === 0) {
        return 0; // 빈 배열인 경우
    }
    return arr[0].length; // 첫 번째 행(row)의 길이 반환
}


function readTableData(tableId) {
    
    var data = []; // 데이터를 저장할 빈 배열을 생성합니다.

    const table = document.getElementById(tableId);
    const rows = table.getElementsByTagName('tr');
    
    for (let i = 0; i < rows.length; i++) { 
        const cells = rows[i].getElementsByTagName('td');
        const row_data = [];
        for (let j = 0; j < cells.length; j++) {
            row_data.push(cells[j].textContent);
        }
        data.push(row_data);
    }

    return data;
}



function parseCSV(data) {
    const rows = data.split('\n');
    return rows.map(row => row.split(','));
}


function clearTable(tableId) {
    const table = document.getElementById(tableId);
    table.innerHTML = ''; // Clear any existing content
}

function displayTable(data, tableIds) {
    
    //document.getElementById("text01").value = getColumnCount(data) + '::' + tableIds;
    
    const table = document.getElementById(tableIds);
    //table.innerHTML = ''; // Clear any existing content
    // Create table headers
    /*const headers = data[0];
    const headerRow = document.createElement('tr');
    headers.forEach(header => {
        const th = document.createElement('th');
        th.textContent = header;
        headerRow.appendChild(th);
    });
    table.appendChild(headerRow);*/
    
    var rowCount = table.rows.length;
    for (var i = rowCount - 1; i > 0; i--) {
        table.deleteRow(i);
    }


    // Create table rows
    for (let i = 0; i < data.length; i++) {
        const row = document.createElement('tr');
        data[i].forEach(cell => {
            const td = document.createElement('td');
            td.textContent = cell;
            row.appendChild(td);
        });
        table.appendChild(row);
    }
}

document.addEventListener("DOMContentLoaded", function() {
    document.getElementById("simulBtn").addEventListener("click", function() {
        simulData();
    });
});

document.addEventListener("DOMContentLoaded", function() {
    document.getElementById("file").addEventListener("change", function() {
        const file = event.target.files[0];
    
        if (file) {
            
            const reader = new FileReader();
            reader.onload = function(e) {
                const contents = e.target.result;
                const fdata = parseCSV(contents);
                displayTable(fdata, 'resultTable');
            };
            reader.readAsText(file);
        }
    });
});
