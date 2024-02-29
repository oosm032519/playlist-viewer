package org.example.playlistinfo.controller.user;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller // このクラスがSpring MVCのコントローラーであることを示す
public class UserLoginController {

    // "/login"というURLへのGETリクエストをハンドルするメソッド
    @GetMapping("/login")
    public String login() {
        return "login";
    }
}
