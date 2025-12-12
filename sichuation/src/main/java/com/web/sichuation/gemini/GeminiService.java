package com.web.sichuation.gemini;

import org.springframework.ai.chat.client.ChatClient;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * Gemini API 연동 서비스
 * - Gemini API 호출 및 응답 처리
 * - 응답에서 시흥시 주소 추출
 */
@Service
public class GeminiService {

    private final ChatClient chatClient;

    public GeminiService(ChatClient.Builder chatClientBuilder) {
        this.chatClient = chatClientBuilder.build();
    }

    /**
     * Gemini API에 메시지를 전송하고 응답을 받음
     *
     * @param userMessage 사용자 메시지
     * @return Gemini 응답 텍스트
     */
    public String sendMessage(String userMessage) {
        return chatClient.prompt()
                .user(userMessage)
                .call()
                .content();
    }

    /**
     * 메시지 전송 후 응답과 추출된 주소를 함께 반환
     *
     * @param userMessage 사용자 메시지
     * @return GeminiResponse (응답 텍스트 + 추출된 주소 목록)
     */
    public GeminiResponse sendMessageWithAddresses(String userMessage) {
        String response = sendMessage(userMessage);
        List<String> addresses = extractAddresses(response);

        return new GeminiResponse(response, addresses);
    }

    /**
     * 텍스트에서 시흥시 주소를 추출
     *
     * @param text Gemini 응답 텍스트
     * @return 추출된 주소 목록
     */
    public List<String> extractAddresses(String text) {
        List<String> addresses = new ArrayList<>();

        // 시흥시 주소 패턴들
        String[] patterns = {
                // "주소:" 또는 "위치:" 뒤에 오는 시흥시 주소
                "(?:주소|위치|Address|장소)\\s*[:：]\\s*([^\\n]*시흥[^\\n]*)",

                // 경기도 시흥시 전체 주소 패턴
                "(경기도?\\s*시흥시[^\\n]+)",

                // 시흥시 + 동/로/길 패턴
                "(시흥시\\s*[가-힣]+(?:동|읍|면|로|길)[\\s\\d\\-]+(?:번지|번|호)?[^\\n]*)",

                // 시흥시 주요 지역명 패턴
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

    /**
     * 주소 문자열 정리
     */
    private String cleanAddress(String address) {
        return address
                .replaceAll("[*#\\-•·]", "") // 마크다운 문자 제거
                .replaceAll("\\s+", " ") // 연속 공백을 하나로
                .trim();
    }

    /**
     * 유효한 시흥시 주소인지 검증
     */
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
