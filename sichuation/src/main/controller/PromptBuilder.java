//AI가 이해하기 쉬운 JSON 포맥으로 프롬프트 구성
//지도에 표시할 장소를 JSON으로 받아오도록 유도

package controller;

public class PromptBuilder {

    public static String build(String cleanedInput) {

        return
                "너는 시흥시 기반 유능한 여행 가이드야. 사용자의 요청에 맞는 장소를 3~5곳 추천해줘.\n" +
                        "사용자 입력: \"" + cleanedInput + "\"\n\n" +

                        "반드시 아래와 같은 JSON 형식으로만 답변해. 다른 말은 덧붙이지 마.\n" +
                        "[\n" +
                        "  {\n" +
                        "    \"name\": \"장소명\",\n" +
                        "    \"address\": 정확한 도로명 주소(~근방, ~일대 X)(한국어),\n" +
                        "    \"description\": \"추천 이유 한 줄 요약\"\n" +
                        "  }\n" +
                        "]\n\n" +
                        "⚠ 절대 JSON 외의 다른 텍스트를 출력하지 마.\n" +
                        "⚠ 주소는 반드시 '도로명 주소'만 사용.\n" +
                        "⚠ 최소 3개의 장소를 JSON 배열로 반환해.";

    }
}
