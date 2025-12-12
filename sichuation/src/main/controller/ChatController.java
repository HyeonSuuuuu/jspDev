// 사용자 입력 --> 정제 --> 프롬프트 생성 --> Gemini API용청 -->  결과 반환
// 즉, 모든 흐름 총괄

package controller;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.*;
import java.io.IOException;

@WebServlet("/chat")
public class ChatController extends HttpServlet {

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        req.setCharacterEncoding("UTF-8");
        resp.setContentType("application/json; charset=UTF-8");

        // 1) 사용자 입력 받기
        String userInput = req.getParameter("message");

        // 2) 입력 정제
        String cleaned = InputFilter.clean(userInput);

        // 3) 프롬프트 생성
        String prompt = PromptBuilder.build(cleaned);

        // 4) Gemini API 호출
        String aiResult = GeminiAPI.request(prompt);

        // 5) 결과 반환 (프론트 AJAX에 전달)
        resp.getWriter().write(aiResult);
    }
}
