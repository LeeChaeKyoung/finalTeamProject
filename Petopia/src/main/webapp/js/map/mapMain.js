// 마커를 담을 배열
var markers = [];
//마커를 클릭했을 때 해당 장소의 정보를 보여줄 커스텀오버레이
var placeOverlay = new kakao.maps.CustomOverlay({ zIndex: 1 }),
	contentNode = document.createElement('div'); //커스텀 오버레이의 컨텐츠 엘리먼트

var mapContainer = document.getElementById("map"),
	mapOptions = {
		center: new kakao.maps.LatLng(37.566826, 126.9786567), //지도 중심 좌표
		level: 3 //지도확대레벨
	}
// 지도 생성
var map = new kakao.maps.Map(mapContainer, mapOptions);

var lat = 37.566826;
var lng = 126.9786567;
var m = 1000;
var locPosition;
//현재 나의 위치로 이동
function locationLoadSuccess(position) {
	lat = position.coords.latitude; //위도
	lon = position.coords.longitude; //경도

	locPosition = new kakao.maps.LatLng(lat, lon);

	map.setCenter(locPosition);
	map.setLevel(3);
	ps.keywordSearch('동물병원', placesSearchOk, {
		location: new kakao.maps.LatLng(lat, lon)
	});
};
function locationLoadError(pos) {
	alert('위치 정보를 가져오는데 실패했습니다.');
	locPosition = new kakao.maps.LatLng(37.566826, 126.9786567);
	map.setCenter(locPosition);
};
// 위치 가져오기 버튼 클릭시
function getCurrentPosBtn() {
	navigator.geolocation.getCurrentPosition(locationLoadSuccess, locationLoadError);
};

//장소 검색 객체를 생성
var ps = new kakao.maps.services.Places();
ps.keywordSearch('동물병원', placesSearchOk, {
	location: new kakao.maps.LatLng(37.566826, 126.9786567),
	level: 3
});
//커스텀 오버레이의 컨텐츠 노드에 css class를 추가
contentNode.className = 'placeinfo_wrap';

//지도 객체에 이벤트 전달되는거 막기
addEventHandle(contentNode, 'mousedown', kakao.maps.event.preventMap);
addEventHandle(contentNode, 'touchstart', kakao.maps.event.preventMap);
//커스텀 오버레이 컨텐츠 설정하기
placeOverlay.setContent(contentNode);
let boundsChange = [];


/*
kakao.maps.event.addListener(map, 'idle', searchPlaces);
//idle이벤트로 지도 드래그해서 범위 바꿀 때 마다 마커 새로 고침
kakao.maps.event.addListener(map, 'idle', function() {
	var level = map.getLevel();
	var latlng = map.getCenter();
	
	if(level>3){
		m = 5000;
	} else if(level == 3){
		m = 2500;
	} else if(level == 2){
		m = 1000;
	} else if(level == 1){
		m = 500;
	}
});
*/

//엘리먼트에 이벤트 핸들러를 등록하는 함수
function addEventHandle(target, type, callback) {
	if (target.addEventListener) {
		target.addEventListener(type, callback);
	} else {
		target.attachEvent('on' + type, callback);
	}
}
//키워드 검색을 요청하는 함수
function searchPlaces() {
	var keyword = document.getElementById('keyword').value;

	if (!keyword.replace('')) {
		alert("지역을 입력해주세요.");
		return false;
	}
	// 장소검색 객체를 통해 키워드로 장소검색을 요청
	ps.keywordSearch(keyword + ' 동물병원', placesSearchOk);
	$("#keyword").val('');
}

// 장소 검색이 완료됐을 때 호출되는 함수
function placesSearchOk(data, status) {
	if (status === kakao.maps.services.Status.OK) {
		//정상적으로 검색이 완료됐을 때 (검색목록과 마커 표출)
		displayPlaces(data);
	} else if (status === kakao.maps.services.Status.ZERO_RESULT) {
		alert("검색 결과가 존재하지 않습니다.")
		return;
	} else if (status === kakao.maps.services.Status.ERROR) {
		alert("검색 결과 중 오류가 발생했습니다.");
		return;
	}
}

