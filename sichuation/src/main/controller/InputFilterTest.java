package controller;

import controller.InputFilter;
import controller.PromptBuilder;

public class InputFilterTest {
    public static void main(String[] args) {

        String[] tests = {
                "그냥 혹시 강남에서 뭐 추천해줘",
                "솔직히 씨발 홍대에 뭐있을까 알려줘",
                "그 제주도에서 약간 카페 추천해주세요",
                "광안리에서 좀 맛집 추천해줄래",
                "음 어 근데 부산 좀 알려줘"
        };

        for (String t : tests) {

            // 1) 입력
            System.out.println("입력: " + t);

            // 2) 필터링
            String cleaned = InputFilter.clean(t);
            System.out.println("정제: " + cleaned);
            System.out.println("");

            // 3) 프롬프트 생성
            String prompt = PromptBuilder.build(cleaned);
            System.out.println("프롬프트:\n" + prompt);

            System.out.println("======================================");
        }
    }
}
