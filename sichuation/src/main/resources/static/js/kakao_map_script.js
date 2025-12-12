var map=null;
var markers = [];
var geocoder = null;

function initKakaoMap() {
    // 1. HTML에서 지도 컨테이너를 가져옵니다.
    var container = document.getElementById('map'); 
    
    // HTML에 'map' ID를 가진 요소가 없는 경우를 대비하여 null 체크를 추가하는 것이 좋습니다.
    if (!container) {
        console.error("지도를 표시할 'map' 요소를 찾을 수 없습니다.");
        return;
    }

    // 2. 지도 옵션 설정 (이 코드는 변경할 필요 없습니다.)
    var options = {
        center: new kakao.maps.LatLng(37.341490, 126.733330), // 원하는 좌표
        level: 3
    };

    // 3. 지도를 생성합니다.
    map = new kakao.maps.Map(container, options);
    
    // 주소좌표객체 생성
    geocoder = new kakao.maps.services.Geocoder();
    console.log("카카오맵이 성공적으로 생성되었습니다.");
}

function searchAddress() {
    // 1. 입력 필드의 값(주소)을 가져옵니다.
    var address = document.getElementById('addressInput').value;

    if (!map||!address) {
            alert("js에러");
            return;
    }

    // 2. 주소로 좌표를 검색합니다.
    geocoder.addressSearch(address, function(result, status) {

        if (status === kakao.maps.services.Status.OK) {
            // 검색 성공 시: 결과는 result[0]에 담겨 있습니다.
            var coords = new kakao.maps.LatLng(result[0].y, result[0].x);

            // 3. 새로운 마커를 생성하고 지도에 표시합니다.
            var newMarker = new kakao.maps.Marker({ // 'var newMarker'로 선언
                map: map,
                position: coords
            });

            // 4. 생성된 마커를 배열에 추가합니다.
            markers.push(newMarker);

            // 5. 지도의 중심을 마커가 있는 위치로 이동합니다.
            map.setCenter(coords);

            console.log("주소 검색 성공:", result[0].address_name);

        } else {
            // 검색 실패 시
            alert('주소 검색에 실패했습니다. (상태: ' + status + ')');
        }
    });
}