function addPlace(places) {
	//id, 
	arr = []
	for (var i = 0; i < places.length; i++) {
		var p = places[i];
		var a = {
			'shopid': p.id,
			'shopname': p.place_name,
			'shopaddr': p.road_address_name,
			'shopnumber': p.phone
		}
		arr.push(a);
	}
	var obj = {
		places: arr
	}
	var str = JSON.stringify(obj);
	//alert(str)
	$.ajax({
		type: "POST",
		url: "/map/insertshop",
		contentType: "application/json",
		data: str,
		success: function(res) {
			//alert(res);
		}
	});
}
//검색 결과 목록과 마커를 표출하는 함수
function displayPlaces(places) {
	var listEl = document.getElementById('placesList'),
		menuEl = document.getElementById('menu_wrap'),
		fragment = document.createDocumentFragment(),
		bounds = new kakao.maps.LatLngBounds(),
		listStr = "";
	//검색 결과 목록에 추가된 항목들을 제거
	removeAllChildNods(listEl);
	// 지도에 표시되고 있는 마커 제거
	removeMarker();
	addPlace(places);
	for (var i = 0; i < places.length; i++) {
		//마커 생성하고 지도에 표시
		var placePosition = new kakao.maps.LatLng(places[i].y, places[i].x),
			marker = addMarker(placePosition, i);
		itemEl = getListItem(i, places[i]); //검색 결과 항목 Element를 생성
		//검색된 장소 위치를 기준으로 지도 범위를 재설정.
		//LatLngBounds객체에 좌표 추가
		bounds.extend(placePosition);

		//마커 클릭시, 커스텀 오버레이창 띄우기
		(function(marker, place) {
			kakao.maps.event.addListener(marker, 'click', function() {
				displayPlaceInfo(place);
			});
		})(marker, places[i]);
		fragment.appendChild(itemEl);
	}
	//검색 결과 항목들을 검색결과 목록 Element에 추가
	listEl.appendChild(fragment);
	menuEl.scrollTop = 0;

	//검색된 장소 위치를 기준으로 지도 범위를 재설정
	map.setBounds(bounds);
}

