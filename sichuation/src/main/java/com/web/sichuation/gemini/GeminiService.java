package com.web.sichuation.gemini;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.*;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.util.ArrayList;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * Gemini API 연동 서비스 (직접 HTTP 호출 방식)
 */
@Service
public class GeminiService {

    @Value("${spring.ai.google.genai.api-key}")
    private String apiKey;

    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();

    private static final String GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent";

    private static final String PROMPT_TEMPLATE = "너는 시흥시 기반 유능한 여행 가이드야. 사용자의 요청에 맞는 장소를 3~5곳 추천해줘.\n\n" +
            "사용자 요청: \"%s\"\n\n" +
            "반드시 아래와 같은 JSON 형식으로만 답변해. 다른 말은 덧붙이지 마.\n" +
            "[\n" +
            "{\n" +
            "\"name\": \"장소명\",\n" +
            "\"address\": \"정확한 도로명 주소 (~근방, ~일대 X) (한국어)\",\n" +
            "\"description\": \"추천 이유 한 줄 요약\"\n" +
            "},\n" +
            "...\n" +
            "]";

    /**
     * Gemini API에 메시지를 전송하고 응답을 받음
     */
    public String sendMessage(String userMessage) {
        try {
            String url = GEMINI_API_URL + "?key=" + apiKey;

            // 프롬프트 적용
            // String.format 사용 시 % 문자가 있으면 에러가 발생하므로 이스케이프 처리
            String safeUserMessage = userMessage.replace("%", "%%");
            String finalPrompt = String.format(PROMPT_TEMPLATE, safeUserMessage);

            // 요청 본문 생성 (JSON 이스케이프 처리)
            String requestBody = String.format(
                    "{\"contents\":[{\"parts\":[{\"text\":\"%s\"}]}]}",
                    finalPrompt.replace("\"", "\\\"").replace("\n", "\\n"));

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.set("x-goog-api-key", apiKey);

            HttpEntity<String> entity = new HttpEntity<>(requestBody, headers);

            ResponseEntity<String> response = restTemplate.exchange(
                    url, HttpMethod.POST, entity, String.class);

            // 응답 파싱
            JsonNode root = objectMapper.readTree(response.getBody());
            JsonNode candidates = root.path("candidates");

            if (candidates.isArray() && candidates.size() > 0) {
                return candidates.get(0)
                        .path("content")
                        .path("parts")
                        .get(0)
                        .path("text")
                        .asText();
            }

            return "응답을 받지 못했습니다.";

        } catch (Exception e) {
            e.printStackTrace();
            return "에러 발생: " + e.getMessage();
        }
    }

    /**
     * 메시지 전송 후 응답과 추출된 주소를 함께 반환
     */
    public GeminiResponse sendMessageWithAddresses(String userMessage) {
        String response = sendMessage(userMessage);
        List<String> addresses = extractAddresses(response);
        return new GeminiResponse(response, addresses);
    }

    /**
     * 텍스트에서 시흥시 주소를 추출
     */
    public List<String> extractAddresses(String text) {
        List<String> addresses = new ArrayList<>();

        String[] patterns = {
                "(?:주소|위치|Address|장소)\\s*[:：]\\s*([^\\n]*시흥[^\\n]*)",
                "(경기도?\\s*시흥시[^\\n]+)",
                "(시흥시\\s*[가-힣]+(?:동|읍|면|로|길)[\\s\\d\\-]+(?:번지|번|호)?[^\\n]*)",
                "(시흥시\\s*(?:정왕동|월곶동|대야동|신천동|죽율동|은행동|능곡동|과림동|군자동|장곡동|매화동|조남동|목감동|거모동|미산동|논곡동|광석동|하상동|하중동|포동|방산동|안현동|장현동|배곧동)[^\\n]*)"
        };

        for (String patternStr : patterns) {
            Pattern pattern = Pattern.compile(patternStr, Pattern.CASE_INSENSITIVE);
            Matcher matcher = pattern.matcher(text);

            while (matcher.find()) {
                String address = cleanAddress(matcher.group(1) != null ? matcher.group(1) : matcher.group(0));
                if (isValidSiheungAddress(address) && !addresses.contains(address)) {
                    addresses.add(address);
                }
            }
        }

        return addresses;
    }

    private String cleanAddress(String address) {
        return address
                .replaceAll("[*#\\-•·]", "")
                .replaceAll("\\s+", " ")
                .trim();
    }

    private boolean isValidSiheungAddress(String address) {
        if (address == null || address.length() < 5) {
            return false;
        }
        if (!address.contains("시흥")) {
            return false;
        }
        return address.matches(".*[가-힣].*");
    }

    public record GeminiResponse(
            String message,
            List<String> addresses) {
    }
}
