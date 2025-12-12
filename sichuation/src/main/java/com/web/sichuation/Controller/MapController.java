package com.web.sichuation.Controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;


@Controller
public class MapController {

    // http://localhost:8080/ 로 접속 시 실행
    @GetMapping("/")
    public String home() {
        // templates 폴더의 index.html 파일을 렌더링하도록 지정
        return "index.html";
    }

    // http://localhost:8080/map 으로 요청 시 실행
    @GetMapping("/map")
    public String kakaoMapPage() {
        // 'forward:' 접두사를 사용하면, /kakao_map.html (static 폴더의 파일)로 포워딩합니다.
        // 이는 브라우저 주소창은 /map으로 유지됩니다.
        return "forward:/kakao_map.html";
    }
}