//마커를 생성하고 지도 위에 마커를 표시하는 함수
function addMarker(position, idx) {
	var imageSrc = '/img/map/veterinarian-3.png'; //마커 이미지 url, 스프라이트 이미지사용
	var imageSize = new kakao.maps.Size(64, 64), // 마커이미지의 크기입니다
		imageOption = { offset: new kakao.maps.Point(27, 69) }; // 마커이미지의 옵션입니다. 마커의 좌표와 일치시킬 이미지 안에서의 좌표를 설정합니다.
	markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize, imageOption),
		marker = new kakao.maps.Marker({
			position: position, //마커위치
			image: markerImage
		});
	marker.setMap(map); //지도 위에 마커를 표출
	markers.push(marker);	//배열에 생성된 마커를 추가

	return marker;
}
// 지도 위에 표시되고 있는 마커 모두 제거
function removeMarker() {
	for (var i = 0; i < markers.length; i++) {
		markers[i].setMap(null);
	}
	markers = [];
}
//검색 결과 항목을 Element로 반환하는 함수
function getListItem(index, places) {
	var el = document.createElement('li');
	var itemStr = '<span class="markerbg marker_' + (index + 1) + '"></span>' +
		'<div class="info" onclick="openInfo('+places.id+')">' +
		'	<h5 name="shopname">' + places.place_name + '</h5><span name="shopid">' + places.id + '</span>';

	if (places.road_address_name) {
		itemStr += '	<span name="shopaddr">' + places.road_address_name + '</span>' +
			'	<span class="jibun gray"">' + places.address_name + '</span';
	} else {
		itemStr += '	<span>' + places.address_name + '</span>';
	}
	itemStr += '	<span class="tel" name="shopnumber">' + places.phone + '</span>' +
		'</div>';
	el.innerHTML = itemStr;
	el.className = 'item';

	return el;
}
function openInfo(sid) {
	
	selectReview(sid);
}
function selectReview(sid) {
	let url = "/map/reviewList";
	let data = "shopid=" + sid;
	$.ajax({
		url: url,
		data: data,
		async: false,
		cache: false,
		success: function(res) {
			$('.host_info2').html("");
			$("#host_review2").html("");
			if (res.length > 0 && res[0].shopid == sid) {
				let str2 = `<span name="shopid" id="` + res[0].shopid + `" style="display:hidden"></span>
				<span name="shopname" id="shopname" style="color:#212121;font-weight:bold;font-size:1.5em">`+ res[0].shopname + `</span><br/>
				<span id="shopaddr" style="color:#434343;font-size:1.5em">`+ res[0].shopaddr + `</span><br/>
				<span id="shopnumber" style="color:#434343;font-size:1.2em">`+ res[0].shopnumber + `</span>`;
				$('.host_info2').html(str2);

				var str = ''
				$(res).each(function(idx, shop) {
					str += `<div style="border:1px solid #ddd; margin:5px;"><span style="font-size:1.5em;font-weight:bold;margin:3px">` + shop.userid + `</span>` +
						`<span style="color:#696969">   ` + shop.writedate + `</span>` +
						`<div><span style="font-size:1.2em;margin:5px;">` + shop.shopreview + `</span><br/></div></div>`;
					str += `<span class="btns"><input type="button" class="btn" value="수정">`;
					str += `<input type="button" class="btn" value="삭제" title="` + shop.reviewno + `"></span></div>`;
					/*
					if(shop.userid==userid){
						str+=`<div style="display:none"><form method="post">`;
						str+=`<input type="hidden" name="shopid" id="shopid" value="`+shop.shopid+`">`;
						str+=`<div class="map_review"><textarea name="shopreview">`+shop.shopreview+`</textarea><br/>`;
						str+=`<input type="submit" class="rev_btn" value="수정하기"><br/>`;
						str+=`<input type="file" name="filename" id="filename"/></div></form></div>`;
					}*/
				})
				$("#host_review2").html(str);
				$("#menu_wrap_2").toggle(
					function() { $("#menu_wrap_2").addClass('show') }, //클릭하면 show클래스 적용되서 보이기
					function() { $("#menu_wrap_2").addClass('hide') } //한 번 더 클릭하면 hide클래스가 숨기기
				)
			}
			else {
				let str3 = `<span name="shopid" id="` + res[0].shopid + `" style="display:hidden"></span>
				<span name="shopname" id="shopname" style="color:#212121;font-weight:bold;font-size:1.5em">`+ res[0].shopname + `</span><br/>
				<span id="shopaddr" style="color:#434343;font-size:1.5em">`+ res[0].shopaddr + `</span><br/>
				<span id="shopnumber" style="color:#434343;font-size:1.2em">`+ res[0].shopnumber + `</span>`;
				$('.host_info2').html(str3);
				$("#menu_wrap_2").toggle(
					function() { $("#menu_wrap_2").addClass('show') }, //클릭하면 show클래스 적용되서 보이기
					function() { $("#menu_wrap_2").addClass('hide') } //한 번 더 클릭하면 hide클래스가 숨기기
				)
			}
		}
	})
}
//수정버튼 클릭 시
$(document).on('click', '#reviewList input[value=수정]', function() {
	$(this).parent().css("display", "none");
	$(this).parent().next().css("display", "block");
})
// DB 수정
$(document).on('submit', '#reviewList form', function() {
	event.preventDefault();

	$.ajax({
		url: 'editOk',
		data: $(this).serialize(),
		type: "POST",
		success: function() {
			selectReview();
		}, error: function() {
			console.log("수정실패");
		}
	})
})
//리뷰 삭제
$(document).on('click', "#reviewList input[value=삭제]", function() {
	if (confirm('리뷰를 삭제하시겠습니까?')) {
		let data = "reviewno=" + $(this).attr("title");
		$.ajax({
			url: "deleteOk",
			data: data,
			success: function() {
				selectReview();
			}, error: function() {
				console.log("삭제 실패");
			}
		})
	}
})
//클릭한 마커에 대한 장소 정보를 커스텀 오버레이로 표시하는 함수
function displayPlaceInfo(place) {
	var content = '<div class="placeinfo">' +
		'	<div class="title_close"><div class="close" onclick="closeOverlay()" title="닫기"></div><a class="title" name="shopname" onclick="openInfo(' + place.id + ')" title="' + place.place_name + '">' + place.place_name + '</a></div>';

	if (place.road_address_name) {
		content += '	<span title="' + place.road_address_name + '">' + place.road_address_name + '</span>' +
			'	<span class="jibun" title="' + place.address_name + '">(지번: ' + place.address_name + ')</span>';
	} else {
		content += '	<span title="' + place.address_name + '">' + place.address_name + '</span>';
	}
	content += '	<span class="tel">' + place.phone + '</span>' +
		'	<form method="post" id="reviewFrm" enctype="multipart/form-data" onsubmit="sendFile()">' + '<input type="hidden" name="shopid" id="shopid" value="' + place.id + '">' +
		'<div class="map_review"><textarea name="shopreview" id="shopreview"></textarea>' +
		'<input type="submit" class="rev_btn" value="글쓰기"><br/>' +
		'<input type="file" name="filename" id="filename"/>' +
		'</div></form>' +
		'</div>' +
		'<div class="after"></div>';
	contentNode.innerHTML = content;
	placeOverlay.setPosition(new kakao.maps.LatLng(place.y, place.x));
	placeOverlay.setMap(map);
}
function sendFile() {
	event.preventDefault();

	if ($("#shopreview").val() == "") { //리뷰 입력 안함
		alert("리뷰를 입력 후에 등록해주세요");
		return;
	}

	// 리뷰 입력
	var data = new FormData($("#reviewFrm")[0]); // form데이터 보내기
	$.ajax({
		url: '/map/writeOk',
		dataType: 'text',
		data: data,
		type: 'POST',
		processData: false,
		contentType: false,
		success: function(result) {
			$("#shopreview").val("");
			$("#filename").val("");
		}
	});
}

//검색결과 목록의 자식 Element를 제거하는 함수
function removeAllChildNods(el) {
	while (el.hasChildNodes()) {
		el.removeChild(el.lastChild);
	}
}
//커스텀 오버레이를 닫기 위해 호출되는 함수
function closeOverlay() {
	placeOverlay.setMap(null);
}
/*
// 검색 결과 목록이나 마커를 클릭했을 때 장소명을 표출할 인포윈도우를 생성
var infoWindow = new kakao.maps.InfoWindow({zIndex:1});
searchPlaces(); //키워드로 장소 검색

//검색결과 목록 또는 마커를 클릭했을 때 호출되는 함수
// 인포윈도우에 장소명을 표시
function displayInfowindow(marker, title){
	var content = '<div style="padding:5px; z-index:1;">' + title + '</div>';

	infoWindow.setContent(content);
	infoWindow.open(map, marker);
}
 */