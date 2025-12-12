package controller;

import controller.InputFilter;
import controller.PromptBuilder;

public class InputFilterTest {
    public static void main(String[] args) {

        String[] tests = {
                "그 있잖아 나는 오늘 정왕에서 점심 먹을려고 하는데 약간 한식 먹고 싶은데 밥집 추천 해주라"
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
