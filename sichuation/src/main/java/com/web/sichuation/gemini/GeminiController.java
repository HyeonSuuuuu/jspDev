package com.web.sichuation.gemini;

import org.springframework.web.bind.annotation.*;

/**
 * Gemini 챗봇 테스트용 Controller
 */
@RestController
@RequestMapping("/api/gemini")
@CrossOrigin(origins = "*")
public class GeminiController {

    private final GeminiService geminiService;

    public GeminiController(GeminiService geminiService) {
        this.geminiService = geminiService;
    }

    /**
     * 챗봇 메시지 전송 API
     * 
     * @param request 사용자 메시지
     * @return Gemini 응답 + 추출된 주소
     */
    @PostMapping("/chat")
    public GeminiService.GeminiResponse chat(@RequestBody ChatRequest request) {
        return geminiService.sendMessageWithAddresses(request.message());
    }

    /**
     * 간단한 테스트용 GET API
     */
    @GetMapping("/test")
    public GeminiService.GeminiResponse test(@RequestParam String message) {
        return geminiService.sendMessageWithAddresses(message);
    }

    public record ChatRequest(String message) {
    }
}
