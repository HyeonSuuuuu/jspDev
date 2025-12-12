// 사용자 입력 정제 (금지어 제거, 불필요한 트큰 제거, 공백 정리 등등등)

package controller;

public class InputFilter {

    public static String clean(String input) {
        if (input == null) return "";

        String result = input.trim();

        // 1) 자주 등장하는 말버릇 제거
        String[] fillers = {
                "그냥", "좀", "약간", "혹시", "일단", "그리고", "근데",
                "뭐냐면", "뭐랄까", "아무튼", "음", "어", "아",
                 "그..", "저기", "그러니까", "솔직히","아니",
                "진짜", "너무", "완전", "개","저기","부탁"
        };
        for (String f : fillers) {
            result = result.replace(f, "");
        }

        // 2) 요청 표현 단순화
        String[][] requestPatterns = {
                {"추천해줘", "추천"},
                {"추천해주세요", "추천"},
                {"추천해줄래", "추천"},
                {"알려줘", ""},
                {"말해줘", ""},
                {"찾아줘", "검색"},
                {"찾아줄래", "검색"},
                {"뭐 있을까", ""},
                {"뭐있을까", ""},
                {"어떤게 있어", ""},
                {"어떤 게 있어", ""}
        };

        for (String[] pair : requestPatterns) {
            result = result.replace(pair[0], pair[1]);
        }

        // 3) 금지어 제거
        String[] banned = {"씨발", "ㅅㅂ", "fuck", "좆","ㅈㄴ","존나","꺼져","ㄲㅈ"};
        for (String b : banned) {
            result = result.replace(b, "");
        }

        // 4) 공백 정리
        result = result.replaceAll("\\s+", " ").trim();

        return result;
    }
}

